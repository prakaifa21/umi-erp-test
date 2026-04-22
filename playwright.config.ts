import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

const sessionFile = path.resolve(__dirname, 'session.json');
const sessionExists = fs.existsSync(sessionFile);

if (!sessionExists) {
  console.warn('\n⚠️  session.json not found. Run:  node save-session.js\n');
}

// Strip trailing slash from BASE_URL so paths like /modern-trade-customers work correctly
const rawBase = process.env.BASE_URL ?? 'https://umi-erp-dev.konsys.co';
const baseURL = rawBase.replace(/\/$/, '');

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',

  use: {
    baseURL,
    ...(sessionExists ? { storageState: sessionFile } : {}),
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});