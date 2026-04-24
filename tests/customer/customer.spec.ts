import { test, expect } from '@playwright/test';
import { ModernTradeCustomerListPage } from '../../pages/customerlist-page';
import customerData from '../../data/customer-data.json';
import { MOCK_CUSTOMERS } from '../../fixtures/customer-fixture';
import { mockCustomerListApi, mockEmptyCustomerListApi } from '../../fixtures/apimock';
//import { mockCustomerListApi, mockEmptyCustomerListApi } from '../mocks/apiMocks';

test.describe('ModernTrade Customer List — Acceptance Criteria', () => {
  let customerList: ModernTradeCustomerListPage;

  test.beforeEach(async ({ page }) => {
    customerList = new ModernTradeCustomerListPage(page);
  });

  test.describe('AC-001 | Happy Path', () => {
    test('displays the customer table and 10 rows per page', async ({ page }) => {
      //await mockCustomerListApi(customerList.page, MOCK_CUSTOMERS);
      await customerList.navigate('/modern-trade-customers');
      await expect(page.getByRole('heading', { name: 'ModernTrade Customers' })).toBeVisible();
      await expect(customerList.customerTable).toBeVisible();
      const rowCount = await customerList.getVisibleRowCount();
      console.log('num of row', rowCount)
      expect(rowCount).toBeGreaterThan(0); // check ว่ามี column 
      expect(rowCount).toBeLessThanOrEqual(10); // มีไม่เกิน 10 
    });

    test('shows all required columns', async () => {
      await customerList.navigate('/modern-trade-customers');
      await expect(customerList.colHeaderSapId).toBeVisible();
      await expect(customerList.colHeaderNameTaxId).toBeVisible();
      await expect(customerList.colHeaderCityCountry).toBeVisible();
      await expect(customerList.colHeaderTier).toBeVisible();
      await expect(customerList.colHeaderPlatformAccount).toBeVisible();
      await expect(customerList.colHeaderActions).toBeVisible();
    });

    test('pagination controls are visible when total records exceed 10', async ({ page }) => {
      await customerList.navigate('/modern-trade-customers');
      await expect(customerList.prevPageButton).toBeVisible();
      await expect(customerList.nextPageButton).toBeVisible();
      // exceed 10 record --> page 2 appear
      const secondPage = page.locator('a', { hasText: '2' });
      await expect(secondPage).toBeVisible()
    });
  });

  test.describe('AC-002 - AC- 004 - Search', async () => {
    test('AC-002.1 - search by sap id', async () => {
      await customerList.navigate('/modern-trade-customers');
      await customerList.search(customerData.sapSearch);
      await expect(customerList.colHeaderSapId).toBeVisible();
      await expect(customerList.tableRows.first().locator('td').nth(0)).toContainText(customerData.sapSearch);
    });
    test('AC-003.1 - search by customer name', async () => {
      await customerList.navigate('/modern-trade-customers');
      await customerList.search(customerData.customerNameSearch);
      await expect(customerList.colHeaderNameTaxId).toBeVisible();
      await expect(customerList.tableRows.first().locator('td').nth(1)).toContainText(customerData.customerNameSearch);
    });
    test('AC-003.2 search by tax id', async () => {
      await customerList.navigate('/modern-trade-customers');
      await customerList.search(customerData.taxIdSearch);
      await expect(customerList.tableRows.first().locator('td').nth(1)).toContainText(customerData.taxIdSearch);
    });
    test('AC-004 - search by empty(empty stage) and clear search', async () => {
      await customerList.navigate('/modern-trade-customers');
      await customerList.search(customerData.emptySearch);
      await expect(customerList.emptyStateMessage).toBeVisible();
      await customerList.clearSearch();
      await expect(customerList.tableRows).toHaveCount(10);
    });

  test.describe('AC-005 - Account status indicator', async () => {
    test('AC-005.1 - filter Active', async () => {
      await customerList.navigate('/modern-trade-customers');
      await customerList.filterByStatus('Active');
      await expect(customerList.tableRows.first().locator('td').nth(4)).toContainText('Active');
    });
    test('AC-005.2 - Inactive', async () => {
      await customerList.navigate('/modern-trade-customers');
      await customerList.filterByStatus('Inactive');
      await expect(customerList.tableRows.first().locator('td').nth(4)).toContainText('Inactive');
    });
    test('AC-005.3 - Pending', async () => {
      await customerList.navigate('/modern-trade-customers');
      await customerList.filterByStatus('Inactive');
      await expect(customerList.tableRows.first().locator('td').nth(4)).toContainText('Pending')
    });
    test('AC-005.4 - No Account', async () => {
      await customerList.navigate('/modern-trade-customers');
      await customerList.filterByStatus('No Account');
      await expect(customerList.tableRows.first().locator('td').nth(4)).toContainText('No Account');
    });

    test('AC-006 - Last sync SAP', async () => {
      await customerList.navigate('/modern-trade-customers');
      await expect(customerList.latestSyncDescription).toContainText('Latest synced SAP at');
    });

    })
  })
});



