const fs = require('fs').promises;
const path = require('path');

async function analyzeQuestAttributes() {
    try {
        // Read quests.json
        const questsPath = path.join(__dirname, 'public', 'quests.json');
        const quests = JSON.parse(await fs.readFile(questsPath, 'utf8'));
        
        // Track unique values
        const uniqueAfterClear = new Set();
        const uniqueConsumeTypes = new Set();
        const uniqueConsumeItems = new Set();
        
        // Process each quest
        quests.forEach(quest => {
            // Track afterClear values
            if (quest.afterClear) {
                uniqueAfterClear.add(quest.afterClear);
            }
            
            // Track consumeType values
            if (quest.consumeType) {
                uniqueConsumeTypes.add(quest.consumeType);
            }
            
            // Track consumeItem values
            if (quest.consumeItem && quest.consumeItem.length > 0) {
                quest.consumeItem.forEach(consume => {
                    if (consume.item) {
                        uniqueConsumeItems.add(consume.item.name);
                    }
                });
            }
        });
        
        // Format output
        const result = {
            afterClearTypes: Array.from(uniqueAfterClear).sort(),
            consumeTypes: Array.from(uniqueConsumeTypes).sort(),
            consumeItems: Array.from(uniqueConsumeItems).sort()
        };
        
        // Save to attributes.json
        const outputPath = path.join(__dirname, 'public', 'quest_attributes.json');
        await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
        
        // Print summary
        console.log('Unique afterClear values:', result.afterClearTypes);
        console.log('\nUnique consumeTypes:', result.consumeTypes);
        console.log('\nUnique consumeItems:', result.consumeItems);
        
        console.log(`\nData saved to ${outputPath}`);

    } catch (error) {
        console.error('Error:', error);
        if (error.code === 'ENOENT') {
            console.error('File not found:', error.path);
        }
        if (error.stack) {
            console.error('Stack:', error.stack);
        }
    }
}

analyzeQuestAttributes();
