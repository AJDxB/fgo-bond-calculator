/**
 * Test Quest Mode filtering logic
 * Verifies that the filtering criteria work correctly with the quest data
 */

const fs = require('fs');
const path = require('path');

// Read the quest data
const questsPath = path.join(__dirname, '..', 'public', 'quests.json');
const questData = JSON.parse(fs.readFileSync(questsPath, 'utf8'));

console.log('Total quests in data:', questData.length);

// Apply Quest Mode filters: afterClear "repeatLast"/"resetInterval", consumeType "ap", questType "free"
const filteredQuests = questData.filter(quest => 
  quest.questType === "free" &&
  quest.consumeType === "ap" &&
  (quest.afterClear === "repeatLast" || quest.afterClear === "resetInterval")
);

console.log('Filtered quests for Quest Mode:', filteredQuests.length);

// Group by warLongName for display
const groupedQuests = filteredQuests.reduce((groups, quest) => {
  const warName = quest.warLongName;
  if (!groups[warName]) {
    groups[warName] = [];
  }
  groups[warName].push(quest);
  return groups;
}, {});

console.log('\nQuests grouped by war:');
Object.entries(groupedQuests).forEach(([warName, quests]) => {
  console.log(`\n${warName} (${quests.length} quests):`);
  quests.slice(0, 3).forEach(quest => {
    // Get bond points for the first available bond level
    const bondLevels = Object.keys(quest.bond);
    const bondPoints = quest.bond[bondLevels[0]] || 0;
    console.log(`  - ${quest.spotName} (${quest.ap} AP, ${bondPoints} Bond)`);
  });
  if (quests.length > 3) {
    console.log(`  ... and ${quests.length - 3} more`);
  }
});

// Test sample calculations
console.log('\n--- Sample Quest Calculations ---');
if (filteredQuests.length > 0) {
  const sampleQuest = filteredQuests[0];
  const bondLevels = Object.keys(sampleQuest.bond);
  const baseBond = sampleQuest.bond[bondLevels[0]] || 0;
  
  console.log(`Sample quest: ${sampleQuest.questName} (${sampleQuest.spotName})`);
  console.log(`AP Cost: ${sampleQuest.ap}`);
  console.log(`Base Bond: ${baseBond}`);
  console.log(`War: ${sampleQuest.warLongName}`);
  console.log(`After Clear: ${sampleQuest.afterClear}`);
  
  // Test bond calculation with various bonuses
  const testBonuses = [0, 50, 100];
  testBonuses.forEach(bonus => {
    const bondWithBonus = Math.floor(baseBond * (1 + bonus / 100));
    console.log(`With ${bonus}% bonus: ${bondWithBonus} bond per run`);
  });
}
