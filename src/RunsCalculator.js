/**
 * RunsCalculator.js
 * FGO Bond Calculator - Quest Runs Calculator Component
 * 
 * Calculates th            'Lostbelt No.6': 'LB6 - Avalon le Fae',
            'Heian-kyo': 'Heian-kyo',
            'Traum': 'Traum',
            'Lostbelt No.7': 'LB7 - Nahui Mictlān',
            'Paper Moon': 'Paper Moon',ber of quest runs needed to reach target bond levels.
 * Includes quest selection, custom points mode, AP costs, time estimates,
 * and bond bonus calculations for farming efficiency.
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4 - Added Quest Mode with FGO quest database, InfoTooltip integration, React Select upgrade
 * @created 2025-06-04
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React, { useState, useEffect } from "react";
// import styles from "./RunsCalculator.module.css";
import "./RunsCalculator.css";
import "./QuestSelect.css";
import InfoTooltip from "./InfoTooltip";
import QuestModePanel from "./components/core/QuestModePanel";
import CustomPointsPanel from "./components/core/CustomPointsPanel";
import QuickListPanel from "./components/core/QuickListPanel";

// DEBUG: Log CSS module styles
// console.log('CSS Module styles loaded:', styles);

// Quest data with base bond points
const QUEST_DATA = {
  // Dailies
  extreme_training: { name: "Extreme Training Grounds (40 AP)", ap: 40, baseBond: 815 },
  extreme_treasure: { name: "Extreme Treasure Vault (40 AP)", ap: 40, baseBond: 715 },
  extreme_embers: { name: "Extreme Ember Gathering (40 AP)", ap: 40, baseBond: 715 },
  // Free Quests
  free_quest_80: { name: "Free Quest Lv80 (21 AP)", ap: 21, baseBond: 815 },
  free_quest_84: { name: "Free Quest Lv84 (22 AP)", ap: 22, baseBond: 855 },
  // Bleached Earth
  bleached_90pp: { name: "Bleached Earth 90++ (40 AP)", ap: 40, baseBond: 2636 },
  bleached_90s: { name: "Bleached Earth 90* (40 AP)", ap: 40, baseBond: 3164 },
  bleached_90ss: { name: "Bleached Earth 90** (40 AP)", ap: 40, baseBond: 3797 },
  // Event Quests
  event_90: { name: "Event Quest Lv90 (40 AP)", ap: 40, baseBond: 915 },
  event_90p: { name: "Event Quest Lv90+ (40 AP)", ap: 40, baseBond: 1098 },
  event_90pp: { name: "Event Quest Lv90++ (40 AP)", ap: 40, baseBond: 1318 },
};

// Helper function to format quest options
const formatQuickListOption = (name, ap, bond) => (
  <div className="quest-option">
    <span className="quest-name">{name}</span>
    <span className="quest-ap">{ap} AP</span>
    <span className="quest-bond">{bond} Bond</span>
  </div>
);

// Quick List options with formatted display
const quickListOptions = [
  {
    label: "Dailies",
    options: [
      { value: "extreme_training", label: formatQuickListOption("Extreme Training Grounds", 40, 815) },
      { value: "extreme_treasure", label: formatQuickListOption("Extreme Treasure Vault", 40, 715) },
      { value: "extreme_embers", label: formatQuickListOption("Extreme Ember Gathering", 40, 715) }
    ]
  },
  {
    label: "Free Quests",
    options: [
      { value: "free_quest_80", label: formatQuickListOption("Lv80", 21, 815) },
      { value: "free_quest_84", label: formatQuickListOption("Lv84", 22, 855) }
    ]
  },
  {
    label: "Bleached Earth",
    options: [
      { value: "bleached_90pp", label: formatQuickListOption("Lv90++", 40, 2636) },
      { value: "bleached_90s", label: formatQuickListOption("Lv90*", 40, 3164) },
      { value: "bleached_90ss", label: formatQuickListOption("Lv90**", 40, 3797) }
    ]
  },
  {
    label: "Event Quests",
    options: [
      { value: "event_90", label: formatQuickListOption("Lv90", 40, 915) },
      { value: "event_90p", label: formatQuickListOption("Lv90+", 40, 1098) },
      { value: "event_90pp", label: formatQuickListOption("Lv90++", 40, 1318) }
    ]
  }
];

// Change the isBleachedEarthQuest function to handle both modes
const isBleachedEarthQuest = (questKey, questData = null) => {
  if (questData) {
    // Quest Mode - Check if the quest name contains "Bleached Earth"
    return questData.questName.includes("Bleached Earth");
  }
  // Quick List Mode - Check by quest key
  return questKey.startsWith('bleached_');
};

// Helper function to check if a quest is a Bleached Earth quest
// const isBleachedEarthQuest = (questKey) => questKey.startsWith('bleached_');

// Set the default selected quest to the first key in QUEST_DATA
const QUEST_KEYS = Object.keys(QUEST_DATA);

const RunsCalculator = ({ selectedServant, targetBond, pointsNeeded }) => {
  const [selectedQuest, setSelectedQuest] = useState(QUEST_KEYS[0]);
  const [bondBonus, setBondBonus] = useState(0);
  const [results, setResults] = useState(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isQuestMode, setIsQuestMode] = useState(false);
  const [customBondPoints, setCustomBondPoints] = useState("");
  const [customAP, setCustomAP] = useState("");
  const [heroicPortraitEnabled, setHeroicPortraitEnabled] = useState(false);
  const [heroicPortraitMultiplier, setHeroicPortraitMultiplier] = useState(1);
  const [frontlineBonusEnabled, setFrontlineBonusEnabled] = useState(false);
  const [frontlineBonusPercent, setFrontlineBonusPercent] = useState(0.24);
  const [filteredQuests, setFilteredQuests] = useState([]);
  const [selectedQuestFromData, setSelectedQuestFromData] = useState("");

  // Memoize quest options
  const questOptions = React.useMemo(() => {
    const groupedQuests = filteredQuests.reduce((acc, quest) => {
      // Special handling for Lostbelt 5 to differentiate between Atlantis and Olympus
      let warDisplayName;
      if (quest.warLongName.includes('Ancient Ocean of the Dreadnought Gods, Atlantis')) {
        warDisplayName = 'LB5.1 - Atlantis';
      } else if (quest.warLongName.includes('Interstellar Mountainous City, Olympus')) {
        warDisplayName = 'LB5.2 - Olympus';
      } else if (quest.warLongName.includes('Golden Sea of Trees, Nahui Mictlān')) {
        warDisplayName = 'LB7 - Nahui Mictlān';
      } else if (quest.warLongName.includes('Zero Compass Inner Domain')) {
        warDisplayName = 'Paper Moon';
      } else if (quest.warLongName.includes('Naraka Mandala')) {
        warDisplayName = 'Heian-kyo';
      } else if (quest.warLongName.includes('Realm of the Thanatos Impulse')) {
        warDisplayName = 'Traum';
      } else {
        // Get the full war name including any subtitles
        const fullWarName = quest.warLongName;

        // Special handling for Pseudo-Singularity/EoR format
        if (fullWarName.startsWith('Pseudo-Singularity I:') || fullWarName.startsWith('Epic of Remnant I:')) {
          warDisplayName = 'EoR 1 - Shinjuku';
        } else if (fullWarName.startsWith('Pseudo-Singularity II:') || fullWarName.startsWith('Epic of Remnant II:')) {
          warDisplayName = 'EoR 2 - Agartha';
        } else if (fullWarName.startsWith('Pseudo-Singularity III:') || fullWarName.startsWith('Epic of Remnant III:') || 
                   fullWarName.includes('Pseudo-Parallel World')) {
          warDisplayName = 'EoR 3 - Shimousa';
        } else if (fullWarName.startsWith('Pseudo-Singularity IV') || fullWarName.startsWith('Epic of Remnant IV:')) {
          warDisplayName = 'EoR 4 - Salem';
        } else {
          // For all other cases, get base war name and apply mapping
          let warLongName = quest.warLongName.split('\n')[0];  // Take first part before any newlines

          // Apply simplified naming
          const warNameMap = {
            'Singularity F': 'Singularity F - Fuyuki',
            'First Singularity': '1st Singularity - Orleans',
            'Second Singularity': '2nd Singularity - Septem',
            'Third Singularity': '3rd Singularity - Okeanos',
            'Fourth Singularity': '4th Singularity - London',
            'Fifth Singularity': '5th Singularity - E Pluribus Unum',
            'Sixth Singularity': '6th Singularity - Camelot',
            'Seventh Singularity': '7th Singularity - Babylonia',
            // Standardize all EoR/Pseudo-Singularity names to simplified EoR format
            'Epic of Remnant I': 'EoR 1 - Shinjuku',
            'Epic of Remnant II': 'EoR 2 - Agartha',
            'Epic of Remnant III': 'EoR 3 - Shimousa',
            'Epic of Remnant IV': 'EoR 4 - Salem',
            'Pseudo-Singularity I': 'EoR 1 - Shinjuku',
            'Pseudo-Singularity II': 'EoR 2 - Agartha',
            'Pseudo-Singularity III': 'EoR 3 - Shimousa',
            'Pseudo-Singularity IV': 'EoR 4 - Salem',
            'Lostbelt No.1': 'LB1 - Anastasia',
            'Lostbelt No.2': 'LB2 - Götterdämmerung',
            'Lostbelt No.3': 'LB3 - SIN',
            'Lostbelt No.4': 'LB4 - Yuga Kshetra',
            'Lostbelt No.6': 'LB6 - Avalon le Fae',
            'Heian-kyo': 'Heian-kyo',
            'Traum': 'Traum',
            'Lostbelt No.7': 'LB7 - Nahui Mictlān',
            'Paper Moon': 'Paper Moon',
            'Isolated Realm of the Far East, Imperial Capital': 'Imperial Capital'
          };
          
          // Replace with simplified name if it exists in the map
          warDisplayName = warNameMap[warLongName] || warLongName;
        }
      }

      if (!acc[warDisplayName]) {
        acc[warDisplayName] = [];
      }
      
      // Get first bond level value
      const firstBondValue = quest.bond[Object.keys(quest.bond)[0]];
      acc[warDisplayName].push({
        ...quest,
        displayName: (
          <div className="quest-option">
            <span className="quest-name">{quest.spotName}</span>
            <span className="quest-ap">{quest.ap} AP</span>
            <span className="quest-bond">{firstBondValue} Bond</span>
          </div>
        )
      });
      return acc;
    }, {});

    // Sort quests within each group
    Object.values(groupedQuests).forEach(group => {
      group.sort((a, b) => a.ap - b.ap);
    });

    return Object.entries(groupedQuests).map(([warLongName, quests]) => ({
      label: warLongName,
      options: quests.map(quest => ({
        value: quest.questId.toString(),
        label: quest.displayName,
        quest: quest
      }))
    }));
  }, [filteredQuests]);
    // Load quest data for Quest Mode
  useEffect(() => {
    const loadQuestData = async () => {
      try {
        // Handle both development and production environments
        const publicUrl = process.env.PUBLIC_URL || '';
        const response = await fetch(`${publicUrl}/quests.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter quests: afterClear "repeatLast"/"resetInterval", consumeType "ap", questType "free"
        const filtered = data.filter(quest => 
          quest.questType === "free" &&
          quest.consumeType === "ap" &&
          (quest.afterClear === "repeatLast" || quest.afterClear === "resetInterval")
        );
        
        setFilteredQuests(filtered);
        
        // Set default selection to first quest if available
        if (filtered.length > 0) {
          setSelectedQuestFromData(`${filtered[0].questId}`);
        }      } catch (error) {
        console.error('Error loading quest data:', error);
        setFilteredQuests([]);
        // Show user-friendly error in the UI
        setResults({
          runsNeeded: 0,
          totalAP: 0,
          pointsNeeded: 0,
          bondPerRun: 0,
          message: "Failed to load quest data. Please refresh the page or try again later."
        });
      }
    };

    loadQuestData();
  }, []);

  // Calculate runs when inputs change
  useEffect(() => {
    const calculateRuns = () => {
      if (!selectedServant || !targetBond) return;      // Ensure we have valid numeric input for points
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
      }      let bondPerRun, runsNeeded, totalAP, questName;
      
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
        let base = Math.floor(customPoints * (1 + bondBonus / 100)) + (heroicPortraitEnabled ? 50 * heroicPortraitMultiplier : 0);
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
        
        // Get bond points for the first available bond level (usually level 1)
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
        
        let base = Math.floor(baseBondPoints * (1 + bondBonus / 100)) + (heroicPortraitEnabled ? 50 * heroicPortraitMultiplier : 0);
        if (frontlineBonusEnabled) base = Math.floor(base * (1 + frontlineBonusPercent));
        bondPerRun = base;
        runsNeeded = Math.ceil(points / bondPerRun);
        totalAP = runsNeeded * selectedQuestData.ap;
        // Get war display name with the same mapping used in the quest options        // Get war display name using the same mapping logic as in the quest options
        let warDisplayName;
        if (selectedQuestData.warLongName.includes('Ancient Ocean of the Dreadnought Gods, Atlantis')) {
          warDisplayName = 'LB5.1 - Atlantis';
        } else if (selectedQuestData.warLongName.includes('Interstellar Mountainous City, Olympus')) {
          warDisplayName = 'LB5.2 - Olympus';
        } else if (selectedQuestData.warLongName.includes('Golden Sea of Trees, Nahui Mictlān')) {
          warDisplayName = 'LB7 - Nahui Mictlān';
        } else if (selectedQuestData.warLongName.includes('Zero Compass Inner Domain')) {
          warDisplayName = 'Paper Moon';
        } else if (selectedQuestData.warLongName.includes('Naraka Mandala')) {
          warDisplayName = 'Heian-kyo';
        } else if (selectedQuestData.warLongName.includes('Realm of the Thanatos Impulse')) {
          warDisplayName = 'Traum';
        } else if (selectedQuestData.warLongName.startsWith('Pseudo-Singularity I:') || selectedQuestData.warLongName.startsWith('Epic of Remnant I:')) {
          warDisplayName = 'EoR 1 - Shinjuku';
        } else if (selectedQuestData.warLongName.startsWith('Pseudo-Singularity II:') || selectedQuestData.warLongName.startsWith('Epic of Remnant II:')) {
          warDisplayName = 'EoR 2 - Agartha';
        } else if (selectedQuestData.warLongName.startsWith('Pseudo-Singularity III:') || selectedQuestData.warLongName.startsWith('Epic of Remnant III:') || 
                   selectedQuestData.warLongName.includes('Pseudo-Parallel World')) {
          warDisplayName = 'EoR 3 - Shimousa';
        } else if (selectedQuestData.warLongName.startsWith('Pseudo-Singularity IV') || selectedQuestData.warLongName.startsWith('Epic of Remnant IV:')) {
          warDisplayName = 'EoR 4 - Salem';
        } else {
          // For all other cases, use the same mapping as the quest options
          const warNameMap = {
            'Singularity F': 'Singularity F - Fuyuki',
            'First Singularity': '1st Singularity - Orleans',
            'Second Singularity': '2nd Singularity - Septem',
            'Third Singularity': '3rd Singularity - Okeanos',
            'Fourth Singularity': '4th Singularity - London',
            'Fifth Singularity': '5th Singularity - E Pluribus Unum',
            'Sixth Singularity': '6th Singularity - Camelot',
            'Seventh Singularity': '7th Singularity - Babylonia',
            'Lostbelt No.1': 'LB1 - Anastasia',
            'Lostbelt No.2': 'LB2 - Götterdämmerung',
            'Lostbelt No.3': 'LB3 - SIN',
            'Lostbelt No.4': 'LB4 - Yuga Kshetra',
            'Lostbelt No.6': 'LB6 - Avalon le Fae',
            'Heian-kyo': 'Heian-kyo',
            'Traum': 'Traum',
            'Lostbelt No.7': 'LB7 - Nahui Mictlān',
            'Paper Moon': 'Paper Moon',
            'Isolated Realm of the Far East, Imperial Capital': 'Imperial Capital'
          };          warDisplayName = warNameMap[selectedQuestData.warLongName.split('\n')[0]] || selectedQuestData.warLongName;
        }
        questName = `${warDisplayName} - ${selectedQuestData.spotName}`;
      } else {
        const quest = QUEST_DATA[selectedQuest];
        let base = Math.floor(quest.baseBond * (1 + bondBonus / 100)) + (heroicPortraitEnabled ? 50 * heroicPortraitMultiplier : 0);
        if (frontlineBonusEnabled) base = Math.floor(base * (1 + frontlineBonusPercent));
        bondPerRun = base;
        runsNeeded = Math.ceil(points / bondPerRun);
        totalAP = runsNeeded * quest.ap;
        questName = quest.name;
      }

      // Calculate estimated time (assuming 1 run = 3 minutes average)
      const estimatedMinutes = runsNeeded * 3;
      const hours = Math.floor(estimatedMinutes / 60);
      const minutes = estimatedMinutes % 60;
      
      // Special calculation for Bleached Earth quests (3 runs per day limit)
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
        isBleachedEarth: isBleached
      });
    };    if (selectedServant && targetBond && typeof pointsNeeded === "number") {
      calculateRuns();
    }
  }, [selectedServant, targetBond, pointsNeeded, selectedQuest, bondBonus, isCustomMode, isQuestMode, customBondPoints, customAP, heroicPortraitEnabled, heroicPortraitMultiplier, frontlineBonusEnabled, frontlineBonusPercent, selectedQuestFromData, filteredQuests]);

  const handleBonusChange = (e) => {
    const value = Math.max(0, Math.min(300, parseInt(e.target.value) || 0)); // Cap at 300%
    setBondBonus(value);
  };

  const handleCustomBondPointsChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setCustomBondPoints(formatted);
  };

  const handleCustomAPChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setCustomAP(formatted);
  };
  if (!selectedServant) {
    return (      <div className="runs-calculator">
        <h3 className="runs-title">Runs to Max Calculator</h3>
        <p className="runs-info">Select a servant first to calculate quest runs needed.</p>
      </div>
    );
  }
  return (    <div className="runs-calculator">
      <h3 className="runs-title">Runs to Max Calculator</h3>
        <div className="runs-form">        <div className="calculator-mode-toggle">
          <button
            className={`calc-toggle-btn ${!isCustomMode && !isQuestMode ? 'active' : ''}`}
            onClick={() => {
              setIsCustomMode(false);
              setIsQuestMode(false);
            }}
          >
            Quick List
          </button>          <button 
            className={`calc-toggle-btn ${isQuestMode && !isCustomMode ? 'active' : ''}`}
            onClick={() => {
              setIsCustomMode(false);
              setIsQuestMode(true);
            }}
          >
            Quest Mode
          </button>          <button 
            className={`calc-toggle-btn ${isCustomMode ? 'active' : ''}`}
            onClick={() => {
              setIsCustomMode(true);
              setIsQuestMode(false);
            }}
          >
            Custom Points
          </button>
        </div>        {isCustomMode ? (
          <CustomPointsPanel
            customBondPoints={customBondPoints}
            onCustomBondPointsChange={handleCustomBondPointsChange}
            customAP={customAP}
            onCustomAPChange={handleCustomAPChange}
          />
        ) : isQuestMode ? (
          <QuestModePanel
            questOptions={questOptions}
            selectedQuestFromData={selectedQuestFromData}
            onQuestChange={setSelectedQuestFromData}
            filteredQuests={filteredQuests}
          />
        ) : (
          <QuickListPanel
            quickListOptions={quickListOptions}
            selectedQuest={selectedQuest}
            onQuestChange={setSelectedQuest}
          />
        )}

        {/* Universal options: Bond Bonus and Heroic Portrait bonus */}        <div className="form-group">
          <label className="form-label">
            Bond Bonus (%)
            <InfoTooltip text="Include CE bonuses (Chaldea Lunchtime, etc.), event bonuses, and other bond point multipliers" />
          </label>
          <input
            type="number"
            value={bondBonus}
            onChange={handleBonusChange}
            className="form-input"
            placeholder="0"
            min="0"
            max="300"
          />
        </div>
        <div className="form-group" style={{ display: 'flex', gap: '2em', alignItems: 'flex-end' }}>
          {/* Heroic Portrait */}
          <div style={{ flex: 1 }}>            <label className={"form-label"} htmlFor="heroicPortrait">
              Heroic Portrait
              <span className="bonus-help" style={{ marginLeft: 6 }}>
                +50 per
              </span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75em' }}>
              <input
                type="checkbox"
                id="heroicPortrait"
                checked={heroicPortraitEnabled}
                onChange={e => setHeroicPortraitEnabled(e.target.checked)}
                style={{ marginRight: '0.5em', accentColor: 'var(--primary-color, #2962ff)' }}
              />              <select
                value={heroicPortraitMultiplier}
                onChange={e => setHeroicPortraitMultiplier(Number(e.target.value))}
                disabled={!heroicPortraitEnabled}
                className={"form-select"}
              >
                {[1,2].map(n => (
                  <option key={n} value={n}>{`${n} CE${n > 1 ? 's' : ''}`}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Frontline Bonus */}
          <div style={{ flex: 1 }}>            <label className={"form-label"} htmlFor="frontlineBonus">
              Frontline Bonus
              <span className="bonus-help" style={{ marginLeft: 6 }}>
                
              </span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75em' }}>
              <input
                type="checkbox"
                id="frontlineBonus"
                checked={frontlineBonusEnabled}
                onChange={e => setFrontlineBonusEnabled(e.target.checked)}
                style={{ marginRight: '0.5em', accentColor: 'var(--primary-color, #2962ff)' }}
              />              <select
                value={frontlineBonusPercent}
                onChange={e => setFrontlineBonusPercent(Number(e.target.value))}
                disabled={!frontlineBonusEnabled}
                className={"form-select"}
                style={{ minWidth: 70 }}
              >
                <option value={0.24}>24%</option>
                <option value={0.20}>20%</option>
                <option value={0.04}>4%</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {results && (        <div className={`${"results-container"} ${"fade-in"}`}>
          <div className={"results-grid"}>
            <div className={"runs-item"}>
              <span className={"runs-label"}>Runs Needed:</span>
              <span className={"runs-value"}>{results.runsNeeded.toLocaleString()}</span>
            </div>
            
            <div className={"runs-item"}>
              <span className={"runs-label"}>Total AP Cost:</span>
              <span className={"runs-value"}>{results.totalAP.toLocaleString()}</span>
            </div>
            
            <div className={"runs-item"}>
              <span className={"runs-label"}>Bond per Run:</span>
              <span className={"runs-value"}>{results.bondPerRun.toLocaleString()}</span>
            </div>
            
            <div className={"runs-item"}>
              <span className={"runs-label"}>Points Needed:</span>
              <span className={"runs-value"}>{results.pointsNeeded.toLocaleString()}</span>
            </div>
              {results.estimatedTime && (
              <div className={`${"runs-item"} ${"full-width"}`}>
                <span className={"runs-label"}>Estimated Time:</span>
                <span className={"runs-value"}>
                  {results.estimatedTime.hours > 0 && `${results.estimatedTime.hours}h `}
                  {results.estimatedTime.minutes}m
                </span>
              </div>
            )}
              {results.apPerDay > 0 && (
              <div className={`${"runs-item"} ${"full-width"}`}>
                <span className={"runs-label"}>                  {results.isBleachedEarth ? "Days Required:" : "Days with Natural AP:"}
                </span>
                <span className={"runs-value"}>                  {Math.ceil(results.apPerDay)} {Math.ceil(results.apPerDay) === 1 ? 'Day' : 'Days'}
                  {results.isBleachedEarth && 
                    <span className="bonus-help" style={{ display: 'block', fontSize: '0.85em', color: 'var(--text-muted)' }}>
                      (Based on 3 runs per day limit for Bleached Earth quests)
                    </span>
                  }
                </span>
              </div>
            )}
          </div>
          
          <div className={"quest-info"}>
            Running: <strong>{results.questName}</strong>
            {results.isBleachedEarth && (
              <div className="quest-note" style={{ marginTop: '0.5em', fontSize: '0.9em', color: 'var(--text-muted)' }}>
                Note: Bleached Earth quests are limited to 3 runs per day
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RunsCalculator;
