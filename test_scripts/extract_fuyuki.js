const fs = require('fs').promises;
const path = require('path');

async function extractFuyukiQuests() {
    try {
        // Read quests.json
        const questsPath = path.join(__dirname, 'public', 'quests.json');
        const quests = JSON.parse(await fs.readFile(questsPath, 'utf8'));
        
        // Filter quests for Fuyuki Singularity
        const fuyukiQuests = quests.filter(q => 
            q.warLongName === "Singularity F\nFlame Contaminated City: Fuyuki "
        );
        
        if (fuyukiQuests.length === 0) {
            throw new Error('No Fuyuki quests found');
        }
        
        // Sort by questId for consistency
        fuyukiQuests.sort((a, b) => a.questId - b.questId);

        // Create output with metadata and quest stats
        const output = {
            warId: fuyukiQuests[0].warId,
            warName: fuyukiQuests[0].warName,
            warLongName: fuyukiQuests[0].warLongName,
            questCount: fuyukiQuests.length,
            consumeTypeStats: countUniqueValues(fuyukiQuests, 'consumeType'),
            afterClearStats: countUniqueValues(fuyukiQuests, 'afterClear'),
            quests: fuyukiQuests.map(quest => ({
                questId: quest.questId,
                questName: quest.questName,
                questType: quest.questType,
                bond: quest.bond || {},
                spotId: quest.spotId,
                spotName: quest.spotName,
                ap: quest.ap || 0,
                consumeType: quest.consumeType || 'none',
                consumeItem: quest.consumeItem || [],
                afterClear: quest.afterClear || ""
            }))
        };
        
        // Save to fuyuki_quests.json
        const outputPath = path.join(__dirname, 'public', 'fuyuki_quests.json');
        await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
        
        // Print summary
        console.log(`Saved ${fuyukiQuests.length} Fuyuki quests to ${outputPath}`);
        console.log('\nConsume Type Distribution:');
        console.log(output.consumeTypeStats);
        console.log('\nAfterClear Type Distribution:');
        console.log(output.afterClearStats);
        console.log('\nFirst quest sample:');
        console.log(JSON.stringify(output.quests[0], null, 2));
        
    } catch (error) {
        console.error('Error:', error);
        if (error.code === 'ENOENT') {
            console.error('File not found:', error.path);
        }
        process.exit(1);
    }
}

// Helper function to count unique values in an array
function countUniqueValues(array, property) {
    return array.reduce((acc, item) => {
        const value = item[property] || 'none';
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});
}

extractFuyukiQuests();
