import { test, expect } from '@playwright/test';

const path = ['', 'list/all-products', 'list/laptops', 'list/controllers', 'list/desktops', 'list/mobiles', 'list/monitors'];

// loop through all paths, navigate to the site to get all links, then check that each link is valid
for (const p of path) {
    test(`should have valid links on ${p}`, async ({ page }) => {
        await page.goto(p);
        const links = await page.$$eval('a', (links) => links.map((link) => link.href));
        for (const link of links) {
            await page.goto(link);
            await expect(page).toHaveURL(link);
        }
    });
}