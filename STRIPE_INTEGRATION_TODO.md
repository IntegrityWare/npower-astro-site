# Stripe integration TODO

Status: Checkout Studio settings applied and deployed to staging on 2026-10-15. Automated checks passed. This remains a sandbox integration.

## Values to replace

None. The existing `mode`, `success_url`, `cancel_url`, and `line_items` use real purchase selections, website URLs, sandbox Price IDs, and quantities. They were preserved; `{CHECKOUT_SESSION_ID}` is Stripe's required substitution token, not an unfinished placeholder.

The values come from [store/purchase-options.mjs](store/purchase-options.mjs) and [store/catalog.sandbox.json](store/catalog.sandbox.json). Live payments require a separate launch task; replacing a secret alone is not sufficient because this store deliberately verifies its sandbox account, prices, and customer.

## Configured parameters

The existing call in [store/service.mjs](store/service.mjs) now explicitly applies:

- `ui_mode`: `hosted_page` (installed Stripe SDK: 23.0.0).
- `billing_address_collection`: `auto`.
- `phone_number_collection`: `{ enabled: false }`.
- `automatic_tax`: `{ enabled: false }`.
- `allow_promotion_codes`: `false`.
- `payment_method_collection`: `always`, only when `mode` is `subscription`.
- `submit_type`: `auto`.
- `integration_identifier`: `hosted_web_0001`.
- `origin_context`: `web`.

## Maintenance billing and customer explanation

Every perpetual purchase includes the first year of maintenance. Optional automatic maintenance enrollment is unchecked by default. If selected, only the perpetual license price is due today; the first maintenance payment is one year after purchase, followed by yearly renewals. Without enrollment, there is no automatic maintenance charge. Canceling maintenance preserves perpetual product access.

The existing `subscription_data.trial_end` preserves this delay. Order/customer metadata, client reference, card settings, USD pricing, session expiration, and the idempotency key are also retained so fulfillment and renewal processing continue to work.

[PurchaseOptions.jsx](src/components/store/PurchaseOptions.jsx) already states the annual price per license, "First charge after the included year," and "starting one year after purchase." [Cart.jsx](src/components/store/Cart.jsx) shows the included first year, the renewal amount for each selection, and the yearly total starting one year after purchase. Annual licenses include maintenance throughout their subscription and do not add a separate maintenance charge.

## Validation completed

- All 24 existing store tests passed, including maintenance renewals, cancellation, failed payments, duplicate events, and license/email delivery with mocked vendors.
- Additional in-memory checks passed for all 18 product/maintenance combinations at quantity two: configured Checkout fields, preserved order details, correct amount due today, first-year deferral, and one key per purchased license.
- `npm run build` passed (79 pages; existing Vite deprecation and Browserslist freshness warnings remain).
- `wrangler deploy --dry-run` passed.

## Setup and next steps

No new dependencies or environment variables are needed. The existing Worker uses server-only `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CRYPTOLENS_TOKENS`, `CRYPTOLENS_RENEWAL_TOKENS`, and `SANDBOX_ACCESS_CODE`. Keep values in encrypted Worker secrets, never source code or browser variables. The Stripe client already omits an explicit API version.

The only new repository file is this checklist. Only the existing Checkout call's parameters were changed; no routes, billing infrastructure, fulfillment logic, or renewal logic were added.

GitHub commit `81b8f7c` deployed successfully to Cloudflare Pages. The sandbox Worker required a direct Wrangler deployment, which succeeded as version `d045e2f9-8b7d-4858-bdf3-386761e23b5d`. Verify Worker deployment separately on future backend changes. The staging store is ready for a fresh payment check:

1. Open [the staging store](https://www.npowersoftwarenew.com/store/) using the existing sandbox access code.
2. Choose a perpetual product, quantity, and optional maintenance renewal. Confirm that the cart shows only the license charge due today and the maintenance amount starting one year later.
3. Continue to Stripe Checkout. Confirm the same amount due today and future maintenance start date. Use public test card `4242 4242 4242 4242`, a future expiration date, and any three-digit CVC. Never use the test card in live mode.
4. Complete the sandbox payment and confirm the receipt and activation email at `gcrocker61@gmail.com`. A mixed annual/maintenance cart has two Stripe payment steps; email delivery follows completion of both.

Flow: product options -> cart -> Stripe-hosted Checkout -> signed webhook -> Cryptolens licenses -> activation email. Product selection, fulfillment, and order tracking already exist. This update has automated coverage; a fresh hosted payment using these additional Checkout settings remains the final acceptance step.

## Renewal reminder setup

Stripe supports automatic upcoming-renewal emails in its Billing subscription/email settings. These settings were not changed or verified during this Checkout update.

- Recommended for subsequent yearly maintenance payments: enable upcoming-renewal emails and set advance notice to 30 days.
- For the first maintenance payment after the included year: enable the separate 7-day trial-ending reminder, because the included year is implemented with Stripe's trial-end billing delay.
- Preview the first-year wording so customers understand that the notice concerns maintenance, while their perpetual product license continues. Verify the date, renewal amount, and subscription-management/cancellation link.
- Check both sandbox and live configuration separately before launch. Sandbox email testing is restricted to verified-domain addresses or active Stripe team members; confirm the test address qualifies.

See [Stripe customer email configuration](https://docs.stripe.com/billing/revenue-recovery/customer-emails). Enabling these reminders and validating delivery is a separate setup step; the activation email already has its own fulfillment flow.

Resources: [Stripe Checkout parameters](https://docs.stripe.com/api/checkout/sessions/create), [Stripe support](https://support.stripe.com), and [Stripe MCP documentation](https://docs.stripe.com/mcp).
