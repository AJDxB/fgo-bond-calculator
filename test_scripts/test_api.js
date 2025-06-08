const fetch = require('node-fetch');

async function test() {
    try {
        // Get a war to see its structure
        const warData = await fetch('https://api.atlasacademy.io/nice/NA/war/301').then(r => r.json());
        console.log('War structure sample:', JSON.stringify(warData, null, 2).slice(0, 1000));

        // Get phase data for a quest
        const phaseData = await fetch('https://api.atlasacademy.io/nice/NA/quest/94051831/1').then(r => r.json());
        console.log('\nPhase structure sample:', JSON.stringify(phaseData, null, 2).slice(0, 1000));
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
