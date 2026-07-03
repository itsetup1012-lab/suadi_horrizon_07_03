const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: false, slowMo: 200 });
    const context = await browser.newContext();
    const page = await context.newPage();

    const errors = [];
    const networkLog = [];

    page.on('console', msg => {
        const text = msg.text();
        console.log(`[BROWSER ${msg.type().toUpperCase()}] ${text}`);
        if (msg.type() === 'error') errors.push(text);
    });

    page.on('response', async response => {
        const url = response.url();
        if (url.includes('localhost:3000/api/')) {
            const status = response.status();
            let body = '';
            try { body = await response.text(); } catch (e) { }
            const entry = `[${status}] ${response.request().method()} ${url.replace('http://localhost:3000', '')} => ${body.slice(0, 400)}`;
            console.log('[NETWORK]', entry);
            networkLog.push(entry);
        }
    });

    console.log('>> Navigating to admin products...');
    await page.goto('http://localhost:3000/admin/products', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Find search box - try multiple selectors
    console.log('>> Finding search input...');
    const searchSelector = 'input[type="text"]';
    await page.waitForSelector(searchSelector, { timeout: 10000 });
    const inputs = await page.locator(searchSelector).all();
    console.log(`>> Found ${inputs.length} text inputs`);

    // Use the first visible input that looks like a search bar
    const searchInput = page.locator(searchSelector).first();
    await searchInput.click({ clickCount: 3 });
    await searchInput.fill('458/20040');
    await page.waitForTimeout(1500);

    // Find a row
    console.log('>> Looking for product row...');
    const rows = await page.locator('tbody tr').all();
    console.log(`>> Found ${rows.length} rows`);

    if (rows.length === 0) {
        console.log('>> No rows found - clearing and retrying');
        await searchInput.fill('KNUCKLE');
        await page.waitForTimeout(1500);
        const rows2 = await page.locator('tbody tr').all();
        console.log(`>> Found ${rows2.length} rows after KNUCKLE search`);
    }

    // Hover and click edit
    const allRows = await page.locator('tbody tr').all();
    if (allRows.length > 0) {
        await allRows[0].hover();
        await page.waitForTimeout(600);

        // Find edit button (gold/pencil icon button in last column)
        const rowBtns = await allRows[0].locator('button').all();
        console.log(`>> Found ${rowBtns.length} buttons in row`);

        // Click second to last (edit, not delete)
        if (rowBtns.length >= 2) {
            await rowBtns[rowBtns.length - 2].click();
        } else if (rowBtns.length === 1) {
            await rowBtns[0].click();
        }
        await page.waitForTimeout(1500);
    }

    // Check if modal opened
    const modalOpen = await page.locator('text=Edit Product').isVisible().catch(() => false);
    console.log(`>> Modal open: ${modalOpen}`);

    if (modalOpen) {
        // Upload image
        const imagePath = 'C:\\Users\\vv\\Desktop\\saudi_horizon_fresh\\public\\product_upload_temp.jpg';
        console.log(`>> Image exists: ${fs.existsSync(imagePath)}`);

        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(imagePath);
        console.log('>> File set, waiting 4s for Cloudinary upload...');
        await page.waitForTimeout(4000);

        // Check image preview
        const imgPreview = await page.locator('form img').first().isVisible().catch(() => false);
        console.log(`>> Image preview visible: ${imgPreview}`);

        // Click save
        console.log('>> Clicking SAVE PRODUCT...');
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(4000);

        // Check for toast
        const successToast = await page.locator('text=updated successfully').isVisible().catch(() => false);
        const errorToast = await page.locator('[class*="toast"][class*="error"], [data-type="error"]').first().textContent().catch(() => null);
        console.log(`>> Success toast: ${successToast}`);
        console.log(`>> Error toast text: ${errorToast}`);
    }

    console.log('\n===== FINAL NETWORK LOG =====');
    networkLog.slice(-10).forEach(l => console.log(l));
    console.log('\n===== CONSOLE ERRORS =====');
    errors.forEach(e => console.log(e));

    await page.screenshot({ path: 'C:\\Users\\vv\\Desktop\\saudi_horizon_fresh\\public\\debug_result.png', fullPage: false });
    console.log('>> Screenshot: public/debug_result.png');

    await browser.close();
    console.log('>> Done.');
})();
