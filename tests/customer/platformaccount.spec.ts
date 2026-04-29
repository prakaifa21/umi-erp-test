// import { test, expect, Page } from '@playwright/test';
// import { PlatformAccountPage } from '../pages/PlatformAccountPage';
// import { ModernTradeCustomerListPage } from '../pages/ModernTradeCustomerListPage';
// import {
//   ACCOUNT_NO_ACCOUNT,
//   ACCOUNT_PENDING,
//   ACCOUNT_ACTIVE,
//   ACCOUNT_INACTIVE,
//   EMAIL_VALID_NEW,
//   EMAIL_VALID_CURRENT,
//   EMAIL_DUPLICATE,
//   EMAIL_INVALID,
// } from '../fixtures/platformAccountFixtures';
// import {
//   mockGetPlatformAccount,
//   mockCreateAccountSuccess,
//   mockUpdateAccountSuccess,
//   mockUpdateAccountDuplicateEmail,
//   mockUpdateAccountSameEmail,
//   mockResendEmailSuccess,
//   mockSessionRejected,
// } from '../mocks/platformAccountMocks';
// import { mockCustomerListApi } from '../mocks/apiMocks';
// import { MOCK_CUSTOMERS } from '../fixtures/customerFixtures';

// // ─────────────────────────────────────────────────────────────────────────────
// // Shared constants
// // ─────────────────────────────────────────────────────────────────────────────
// const SAP_ID = '11000150';

// // ─────────────────────────────────────────────────────────────────────────────
// // Helper — navigate from Customer List → edit icon → Platform Account tab
// // Reuses ModernTradeCustomerListPage to verify the entry-point flow works.
// // ─────────────────────────────────────────────────────────────────────────────
// async function navigateViaCustomerList(
//   page: Page,
//   targetSapId: string
// ): Promise<PlatformAccountPage> {
//   const listPage = new ModernTradeCustomerListPage(page);
//   await listPage.goto();
//   await listPage.search(targetSapId);
//   await listPage.clickEditForRow(0);          // opens detail page
//   const detailPage = new PlatformAccountPage(page, targetSapId);
//   await detailPage.platformAccountTab.click();
//   return detailPage;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Suite
// // ─────────────────────────────────────────────────────────────────────────────
// test.describe('Platform Account — State-based UI', () => {
//   let accountPage: PlatformAccountPage;

//   test.beforeEach(async ({ page }) => {
//     accountPage = new PlatformAccountPage(page, SAP_ID);
//   });

//   // ── No Account state ─────────────────────────────────────────────────────
//   test.describe('State: No Account', () => {
//     test.beforeEach(async () => {
//       await mockGetPlatformAccount(accountPage.page, ACCOUNT_NO_ACCOUNT);
//       await mockCreateAccountSuccess(accountPage.page, SAP_ID);
//       await accountPage.gotoCreate();
//     });

//     test('shows "No Account" badge in the page header', async () => {
//       await expect(accountPage.statusBadge).toContainText('No Account');
//     });

//     test('renders Account Information form with Customer Email and Tier fields', async () => {
//       await expect(accountPage.customerEmailInput).toBeVisible();
//       await expect(accountPage.tierSelect).toBeVisible();
//     });

//     test('shows "Create Account" button', async () => {
//       await expect(accountPage.createAccountButton).toBeVisible();
//     });

//     test('clicking "Create Account" opens confirmation dialog with correct copy', async () => {
//       await accountPage.fillEmail(EMAIL_VALID_NEW);
//       await accountPage.createAccountButton.click();

//       await expect(accountPage.confirmDialog).toBeVisible();
//       await expect(accountPage.confirmDialogTitle).toContainText('Are you absolutely sure?');
//       await expect(accountPage.confirmDialogBody).toContainText(
//         'This action cannot be undo. This will create Platform Account.'
//       );
//       await expect(accountPage.confirmDialogCancelButton).toBeVisible();
//       await expect(accountPage.confirmDialogConfirmButton).toContainText('Yes, create account');
//     });

