const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');

/**
 * @typedef {'NA' | 'JP' | 'KR' | 'TW' | 'CN'} Region * @typedef {{ 
 *   questId: number, 
 *   questName: string, 
 *   questType: string, 
 *   bond: Record<number, number>,
 *   warId: number,
 *   warName: string,
 *   warLongName: string,
 *   spotId: number,
 *   spotName: string,
 *   ap: number,
 *   consumeType: string,
 *   consumeItem: Array<{ item: { id: number, name: string }, amount: number }>,
 *   afterClear: string
 * }} QuestBondData
 */

/**
 * Fetches quest data and maps bond points for a specific FGO region
 * @param {Region} region - The game region to fetch data for
 * @returns {Promise<QuestBondData[]>}
 */
async function getQuestBondMapping(region) {
    try {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        
        // Fetch the nice war data which includes wars, spots, and quests
        const warData = await fetch(`https://api.atlasacademy.io/export/${region}/nice_war.json`).then(r => r.json());
        await delay(1000);
        
        // Just fetch phase data for bond points
        const phaseData = await fetch(
            `https://git.atlasacademy.io/atlasacademy/fgo-game-data/raw/branch/${region}/master/mstQuestPhase.json`
        ).then(r => r.json());
        
        // Create a map for bond points
        const questPhaseMap = new Map();
        for (const phase of phaseData) {
            if (!questPhaseMap.has(phase.questId)) {
                questPhaseMap.set(phase.questId, new Map());
            }
            questPhaseMap.get(phase.questId).set(phase.phase, phase.friendshipExp);
        }        // Process all wars, spots, and quests
        const mappedData = [];
        for (const war of warData) {
            for (const spot of war.spots) {
                for (const quest of (spot.quests || [])) {
                    // Get bond points for each phase of this quest
                    const questPhases = questPhaseMap.get(quest.id) || new Map();
                    const bondMapping = {};
                    questPhases.forEach((bond, phase) => {
                        bondMapping[phase] = bond;
                    });                    mappedData.push({
                        questId: quest.id,
                        questName: quest.name,
                        questType: quest.type,
                        bond: bondMapping,
                        warId: war.id,
                        warName: war.name,
                        warLongName: war.longName,
                        spotId: spot.id,
                        spotName: spot.name,
                        ap: quest.consumeType === 'ap' ? (quest.consume || 0) : 0,
                        consumeType: quest.consumeType || 'none',
                        consumeItem: quest.consumeItem || [],
                        afterClear: quest.afterClear || ""
                    });
                }
            }
        }

        // Save to public/quests.json
        const outputPath = path.join(__dirname, 'public', `quests${region === 'JP' ? '_jp' : ''}.json`);
        await fs.writeFile(outputPath, JSON.stringify(mappedData, null, 2));
        console.log(`Saved quest data to ${outputPath}`);

        return mappedData;
    } catch (error) {
        console.error(`Error fetching data for region ${region}:`, error);
        throw error;
    }
}

module.exports = { getQuestBondMapping };
