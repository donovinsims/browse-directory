/**
 * STRIPE PLACEHOLDER — intentionally not implemented yet.
 *
 * When payments land, this becomes the Stripe Checkout session endpoint:
 *   1. `npm i stripe`
 *   2. Read STRIPE_SECRET_KEY + STRIPE_PRICE_BOOKMARKING from env
 *      (see .env.example).
 *   3. Create a checkout session (mode: "subscription") for the signed-in
 *      user's email, with success/cancel URLs back to /account.
 *   4. Return { url } and redirect the client to it from Pricing/Account.
 *
 * Companion pieces already in place:
 *   - api/stripe-webhook.ts (flips profiles.is_pro on subscription events)
 *   - profiles.is_pro column (supabase/schema.sql)
 *   - REQUIRE_PLAN_FOR_BOOKMARKS flag (src/lib/config.ts)
 */
export default function handler(_req: Request): Response {
  return new Response(
    JSON.stringify({
      error: 'Payments are not implemented yet. See README → "Stripe placeholder".',
    }),
    { status: 501, headers: { 'content-type': 'application/json' } },
  )
}
