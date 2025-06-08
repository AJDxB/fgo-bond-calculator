const fetch = require('node-fetch');

async function testWarApi() {
    try {
        // Get the nice war data
        const warData = await fetch('https://api.atlasacademy.io/export/NA/nice_war.json').then(r => r.json());
        
        // Get one sample war with its spots and quests
        const sampleWar = warData[0];
        
        // Just fetch phase data for sample quest
        const sampleQuest = sampleWar.spots[0]?.quests[0];
        const phaseData = sampleQuest ? await fetch(
            `https://git.atlasacademy.io/atlasacademy/fgo-game-data/raw/branch/NA/master/mstQuestPhase.json`
        ).then(r => r.json()) : [];
        
        // Log sample data structure
        console.log('Sample War Structure:', {
            id: sampleWar.id,
            name: sampleWar.name,
            longName: sampleWar.longName,
            spots: sampleWar.spots.map(spot => ({
                id: spot.id,
                name: spot.name,
                quests: (spot.quests || []).slice(0, 1).map(quest => ({
                    id: quest.id,
                    name: quest.name,
                    type: quest.type,
                    phases: phaseData
                        .filter(p => p.questId === quest.id)
                        .map(p => ({
                            phase: p.phase,
                            bond: p.friendshipExp
                        }))
                }))
            }))
        });    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', await error.response.text());
        }
    }
}

testWarApi();
