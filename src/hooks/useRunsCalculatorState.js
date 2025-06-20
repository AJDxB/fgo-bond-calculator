/**
 * useRunsCalculatorState.js
 * FGO Bond Calculator - Form State Management Hook
 * 
 * Custom hook for managing all form state variables in the RunsCalculator component.
 * Centralizes state management for quest selection, bonuses, and mode toggles.
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4
 * @created 2025-06-20
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import { useState } from 'react';

/**
 * Custom hook for managing RunsCalculator form state
 * @param {Array} QUEST_KEYS - Available quest keys for initial selection
 * @returns {Object} - All state variables and their setters
 */
const useRunsCalculatorState = (QUEST_KEYS) => {
  // Quest selection state
  const [selectedQuest, setSelectedQuest] = useState(QUEST_KEYS[0]);
  
  // Mode state
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isQuestMode, setIsQuestMode] = useState(false);
  
  // Custom mode inputs
  const [customBondPoints, setCustomBondPoints] = useState("");
  const [customAP, setCustomAP] = useState("");
  
  // Bonus state
  const [bondBonus, setBondBonus] = useState(0);
  
  // Heroic Portrait CE state
  const [heroicPortraitEnabled, setHeroicPortraitEnabled] = useState(false);
  const [heroicPortraitMultiplier, setHeroicPortraitMultiplier] = useState(1);
  
  // Frontline bonus state
  const [frontlineBonusEnabled, setFrontlineBonusEnabled] = useState(false);
  const [frontlineBonusPercent, setFrontlineBonusPercent] = useState(0.24);

  // Helper functions for mode switching
  const switchToQuickList = () => {
    setIsCustomMode(false);
    setIsQuestMode(false);
  };

  const switchToCustomMode = () => {
    setIsCustomMode(true);
    setIsQuestMode(false);
  };

  const switchToQuestMode = () => {
    setIsCustomMode(false);
    setIsQuestMode(true);
  };

  return {
    // Quest selection
    selectedQuest,
    setSelectedQuest,
    
    // Mode state
    isCustomMode,
    setIsCustomMode,
    isQuestMode,
    setIsQuestMode,
    
    // Custom mode inputs
    customBondPoints,
    setCustomBondPoints,
    customAP,
    setCustomAP,
    
    // Bonus state
    bondBonus,
    setBondBonus,
    
    // Heroic Portrait CE
    heroicPortraitEnabled,
    setHeroicPortraitEnabled,
    heroicPortraitMultiplier,
    setHeroicPortraitMultiplier,
    
    // Frontline bonus
    frontlineBonusEnabled,
    setFrontlineBonusEnabled,
    frontlineBonusPercent,
    setFrontlineBonusPercent,
    
    // Helper functions
    switchToQuickList,
    switchToCustomMode,
    switchToQuestMode
  };
};

export default useRunsCalculatorState;
