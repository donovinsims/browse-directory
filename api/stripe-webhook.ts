/**
 * STRIPE PLACEHOLDER — intentionally not implemented yet.
 *
 * When payments land, this becomes the Stripe webhook receiver:
 *   1. Verify the signature with STRIPE_WEBHOOK_SECRET.
 *   2. On `checkout.session.completed` / `customer.subscription.updated`,
 *      set is_pro = true on the matching Appwrite user's prefs (use a server
 *      API key via node-appwrite — server-side only, never expose it).
 *   3. On `customer.subscription.deleted`, set is_pro = false.
 *   4. Flip REQUIRE_PLAN_FOR_BOOKMARKS to true in src/lib/config.ts so the
 *      paid gate takes effect.
 */
export default function handler(_req: Request): Response {
  return new Response(
    JSON.stringify({
      error: 'Webhook not implemented yet. See README → "Stripe placeholder".',
    }),
    { status: 501, headers: { 'content-type': 'application/json' } },
  )
}
