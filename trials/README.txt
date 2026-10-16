PRODUCTION INTEGRATION - 2026-10-16 Arizona

The public trial service is integrated with the main website source. This release
preparation focuses on Power Surfacing VIZ. Existing SOLIDWORKS registration is
unchanged. Both production and staging /api/trials/* URLs use the same Worker,
D1 ledger, hash key and credentials. TRIAL_ORIGIN is the production origin;
TRIAL_LEGACY_ORIGIN preserves staging browser compatibility. Desktop calls
without Origin remain supported at both URLs without redirects.

A current signed installer containing the verified-email client is still needed
before adding the public VIZ download. This section supersedes the historical
future-domain-move and uncommitted-source notes below. Paid checkout remains
sandbox-only. No new database or trial reset.

POWER SURFACING VERIFIED-EMAIL EVALUATIONS

PUBLIC TRIAL PILOT (2026-10-15 Arizona)
- Public signup was explicitly approved and deployed on www.npowersoftwarenew.com.
  TRIAL_PUBLIC_SIGNUP=true permits verification requests from any valid email.
  Users must still prove email ownership before a license is issued. One 30-day
  evaluation per email AND machine, across editions, remains enforced.
- Active Worker: b77b1817-f3a3-48c6-842a-7a8b0b0ad45e (npower-astro-site).
  Previous Worker: d3504de1-8764-4dd8-ba1e-c918bcc9e5ea.
  Pages was not redeployed in this rollout; its existing TRIAL_SERVICE binding
  and /api/trials/* routing continue to use the Worker.
- Global mail budgets: 100 attempts per hour and 500 per 24 hours, persisted in
  the existing trial_limits table. Individual IP/email/machine limits remain.
  No migration, ledger reset, token rotation or paid checkout changes were made.
- All 64 local tests passed (31 trial, 9 SMTP, 24 paid-store), as did the Astro
  build, generated Worker types and Wrangler dry-run packaging.
- Live checks with unfamiliar emails reached invalid-machine validation (400),
  malformed email was rejected (400), and foreign Origin was rejected (403).
  These checks sent no mail and created no licenses. The normal ledger contained
  one issued trial before AND after the rollout. Paid sandbox status stayed ready
  for all 12 options. Unknown-user end-to-end delivery is the next user test.
- Sender remains support@npowersoftware.com, authenticated through the existing
  mailbox. No DNS, forwarder or production-domain changes were made.
- Existing desktop builds targeting the staging evaluation API need no rebuild
  for this toggle. Test a fresh activation on a computer without an existing trial;
  a second email on a previously used computer must not receive another trial.
- This was a direct Worker deployment, not a Git commit or push. Reviewed source
  changes must be committed before future main-branch deployment to avoid reverting
  the direct deployment. Production-domain cutover is still a separate operation.

INITIAL GMAIL-ONLY ACCEPTANCE (historical snapshot)
Gmail-only staging deployed 2026-10-16 UTC (2026-10-15 Arizona). Email delivery,
30-day license creation/activation and retry protection passed a live acceptance
test on a disposable machine ID and isolated database. The application endpoint
was ready for gcrocker61@gmail.com only. Public trials were then unavailable. Paid checkout
is unchanged. No application binaries were installed or launched for this setup.

INITIAL STAGING SETUP STATUS (2026-10-16 UTC; superseded by public pilot above)
- Approved destination: https://www.npowersoftwarenew.com; testing restricted to
  gcrocker61@gmail.com. TRIAL_ORIGIN is now recorded in the local Wrangler config.
- Requested sender: support@npowersoftware.com (a forwarder, not a mailbox).
  Prepared authenticated SMTP through mail.npowersoftware.com:465 with implicit
  SSL/TLS, using dgill@npowersoftware.com as the login. Host permission to send
  as support passed the controlled acceptance test. No forwarder/DNS changes.
  Paid-store EMAIL/EMAIL_FROM are unchanged. The unused trial Cloudflare email
  binding has been removed locally; trial mail now uses its own SMTP transport.
- Applied 0003_trials.sql to npower-store-sandbox. Verified all three trial tables,
  zero trial licenses and no remaining migrations. Existing store data is retained.
- 55 local trial/store/SMTP tests passed (31 trial/SMTP, 24 paid-store).
  Configuration types were regenerated. The trial routing regression is covered.
  A local workerd runtime successfully verified TLS and SMTP greeting/EHLO via
  the SMTP library, explicitly without authentication or sending any email.
  Wrangler dry-run packaging and Astro build now pass in the authorized shell.
  Initial Worker: d3504de1-8764-4dd8-ba1e-c918bcc9e5ea.
  Initial Pages deployment: https://a0c7918d.npower-astro-site.pages.dev.
  Pages Production has TRIAL_SERVICE bound to Worker npower-astro-site.
  public/_routes.json now includes both /api/store/* and /api/trials/*; omitting
  the latter previously caused static Pages to return 405 to trial POSTs.
- SMTP avoids the trial's dependency on Cloudflare Email Sending onboarding or
  moving npowersoftware.com DNS. No plan purchase or recipient expansion was made.
- TRIAL_SMTP_PASSWORD is installed in the Worker's encrypted secrets. Its value was
  never read or printed. Authenticated SMTP accepted the support sender. Gmail
  received the test at 2026-10-16 00:54:28 UTC in INBOX (message 1a1423411824cdb9).
  SPF, DKIM and DMARC all passed. The eight-digit test code cannot activate a license.
- Delivery was tested in a non-deployed, authenticated, one-use, expiring preview;
  an unauthenticated request returned 401 and repeated authenticated use returned
  409 without another send. The active deployment was unchanged during that test.
  The temporary acceptance handler is NOT part of the deployed website Worker.
- With explicit user approval, six server-only Devolens tokens were created:
  Trial Server Viz Create / Activate (product 33431), Trial Server Studio Create /
  Activate (33432), Trial Server RE Create / Activate (33433). Each Create token
  has only CreateKey + AddCustomer; each Activate token has only Activate.
  All are product locked, Key Lock 0, Feature Lock 0. No existing tokens changed.
- TRIAL_HASH_KEY, CRYPTOLENS_TRIAL_CREATE_TOKENS and
  CRYPTOLENS_TRIAL_ACTIVATE_TOKENS are installed as encrypted Worker secrets.
  No secret values were written to source files, logs or this documentation.
- Full live acceptance at 2026-10-16T01:01:51Z used the real trial handler, SMTP
  sender and Devolens calls, with dedicated database npower-trial-acceptance-20261016
  (ffd6f724-b1f0-4419-998b-9d01f675e1bf). Wrong code returned 401. Exactly one
  Studio RE license was issued and activated, expiring 2026-11-15T01:01:47Z.
  Retrying returned the same key and expiry. The one-use harness rejected a repeat
  with 409. It did not use the desktop's real machine ID or normal trial ledger.
- Verified through https://www.npowersoftwarenew.com/api/trials/: Gmail input with
  an invalid machine reaches validation (400); non-allowlisted email is denied
  (503); missing verification credentials are denied (401); foreign Origin is
  denied (403). These endpoint checks sent no mail and created no licenses.
- After deployment, paid store remains ready with all 12 product options;
  normal trial_requests and trial_licenses both contain zero rows. TRIALS_ENABLED
  is true with TRIAL_TEST_EMAIL still restricted to gcrocker61@gmail.com.
  The user must request a NEW code in the application, not reuse acceptance emails.
- Evidence is retained under C:\Users\gcroc\.codex\visualizations\2026\09\03\
  01a06551-b621-77e2-883f-dd139bd9bbcb\trial-email-acceptance (one path): result.json,
  flow-result.json, application-endpoint-smoke.json and pages-trial-binding.png.
  These direct deployments are not a Git push. Commit the reviewed trial source
  changes before a future main-branch deployment so CI does not restore old code.

FLOW
1. Desktop chooses Viz (2), Studio (4) or Studio RE (8), enters email, POSTs start.
2. Server mails an eight-digit, fifteen-minute code. No license exists yet.
3. Desktop POSTs verify with code, initiating request credential and machine code.
4. Server atomically reserves ONE evaluation per email AND machine, across editions.
5. Server creates a customer-associated, 30-day, one-machine Cryptolens key and
   activates the intended machine before releasing the key to the requesting client.
6. Desktop independently verifies the signed activation and caches it. Normal
   restarts require no email verification. Recovery after cache loss requires proof
   of email ownership again; it returns the same license and original expiry.

New email on same machine: denied. Same email on different machine: denied (support
can handle legitimate machine replacements). Different edition: denied; choose the
original edition or contact support. No automatic cross-edition upgrade/reset.
Machine identity comes from the existing desktop identifier, already SHA256 hashed.
Server stores an additional keyed HMAC, not the raw machine code. OS reinstall,
VMs, modified clients and deliberately changed IDs are not hardware attestation.
Email variants on the same machine cannot bypass the machine uniqueness constraint.

CONFIGURATION / RELEASE GATES
- Apply migrations/0003_trials.sql to the selected D1 database before enabling
  (already applied to the approved staging database above).
  Local tests use in-memory SQLite and never change the hosted store database.
- TRIALS_ENABLED=true enables the approved trial service. Set it false to
  disable new trial API use; keep the ledger and TRIAL_HASH_KEY intact.
- TRIAL_PUBLIC_SIGNUP=true explicitly enables public signup. Missing, false or
  any other value restores restricted testing. TRIAL_TEST_EMAIL is retained as
  gcrocker61@gmail.com for that rollback. Clearing the test address does NOT enable
  public signup; restricted mode with no valid test address fails closed.
  Both start validation and SMTP delivery enforce this setting. Trial code never
  falls back to paid-store email. All sends require an initiating signup request.
- TRIAL_EMAIL_HOURLY_LIMIT=100 and TRIAL_EMAIL_DAILY_LIMIT=500 cap mail attempts
  using shared D1 counters, including failed/uncertain sends. Invalid limits fail
  closed. Existing 20/IP/hour, 3/email/hour and 5/machine/hour limits also apply.
- TRIAL_SMTP_HOST/PORT/USER configure the existing authenticated server. Port
  465 and certificate-validated TLS are mandatory; no plaintext fallback, debug
  mail logging or automatic retries. The support forwarder stays unchanged.
- In Cloudflare, select the npower-astro-site WORKER (not the Pages project),
  Settings > Variables and Secrets > Add > Secret, name TRIAL_SMTP_PASSWORD.
  Enter the dgill mailbox password yourself and save. Do not share it in chat.
  Equivalent secure terminal prompt from this project directory:
  node node_modules/wrangler/bin/wrangler.js secret put TRIAL_SMTP_PASSWORD
- Set TRIAL_ORIGIN to the approved website origin for browser calls. Desktop calls
  have no Origin header. No CORS wildcard or ambient browser cookies authorize trials.
- Keep Pages TRIAL_SERVICE bound to the trial-capable Worker and /api/trials/* in
  public/_routes.json. The Pages route fails closed without the service binding.
- Desktop EvaluationServiceUrl is set to the approved HTTPS API ending in
  /api/trials/. This configuration does not deploy or enable the trial backend.

FUTURE PRODUCTION DOMAIN MOVE (not executed)
1. Route /api/trials/* on www.npowersoftware.com through TRIAL_SERVICE to the same
   trial-capable Worker. Verify its routing and service binding before cutover.
2. At approved cutover, change TRIAL_ORIGIN to https://www.npowersoftware.com.
   SMTP EHLO derives its host from this validated origin; no staging hostname is
   hardcoded in the transport. Retest same-origin and foreign-origin requests.
3. Update desktop EvaluationServiceUrl to the production API and distribute the
   updated client. Keep the old staging API proxy/service route working during
   transition for installed clients. Do not rely on HTTP redirects: the desktop
   client's HttpClientHandler has AllowAutoRedirect=false.
4. Preserve the SAME D1 trial ledger, TRIAL_HASH_KEY and server credentials.
   Moving domains must not erase existing trials or allow repeat evaluations.
5. Test verification, activation and recovery without resetting eligibility.
   Paid Stripe/store origin and sales@npowersoftware.com delivery are a separate
   rollout; this public trial pilot does not enable live payments or paid emails.

SERVER SECRETS (never in the desktop, source control, logs or request bodies)
- TRIAL_SMTP_PASSWORD: password for TRIAL_SMTP_USER, not the support forwarder.
  If your host refuses the support sender, arrange send-as authorization or a
  dedicated sending mailbox; do not silently substitute a different sender.
- TRIAL_HASH_KEY: at least 32 random bytes encoded as hex or base64. Back up securely.
  Do NOT rotate/delete without migrating ledger hashes; that would erase effective
  repeat-trial protection. The same key must survive deployments and restarts.
- CRYPTOLENS_TRIAL_CREATE_TOKENS: JSON mapping 33431/33432/33433 to separate
  product-locked CreateKey + AddCustomer tokens. No extension, deletion, blocking,
  template or administrative permissions. AddCustomer is account-level authority;
  only the server owns it. The service, not the client, fixes duration and flags.
- CRYPTOLENS_TRIAL_ACTIVATE_TOKENS: JSON mapping the same product IDs to restricted
  Activate-only tokens. Feature Lock 0 preserves all response fields.
- F1 is time limited, F2 is trial; agree these definitions with the product setup.
  Never enable treating ALL licenses as time limited: paid perpetual keys use expiry
  for maintenance. Never reuse paid templates or issue trial keys from the client.

RECOVERY / SECURITY
Database uniqueness constraints, not local memory or a check-then-insert, serialize
issuance. Cryptolens CreateKey has no idempotency key. An uncertain response, failed
binding, or failed ledger save stays issuing/review and is never blindly retried.
Use the trial_licenses id, also included in the vendor key Notes, to reconcile with
Cryptolens. Verify customer, machine, product, original dates and trial flags before
recording a known issued key. Never delete a reservation to retry without checking
whether a key was already created. No public administrative/retry endpoint exists.

Codes have five guesses, email/machine/IP send limits and a verification IP limit.
The request secret and verification code are HMAC-hashed. Request secrets never
enter URLs. Errors never return another person's license or vendor credentials.
Trial ledger hashes remain after expiry to enforce eligibility. The existing cron
cleans expired short-lived requests (including emails) and rate counters, not the
ledger. Cryptolens retains the customer email associated with their license.
Do not clear D1 or change its binding between deployments as a cleanup operation.

TESTS
npm run test:trials - service + real SQLite schema/queries, race/retry/failure cases,
  expiry, wrong email/machine/edition, OTP limits, mocked vendor API protocol,
  SMTP TLS/authentication settings, restricted/public modes, global mail budgets,
  failure redaction and deadlines.
npm run test:store - existing paid purchase/renewal regression suite.
npm run build - Astro build. npx wrangler deploy --dry-run - Worker packaging only.
Local mocks alone do not prove email delivery or vendor provisioning. The live
Gmail/Studio RE disposable acceptance above passed; all three editions passed local
tests. Public signup is now explicitly approved and deployed as recorded above;
the new rollout used safe live validation probes, not real unknown-user mail or
new license issuance. Desktop interaction with a fresh eligible tester remains
the user's next test. This rollout did not reset or consume desktop trial eligibility.
