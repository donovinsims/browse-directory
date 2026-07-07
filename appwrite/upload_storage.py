#!/usr/bin/env python3
"""
One-time migration: upload local images (site thumbnails, blog covers, favicon)
to a public Appwrite Storage bucket and emit a URL map.

Reads creds from env (never hardcode the key):
  APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY

Writes /agent/workspace/storage_map.json:
  { "thumbs": {filename: url}, "blog": {filename: url}, "favicon": url, "bucket": "assets" }
"""
import os, json, uuid, hashlib, mimetypes, urllib.request, urllib.error

EP = os.environ["APPWRITE_ENDPOINT"].rstrip("/")
P = os.environ["APPWRITE_PROJECT_ID"]
K = os.environ["APPWRITE_API_KEY"]
BUCKET = "assets"
PUB = "/agent/workspace/browse-directory/public"


def api(method, path, body=None, headers=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(EP + path, data=data, method=method)
    req.add_header("X-Appwrite-Project", P)
    req.add_header("X-Appwrite-Key", K)
    if body is not None:
        req.add_header("Content-Type", "application/json")
    for h, v in (headers or {}).items():
        req.add_header(h, v)
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode())
        except Exception:
            return e.code, {}


def view_url(file_id):
    return f"{EP}/storage/buckets/{BUCKET}/files/{file_id}/view?project={P}"


def upload(file_id, path):
    ct = mimetypes.guess_type(path)[0] or "application/octet-stream"
    boundary = "----bnd" + uuid.uuid4().hex
    pre = (
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"fileId\"\r\n\r\n{file_id}\r\n"
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{os.path.basename(path)}\"\r\n"
        f"Content-Type: {ct}\r\n\r\n"
    ).encode()
    post = f"\r\n--{boundary}--\r\n".encode()
    body = pre + open(path, "rb").read() + post
    req = urllib.request.Request(EP + f"/storage/buckets/{BUCKET}/files", data=body, method="POST")
    req.add_header("X-Appwrite-Project", P)
    req.add_header("X-Appwrite-Key", K)
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    try:
        with urllib.request.urlopen(req) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code


# 1) bucket (public read)
st, js = api("POST", "/storage/buckets", {
    "bucketId": BUCKET, "name": "Assets",
    "permissions": ['read("any")'], "fileSecurity": False, "enabled": True,
})
print("bucket:", "ok" if st in (200, 201) else ("exists" if st == 409 else f"{st} {js.get('message','')[:80]}"))

out = {"bucket": BUCKET, "thumbs": {}, "blog": {}, "favicon": None}


def do(dirpath, id_fn, sink):
    for fn in sorted(os.listdir(dirpath)):
        path = os.path.join(dirpath, fn)
        if not os.path.isfile(path):
            continue
        fid = id_fn(fn)
        code = upload(fid, path)
        ok = code in (200, 201) or code == 409
        sink[fn] = view_url(fid)
        if not ok:
            print(f"  xx {fn} -> {code}")
    return sink


def thumb_id(fn):
    stem = os.path.splitext(fn)[0]
    return stem[:36]

def blog_id(fn):
    stem = os.path.splitext(fn)[0]
    return "blog-" + hashlib.md5(stem.encode()).hexdigest()[:8]

do(os.path.join(PUB, "thumbs"), thumb_id, out["thumbs"])
do(os.path.join(PUB, "blog"), blog_id, out["blog"])

fav = os.path.join(PUB, "favicon.png")
if os.path.exists(fav):
    upload("favicon", fav)
    out["favicon"] = view_url("favicon")

json.dump(out, open("/agent/workspace/storage_map.json", "w"), indent=1)
print(f"uploaded thumbs={len(out['thumbs'])} blog={len(out['blog'])} favicon={'yes' if out['favicon'] else 'no'}")
print("sample thumb url:", next(iter(out["thumbs"].values())))
