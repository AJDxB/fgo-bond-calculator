// fetch_quests.js
// Run this script to fetch the latest FGO quest data from Atlas Academy API

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_URL = 'https://api.atlasacademy.io/export/NA/nice_quest.json';

// We'll fetch these primary story chapters and daily quests
const WAR_IDS = [
  1001, // Daily Quests
  301,  // Orleans
  302,  // Septem
  303,  // Okeanos
  304   // London
];

const OUTPUT_PATH = path.join(__dirname, 'public', 'quests.json');

async function fetchAndSaveQuests() {
  try {
    console.log('Fetching quest data from Atlas Academy API...');
    const response = await axios.get(API_URL, { timeout: 20000 });
    const questsRaw = response.data;
    const quests = [];

    if (!Array.isArray(questsRaw)) {
      throw new Error('API response is not an array');
    }

    questsRaw.forEach(quest => {
      if (
        quest &&
        quest.consume > 0 &&
        quest.bond > 0 &&
        quest.name &&
        quest.type &&
        !quest.name.toLowerCase().includes('test')
      ) {
        quests.push({
          id: quest.id,
          name: quest.name,
          ap: quest.consume,
          baseBond: quest.bond,
          type: quest.type,
          warId: quest.warId,
          spotId: quest.spotId,
          warName: quest.warLongName || '',
          spotName: quest.spotName || ''
        });
      }
    });

    console.log(`Found ${quests.length} valid quests`);
    quests.sort((a, b) => a.ap - b.ap || a.name.localeCompare(b.name));
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(quests, null, 2), 'utf-8');
    console.log(`Quest data saved to ${OUTPUT_PATH} (${quests.length} quests)`);
  } catch (err) {
    if (err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED') {
      console.error('Request timed out while fetching quest data. The API might be temporarily unavailable.');
    } else if (err.response) {
      console.error('API error:', err.response.status, err.response.statusText);
      console.error('Error details:', err.response.data);
    } else if (err.request) {
      console.error('No response received from API. Network error or API might be down.');
    } else {
      console.error('Error:', err.message);
    }
    process.exit(1);
  }
}

// Run the script
fetchAndSaveQuests();
