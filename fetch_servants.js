// fetch_servants.js
// Run this script to fetch the latest FGO servant data and save it locally for your React app

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_URL = 'https://api.atlasacademy.io/export/NA/nice_servant.json';
const OUTPUT_PATH = path.join(__dirname, 'public', 'servants.json');

async function fetchAndSaveServants() {
  try {
    const response = await axios.get(API_URL);
    const filtered = response.data.filter(
      (servant) =>
        servant.bondGrowth &&
        servant.className &&
        !servant.collectionNo.toString().startsWith('9') &&
        !servant.id.toString().startsWith('99') &&
        !(servant.name.toLowerCase().includes('solomon') && servant.className.toLowerCase().includes('caster')) &&
        (servant.cost > 0 || servant.className.toLowerCase() === 'shielder')
    );
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
    console.log(`Servant data saved to ${OUTPUT_PATH} (${filtered.length} servants)`);
  } catch (err) {
    console.error('Failed to fetch or save servant data:', err);
    process.exit(1);
  }
}

fetchAndSaveServants();
