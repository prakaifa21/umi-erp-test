# Automate Test with Playwright
# UMI-ERP Project

---

## Initialize & Clone
```bash
git init                        # initialize a new repo
git clone <url>                 # clone a remote repo
git clone <url> my-folder       # clone into a specific folder
```

---

## Run Save-Session

### 1. Install dotenv
```bash
npm install dotenv --save-dev
```

### 2. Create `.env` file
```env
BASE_URL="https://your-umi-erp-url.com"
```

### 3. Run session script to login & get token
```bash
node session.js
```
> This will log in and save your auth state to `session.json`

### 4. Config Playwright — add `storageState` to `playwright.config.js`
```js
// playwright.config.js
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,
    storageState: 'session.json',   // reuse saved session
  },
});
```

### 5. Run tests
```bash
npx playwright test                 # run all tests
npx playwright test --headed        # run with browser visible
npx playwright test --ui            # open Playwright UI mode
npx playwright test tests/foo.spec.ts  # run a specific test file
```

---

## Full Workflow (from scratch)
```bash
# 1. Clone the repo
git clone <url>
cd umi-erp-test

# 2. Install dependencies
npm install
npm install dotenv --save-dev

# 3. Set up environment
echo 'BASE_URL="url"' > .env

# 4. Save session (login & store token)
node session.js

# 5. Run Playwright tests
npx playwright test
```

---

## Tips

| Command | Description |
|---|---|
| `npx playwright test --debug` | Step through tests in debug mode |
| `npx playwright codegen <url>` | Auto-generate test code by clicking |
| `npx playwright show-report` | View HTML test report |
| `npx playwright test --workers=4` | Run tests in parallel |

> **Note:** Add `session.json` to `.gitignore` to avoid committing auth tokens.
```bash
echo "session.json" >> .gitignore
echo ".env" >> .gitignore
```
