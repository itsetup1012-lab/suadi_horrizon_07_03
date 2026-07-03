const axios = require('axios');

async function testApi() {
    try {
        const res = await axios.get('http://localhost:3000/api/products?limit=1000');
        const data = res.data;
        console.log(`Source: ${data._source || 'unknown'}`);
        console.log(`Total items reported: ${data.total}`);
        console.log(`Total items in array: ${data.products.length}`);

        // Check for specific product name
        const searchBySku = 'SHI-HYD-9921';
        const found = data.products.find(p => p.sku === searchBySku);
        if (found) {
            console.log(`Found product: ${JSON.stringify(found, null, 2)}`);
        } else {
            console.log(`Product with SKU ${searchBySku} NOT found in the API response.`);
        }
    } catch (e) {
        console.error('API Test Error:', e.message);
    }
}

testApi();
