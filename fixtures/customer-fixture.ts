/**
 * Typed mock data matching the real ModernTrade Customer UI.
 *
 * Column mapping from screenshot:
 *   SAP ID | Name & Tax ID | City, Country | Tier | Platform Account | Actions
 *
 * Platform Account status values visible in design:
 *   'Active' | 'Inactive' | 'Pending' | 'No Account'
 */

export type PlatformAccountStatus = 'Active' | 'Inactive' | 'Pending' | 'No Account';
export type TierValue = 'AAA' | 'AA' | 'A' | 'B' | 'C' | '';

export interface CustomerRecord {
  sapId: string;
  customerName: string;       // Thai or English name
  taxId: string;              // e.g. "0105555021215"
  city: string;               // e.g. "จ.พระนครศรีอยุธยา"
  country: string;            // e.g. "TH"
  tier: TierValue;
  platformAccountStatus: PlatformAccountStatus;
}

// ── 15 mock records (> 10 to exercise pagination) ─────────────────────────
export const MOCK_CUSTOMERS: CustomerRecord[] = [
  // Row 1 — Active, Tier AAA  (matches screenshot row 1)
  {
    sapId: '11000231',
    customerName: 'บริษัท ซีอาร์ซี ไทวัสดุ จำกัด (สาขาพระราม 2)',
    taxId: '0105555021215',
    city: 'จ.พระนครศรีอยุธยา',
    country: 'TH',
    tier: 'AAA',
    platformAccountStatus: 'Active',
  },
  // Row 2 — Inactive, Tier A  (matches screenshot row 2)
  {
    sapId: '11000150',
    customerName: 'บริษัท โฮมโปรดักส์ เซ็นเตอร์ จำกัด (มหาชน) สาขากาญจนบุรี',
    taxId: '0107544000043',
    city: 'จ.กาญจนบุรี',
    country: 'TH',
    tier: 'A',
    platformAccountStatus: 'Inactive',
  },
  // Row 3 — Pending, Tier AA
  {
    sapId: '11000231',
    customerName: 'บริษัท ซีอาร์ซี ไทวัสดุ จำกัด (สาขาพระราม 2)',
    taxId: '0105555021215',
    city: 'จ.พระนครศรีอยุธยา',
    country: 'TH',
    tier: 'AA',
    platformAccountStatus: 'Pending',
  },
  // Row 4 — No Account, Tier A
  {
    sapId: '11000231',
    customerName: 'บริษัท ซีอาร์ซี ไทวัสดุ จำกัด (สาขาพระราม 2)',
    taxId: '0105555021215',
    city: 'จ.พระนครศรีอยุธยา',
    country: 'TH',
    tier: 'A',
    platformAccountStatus: 'No Account',
  },
  // Rows 5–9 — No Account (padding)
  ...Array.from({ length: 5 }, (_, i) => ({
    sapId: '11000231',
    customerName: 'บริษัท ซีอาร์ซี ไทวัสดุ จำกัด (สาขาพระราม 2)',
    taxId: '0105555021215',
    city: 'จ.พระนครศรีอยุธยา',
    country: 'TH',
    tier: 'A' as TierValue,
    platformAccountStatus: 'No Account' as PlatformAccountStatus,
  })),
  // Row 10 — Active, Tier AAA
  {
    sapId: '11000231',
    customerName: 'บริษัท ซีอาร์ซี ไทวัสดุ จำกัด (สาขาพระราม 2)',
    taxId: '0105555021215',
    city: 'จ.พระนครศรีอยุธยา',
    country: 'TH',
    tier: 'AAA',
    platformAccountStatus: 'Active',
  },
  // Rows 11–15 — page 2 records (Inactive)
  ...Array.from({ length: 5 }, (_, i) => ({
    sapId: '11000150',
    customerName: `บริษัท โฮมโปรดักส์ เซ็นเตอร์ จำกัด (มหาชน) สาขาที่ ${i + 1}`,
    taxId: '0107544000043',
    city: 'จ.กาญจนบุรี',
    country: 'TH',
    tier: 'A' as TierValue,
    platformAccountStatus: 'Inactive' as PlatformAccountStatus,
  })),
];

// ── API response envelope builders ────────────────────────────────────────

export interface CustomerListResponse {
  data: CustomerRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export function buildCustomerListResponse(
  customers: CustomerRecord[],
  page = 1,
  pageSize = 10
): CustomerListResponse {
  const start = (page - 1) * pageSize;
  return {
    data: customers.slice(start, start + pageSize),
    total: customers.length,
    page,
    pageSize,
  };
}

export const EMPTY_CUSTOMER_LIST_RESPONSE: CustomerListResponse = {
  data: [],
  total: 0,
  page: 1,
  pageSize: 10,
};