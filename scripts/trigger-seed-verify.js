const axios = require('axios');

async function triggerSeedAndVerify() {
    try {
        console.log('--- Triggering Seed ---');
        const seedRes = await axios.get('http://localhost:3000/api/seed');
        console.log('Seed Status:', seedRes.status);
        console.log('Seed Result:', JSON.stringify(seedRes.data, null, 2));

        console.log('\n--- Verifying Brands via API ---');
        const brandsRes = await axios.get('http://localhost:3000/api/brands');
        console.log(`Brands Count: ${brandsRes.data.brands.length}`);
        brandsRes.data.brands.forEach(b => {
            console.log(`- ${b.name}: ID=${b._id} (Type: ${typeof b._id})`);
        });

        console.log('\n--- Verifying Categories via API ---');
        const catsRes = await axios.get('http://localhost:3000/api/categories');
        console.log(`Categories Count: ${catsRes.data.categories.length}`);
        catsRes.data.categories.forEach(c => {
            console.log(`- ${c.name}: ID=${c._id} (Type: ${typeof c._id})`);
        });

    } catch (e) {
        console.error('VERIFICATION FAILED:', e.response?.data || e.message);
    }
}

triggerSeedAndVerify();
