// save-session.js — run once: node save-session.js
const { chromium } = require('@playwright/test');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

// ── Read .env manually ───────────────────────────────────────────────────────
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) return;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
    if (key) process.env[key] = val;
  });
}

// ── Hardcode fallback so it never becomes "undefined" ───────────────────────
const BASE_URL = (process.env.BASE_URL || 'https://umi-erp-dev.konsys.co').replace(/\/$/, '');

console.log('BASE_URL:', BASE_URL); // confirm it printed correctly

async function saveSession() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('\n──────────────────────────────────────────────');
  console.log('  1. Log in with Microsoft SSO + MFA');
  console.log('  2. Wait until you see the app dashboard');
  console.log('  3. Press ENTER here to save the session');
  console.log('──────────────────────────────────────────────\n');

  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await waitForEnter();

  const currentUrl = page.url();
  if (currentUrl.includes('microsoftonline') || currentUrl.includes('/login')) {
    console.error('❌  Still on login page. Please finish login first.');
    await browser.close();
    process.exit(1);
  }

  const sessionPath = path.join(__dirname, 'session.json');
  await context.storageState({ path: sessionPath });

  console.log(`\n✅  Saved to ${sessionPath}`);
  console.log('    Now run:  npx playwright test\n');
  await browser.close();
}

function waitForEnter() {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin });
    console.log('👉  Press ENTER after you are fully logged in...');
    rl.once('line', () => { rl.close(); resolve(); });
  });
}

saveSession().catch(e => { console.error(e.message); process.exit(1); });