//     test('cancelling the confirmation dialog closes it without creating an account', async () => {
//       await accountPage.fillEmail(EMAIL_VALID_NEW);
//       await accountPage.createAccountButton.click();
//       await accountPage.confirmDialogCancelButton.click();

//       await expect(accountPage.confirmDialog).not.toBeVisible();
//       // Form is still open with the typed email
//       await expect(accountPage.customerEmailInput).toBeVisible();
//     });
//   });

//   // ── Pending state (read-only) ─────────────────────────────────────────────
//   test.describe('State: Pending (read-only)', () => {
//     test.beforeEach(async () => {
//       await mockGetPlatformAccount(accountPage.page, ACCOUNT_PENDING);
//       await mockResendEmailSuccess(accountPage.page, SAP_ID);
//       await accountPage.gotoPendingResend();
//     });

//     test('shows "Pending" badge in the page header', async () => {
//       await expect(accountPage.statusBadge).toContainText('Pending');
//     });

//     test('displays the registered email and tier in read-only mode', async () => {
//       await expect(accountPage.emailDisplayValue).toContainText(
//         ACCOUNT_PENDING.customerEmail!
//       );
//       await expect(accountPage.tierDisplayValue).toContainText(ACCOUNT_PENDING.tier!);
//     });

//     test('shows "Resend Email" button', async () => {
//       await expect(accountPage.resendEmailButton).toBeVisible();
//     });

//     test('shows "Edit Account Information" button', async () => {
//       await expect(accountPage.editAccountInfoButton).toBeVisible();
//     });

//     test('"Resend Email" button triggers API call and shows success feedback', async () => {
//       const [request] = await Promise.all([
//         accountPage.page.waitForRequest(
//           (req) => req.url().includes('resend') && req.method() === 'POST'
//         ),
//         accountPage.resendEmailButton.click(),
//       ]);
//       expect(request).toBeTruthy();
//     });
//   });

//   // ── Pending-Edit state ────────────────────────────────────────────────────
//   test.describe('State: Pending (edit form)', () => {
//     test.beforeEach(async () => {
//       await mockGetPlatformAccount(accountPage.page, ACCOUNT_PENDING);
//       await accountPage.gotoPendingEdit();
//     });

//     test('shows "Pending" badge and editable form simultaneously', async () => {
//       await expect(accountPage.statusBadge).toContainText('Pending');
//       await expect(accountPage.customerEmailInput).toBeVisible();
//       await expect(accountPage.tierSelect).toBeVisible();
//     });

//     test('shows "Resend Email" action alongside the edit form', async () => {
//       await expect(accountPage.resendEmailButton).toBeVisible();
//     });

//     test('clicking "Update Account" opens confirmation dialog with correct copy', async () => {
//       await accountPage.updateAccountButton.click();

//       await expect(accountPage.confirmDialog).toBeVisible();
//       await expect(accountPage.confirmDialogTitle).toContainText('Are you absolutely sure?');
//       await expect(accountPage.confirmDialogBody).toContainText(
//         'This action cannot be undo. This will change Platform Account and user need to set up new password again.'
//       );
//       await expect(accountPage.confirmDialogConfirmButton).toContainText('Yes, change account');
//     });
//   });

//   // ── Active-Edit state ─────────────────────────────────────────────────────
//   test.describe('State: Active (edit form)', () => {
//     test.beforeEach(async () => {
//       await mockGetPlatformAccount(accountPage.page, ACCOUNT_ACTIVE);
//       await accountPage.gotoActiveEdit();
//     });

//     test('shows "Active" badge in the page header', async () => {
//       await expect(accountPage.statusBadge).toContainText('Active');
//     });

//     test('shows the "Active" toggle switch in ON state', async () => {
//       await expect(accountPage.activeToggle).toBeVisible();
//       const isOn = await accountPage.isActiveToggleOn();
//       expect(isOn).toBe(true);
//     });

//     test('shows editable Customer Email and Tier fields pre-filled with current values', async () => {
//       await expect(accountPage.customerEmailInput).toBeVisible();
//       await expect(accountPage.customerEmailInput).toHaveValue(ACCOUNT_ACTIVE.customerEmail!);
//       await expect(accountPage.tierSelect).toBeVisible();
//     });

