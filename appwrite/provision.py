#!/usr/bin/env python3
"""
Provision the Browse Appwrite backend: database, collections, attributes,
indexes, and the demo site catalog. Idempotent (safe to re-run).

Reads credentials from the environment — NEVER hardcode the API key:
  APPWRITE_ENDPOINT    e.g. https://nyc.cloud.appwrite.io/v1
  APPWRITE_PROJECT_ID  the project id
  APPWRITE_API_KEY     a server key (secret; sandbox-only, never shipped)

The web app itself never uses the API key — it talks to Appwrite with the
project id + endpoint and per-user sessions.
"""
import os, json, time, urllib.request, urllib.error

EP = os.environ["APPWRITE_ENDPOINT"].rstrip("/")
PROJECT = os.environ["APPWRITE_PROJECT_ID"]
KEY = os.environ["APPWRITE_API_KEY"]
DB = "browse"
SEED = os.environ.get("SEED_JSON", "/agent/workspace/extract/data.json")


def api(method, path, body=None):
    url = EP + path
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("X-Appwrite-Project", PROJECT)
    req.add_header("X-Appwrite-Key", KEY)
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        try:
            payload = json.loads(e.read().decode())
        except Exception:
            payload = {}
        return e.code, payload
    except urllib.error.URLError as e:
        return 0, {"message": f"network error: {e.reason}"}


def ensure(desc, res, ok=(200, 201, 202), dup=409):
    st, js = res
    if st in ok:
        print(f"  ok  {desc}")
    elif st == dup:
        print(f"  ==  {desc} (exists)")
    elif st == 0:
        print(f"  !!  {desc} -> {js.get('message')}")
    else:
        print(f"  xx  {desc} -> {st} {js.get('message','')[:140]}")
    return st, js


print("→ database")
ensure("database browse", api("POST", "/databases", {"databaseId": DB, "name": "Browse"}))

print("→ collections")
cols = {
    "sites": {"name": "Sites", "permissions": ['read("any")'], "documentSecurity": False},
    "submissions": {"name": "Submissions", "permissions": ['create("any")'], "documentSecurity": False},
    "subscribers": {"name": "Subscribers", "permissions": ['create("any")'], "documentSecurity": False},
    "bookmarks": {"name": "Bookmarks", "permissions": ['create("users")'], "documentSecurity": True},
}
for cid, cfg in cols.items():
    ensure(f"collection {cid}", api("POST", f"/databases/{DB}/collections", {"collectionId": cid, **cfg}))

print("→ attributes")
def s_attr(col, key, size, req=False, default=None):
    b = {"key": key, "size": size, "required": req}
    if not req and default is not None:
        b["default"] = default
    ensure(f"{col}.{key}", api("POST", f"/databases/{DB}/collections/{col}/attributes/string", b))

def i_attr(col, key, req=False, default=None):
    b = {"key": key, "required": req}
    if not req and default is not None:
        b["default"] = default
    ensure(f"{col}.{key}", api("POST", f"/databases/{DB}/collections/{col}/attributes/integer", b))

s_attr("sites", "slug", 255, True)
s_attr("sites", "name", 255, True)
s_attr("sites", "category_slug", 64, True)
s_attr("sites", "category_label", 64, True)
s_attr("sites", "url", 2048, True)
s_attr("sites", "thumb", 512, False)
i_attr("sites", "sort", False, 0)
s_attr("submissions", "email", 320, True)
s_attr("submissions", "url", 2048, True)
s_attr("submissions", "comment", 2000, False)
s_attr("submissions", "status", 32, False, "pending")
s_attr("subscribers", "email", 320, True)
s_attr("bookmarks", "userId", 64, True)
s_attr("bookmarks", "siteSlug", 255, True)

print("→ waiting for attributes to become available")
def wait_attrs(col, tries=40):
    for _ in range(tries):
        st, js = api("GET", f"/databases/{DB}/collections/{col}/attributes")
        attrs = js.get("attributes", [])
        if attrs and all(a.get("status") == "available" for a in attrs):
            return True
        time.sleep(1.5)
    print(f"  !! {col}: attributes not all available yet")
    return False

for c in cols:
    wait_attrs(c)

print("→ indexes")
def idx(col, key, typ, attrs, orders=None):
    b = {"key": key, "type": typ, "attributes": attrs}
    if orders:
        b["orders"] = orders
    ensure(f"index {col}.{key}", api("POST", f"/databases/{DB}/collections/{col}/indexes", b))

idx("sites", "sort_idx", "key", ["sort"], ["ASC"])
idx("subscribers", "email_unique", "unique", ["email"])
idx("bookmarks", "user_idx", "key", ["userId"])
idx("bookmarks", "user_site_unique", "unique", ["userId", "siteSlug"])
time.sleep(2)

print("→ seeding sites")
data = json.load(open(SEED))
sites = data["sites"]
seeded = existed = failed = 0
for i, s in enumerate(sites):
    doc_id = s["slug"][:36]
    body = {
        "documentId": doc_id,
        "data": {
            "slug": s["slug"],
            "name": s["name"],
            "category_slug": s["categorySlug"],
            "category_label": s["categoryLabel"],
            "url": s["url"],
            "thumb": "/thumbs/" + s["thumb"],
            "sort": i,
        },
    }
    st, js = api("POST", f"/databases/{DB}/collections/sites/documents", body)
    if st in (200, 201):
        seeded += 1
    elif st == 409:
        existed += 1
    else:
        failed += 1
        print(f"  xx seed {s['slug']}: {st} {js.get('message','')[:90]}")
print(f"  sites: seeded={seeded} existed={existed} failed={failed} total={len(sites)}")

print("→ web platforms (may require console access; project keys often cannot)")
for name, host in [("localhost", "localhost"), ("vercel-prod", "browse-directory.vercel.app")]:
    st, js = api("POST", f"/projects/{PROJECT}/platforms", {"type": "web", "name": name, "hostname": host})
    if st in (200, 201):
        print(f"  ok  platform {host}")
    else:
        print(f"  --  platform {host}: {st} {js.get('message','')[:90]} (add manually in console if needed)")

print("done.")
