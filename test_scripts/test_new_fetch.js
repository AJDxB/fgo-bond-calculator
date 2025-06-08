const { getQuestBondMapping } = require('./fetch_all_quests');

async function test() {
    try {
        console.log('Fetching NA quest data...');
        const data = await getQuestBondMapping('NA');
          // Print some sample data
        console.log('\nSample quests:');
        console.log(JSON.stringify(data.slice(0, 2), null, 2));
        
        console.log('\nTotal quests:', data.length);
        
        // Check if we have bond points
        const questsWithBond = data.filter(q => Object.keys(q.bond).length > 0);
        console.log('Quests with bond points:', questsWithBond.length);
        
        // Check if we have AP costs
        const questsWithAP = data.filter(q => q.ap > 0);
        console.log('Quests with AP cost:', questsWithAP.length);
          } catch (error) {
        console.error('Test failed:', error);
        if (error.response) {
            console.error('Response:', await error.response.text());
        }
    }
}

test();