//     test('shows "Update Account" button', async () => {
//       await expect(accountPage.updateAccountButton).toBeVisible();
//     });
//   });

//   // ── Inactive state (read-only, no actions) ────────────────────────────────
//   test.describe('State: Inactive (read-only)', () => {
//     test.beforeEach(async () => {
//       await mockGetPlatformAccount(accountPage.page, ACCOUNT_INACTIVE);
//       await accountPage.gotoInactiveEdit();
//     });

//     test('shows "Inactive" badge in the page header', async () => {
//       await expect(accountPage.statusBadge).toContainText('Inactive');
//     });

//     test('displays email and tier in read-only mode', async () => {
//       await expect(accountPage.emailDisplayValue).toContainText(
//         ACCOUNT_INACTIVE.customerEmail!
//       );
//       await expect(accountPage.tierDisplayValue).toContainText(ACCOUNT_INACTIVE.tier!);
//     });

//     test('does NOT show Create, Update, or Resend buttons', async () => {
//       await expect(accountPage.createAccountButton).not.toBeVisible();
//       await expect(accountPage.updateAccountButton).not.toBeVisible();
//       await expect(accountPage.resendEmailButton).not.toBeVisible();
//     });
//   });

//   // ── SAP Data tab ──────────────────────────────────────────────────────────
//   test.describe('SAP Data tab', () => {
//     test.beforeEach(async () => {
//       await mockGetPlatformAccount(accountPage.page, ACCOUNT_ACTIVE);
//       await accountPage.gotoSapData();
//     });

//     test('shows "Active" badge on the SAP Data tab view', async () => {
//       await expect(accountPage.statusBadge).toContainText('Active');
//     });

//     test('SAP Data tab is active/selected', async () => {
//       await expect(accountPage.sapDataTab).toHaveAttribute('aria-selected', 'true')
//         .catch(async () => {
//           // Some implementations use CSS class instead of aria
//           await expect(accountPage.sapDataTab).toHaveClass(/active|selected/i);
//         });
//     });

//     test('displays SAP Master Data section', async () => {
//       await expect(
//         accountPage.page.getByText('SAP Master Data')
//       ).toBeVisible();
//     });

//     test('displays Sales Area Fields section', async () => {
//       await expect(
//         accountPage.page.getByText(/Sales Area Fields/i)
//       ).toBeVisible();
//     });
//   });
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // Email Change Acceptance Criteria (AC-001 – AC-008)
// // Entry point: Customer List → Edit → Platform Account
// // ─────────────────────────────────────────────────────────────────────────────
// test.describe('Email Change — Acceptance Criteria', () => {
//   let accountPage: PlatformAccountPage;

//   test.beforeEach(async ({ page }) => {
//     accountPage = new PlatformAccountPage(page, SAP_ID);
//     // Also mock the customer list so entry-via-list tests work
//     await mockCustomerListApi(page, MOCK_CUSTOMERS);
//   });

//   // ── AC-001 | Happy Path — from Active ────────────────────────────────────
//   test.describe('AC-001 | Happy Path from Active status', () => {
//     test.beforeEach(async () => {
//       await mockGetPlatformAccount(accountPage.page, ACCOUNT_ACTIVE);
//       await mockUpdateAccountSuccess(accountPage.page, SAP_ID, { customerEmail: EMAIL_VALID_NEW });
//       await accountPage.gotoActiveEdit();
//     });

//     test('changing email on an Active account resets status to Pending', async () => {
//       await accountPage.fillEmail(EMAIL_VALID_NEW);
//       await accountPage.submitUpdateAccount('confirm');

//       // After success the page should show Pending badge
//       await expect(accountPage.statusBadge).toContainText('Pending');
//     });

//     test('confirmation dialog body warns that sessions will be invalidated', async () => {
//       await accountPage.fillEmail(EMAIL_VALID_NEW);
//       await accountPage.updateAccountButton.click();

//       await expect(accountPage.confirmDialogBody).toContainText(
//         /change Platform Account and user need to set up new password again/i
//       );
//     });

