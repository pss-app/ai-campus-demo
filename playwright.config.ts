import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser',
  fullyParallel:false,
  workers:1,
  timeout:60000,
  expect:{timeout:10000},
  reporter:'list',
  use:{baseURL:'http://127.0.0.1:3100',channel:'chrome',headless:true,trace:'retain-on-failure',screenshot:'only-on-failure'},
  webServer:{command:'npm run start -- --port 3100',url:'http://127.0.0.1:3100',reuseExistingServer:false,timeout:120000},
});
