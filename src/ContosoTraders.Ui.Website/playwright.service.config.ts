/*
 * This file enables Playwright client to connect to remote browsers.
 * It should be placed in the same directory as playwright.config.ts.
 * The file is temporary for private preview.
 */

import { defineConfig } from "@playwright/test";
import config from "./playwright.config";
import dotenv from "dotenv";

dotenv.config({ path: ".env.playwright.local" });

// Name the test run if it's not named yet.
process.env.PLAYWRIGHT_SERVICE_RUN_ID = process.env.PLAYWRIGHT_SERVICE_RUN_ID || new Date().toISOString();

// Can be 'linux' or 'windows'.
const os = process.env.PLAYWRIGHT_SERVICE_OS || 'linux';

export default defineConfig(config, {
  timeout: 60000,
  expect: {
    timeout: 20000,
  },  
  workers: 50,
  // Enable screenshot testing and configure directory with expectations.
  ignoreSnapshots: false,
  snapshotPathTemplate: `{testDir}/{testFilePath}-snapshots/${os}/{arg}{ext}`,  
  use: {
    // Specify the service endpoint.
    connectOptions: {
      wsEndpoint: `${process.env.PLAYWRIGHT_SERVICE_URL}?cap=${JSON.stringify({
        os,
        runId: process.env.PLAYWRIGHT_SERVICE_RUN_ID,
      })}`,
      headers: {
        "x-mpt-access-key": process.env.PLAYWRIGHT_SERVICE_ACCESS_KEY!,
      },
      // Allow service to access the localhost.
      exposeNetwork: "<loopback>",
    },
  },
});