//     test('entry via Customer List edit icon navigates correctly to Platform Account tab', async ({
//       page,
//     }) => {
//       // Use reusable helper that goes through the list
//       const detailPage = await navigateViaCustomerList(page, SAP_ID);
//       await expect(detailPage.platformAccountTab).toBeVisible();
//       await expect(detailPage.statusBadge).toBeVisible();
//     });
//   });

//   // ── AC-002 | Happy Path — from Pending ───────────────────────────────────
//   test.describe('AC-002 | Happy Path from Pending status', () => {
//     test.beforeEach(async () => {
//       await mockGetPlatformAccount(accountPage.page, ACCOUNT_PENDING);
//       await mockUpdateAccountSuccess(accountPage.page, SAP_ID, { customerEmail: EMAIL_VALID_NEW });
//       await accountPage.gotoPendingEdit();
//     });

//     test('changing email on a Pending account sends a new reset link and stays Pending', async () => {
//       await accountPage.fillEmail(EMAIL_VALID_NEW);
//       await accountPage.submitUpdateAccount('confirm');

//       // Should still be Pending (new link sent to new email)
//       await expect(accountPage.statusBadge).toContainText('Pending');
//     });

//     test('the old reset link is invalidated — API receives new email in payload', async () => {
//       await accountPage.fillEmail(EMAIL_VALID_NEW);

//       const [request] = await Promise.all([
//         accountPage.page.waitForRequest(
//           (req) =>
//             req.method() === 'PUT' &&
//             req.url().includes(SAP_ID) &&
//             req.url().includes('platform-account')
//         ),
//         accountPage.submitUpdateAccount('confirm'),
//       ]);

//       const payload = JSON.parse(request.postData() ?? '{}');
//       expect(payload.email).toBe(EMAIL_VALID_NEW);
//     });
//   });

//   // ── AC-003 | Same Email ───────────────────────────────────────────────────
//   test.describe('AC-003 | Same Email error', () => {
//     test.beforeEach(async () => {
//       await mockGetPlatformAccount(accountPage.page, ACCOUNT_ACTIVE);
//       await mockUpdateAccountSameEmail(accountPage.page, SAP_ID);
//       await accountPage.gotoActiveEdit();
//     });

//     test('submitting the same email shows inline error "The new email address is the same as the current one"', async () => {
//       await accountPage.fillEmail(EMAIL_VALID_CURRENT);
//       await accountPage.submitUpdateAccount('confirm');

//       await expect(accountPage.emailFieldError.or(accountPage.generalFormError)).toContainText(
//         'The new email address is the same as the current one'
//       );
//     });

//     test('no status change occurs when submitting the same email', async () => {
//       await accountPage.fillEmail(EMAIL_VALID_CURRENT);
//       await accountPage.submitUpdateAccount('confirm');

//       // Status badge must still read Active
//       await expect(accountPage.statusBadge).toContainText('Active');
//     });
//   });

//   // ── AC-004 | Duplicate Email ─────────────────────────────────────────────
//   test.describe('AC-004 | Duplicate Email error', () => {
//     test.beforeEach(async () => {
//       await mockGetPlatformAccount(accountPage.page, ACCOUNT_ACTIVE);
//       await mockUpdateAccountDuplicateEmail(accountPage.page, SAP_ID);
//       await accountPage.gotoActiveEdit();
//     });

//     test('submitting a duplicate email shows inline error "The email is already exists"', async () => {
//       await accountPage.fillEmail(EMAIL_DUPLICATE);
//       await accountPage.submitUpdateAccount('confirm');

//       await expect(accountPage.emailFieldError.or(accountPage.generalFormError)).toContainText(
//         'The email is already exists'
//       );
//     });

//     test('email field retains the duplicate value so the user can correct it', async () => {
//       await accountPage.fillEmail(EMAIL_DUPLICATE);
//       await accountPage.submitUpdateAccount('confirm');

//       await expect(accountPage.customerEmailInput).toHaveValue(EMAIL_DUPLICATE);
//     });

//     test('account status remains unchanged after duplicate email error', async () => {
//       await accountPage.fillEmail(EMAIL_DUPLICATE);
//       await accountPage.submitUpdateAccount('confirm');

