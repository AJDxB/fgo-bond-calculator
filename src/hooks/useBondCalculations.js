/**
 * useBondCalculations.js
 * FGO Bond Calculator - Bond Calculations Hook
 * 
 * Custom hook for bond point calculations, runs estimation, and AP cost calculations.
 * Handles different quest modes, bonuses, and provides calculation results.
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4
 * @created 2025-06-20
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for bond calculations
 * @param {Object} params - Calculation parameters
 * @returns {Object} - { results, calculateRuns }
 */
const useBondCalculations = ({
  selectedServant,
  targetBond,
  pointsNeeded,
  bondBonus,
  isCustomMode,
  isQuestMode,
  customBondPoints,
  customAP,
  heroicPortraitEnabled,
  heroicPortraitMultiplier,
  frontlineBonusEnabled,
  frontlineBonusPercent,
  filteredQuests,
  selectedQuestFromData,
  selectedQuest,
  QUEST_DATA
}) => {
  const [results, setResults] = useState(null);

  // Helper function to check if a quest is a Bleached Earth quest
  const isBleachedEarthQuest = (questKey, questData = null) => {
    if (questData) {
      // Quest Mode - Check if the quest name contains "Bleached Earth"
      return questData.questName.includes("Bleached Earth");
    }
    // Quick List Mode - Check by quest key
    return questKey.startsWith('bleached_');
  };

  // War name mapping for quest mode display
  const getWarDisplayName = (warLongName) => {
    if (warLongName.includes('Ancient Ocean of the Dreadnought Gods, Atlantis')) {
      return 'LB5.1 - Atlantis';
    } else if (warLongName.includes('Interstellar Mountainous City, Olympus')) {
      return 'LB5.2 - Olympus';
    } else if (warLongName.includes('Golden Sea of Trees, Nahui Mictlān')) {
      return 'LB7 - Nahui Mictlān';
    } else if (warLongName.includes('Zero Compass Inner Domain')) {
      return 'Paper Moon';
    } else if (warLongName.includes('Naraka Mandala')) {
      return 'Heian-kyo';
    } else if (warLongName.includes('Realm of the Thanatos Impulse')) {
      return 'Traum';
    } else if (warLongName.startsWith('Pseudo-Singularity I:') || warLongName.startsWith('Epic of Remnant I:')) {
      return 'EoR 1 - Shinjuku';
    } else if (warLongName.startsWith('Pseudo-Singularity II:') || warLongName.startsWith('Epic of Remnant II:')) {
      return 'EoR 2 - Agartha';
    } else if (warLongName.startsWith('Pseudo-Singularity III:') || warLongName.startsWith('Epic of Remnant III:') || 
               warLongName.includes('Pseudo-Parallel World')) {
      return 'EoR 3 - Shimousa';
    } else if (warLongName.startsWith('Pseudo-Singularity IV') || warLongName.startsWith('Epic of Remnant IV:')) {
      return 'EoR 4 - Salem';
    } else {
      // Default mapping for standard singularities and lostbelts
      const warNameMap = {
        'Singularity F': 'Singularity F - Fuyuki',
        'Observer on Timeless Temple': 'Part 1',
        'Cosmos in the Lostbelt': 'Part 2',
        'Lostbelt No.1': 'LB1 - Anastasia',
        'Lostbelt No.2': 'LB2 - Götterdämmerung',
        'Lostbelt No.3': 'LB3 - SIN',
        'Lostbelt No.4': 'LB4 - Yuga Kshetra',
        'Lostbelt No.5': 'LB5 - Atlantis/Olympus',
        'Lostbelt No.6': 'LB6 - Avalon le Fae',
        'Lostbelt No.7': 'LB7 - Nahui Mictlān'
      };
      return warNameMap[warLongName] || warLongName;
    }
  };
  const calculateRuns = useCallback(() => {
    if (!selectedServant || !targetBond) return;

    // Ensure we have valid numeric input for points
    const points = typeof pointsNeeded === 'number' ? pointsNeeded : 0;

    if (points <= 0) {
      setResults({
        runsNeeded: 0,
        totalAP: 0,
        pointsNeeded: 0,
        bondPerRun: 0,
        message: "Target bond level already reached!"
      });
      return;
    }

    let bondPerRun, runsNeeded, totalAP, questName;
    
    if (isCustomMode) {
      const customPoints = parseInt(customBondPoints.replace(/,/g, ''), 10) || 0;
      const customAPValue = parseInt(customAP.replace(/,/g, ''), 10) || 0;
      
      if (customPoints <= 0 || customAPValue <= 0) {
        setResults({
          runsNeeded: 0,
          totalAP: 0,
          pointsNeeded: 0,
          bondPerRun: 0,
          message: "Please enter valid points and AP values"
        });
        return;
      }
      
      let base = Math.floor(customPoints * (1 + bondBonus / 100)) + 
                 (heroicPortraitEnabled ? 50 * heroicPortraitMultiplier : 0);
      if (frontlineBonusEnabled) base = Math.floor(base * (1 + frontlineBonusPercent));
      
      bondPerRun = base;
      runsNeeded = Math.ceil(points / bondPerRun);
      totalAP = runsNeeded * customAPValue;
      questName = "Custom Quest";
      
    } else if (isQuestMode) {
      // Handle Quest Mode selection
      const selectedQuestData = filteredQuests.find(q => q.questId.toString() === selectedQuestFromData);
      
      if (!selectedQuestData) {
        setResults({
          runsNeeded: 0,
          totalAP: 0,
          pointsNeeded: 0,
          bondPerRun: 0,
          message: "Please select a quest"
        });
        return;
      }
      
      // Get bond points for the first available bond level
      const bondLevels = Object.keys(selectedQuestData.bond);
      const baseBondPoints = selectedQuestData.bond[bondLevels[0]] || 0;
      
      if (baseBondPoints <= 0) {
        setResults({
          runsNeeded: 0,
          totalAP: 0,
          pointsNeeded: 0,
          bondPerRun: 0,
          message: "Selected quest has no bond points"
        });
        return;
      }
      
      let base = Math.floor(baseBondPoints * (1 + bondBonus / 100)) + 
                 (heroicPortraitEnabled ? 50 * heroicPortraitMultiplier : 0);
      if (frontlineBonusEnabled) base = Math.floor(base * (1 + frontlineBonusPercent));
      
      bondPerRun = base;
      runsNeeded = Math.ceil(points / bondPerRun);
      totalAP = runsNeeded * selectedQuestData.ap;
      
      const warDisplayName = getWarDisplayName(selectedQuestData.warLongName);
      questName = `${selectedQuestData.spotName} (${warDisplayName})`;
      
    } else {
      // Handle Quick List mode
      const questData = QUEST_DATA[selectedQuest];
      if (!questData) return;
      
      let base = Math.floor(questData.baseBond * (1 + bondBonus / 100)) + 
                 (heroicPortraitEnabled ? 50 * heroicPortraitMultiplier : 0);
      if (frontlineBonusEnabled) base = Math.floor(base * (1 + frontlineBonusPercent));
      
      bondPerRun = base;
      runsNeeded = Math.ceil(points / bondPerRun);
      totalAP = runsNeeded * questData.ap;
      questName = questData.name;
    }    // Calculate time estimates (assuming 2.5 minutes per run average)
    const minutesPerRun = 2.5;
    const totalMinutes = runsNeeded * minutesPerRun;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    
    // Determine if this is a Bleached Earth quest and calculate days needed
    let isBleached = false;
    if (isQuestMode) {
      const selectedQuestData = filteredQuests.find(q => q.questId.toString() === selectedQuestFromData);
      isBleached = selectedQuestData ? isBleachedEarthQuest(null, selectedQuestData) : false;
    } else if (!isCustomMode) {
      isBleached = isBleachedEarthQuest(selectedQuest);
    }
    const daysNeeded = isBleached ? Math.ceil(runsNeeded / 3) : Math.ceil(totalAP / (24 * 12));
      setResults({
      runsNeeded,
      totalAP,
      pointsNeeded: points,
      bondPerRun,
      questName,
      estimatedTime: { hours, minutes },
      apPerDay: daysNeeded,
      isBleachedEarth: isBleached,
      message: null
    });
  }, [
    selectedServant,
    targetBond,
    pointsNeeded,
    bondBonus,
    isCustomMode,
    isQuestMode,
    customBondPoints,
    customAP,
    heroicPortraitEnabled,
    heroicPortraitMultiplier,
    frontlineBonusEnabled,
    frontlineBonusPercent,
    filteredQuests,
    selectedQuestFromData,
    selectedQuest,
    QUEST_DATA
  ]);  useEffect(() => {
    calculateRuns();
  }, [
    calculateRuns,
    selectedServant,
    targetBond,
    pointsNeeded,
    bondBonus,
    isCustomMode,
    isQuestMode,
    customBondPoints,
    customAP,
    heroicPortraitEnabled,
    heroicPortraitMultiplier,
    frontlineBonusEnabled,
    frontlineBonusPercent,
    selectedQuestFromData,
    selectedQuest
  ]);

  return {
    results,
    calculateRuns
  };
};

export default useBondCalculations;
