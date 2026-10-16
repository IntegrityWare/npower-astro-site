# nPower Software Astro website

This Astro site deploys automatically from GitHub main to Cloudflare Pages at https://www.npowersoftwarenew.com. The existing Cloudflare Worker `npower-astro-site` deploys from the same repository and serves the sandbox store API. The production website is https://www.npowersoftware.com; this integration does not enable production payments.

## Development and checks

Use Node.js 22.13 or newer, `npm ci`, and `npm run dev` for the website. Run `npm run test:store` and `npm run build` before pushing. `npx wrangler deploy --dry-run` checks the Worker bundle. Astro development alone does not run the payment backend.

The store lives at /store/, product options at /buy/viz/, /buy/studio/, and /buy/studio_re/, and the shared cart at /cart/. Buy buttons always use same-origin paths. PUBLIC_STOREFRONT_URL from the former local helper is no longer used.

## Hosted sandbox

Pages Functions proxy /api/store/* to the existing Worker. The Worker stores order state in D1, verifies signed Stripe webhooks against canonical sandbox payments, issues one Cryptolens key per purchased license, and sends the activation email after all payment groups finish. Annual licenses and perpetual licenses with deferred maintenance require separate Stripe payment steps when combined.

The hosted staging deployment has STORE_ENABLED=true and EMAIL_ENABLED=true after encrypted credentials, signed webhooks, and verified Cloudflare email routing were configured. Set both flags to false to suspend sandbox checkout. The sandbox accepts only the configured test Stripe account and customer; all license emails go to gcrocker61@gmail.com. An access code protects purchase and receipt endpoints.

Configure these encrypted Worker secrets through Wrangler or the Cloudflare dashboard; never place values in Git:
- STRIPE_SECRET_KEY: sandbox key for IntegrityWare account acct_1UQGwdJvz9ox51DZ.
- STRIPE_WEBHOOK_SECRET: signing secret for the hosted /api/store/webhook endpoint.
- CRYPTOLENS_TOKENS: JSON mapping template IDs to restricted Create Key From Template tokens.
- CRYPTOLENS_RENEWAL_TOKENS: JSON mapping product IDs 33431, 33432 and 33433 to product-locked Get Key + Extend License tokens. These permissions can read and extend any key within the locked product; the Worker additionally restricts updates to issued D1 keys belonging to test customer 237012 with matching perpetual/floating/seat flags.
- SANDBOX_ACCESS_CODE: a random code of at least 20 characters.

Apply schema changes with `npx wrangler d1 migrations apply npower-store-sandbox --remote`.
Register checkout.session.completed, checkout.session.async_payment_succeeded, invoice.paid, invoice.payment_failed, customer.subscription.updated, and customer.subscription.deleted on the hosted webhook. Preserve the disabled legacy Cryptolens subscription webhook to avoid duplicate provisioning.

Email requires the configured sender licenses@npowersoftwarenew.com and verified sandbox recipient. Do not enable checkout before email setup is complete.

## Hosted acceptance result

Verified on 2026-10-14: order 50ef9ac8-4a31-4f2e-97b4-c24933f13aed completed both Stripe sandbox steps ($795 annual node-locked Viz and $1,995 perpetual floating Viz), created exactly two Cryptolens keys automatically, and sent one activation email to the verified Gmail inbox. The $295 maintenance subscription is deferred to 2027-10-14. Receipt access remains tied to the initiating browser; its cart clears when fulfillment completes.

An earlier quantity-three test exercised recovery after Cloudflare rejected the local helper's redirect mode. The hosted issuer now uses manual redirects and rejects non-success responses without forwarding tokens. The fresh acceptance order above needed no manual repair. Quantity-two perpetual floating issuance and one email for the combined order were also verified.

Validation includes 24 automated store tests, the Astro build, the Worker bundle check, and an actual workerd request smoke test without credentials.

### Renewal acceptance

Verified on 2026-10-14 using Stripe test clock clock_1UQW8qJvz9ox51DZr6vvcvNP and hosted order 0003af24-bc9f-4d48-8994-3aad691e8ad8. The order issued four keys: Viz annual node-locked, Studio RE annual floating, and two Studio perpetual floating licenses with optional maintenance. The activation email was confirmed in the Gmail inbox exactly once.

Advancing the clock to October 2027 paid the $5,790 annual renewal and $1,390 maintenance renewal. The hosted webhook extended all four existing keys through the October 2028 service end, including the leap year. Immediate maintenance cancellation preserved both perpetual licenses and their paid maintenance dates. With the annual subscription's default payment method temporarily removed, its October 2028 invoice failed and neither annual key was extended. Restoring the public fake Visa and paying that same invoice extended both annual keys through its October 2029 service end. Scheduled cancellation then ended the annual subscription at that paid-through boundary, without another invoice or new keys.

Both acceptance subscriptions are canceled. D1 reconciliation finished with all four keys synced and no pending extension attempts. Cryptolens read-back confirmed the applied dates (2029-10-15 UTC for annual keys, 2028-10-15 UTC for maintenance), reflecting the documented whole-day rounding. Test-clock dates simulate future billing; they do not move the desktop application's clock or enable enforcement.

## Recovery and current limits

The free-plan hosted sandbox limits checkout to 10 licenses per order. Larger orders need queued fulfillment or a suitable Worker plan before this limit is raised.

D1 claims and Stripe idempotency keys prevent duplicate charges and license issuance during retries. Cryptolens issuance has no idempotency key: uncertain responses are held for manual review, never blindly retried. Email timeouts are also held for review to avoid duplicate delivery. Receipts are restricted to the original browser's sandbox session.

## Renewal and cancellation automation

Apply migration 0002 before setting LIFECYCLE_ENABLED=true. Configure the separate renewal credential first. LIFECYCLE_ENABLED is enabled in the hosted sandbox. The temporary test-clock checkout customer override has been removed after acceptance; new orders use the original sandbox tester. SANDBOX_CHECKOUT_CUSTOMER may temporarily select a test-clock customer marked with metadata npower_lifecycle_test=npower_hosted_sandbox_v1. Every order retains its original customer in its saved checkout plan; request bodies cannot select a customer. Remove the override after acceptance to restore the original sandbox tester.

Signed billing webhooks retrieve canonical Stripe subscriptions and paid invoices. Each invoice period is recorded once in D1. Successful yearly payments extend existing keys; quantities create no new keys during renewal. Failed payments never extend paid access. Recovery uses the paid invoice's original service end, not a fresh year from the retry date.

Cancellation (including immediate dashboard cancellation) stops renewal while preserving the period already paid for. Configure customer cancellation at period end in Stripe. Maintenance cancellation never blocks a perpetual license, removes its perpetual flag, or revokes product access. Perpetual Expires continues to represent maintenance eligibility. Desktop enforcement remains passive. Refunds, disputes, plan/quantity changes, prorations, credits and paused collection require separate review; they do not silently rewrite entitlements.

Cryptolens ExtendLicense is additive, not idempotent. D1 serializes subscription reconciliation and records an extension intent before calling it. A timeout is resolved by reading the key; if its result remains uncertain, the request is held for review and never blindly repeated. No block, unblock, feature-edit, key-create or seat-edit permission is used by renewal automation. Cryptolens calendar dates round up to the next UTC midnight so access cannot end earlier than the paid Stripe period (less than one day of grace).

A Worker Cron Trigger runs every five minutes, selecting one due subscription. Successful groups are checked again after a day; queued batches and failures are revisited sooner. At most three keys are synchronized per invocation to stay within free-plan query/request limits. This also backfills existing fulfilled sandbox orders and recovers missed invoice webhooks. D1 cart_subscription_sync and cart_license_sync record status and safe error reasons; cart_paid_periods records the billing evidence. Investigate review rows before manually retrying additive vendor calls.

Keep access limited to the authorized sandbox tester. This remains sandbox commerce; live payments and active desktop enforcement are not enabled.

Keep all edited text files in CRLF format. Local .env files, .dev.vars, and .wrangler state are ignored.

## Contact forms and legacy downloads

Sales and support forms POST to /api/contact. Pages forwards the request through
CONTACT_SERVICE to the dedicated npower-contact Worker. It validates fields and
origins, limits requests, and sends only to sales@npowersoftware.com or
support@npowersoftware.com. The proposed update saves an inquiry in private D1 storage before returning a receipt.
A one-minute Cron Trigger sends up to three pending inquiries per invocation.
Submission IDs prevent duplicate saves when a visitor retries after a lost response.
Replies go to the visitor. Application logs never include names, addresses or message content.

The private D1 inbox and up to 30 days of active retention were approved on
2026-10-15. Database: npower-contact-inbox. Apply its schema with
wrangler d1 migrations apply npower-contact-inbox --remote --config wrangler.contact.jsonc.
Regenerate contact Worker types, then deploy the Worker before publishing Pages.
Confirm the one-minute Cron Trigger is active after deployment.

Customer content is cleared immediately when the provider confirms email acceptance.
Unconfirmed inquiries remain available privately in D1 for up to 30 days; all rows
are deleted after 30 days (Cloudflare Time Travel backups may outlast row deletion).
An interrupted or uncertain send is held in review and is never automatically resent.
Check contact_inquiries_need_review events in Worker logs and the contact_inquiries
table in Cloudflare's D1 console. Compare review rows with the existing mail inbox
before manually resolving them; only reset a row to pending after establishing that
it was not delivered. Never expose this table through a public endpoint.
A storage failure returns an error and retains the visitor's input.

The existing email host and MX records are unchanged. The sender is
website@npowersoftwarenew.com, using the already configured Cloudflare sending
domain. Both destination addresses must be verified in Cloudflare Email Routing
before delivery works. Do not enable Email Routing on npowersoftware.com.

Run npm run test:contact and npm run test:store, then npm run build.
Deploy the dedicated backend with npm run deploy:contact before publishing Pages.
Regenerate its local types with wrangler types --config wrangler.contact.jsonc
contact-worker-configuration.d.ts when its bindings change.

Pages production bindings (Settings > Bindings) include CONTACT_SERVICE pointing
to npower-contact and DOWNLOADS_SERVICE pointing to npower-downloads. Preserve the
existing TRIAL_SERVICE binding. Redeploy Pages after changing bindings.
The handlers require no public URL or API token for either service connection.

The /SolidWorks/* Pages handler streams known installer and PDF requests from the
existing R2 download Worker, preserving paths, query strings, HEAD, range requests,
ETags and content headers. Other SolidWorks paths retain ordinary Pages handling.
Page redirects remain generated from integrations/legacy-redirects.mjs; their
reviewed destinations are unchanged. A full live audit passed all 213 legacy rules
before this change. The /api/contact and /SolidWorks/* paths must remain included
in public/_routes.json; page redirects must remain outside the Functions routes.
