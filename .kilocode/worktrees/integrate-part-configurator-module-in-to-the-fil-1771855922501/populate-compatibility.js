/**
 * Script to populate compatibility arrays in products.json
 * Adds realistic equipment compatibility IDs based on product categories
 */

const fs = require('fs');
const path = require('path');

// Load the products
const productsPath = path.join(__dirname, 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

// Equipment compatibility IDs from equipment-database.json
const equipmentIds = {
    excavators: ['cat-320d', 'cat-325d', 'cat-330d', 'kom-pc200', 'kom-pc300'],
    loaders: ['cat-950', 'cat-966', 'jcb-456'],
    dozers: ['cat-d6', 'cat-d8', 'kom-d65'],
    backhoes: ['jcb-3cx', 'jcb-4cx', 'cat-420'],
    graders: ['cat-120', 'cat-140']
};

//Combined IDs for universal parts
const caterpillarIds = ['cat-320d', 'cat-325d', 'cat-330d', 'cat-950', 'cat-966', 'cat-d6', 'cat-d8', 'cat-420', 'cat-120', 'cat-140'];
const komatsuIds = ['kom-pc200', 'kom-pc300', 'kom-d65'];
const jcbIds = ['jcb-456', 'jcb-3cx', 'jcb-4cx'];
const allEquipment = [...caterpillarIds, ...komatsuIds, ...jcbIds];
const excavatorDozerIds = [...equipmentIds.excavators, ...equipmentIds.dozers];
const loaderBackhoeIds = [...equipmentIds.loaders, ...equipmentIds.backhoes];

// Helper to get random subset
function getRandomSubset(array, min, max) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Helper to get compatibility based on part type and brand
function getCompatibility(product) {
    const name = product.name.toLowerCase();
    const category = product.category.toLowerCase();
    const brand = product.brand.toLowerCase();

    // Universal parts - compatible with most equipment
    if (
        name.includes('oil filter') ||
        name.includes('air filter') ||
        name.includes('fuel filter') ||
        name.includes('hydraulic filter')
    ) {
        return getRandomSubset(allEquipment, 8, 12);
    }

    // Brand-specific parts
    if (name.includes('caterpillar') || name.includes('cat ') || brand === 'caterpillar') {
        return getRandomSubset(caterpillarIds, 3, 6);
    }

    if (name.includes('komatsu') || name.includes('kom') || brand === 'komatsu') {
        return getRandomSubset(komatsuIds, 2, 3);
    }

    if (name.includes('jcb') || brand === 'jcb') {
        return getRandomSubset(jcbIds, 2, 3);
    }

    // Engine parts - compatible with excavators and dozers (have bigger engines)
    if (
        category.includes('engine') ||
        name.includes('engine') ||
        name.includes('piston') ||
        name.includes('cylinder') ||
        name.includes('gasket')
    ) {
        return getRandomSubset(excavatorDozerIds, 3, 6);
    }

    // Hydraulic parts - compatible with most
    if (
        category.includes('hydraulic') ||
        name.includes('hydraulic') ||
        name.includes('pump') ||
        name.includes('cylinder') ||
        name.includes('seal')
    ) {
        return getRandomSubset(allEquipment, 4, 8);
    }

    // Transmission parts - compatible with loaders and backhoes
    if (
        category.includes('transmission') ||
        name.includes('transmission') ||
        name.includes('gear') ||
        name.includes('torque')
    ) {
        return getRandomSubset(loaderBackhoeIds, 3, 5);
    }

    // Cooling system parts - universal
    if (
        category.includes('cooling') ||
        name.includes('radiator') ||
        name.includes('fan') ||
        name.includes('hose')
    ) {
        return getRandomSubset(allEquipment, 5, 9);
    }

    // Electrical parts - universal
    if (
        category.includes('electrical') ||
        name.includes('alternator') ||
        name.includes('starter') ||
        name.includes('battery')
    ) {
        return getRandomSubset(allEquipment, 4, 8);
    }

    // Default: random subset of all equipment
    return getRandomSubset(allEquipment, 2, 5);
}

// Process all products
let updatedCount = 0;
products.forEach(product => {
    if (product.compatibility && product.compatibility.length === 0) {
        product.compatibility = getCompatibility(product);
        updatedCount++;
    }
});

// Save the updated products
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');

console.log(`✅ Updated ${updatedCount} products with compatibility data`);
console.log(`📊 Total products: ${products.length}`);
console.log('');
console.log('Sample products with compatibility:');
products.slice(0, 5).forEach(p => {
    console.log(`  - ${p.name}: ${p.compatibility.length} compatible equipment`);
    console.log(`    ${p.compatibility.join(', ')}`);
});