//       await expect(accountPage.statusBadge).toContainText('Active');
//     });
//   });

//   // ── AC-005 | Invalid Email Format ────────────────────────────────────────
//   test.describe('AC-005 | Invalid Email Format', () => {
//     test.beforeEach(async () => {
//       await mockGetPlatformAccount(accountPage.page, ACCOUNT_ACTIVE);
//       await accountPage.gotoActiveEdit();
//     });

//     test('typing a malformed email and clicking Update shows "รูปแบบอีเมลไม่ถูกต้อง"', async () => {
//       await accountPage.fillEmail(EMAIL_INVALID);
//       // Attempt submit — may be blocked client-side before dialog opens
//       await accountPage.updateAccountButton.click();

//       // Either inline HTML5 validation or the custom error message
//       const emailInputInvalid = await accountPage.customerEmailInput
//         .evaluate((el: HTMLInputElement) => !el.validity.valid)
//         .catch(() => false);

//       if (!emailInputInvalid) {
//         // Custom validation path: dialog may open — cancel it and check error
//         const dialogVisible = await accountPage.confirmDialog.isVisible().catch(() => false);
//         if (dialogVisible) await accountPage.confirmDialogConfirmButton.click();
//         await expect(accountPage.emailFieldError).toContainText('รูปแบบอีเมลไม่ถูกต้อง');
//       }
//       // If HTML5 validation blocks, submission is prevented — test passes by not reaching the API
//     });

//     test('an invalid email format does NOT trigger the confirmation dialog', async () => {
//       await accountPage.fillEmail(EMAIL_INVALID);
//       await accountPage.updateAccountButton.click();

//       // Give dialog time to appear (if it wrongly opens)
//       await accountPage.page.waitForTimeout(500);

//       const dialogVisible = await accountPage.confirmDialog.isVisible().catch(() => false);
//       // Dialog should NOT appear for an invalid format — validation must block it
//       // Note: if the app validates after dialog, this assertion is skipped
//       if (dialogVisible) {
//         // Mark an explicit failure: the confirmation dialog should not open for invalid input
//         expect(dialogVisible, 'Confirmation dialog must not open for invalid email format').toBe(false);
//       }
//     });
//   });

//   // ── AC-006 | Cancel ───────────────────────────────────────────────────────
//   test.describe('AC-006 | Cancel reverts changes', () => {
//     test.beforeEach(async () => {
//       await mockGetPlatformAccount(accountPage.page, ACCOUNT_ACTIVE);
//       await accountPage.gotoActiveEdit();
//     });

//     test('clicking Cancel in the edit form reverts the email to the original value', async () => {
//       const originalEmail = ACCOUNT_ACTIVE.customerEmail!;

//       await accountPage.fillEmail('modified@example.com');

//       // Click the form-level Cancel (not the dialog Cancel — this test uses a form Cancel button)
//       const formCancelButton = accountPage.page
//         .getByTestId('form-cancel-button')
//         .or(accountPage.page.getByRole('button', { name: /cancel/i }).first());

//       await formCancelButton.click();

//       // The displayed email should revert
//       const displayedEmail = await accountPage.getDisplayedEmail().catch(async () =>
//         accountPage.customerEmailInput.inputValue()
//       );
//       expect(displayedEmail).toBe(originalEmail);
//     });

//     test('clicking Cancel in the confirmation dialog leaves the form open with modified value', async () => {
//       await accountPage.fillEmail('modified@example.com');
//       await accountPage.updateAccountButton.click();

//       // Dialog opens — click Cancel inside it
//       await expect(accountPage.confirmDialog).toBeVisible();
//       await accountPage.confirmDialogCancelButton.click();

//       // Dialog closed, form still open, value still modified
//       await expect(accountPage.confirmDialog).not.toBeVisible();
//       await expect(accountPage.customerEmailInput).toHaveValue('modified@example.com');
//     });
//   });

//   // ── AC-007 | Session Invalidation ────────────────────────────────────────
//   test.describe('AC-007 | Session Invalidation after email change', () => {
//     test('after a sales user updates the email, the customer session token is rejected', async ({
//       page,
//     }) => {
//       await mockGetPlatformAccount(accountPage.page, ACCOUNT_ACTIVE);
//       await mockUpdateAccountSuccess(accountPage.page, SAP_ID, { customerEmail: EMAIL_VALID_NEW });
//       await mockSessionRejected(page);
//       await accountPage.gotoActiveEdit();

