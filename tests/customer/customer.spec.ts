import { test, expect } from '@playwright/test';
import { ModernTradeCustomerListPage } from '../../pages/customerlist-page';
import { MOCK_CUSTOMERS } from '../../fixtures/customer-fixture';
import { mockCustomerListApi, mockEmptyCustomerListApi } from '../../fixtures/apimock';
//import { mockCustomerListApi, mockEmptyCustomerListApi } from '../mocks/apiMocks';

test.describe('ModernTrade Customer List — Acceptance Criteria', () => {
  let customerList: ModernTradeCustomerListPage;
 
  test.beforeEach(async ({ page }) => {
    customerList = new ModernTradeCustomerListPage(page);
  });
 
    test.describe('AC-001 | Happy Path', () => {
        test('displays the customer table and 10 rows per page', async ({page}) => {
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

        test('pagination controls are visible when total records exceed 10', async ({page}) => {
          await customerList.navigate('/modern-trade-customers');
          await expect(customerList.prevPageButton).toBeVisible();
          await expect(customerList.nextPageButton).toBeVisible();
          // exceed 10 record --> page 2 appear
          const secondPage = page.locator('a', {hasText: '2'});
          await expect(secondPage).toBeVisible()
        });
    });

    test('AC-002 - Search by code', async()=> {

    })
  });



