// import { Page, Locator } from '@playwright/test';
// import { BasePage } from './BasePage';

// /**
//  * Page Object Model – ModernTrade Customer Detail / Platform Account
//  *
//  * URL patterns:
//  *   /modernTrade-customer/detail/:sapId/sap
//  *   /modernTrade-customer/detail/:sapId/platform-account/create
//  *   /modernTrade-customer/detail/:sapId/platform-account/Pending-resend
//  *   /modernTrade-customer/detail/:sapId/platform-account/Pending-Edit
//  *   /modernTrade-customer/detail/:sapId/platform-account/Active-Edit
//  *   /modernTrade-customer/detail/:sapId/platform-account/Inactive-Edit
//  *
//  * RULE: Every locator uses a SINGLE selector string (no .or() chains).
//  * Comma-separated CSS is used for multi-selector fallbacks.
//  */
// export class PlatformAccountPage extends BasePage {
//   readonly baseDetailUrl: string;

//   // ── Page header ──────────────────────────────────────────────────────────
//   readonly pageHeading: Locator;
//   readonly statusBadge: Locator;
//   readonly sapIdLabel: Locator;
//   readonly backButton: Locator;

//   // ── Tabs ─────────────────────────────────────────────────────────────────
//   readonly sapDataTab: Locator;
//   readonly platformAccountTab: Locator;

//   // ── Account Information ───────────────────────────────────────────────────
//   readonly accountInfoSection: Locator;
//   readonly emailDisplayValue: Locator;
//   readonly tierDisplayValue: Locator;

//   // ── Form fields ───────────────────────────────────────────────────────────
//   readonly customerEmailInput: Locator;
//   readonly tierSelect: Locator;

//   // ── Action buttons ────────────────────────────────────────────────────────
//   readonly createAccountButton: Locator;
//   readonly updateAccountButton: Locator;
//   readonly editAccountInfoButton: Locator;
//   readonly resendEmailButton: Locator;
//   readonly activeToggle: Locator;
//   readonly formCancelButton: Locator;

//   // ── Confirmation dialog ───────────────────────────────────────────────────
//   readonly confirmDialog: Locator;
//   readonly confirmDialogTitle: Locator;
//   readonly confirmDialogBody: Locator;
//   readonly confirmDialogCancelButton: Locator;
//   readonly confirmDialogConfirmButton: Locator;

//   // ── Inline errors ─────────────────────────────────────────────────────────
//   readonly emailFieldError: Locator;
//   readonly generalFormError: Locator;

//   constructor(page: Page, sapId: string) {
//     super(page);
//     this.baseDetailUrl = `/modernTrade-customer/detail/${sapId}`;

//     // ── Header ────────────────────────────────────────────────────────────
//     this.pageHeading = page.locator(
//       '[data-testid="customer-detail-heading"], h1'
//     );
//     this.statusBadge = page.locator('[data-testid="customer-status-badge"]');
//     this.sapIdLabel  = page.locator('[data-testid="customer-sap-id"]');
//     this.backButton  = page.locator('[data-testid="back-button"], a:has-text("Back")');

//     // ── Tabs ──────────────────────────────────────────────────────────────
//     // getByRole with a single pattern — no chaining
//     this.sapDataTab         = page.getByRole('tab', { name: 'SAP Data' });
//     this.platformAccountTab = page.getByRole('tab', { name: 'Platform Account' });

//     // ── Account Information ────────────────────────────────────────────────
//     this.accountInfoSection = page.locator('[data-testid="account-info-section"]');
//     this.emailDisplayValue  = page.locator('[data-testid="email-display-value"]');
//     this.tierDisplayValue   = page.locator('[data-testid="tier-display-value"]');

//     // ── Form fields ───────────────────────────────────────────────────────
//     this.customerEmailInput = page.locator(
//       '[data-testid="customer-email-input"], input[name*="email"]'
//     );
//     this.tierSelect = page.locator(
//       '[data-testid="tier-select"], select[name*="tier"]'
//     );

//     // ── Action buttons ────────────────────────────────────────────────────
//     this.createAccountButton  = page.locator('[data-testid="create-account-button"]');
//     this.updateAccountButton  = page.locator('[data-testid="update-account-button"]');
//     this.editAccountInfoButton = page.locator('[data-testid="edit-account-info-button"]');
//     this.resendEmailButton    = page.locator('[data-testid="resend-email-button"]');
//     this.formCancelButton     = page.locator('[data-testid="form-cancel-button"]');

