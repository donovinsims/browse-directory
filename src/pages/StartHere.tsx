import { usePageMeta } from '../lib/meta'

function Code({ children }: { children: string }) {
  return (
    <pre className="bg-surface-raised ring-hairline rounded-[8px] p-4 overflow-x-auto type-caption font-mono text-text-primary whitespace-pre">
      {children}
    </pre>
  )
}

/**
 * Setup guide — unlinked from the nav (mirrors the original template's
 * hidden instructions page). Delete this route before launch.
 */
export function StartHere() {
  usePageMeta('Start Here', 'Setup guide for this template build.')
  return (
    <div className="shell">
      <article className="max-w-[640px] mx-auto pt-16">
        <p className="type-caption text-text-muted">
          This page is unlinked from the nav — delete it before launch.
        </p>
        <h1 className="type-display mt-3">Start Here</h1>
        <p className="type-lede text-text-muted mt-4">
          Everything runs out of the box in demo mode. A few steps take it to production on Appwrite.
        </p>

        <h2 className="type-section mt-14 mb-4">1 · Run it locally</h2>
        <Code>{`npm install\nnpm run dev`}</Code>

        <h2 className="type-section mt-12 mb-4">2 · Replace the demo content</h2>
        <p className="type-body mb-4">
          The catalog is data, not markup. Edit the rows in <code>src/data/sites.ts</code> and drop
          matching thumbnails into <code>public/thumbs/</code> (≈4:3, ~1024px wide). Categories live
          in <code>src/data/categories.ts</code>, blog posts in <code>src/data/blog.ts</code>. When
          Appwrite is connected, re-run the seeder (below) or edit the <code>sites</code> collection.
        </p>

        <h2 className="type-section mt-12 mb-4">3 · Provision Appwrite (one time)</h2>
        <p className="type-body mb-4">
          Create a project in the Appwrite console, then create a server API key with the{' '}
          <code>databases.*</code> and <code>documents.*</code> scopes and run the seeder — it
          creates the database, collections, indexes, and loads the catalog:
        </p>
        <Code>{`APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1 \\\nAPPWRITE_PROJECT_ID=your-project-id \\\nAPPWRITE_API_KEY=your-server-key \\\npython3 appwrite/provision.py`}</Code>
        <p className="type-body mt-4">
          Then add a <strong>Web platform</strong> in the console (Settings → Platforms) for your
          domain and <code>localhost</code>, so the browser SDK is allowed by CORS.
        </p>

        <h2 className="type-section mt-12 mb-4">4 · Connect the app</h2>
        <p className="type-body mb-4">
          The web app only needs the two public values — set them locally and on Vercel:
        </p>
        <Code>{`VITE_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1\nVITE_APPWRITE_PROJECT_ID=your-project-id`}</Code>
        <p className="type-body mt-4">
          Redeploy and sign-up, sign-in, synced bookmarks, and submissions go live. Local browser
          bookmarks merge into the account on first sign-in.
        </p>

        <h2 className="type-section mt-12 mb-4">5 · Stripe (placeholder)</h2>
        <p className="type-body mb-4">
          Payments are intentionally stubbed: <code>api/create-checkout-session.ts</code> and{' '}
          <code>api/stripe-webhook.ts</code> return 501, and{' '}
          <code>REQUIRE_PLAN_FOR_BOOKMARKS</code> in <code>src/lib/config.ts</code> keeps bookmarking
          free for every member until checkout lands (the webhook will flip <code>is_pro</code> on
          the Appwrite account prefs).
        </p>

        <h2 className="type-section mt-12 mb-4">6 · Deploy</h2>
        <p className="type-body">
          Import the repo on Vercel (framework preset: Vite). <code>vercel.json</code> already
          handles SPA rewrites; add the two Appwrite env vars in the project settings.
        </p>
      </article>
    </div>
  )
}
