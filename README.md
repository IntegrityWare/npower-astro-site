# nPower Software Astro website

This Astro site deploys automatically from GitHub main to Cloudflare Pages at https://www.npowersoftware.com. The former staging domain redirects to production. The Worker `npower-astro-site` must be deployed separately with Wrangler and serves trial licensing plus separate sandbox and live-store APIs. Live checkout stays disabled until its credentials and price catalog have been verified.

## Development and checks

Use Node.js 22.13 or newer, `npm ci`, and `npm run dev` for the website. Run `npm run test:store` and `npm run build` before pushing. `npx wrangler deploy --dry-run` checks the Worker bundle. Astro development alone does not run the payment backend.

The store lives at /store/, product options at /buy/viz/, /buy/studio/, and /buy/studio_re/, and the shared cart at /cart/. Buy buttons always use same-origin paths. PUBLIC_STOREFRONT_URL from the former local helper is no longer used.


## Live-store configuration (2026-10-23)

The production Pages proxy sends /api/store/* to the Worker's /api/live-store/* route. The original Worker /api/store/* route and its sandbox secrets/database remain intact. The live route accepts only a live Stripe key, checks account acct_1UQGwRFQQ1xhc2ph, and uses its own STORE_LIVE_DB binding (npower-store-live). A dedicated secure browser cookie owns each order; sandbox cookies do not authorize live receipts.

Live purchases create a Stripe customer per checkout attempt. Only verified, retrieved paid Checkout details can set the order's email. Cryptolens issues one key per quantity to that customer email, and the persisted customer/key identity is checked on renewals. Annual licenses expire at the paid-through date; perpetual expiration records maintenance eligibility only. Canceling maintenance never blocks perpetual access. Optional maintenance remains unchecked initially and first bills after the included year. Mixed annual and deferred-maintenance carts have two payments.

Configure these additional encrypted Worker secrets; do not reuse sandbox issuing credentials:
- STRIPE_LIVE_SECRET_KEY: live key for the account above, with the account/customer/price/Checkout/subscription/invoice/webhook reads and customer/Checkout writes used by store/service.mjs.
- STRIPE_LIVE_WEBHOOK_SECRET: signing secret for https://npower-astro-site.gcrocker61.workers.dev/api/live-store/webhook. Subscribe to the same six events listed for sandbox below, in live mode.
- CRYPTOLENS_LIVE_ISSUING_TOKENS: JSON mapping product IDs to product-locked CreateKey, AddCustomer, AddDataObject and GetKey tokens. Initial launch uses Viz 33431. The customer is supplied from the paid order, not the fixed sandbox template customer.
- CRYPTOLENS_LIVE_RENEWAL_TOKENS: JSON mapping product IDs to separate product-locked GetKey and ExtendLicense tokens.

Non-secret settings are in wrangler.jsonc: LIVE_STORE_PRODUCTS (initially viz), STRIPE_LIVE_ACCOUNT_ID, STRIPE_LIVE_PRICE_IDS, LIVE_STORE_ORIGIN and STORE_LIVE_EMAIL_FROM. Live email uses the existing verified TRIAL_SMTP_* transport credentials with support@npowersoftware.com as sender; sandbox email keeps its restricted Cloudflare binding. SMTP sends have a deadline, and ambiguous delivery is held for review instead of automatically resending.

LIVE_STORE_ENABLED=false closes new purchases. LIVE_LIFECYCLE_ENABLED is independent so existing paid renewals can continue while new checkout is closed. Before opening sales, configure and verify all credentials, the webhook and exact catalog prices, then set both flags true and deploy. Never enable lifecycle processing with sandbox credentials. Offset cron invocations run each environment every five minutes without combining their database query budgets.

The live database is separate and migrations 0001-0004 were applied to it on 2026-10-23. Do not replace the sandbox DB binding or any trial secrets. New checkout is limited to three licenses per order to bound the initial multi-step issuance request; larger purchases must contact sales. Sandbox retains its ten-license limit. Ambiguous license issuance saves its returned identity and requires review; never retry CreateKey blindly or reset a review unit to pending.

Live catalog inspection found the $795 annual, $995 annual floating, $1,995 perpetual floating and $295 annual maintenance prices. The current node-locked perpetual Stripe price is $5, which differs from the public $1,495 catalog. Its live price mapping is deliberately null until a correctly priced production option is selected. Changing Stripe alone does not change the website's prices or bypass amount verification. Do not connect that $5 price to the public full-price option or weaken payment validation.

Validation: 32 store tests cover live and sandbox payments, buyer identity, quantities, deferred maintenance, failed/duplicate/altered events, renewals, cancellations and email. The full store/trial/contact suite has 93 passing tests. No real card payment or live license/email delivery has been performed by this change. Live credentials and the final catalog match remain activation prerequisites.

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
support@npowersoftware.com. The deployed handler saves an inquiry in private D1 storage before returning a receipt.
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

## Public Power Surfacing VIZ evaluation preparation

The existing verified-email trial service is now part of the main source. Pages
routes /api/trials/* through TRIAL_SERVICE to npower-astro-site. Preserve this
route alongside contact, store and legacy downloads. Deploy from this main source,
not an older working copy that would remove the trial settings or handler.

TRIALS_ENABLED=true and TRIAL_PUBLIC_SIGNUP=true restore the approved public pilot.
The production origin is https://www.npowersoftware.com; the staging API stays
compatible with installed clients. Both use the same D1 ledger and TRIAL_HASH_KEY.
Never clear that ledger or rotate its hash key as part of a release. Trial emails
use support@npowersoftware.com through the existing server. See trials/README.txt
for credentials, rate limits and recovery.

Run npm run test:trials, npm run test:contact and npm run test:store, then npm run
build and a Wrangler dry run before deployment. The site's default canonical,
robots and sitemap origin is now production. PUBLIC_SITE_URL and
PUBLIC_ORGANIZATION_URL can override origins for a separate build.

The VIZ public installer must include the verified-email evaluation client and
pass a fresh-machine install, verification and activation test. The working
SOLIDWORKS Keap registration and paid sandbox restrictions are unchanged.

## Standalone Windows downloads

The VIZ Beta card publishes signed Windows x64 release 1.0.2026.1024,
including image-plane aspect-ratio, transparency, border highlighting, and editing-gizmo changes.
The Render Worker card publishes signed Windows x64 release 1.0.2026.1022.
The main application remains published only under VIZ Beta; Studio and RE Studio
cards remain coming soon. The unsigned Apple Silicon Mac beta is unchanged.

VIZ: Downloads/PowerSurfacing-VIZ-Setup-20261024.exe (1169869728 bytes).
SHA-256: db4e16ea0a69d45582ffb9dfce09b073a478c29caef79672e243ecf2290f496d.
Render Worker: Downloads/PowerSurfacing-RenderWorker-Setup-20261022.exe (540909576 bytes).
SHA-256: 6e772aad0472e8f28b22234828af30ec7cecda734f3370e25027c42ad3d40b07.
The Render Worker requires neither registration nor a license key.

These objects are stored in npower-downloads. Narrow filename routes on both
website hostnames send the new downloads directly to the manifest-restricted
R2 Worker for streaming and resumable downloads. Preserve the older objects,
manifest entries and routes so existing download links continue to work.
Pages also forwards /Downloads/* through DOWNLOADS_SERVICE for legacy downloads;
keep that route in public/_routes.json. Public SHA-256 files live under /downloads/.

## Website trial registration

The trial registration page posts to the existing Keap campaign. Before the
native form POST, src/lib/keapRegistration.js obtains the provider's Enterprise
reCAPTCHA token with action WEBFORM_SUBMIT and adds it as
g-enterprise-recaptcha-response. The public site key and form version match the
campaign's hosted form and enterpriseRecaptcha.js as checked on 2026-10-17.
Keep this verification when changing the form styling: omitting it sends users
back through Keap's hosted registration/verification page.

Keep all entered fields and optional email consent choices intact. Failed
verification stays on the same page and permits retry. The submit button waits
for client initialization and prevents repeated submissions. Keap must accept
registration before its configured success redirect runs; do not replace that
with an unconditional local redirect. The legacy completed-download URL
/NewDownloadingPowerSurfacing.html redirects to /pricing/downloads/solidworks/.

Run node --test tests/keap-registration.test.mjs and the standard website checks
for form changes. These regression checks use a local verification stub and do
not create Keap contacts or send email. A live acceptance check requires a real
visitor to submit the form and confirm arrival at the downloads page.

## Private $5 live purchase test (retired)

The live test was retired on October 23, 2026 after two fulfilled purchases and
sent license emails. LIVE_PURCHASE_TEST_ENABLED=false and the test price binding
is removed. The Stripe $5 price is archived. The old page redirects to /buy/viz/.
LIVE_STORE_ENABLED=true and LIVE_LIFECYCLE_ENABLED=true enable the regular VIZ
catalog, including $1,495 perpetual node-locked access. Existing test orders,
licenses, receipts and email history remain intact. The instructions below are
historical; a future test requires deliberately restoring a private page, active
test price binding and test enable flag before issuing an invitation.

The private /checkout/live-test/ page uses the normal live Stripe verification,
Cryptolens issuance and SMTP outbox. It is excluded from the sitemap and marked
noindex. Public Viz perpetual node-locked pricing remains $1,495. The private
price is $5 once for one license, two computers, first-year maintenance included,
with no automatic maintenance renewal.

Apply migrations to npower-store-live before deploying. LIVE_PURCHASE_TEST_ENABLED
enables invitations independently of LIVE_STORE_ENABLED. All live credentials,
storage, public price mappings and email configuration must still be ready.
STRIPE_LIVE_TEST_PRICE_ID must identify a separate active $5 USD one-time Viz price.
No price or recipient sent by a browser can override this selection.

An authenticated operator runs:
node scripts/prepare-live-purchase-test.mjs buyer@example.com

The script stores only an invitation hash and a fixed recipient in live D1, then
prints the private code once. Share it only with that tester. It expires after
24 hours and always opens the same order; an expired checkout requires operator
review before issuing another invitation. The invitation is submitted in a POST
body, never in a link, sitemap, browser storage or application logs. The live
order cookie retains access to the receipt for two days. Stripe must return the
invited email before any license or email is issued.

Set LIVE_PURCHASE_TEST_ENABLED=false to stop new invitation redemptions without
stopping already-paid order fulfillment. Disable an individual invitation by
setting its expires to 0 in the live_purchase_tests table. Never delete an
existing paid order or reset an uncertain issuance to try again.

## VIZ AI materials tutorial (2026-10-24)

The VIZ Videos page embeds "Using AI to manage materials" after the introduction
and materials tutorials using the supplied YouTube video 3lV0n-7MEhE.
The supplied MP4 is also archived in npower-downloads at
Videos/UsingAIToManageMaterials-20261024.mp4. The npower-downloads Worker serves
that allowlisted path on both production hostnames with video/mp4, inline
disposition and byte-range seeking.

## Separate trial signup pages

The header Download Trial menu and /pricing/trials/ chooser list Standalone Studio
Products first, then SOLIDWORKS Add-ins. /pricing/trials/solidworks/ retains the
existing verified Keap campaign and legacy SOLIDWORKS signup redirects.
/pricing/trials/studio/ uses the separate Download Power Surfacing Studio Keap
campaign (a35b97523e0764f1aaf7049061d8abee). Its field mappings come from the supplied
webFormBarebones.html export, with the canonical .app action from the matching full
HTML export. Both pages share TrialRegistrationForm for styling, required-field
validation and enterprise reCAPTCHA; Studio also retains the export's inf-sbt trap.
Keep the two campaign IDs separate. Keap owns the success redirect; configure the
Studio campaign to send accepted registrations to
https://www.npowersoftware.com/pricing/downloads/#standalone. This redirect setting
is not included in the exports and cannot be changed by the website form.

## Product download pages

/pricing/downloads/ is a product-family chooser with Standalone Studio first.
/pricing/downloads/studio/ contains VIZ and Render Worker downloads and upcoming
Studio products. /pricing/downloads/solidworks/ contains the SOLIDWORKS installers
and documentation. Existing product hash bookmarks on the chooser route forward
to the matching family page; the actual installer URLs and tracking stay intact.
Each family page links to its matching trial registration form.

Keap owns the post-registration redirect. The Studio campaign's external thank-you
URL should be https://www.npowersoftware.com/pricing/downloads/studio/.
The working SOLIDWORKS campaign can retain /NewDownloadingPowerSurfacing.html,
which now redirects directly to the SOLIDWORKS download page.