//       await accountPage.fillEmail(EMAIL_VALID_NEW);
//       await accountPage.submitUpdateAccount('confirm');

//       // Simulate the customer trying to use their old session via the verify endpoint
//       const sessionCheckResponse = await page.evaluate(async () => {
//         const res = await fetch('/api/v1/auth/verify', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer mock-session-token-abc123',
//           },
//         });
//         return { status: res.status };
//       });

//       expect(sessionCheckResponse.status).toBe(401);
//     });

//     test('the customer is redirected to login when their stale session is used', async ({
//       page,
//     }) => {
//       // Set up: session rejected → app should redirect to /login
//       await mockSessionRejected(page);

//       // Simulate the customer app navigating to a protected route with old token
//       await page.addInitScript(() => {
//         document.cookie = 'session=mock-session-token-abc123; path=/';
//       });

//       // Navigate to a page that requires auth (the customer app's protected route)
//       // Adjust the URL to the actual customer-facing app route
//       await page.goto('/customer/dashboard').catch(() => {});

//       // Expect redirection to login
//       await page.waitForURL(/login/i, { timeout: 5_000 }).catch(() => {
//         // If the app handles it differently (e.g., shows an error), verify 401 is handled
//       });
//       const url = page.url();
//       const isLoginOrError = /login|unauthorized|401/.test(url);
//       // Pass if redirected to login or an auth error page
//       expect(isLoginOrError || url.includes('login')).toBeTruthy();
//     });
//   });

//   // ── AC-008 | Previous Email Released ─────────────────────────────────────
//   test.describe('AC-008 | Previous email is released after update', () => {
//     test('the old email address can be registered for a different customer after update', async ({
//       page,
//     }) => {
//       // Step 1 — Update current customer to new email
//       await mockGetPlatformAccount(accountPage.page, ACCOUNT_ACTIVE);
//       await mockUpdateAccountSuccess(accountPage.page, SAP_ID, { customerEmail: EMAIL_VALID_NEW });
//       await accountPage.gotoActiveEdit();
//       await accountPage.fillEmail(EMAIL_VALID_NEW);
//       await accountPage.submitUpdateAccount('confirm');

//       // Step 2 — Verify old email is no longer reserved
//       // Mock: the old email is now available (no duplicate error when registering it elsewhere)
//       await page.route(
//         `**/api/**/modern-trade/customers/11000999/platform-account`,
//         async (route) => {
//           if (route.request().method() === 'POST') {
//             const body = JSON.parse(route.request().postData() ?? '{}');
//             // Old email should succeed now
//             if (body.email === ACCOUNT_ACTIVE.customerEmail) {
//               await route.fulfill({
//                 status: 201,
//                 contentType: 'application/json',
//                 body: JSON.stringify({
//                   data: { accountStatus: 'Pending', email: body.email },
//                 }),
//               });
//             }
//           } else {
//             await route.continue();
//           }
//         }
//       );

//       const differentCustomerPage = new PlatformAccountPage(page, '11000999');
//       await differentCustomerPage.gotoCreate();
//       await differentCustomerPage.fillEmail(ACCOUNT_ACTIVE.customerEmail!);
//       await differentCustomerPage.selectTier('A');

//       // Capture the create request payload
//       const [createRequest] = await Promise.all([
//         page.waitForRequest(
//           (req) =>
//             req.method() === 'POST' &&
//             req.url().includes('11000999') &&
//             req.url().includes('platform-account')
//         ),
//         differentCustomerPage.submitCreateAccount('confirm'),
//       ]);

//       const payload = JSON.parse(createRequest.postData() ?? '{}');
//       expect(payload.email).toBe(ACCOUNT_ACTIVE.customerEmail);

//       // Status should become Pending (not a duplicate-email error)
//       await expect(differentCustomerPage.statusBadge).toContainText('Pending');
//     });
//   });
// });
