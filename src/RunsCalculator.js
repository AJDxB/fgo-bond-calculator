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

import React from "react";
// import styles from "./RunsCalculator.module.css";
import "./RunsCalculator.css";
import InfoTooltip from "./components/ui/InfoTooltip";
import QuestModePanel from "./components/core/QuestModePanel";
import CustomPointsPanel from "./components/core/CustomPointsPanel";
import QuickListPanel from "./components/core/QuickListPanel";
import { formatQuickListOption, formatQuestModeOption } from "./components/core/QuestSelect";
import { useQuestData, useBondCalculations, useRunsCalculatorState } from "./hooks";

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

// Set the default selected quest to the first key in QUEST_DATA
const QUEST_KEYS = Object.keys(QUEST_DATA);

const RunsCalculator = ({ selectedServant, targetBond, pointsNeeded }) => {
  // Use custom hooks for state management
  const {
    selectedQuest,
    setSelectedQuest,
    isCustomMode,
    isQuestMode,
    customBondPoints,
    setCustomBondPoints,
    customAP,
    setCustomAP,
    bondBonus,
    setBondBonus,
    heroicPortraitEnabled,
    setHeroicPortraitEnabled,
    heroicPortraitMultiplier,
    setHeroicPortraitMultiplier,
    frontlineBonusEnabled,
    setFrontlineBonusEnabled,
    frontlineBonusPercent,
    setFrontlineBonusPercent,
    switchToQuickList,
    switchToCustomMode,
    switchToQuestMode
  } = useRunsCalculatorState(QUEST_KEYS);

  // Use quest data hook
  const {
    filteredQuests,
    isLoading: isQuestDataLoading,
    error: questDataError,
    selectedQuestId: selectedQuestFromData,
    setSelectedQuestId: setSelectedQuestFromData
  } = useQuestData();

  // Use bond calculations hook
  const { results } = useBondCalculations({
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
  });

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
      const firstBondValue = quest.bond[Object.keys(quest.bond)[0]];      acc[warDisplayName].push({
        ...quest,
        displayName: formatQuestModeOption(quest.spotName, quest.ap, firstBondValue)
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
        label: quest.displayName,        quest: quest
      }))
    }));
  }, [filteredQuests]);

  // Handle quest data loading error display
  if (questDataError) {
    return (
      <div className="runs-calculator">
        <h3 className="runs-title">Runs to Max Calculator</h3>
        <p className="runs-info error">Failed to load quest data. Please refresh the page or try again later.</p>
      </div>
    );
  }

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
            onClick={switchToQuickList}
          >
            Quick List
          </button>
          <button 
            className={`calc-toggle-btn ${isQuestMode && !isCustomMode ? 'active' : ''}`}
            onClick={switchToQuestMode}
          >
            Quest Mode
          </button>
          <button 
            className={`calc-toggle-btn ${isCustomMode ? 'active' : ''}`}
            onClick={switchToCustomMode}
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
        ) : isQuestMode ? (          <QuestModePanel
            questOptions={questOptions}
            selectedQuestFromData={selectedQuestFromData}
            onQuestChange={setSelectedQuestFromData}
            filteredQuests={filteredQuests}
            isLoading={isQuestDataLoading}
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
