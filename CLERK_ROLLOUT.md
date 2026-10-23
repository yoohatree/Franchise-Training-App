# Clerk login rollout

The Worker contains two authentication modes. Without `AUTH_PROVIDER=clerk`, the live Site continues to use its current ChatGPT sign-in and approval records. In Clerk mode, the Worker verifies each Clerk session, retrieves the account's verified primary email, and applies the existing owner and employee approval rules. Legacy approvals remain in R2 and are matched by verified email; revocations continue to take effect.

## Local development

Put `AUTH_PROVIDER=clerk`, `CLERK_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`), and `CLERK_SECRET_KEY` in the ignored `.env`. The publishable and secret keys must belong to the same Clerk instance. Run `npm install`, `npm run build`, and `npm test`. The test suite uses a mock Clerk backend; it does not create accounts.

## Activation on the employee Site

1. Claim the Clerk application in the Clerk Dashboard. The supplied development keys came from an unclaimed accountless instance.
2. Obtain a company-controlled domain and configure it for the Site. Clerk's production instance needs a domain and DNS control.
3. Configure the Clerk production instance for that domain, complete DNS and certificate setup, and obtain matching `pk_live_` and `sk_live_` keys.
4. Store `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` (secret), and `AUTH_PROVIDER=clerk` as Sites runtime variables. Deploy the saved version again to apply the new environment revision.
5. Test sign-in with the owner's verified email, a previously approved employee, a new employee request, approval, revocation, and sign-out. If any check fails, remove `AUTH_PROVIDER` and redeploy the last known working version.

Do not place real keys in tracked files or use `pk_test_` / `sk_test_` on the employee Site.
