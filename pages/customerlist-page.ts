import { Page, Locator, expect } from '@playwright/test';
//import { BasePage } from './BasePage';


export class ModernTradeCustomerListPage { //extends BasePage
  readonly page: Page;
  readonly searchInput: Locator;
  readonly statusFilterDropdown: Locator;
  readonly tierSetupButton: Locator;
  readonly syncSapButton: Locator;
  readonly latestSyncDescription: Locator;
  readonly customerTable: Locator;
  readonly tableRows: Locator;
  readonly colHeaderSapId: Locator;
  readonly colHeaderNameTaxId: Locator;
  readonly colHeaderCityCountry: Locator;
  readonly colHeaderTier: Locator;
  readonly colHeaderPlatformAccount: Locator;
  readonly colHeaderActions: Locator;
  readonly paginationContainer: Locator;
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly activePageButton: Locator;
  readonly emptyStateMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search by Business Partner or Customer Name or Tax ID')
    this.statusFilterDropdown = page.getByRole('button', { name: 'All Status' });
    this.tierSetupButton = page.getByRole('button', {name: 'Tier Setup'});
    this.syncSapButton = page.getByRole('button', {name: 'Sync SAP'})
    this.latestSyncDescription = page.locator('div.p-6.flex.items-center.justify-between p.text-sm.text-gray-50');
    this.customerTable = page.getByRole('table');
    this.tableRows = page.locator('table tbody tr');
    this.colHeaderSapId          = page.getByRole('columnheader', { name: 'SAP ID' });
    this.colHeaderNameTaxId      = page.getByRole('columnheader', { name: 'Name & Tax ID' });
    this.colHeaderCityCountry    = page.getByRole('columnheader', { name: 'City, Country'});
    this.colHeaderTier           = page.getByRole('columnheader', { name: 'Tier' });
    this.colHeaderPlatformAccount = page.getByRole('columnheader', { name: 'Platform Account' });
    this.colHeaderActions         = page.getByRole('columnheader', { name: 'Actions' });

    this.paginationContainer = page
    .getByTestId('pagination-container')
    .or(page.locator('[aria-label="pagination"]'))
    .or(page.locator('nav[role="navigation"]').filter({ hasText: /previous|next/i }));

    this.prevPageButton = this.paginationContainer.locator('a[aria-label="Go to previous page"]');
    this.nextPageButton = this.paginationContainer.locator('a[aria-label="Go to next page"]');
    this.activePageButton = this.paginationContainer.locator('a[aria-current="page"]');
    this.emptyStateMessage = page.getByAltText('No Customer Data — Please Sync Data from SAP');
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  async navigate(path: string) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    await this.page.goto(cleanPath, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('load');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForResponse(
      (resp) => resp.url().includes('customer') && resp.status() === 200,
      { timeout: 4_000 }
    ).catch(() => { /* synchronous filter — ok */ });
    await this.page.waitForTimeout(300);
  }

//   async clearSearch() {
//     await this.searchInput.clear();
//     await this.page.waitForTimeout(300);
//   }

  async getVisibleRowCount(): Promise<number> {
    return this.tableRows.count();
  }

 
//   async getSapIds(): Promise<string[]> {
//     return this.page.locator('table tbody tr td:nth-child(1)').allTextContents();
//   }


//   async getCustomerNames(): Promise<string[]> {
//     // Name sits in a <p>/<span> before the Tax ID line inside column 2
//     const nameElements = this.page.locator('table tbody tr td:nth-child(2) [data-testid="customer-name"]')
//       .or(this.page.locator('table tbody tr td:nth-child(2) p:first-child'))
//       .or(this.page.locator('table tbody tr td:nth-child(2) span:first-child'));
//     return nameElements.allTextContents();
//   }

 
//   async getPlatformAccountStatus(rowIndex: number): Promise<string> {
//     const row = this.tableRows.nth(rowIndex);
//     const badge = row
//       .getByTestId('platform-account-badge')
//       .or(row.locator('td:nth-child(5) [class*="badge"],[class*="chip"],[class*="tag"],[class*="status"]').first());
//     return ((await badge.textContent()) ?? '').trim();
//   }

//   getPlatformAccountBadgeLocator(rowIndex: number): Locator {
//     const row = this.tableRows.nth(rowIndex);
//     return row
//       .getByTestId('platform-account-badge')
//       .or(row.locator('td:nth-child(5) [class*="badge"],[class*="chip"],[class*="tag"],[class*="status"]').first());
//   }

//   async getAllPlatformAccountStatuses(): Promise<string[]> {
//     const count = await this.getVisibleRowCount();
//     const results: string[] = [];
//     for (let i = 0; i < count; i++) {
//       results.push(await this.getPlatformAccountStatus(i));
//     }
//     return results;
//   }

//   async getTierForRow(rowIndex: number): Promise<string> {
//     const row = this.tableRows.nth(rowIndex);
//     const cell = row.locator('td:nth-child(4)')
//       .or(row.getByTestId('tier-value'));
//     return ((await cell.textContent()) ?? '').trim();
//   }

//   async clickEditForRow(rowIndex: number) {
//     const row = this.tableRows.nth(rowIndex);
//     const editBtn = row
//       .getByTestId('action-edit-button')
//       .or(row.getByRole('button', { name: /edit/i }))
//       .or(row.locator('td:last-child button, td:last-child a').first());
//     await editBtn.click();
//   }

//   async goToPage(pageNumber: number) {
//     await this.page
//       .getByRole('button', { name: String(pageNumber), exact: true })
//       .or(this.page.getByTestId(`pagination-page-${pageNumber}`))
//       .click();
//     await this.page.waitForTimeout(300);
//   }

//   async filterByStatus(status: 'All Status' | 'Active' | 'Inactive' | 'Pending' | 'No Account') {
//     await this.statusFilterDropdown.click();
//     await this.page.getByRole('option', { name: status })
//       .or(this.page.getByText(status, { exact: true }))
//       .click();
//     await this.page.waitForTimeout(300);
//   }
}