//     // Toggle — single locator, no chaining
//     this.activeToggle = page.locator(
//       '[data-testid="active-toggle"], input[type="checkbox"][name*="active"]'
//     );

//     // ── Confirmation dialog ───────────────────────────────────────────────
//     // Scope everything inside [role="dialog"] to avoid false positives
//     this.confirmDialog              = page.locator('[data-testid="confirm-dialog"], [role="dialog"]');
//     this.confirmDialogTitle         = page.locator('[data-testid="confirm-dialog-title"]');
//     this.confirmDialogBody          = page.locator('[data-testid="confirm-dialog-body"]');
//     this.confirmDialogCancelButton  = page.locator('[data-testid="confirm-dialog-cancel"]');
//     this.confirmDialogConfirmButton = page.locator('[data-testid="confirm-dialog-confirm"]');

//     // ── Inline errors ─────────────────────────────────────────────────────
//     this.emailFieldError  = page.locator('[data-testid="email-field-error"]');
//     this.generalFormError = page.locator('[data-testid="form-general-error"], [role="alert"]');
//   }

//   // ── Navigation ────────────────────────────────────────────────────────────

//   async gotoCreate() {
//     await this.navigate(`${this.baseDetailUrl}/platform-account/create`);
//   }

//   async gotoPendingResend() {
//     await this.navigate(`${this.baseDetailUrl}/platform-account/Pending-resend`);
//   }

//   async gotoPendingEdit() {
//     await this.navigate(`${this.baseDetailUrl}/platform-account/Pending-Edit`);
//   }

//   async gotoActiveEdit() {
//     await this.navigate(`${this.baseDetailUrl}/platform-account/Active-Edit`);
//   }

//   async gotoInactiveEdit() {
//     await this.navigate(`${this.baseDetailUrl}/platform-account/Inactive-Edit`);
//   }

//   async gotoSapData() {
//     await this.navigate(`${this.baseDetailUrl}/sap`);
//   }

//   // ── Actions ───────────────────────────────────────────────────────────────

//   async fillEmail(email: string) {
//     await this.customerEmailInput.clear();
//     await this.customerEmailInput.fill(email);
//   }

//   async selectTier(tier: string) {
//     // Try native <select> first; fall back to custom dropdown click
//     const tagName = await this.tierSelect.evaluate((el) =>
//       el.tagName.toLowerCase()
//     );
//     if (tagName === 'select') {
//       await this.tierSelect.selectOption(tier);
//     } else {
//       await this.tierSelect.click();
//       await this.page.locator(`[role="option"]:has-text("${tier}")`).click();
//     }
//   }

//   async submitCreateAccount(confirmOrCancel: 'confirm' | 'cancel' = 'confirm') {
//     await this.createAccountButton.click();
//     await this.confirmDialog.waitFor({ state: 'visible' });
//     if (confirmOrCancel === 'confirm') {
//       await this.confirmDialogConfirmButton.click();
//     } else {
//       await this.confirmDialogCancelButton.click();
//     }
//   }

//   async submitUpdateAccount(confirmOrCancel: 'confirm' | 'cancel' = 'confirm') {
//     await this.updateAccountButton.click();
//     await this.confirmDialog.waitFor({ state: 'visible' });
//     if (confirmOrCancel === 'confirm') {
//       await this.confirmDialogConfirmButton.click();
//     } else {
//       await this.confirmDialogCancelButton.click();
//     }
//   }

//   async getStatusBadgeText(): Promise<string> {
//     return ((await this.statusBadge.textContent()) ?? '').trim();
//   }

//   async getDisplayedEmail(): Promise<string> {
//     return ((await this.emailDisplayValue.textContent()) ?? '').trim();
//   }

//   async getDisplayedTier(): Promise<string> {
//     return ((await this.tierDisplayValue.textContent()) ?? '').trim();
//   }

//   async isActiveToggleOn(): Promise<boolean> {
//     const tagName = await this.activeToggle.evaluate((el) =>
//       el.tagName.toLowerCase()
//     );
//     if (tagName === 'input') {
//       return this.activeToggle.isChecked();
//     }
//     const ariaChecked = await this.activeToggle.getAttribute('aria-checked');
//     return ariaChecked === 'true';
//   }
// }
