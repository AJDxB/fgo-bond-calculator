const fs = require('fs').promises;
const path = require('path');

/**
 * @typedef {'NA' | 'JP' | 'KR' | 'TW' | 'CN'} Region
 * @typedef {{ questId: number, questName: string, questType: string, bond: Record<number, number> }} QuestBondData
 */

/**
 * Fetches quest data and maps bond points for a specific FGO region
 * @param {Region} region - The game region to fetch data for
 * @returns {Promise<QuestBondData[]>}
 */
async function getQuestBondMapping(region) {
    const baseUrl = `https://git.atlasacademy.io/atlasacademy/fgo-game-data/raw/branch/${region}/master`;
    
    try {
        // Fetch all required data in parallel
        const [questData, phaseData, enums] = await Promise.all([
            fetch(`${baseUrl}/mstQuest.json`).then(r => r.json()),
            fetch(`${baseUrl}/mstQuestPhase.json`).then(r => r.json()),
            fetch(`https://api.atlasacademy.io/export/${region}/nice_enums.json`).then(r => r.json())
        ]);

        // Create a map of questId to phases
        const reversePhaseMapping = new Map();
        for (const phase of phaseData) {
            if (!reversePhaseMapping.has(phase.questId)) {
                reversePhaseMapping.set(phase.questId, []);
            }
            reversePhaseMapping.get(phase.questId).push(phase);
        }

        // Map quest data
        const mappedData = questData.map(quest => {
            const phases = (reversePhaseMapping.get(quest.id) || [])
                .sort((a, b) => a.phase - b.phase);

            const bondMapping = {};
            for (const phase of phases) {
                bondMapping[phase.phase] = phase.friendshipExp;
            }

            return {
                questId: quest.id,
                questName: quest.name,
                questType: enums.NiceQuestType?.[quest.type] ?? String(quest.type),
                bond: bondMapping
            };
        });

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
