import { Page } from '@playwright/test';
import {
  CustomerRecord,
  MOCK_CUSTOMERS,
  EMPTY_CUSTOMER_LIST_RESPONSE,
  buildCustomerListResponse,
} from '../fixtures/customer-fixture';

/**
 * Adjust these patterns to match the real API paths.
 * Wildcards (**) match any prefix/scheme/host.
 */
const ROUTES = {
  customerList: '**/api/**/modern-trade/customers**',
  customerDetail: '**/api/**/modern-trade/customers/**',
  sapSync: '**/api/**/sap/sync**',
};

/** Intercept the customer list endpoint with mock data */
export async function mockCustomerListApi(
  page: Page,
  customers: CustomerRecord[] = MOCK_CUSTOMERS
) {
  await page.route(ROUTES.customerList, async (route) => {
    const url = new URL(route.request().url());
    const pageNum = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
    const search = (url.searchParams.get('search') ?? '').toLowerCase();

    const filtered = search
      ? customers.filter(
          (c) =>
            c.sapId.includes(search) ||
            c.customerName.toLowerCase().includes(search) ||
            c.taxId.includes(search)
        )
      : customers;

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildCustomerListResponse(filtered, pageNum, pageSize)),
    });
  });
}

/** Intercept with an empty list (AC-004) */
export async function mockEmptyCustomerListApi(page: Page) {
  await page.route(ROUTES.customerList, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(EMPTY_CUSTOMER_LIST_RESPONSE),
    });
  });
}

/** Intercept the SAP sync endpoint (AC-006 — ensure it is never called) */
export async function mockSapSyncApi(page: Page) {
  await page.route(ROUTES.sapSync, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, syncedAt: '28/02/2026 00:00' }),
    });
  });
}