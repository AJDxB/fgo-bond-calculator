/**
 * RunsCalculator.js
 * FGO Bond Calculator - Quest Runs Calculator Component
 * 
 * Calculates the number of quest runs needed to reach target bond levels.
 * Includes quest selection, custom points mode, AP costs, time estimates,
 * and bond bonus calculations for farming efficiency.
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.3 - Enhanced dropdown styling and accessibility, support for JP server data
 * @created 2025-06-04
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React, { useState, useEffect } from "react";
import "./RunsCalculator.css";

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

// Helper function to check if a quest is a Bleached Earth quest
const isBleachedEarthQuest = (questKey) => questKey.startsWith('bleached_');

// Set the default selected quest to the first key in QUEST_DATA
const QUEST_KEYS = Object.keys(QUEST_DATA);
const RunsCalculator = ({ selectedServant, targetBond, pointsNeeded }) => {
  const [selectedQuest, setSelectedQuest] = useState(QUEST_KEYS[0]);
  const [bondBonus, setBondBonus] = useState(0);
  const [results, setResults] = useState(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customBondPoints, setCustomBondPoints] = useState("");
  const [customAP, setCustomAP] = useState("");
  const [heroicPortraitEnabled, setHeroicPortraitEnabled] = useState(false);
  const [heroicPortraitMultiplier, setHeroicPortraitMultiplier] = useState(1);
  const [frontlineBonusEnabled, setFrontlineBonusEnabled] = useState(false);
  const [frontlineBonusPercent, setFrontlineBonusPercent] = useState(0.24);

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
      const minutes = estimatedMinutes % 60;      // Special calculation for Bleached Earth quests (3 runs per day limit)
      const isBleached = !isCustomMode && isBleachedEarthQuest(selectedQuest);
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
  }, [selectedServant, targetBond, pointsNeeded, selectedQuest, bondBonus, isCustomMode, customBondPoints, customAP, heroicPortraitEnabled, heroicPortraitMultiplier, frontlineBonusEnabled, frontlineBonusPercent]);

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
    return (
      <div className="runs-calculator">
        <h3 className="runs-title">Runs to Max Calculator</h3>
        <p className="runs-info">Select a servant first to calculate quest runs needed.</p>
      </div>
    );
  }

  return (
    <div className="runs-calculator">
      <h3 className="runs-title">Runs to Max Calculator</h3>
        <div className="runs-form">        <div className="calculator-mode-toggle">
          <button 
            className={`toggle-btn ${!isCustomMode ? 'active' : ''}`}
            onClick={() => {
              setIsCustomMode(false);
            }}
          >
            Quest Type
          </button>
          <button 
            className={`toggle-btn ${isCustomMode ? 'active' : ''}`}
            onClick={() => {
              setIsCustomMode(true);
            }}
          >
            Custom Points
          </button>
        </div>        {isCustomMode ? (
          <>
            <div className="custom-inputs-row">
              <div className="form-group">
                <label className="form-label">Bond Points per Run</label>
                <input
                  type="text"
                  value={customBondPoints}
                  onChange={handleCustomBondPointsChange}
                  className="form-input"
                  placeholder="Enter bond points"
                />
              </div>
              <div className="form-group">
                <label className="form-label">AP Cost per Run</label>
                <input
                  type="text"
                  value={customAP}
                  onChange={handleCustomAPChange}
                  className="form-input"
                  placeholder="Enter AP cost"
                />
              </div>
            </div>
          </>) : (
          <>
            <div className="form-group">
              <label className="form-label">Quest Type</label>
              <select
                value={selectedQuest}
                onChange={(e) => setSelectedQuest(e.target.value)}
                className="form-select"
              >
                <optgroup label="Dailies">
                  <option value="extreme_training">Extreme Training Grounds (40 AP, 815 Bond)</option>
                  <option value="extreme_treasure">Extreme Treasure Vault (40 AP, 715 Bond)</option>
                  <option value="extreme_embers">Extreme Ember Gathering (40 AP, 715 Bond)</option>
                </optgroup>
                <optgroup label="Free Quests">
                  <option value="free_quest_80">Lv80 (21 AP, 815 Bond)</option>
                  <option value="free_quest_84">Lv84 (22 AP, 855 Bond)</option>
                </optgroup>
                <optgroup label="Bleached Earth">
                  <option value="bleached_90pp">Lv90++ (40 AP, 2636 Bond)</option>
                  <option value="bleached_90s">Lv90* (40 AP, 3164 Bond)</option>
                  <option value="bleached_90ss">Lv90** (40 AP, 3797 Bond)</option>
                </optgroup>
                <optgroup label="Event Quests">
                  <option value="event_90">Lv90 (40 AP, 915 Bond)</option>
                  <option value="event_90p">Lv90+ (40 AP, 1098 Bond)</option>
                  <option value="event_90pp">Lv90++ (40 AP, 1318 Bond)</option>
                </optgroup>
              </select>
            </div>
          </>
        )}

        {/* Universal options: Bond Bonus and Heroic Portrait bonus */}
        <div className="form-group">
          <label className="form-label">
            Bond Bonus (%)
            <span className="bonus-help">Include CE bonuses, event bonuses, etc.</span>
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
          <div style={{ flex: 1 }}>
            <label className="form-label" htmlFor="heroicPortrait">
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
              />
              <select
                value={heroicPortraitMultiplier}
                onChange={e => setHeroicPortraitMultiplier(Number(e.target.value))}
                disabled={!heroicPortraitEnabled}
                className="form-select"                style={{ minWidth: 50 }}
              >
                {[1,2].map(n => (
                  <option key={n} value={n}>{`${n} CE${n > 1 ? 's' : ''}`}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Frontline Bonus */}
          <div style={{ flex: 1 }}>
            <label className="form-label" htmlFor="frontlineBonus">
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
              />
              <select
                value={frontlineBonusPercent}
                onChange={e => setFrontlineBonusPercent(Number(e.target.value))}
                disabled={!frontlineBonusEnabled}
                className="form-select"
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

      {results && (
        <div className="results-container fade-in">
          <div className="results-grid">            <div className="runs-item">
              <span className="runs-label">Runs Needed:</span>
              <span className="runs-value">{results.runsNeeded.toLocaleString()}</span>
            </div>
            
            <div className="runs-item">
              <span className="runs-label">Total AP Cost:</span>
              <span className="runs-value">{results.totalAP.toLocaleString()}</span>
            </div>
            
            <div className="runs-item">
              <span className="runs-label">Bond per Run:</span>
              <span className="runs-value">{results.bondPerRun.toLocaleString()}</span>
            </div>
            
            <div className="runs-item">
              <span className="runs-label">Points Needed:</span>
              <span className="runs-value">{results.pointsNeeded.toLocaleString()}</span>
            </div>
            
            {results.estimatedTime && (
              <div className="runs-item full-width">
                <span className="runs-label">Estimated Time:</span>
                <span className="runs-value">
                  {results.estimatedTime.hours > 0 && `${results.estimatedTime.hours}h `}
                  {results.estimatedTime.minutes}m
                </span>
              </div>
            )}
              {results.apPerDay > 0 && (
              <div className="runs-item full-width">
                <span className="runs-label">
                  {results.isBleachedEarth ? "Days Required:" : "Days with Natural AP:"}
                </span>
                <span className="runs-value">
                  {Math.ceil(results.apPerDay)} days
                  {results.isBleachedEarth && 
                    <span className="bonus-help" style={{ display: 'block', fontSize: '0.85em', color: 'var(--text-muted)' }}>
                      (Based on 3 runs per day limit for Bleached Earth quests)
                    </span>
                  }
                </span>
              </div>
            )}
          </div>
          
          <div className="quest-info">
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
