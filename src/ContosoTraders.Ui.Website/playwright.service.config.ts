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

export default defineConfig(config, {
  workers: 40,
  use: {
    // Specify the service endpoint.
    connectOptions: {
      wsEndpoint: `${process.env.PLAYWRIGHT_SERVICE_URL}?cap=${JSON.stringify({
        // Can be 'linux' or 'windows'.
        os: process.env.PLAYWRIGHT_SERVICE_OS || "linux",
        runId: process.env.PLAYWRIGHT_SERVICE_RUN_ID,
      })}`,
      timeout: 30000,
      headers: {
        "x-mpt-access-key": process.env.PLAYWRIGHT_SERVICE_ACCESS_KEY!,
      },
      // Allow service to access the localhost.
      exposeNetwork: "<loopback>",
    },
  },
});
