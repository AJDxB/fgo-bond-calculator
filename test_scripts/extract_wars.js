const fs = require('fs').promises;
const path = require('path');

async function extractWarNames() {
    try {
        // Read quests.json
        const questsPath = path.join(__dirname, 'public', 'quests.json');
        const quests = JSON.parse(await fs.readFile(questsPath, 'utf8'));
        
        // Get unique war names and sort them
        const warNames = [...new Set(quests.map(q => q.warLongName))]
            .filter(name => name) // Remove empty strings
            .sort();
        
        // Create an object with organized data
        const warData = {
            count: warNames.length,
            names: warNames
        };
        
        // Save to wars.json
        const outputPath = path.join(__dirname, 'public', 'wars.json');
        await fs.writeFile(outputPath, JSON.stringify(warData, null, 2));
        console.log(`Saved ${warNames.length} war names to ${outputPath}`);
        
        // Print first few entries as sample
        console.log('\nSample entries:');
        console.log(warNames.slice(0, 5));    } catch (error) {
        console.error('Error:', error);
        if (error.code === 'ENOENT') {
            console.error('File not found:', error.path);
        }
    }
}

extractWarNames();
