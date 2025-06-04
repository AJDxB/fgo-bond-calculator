/**
 * RunsCalculator.js
 * FGO Bond Calculator - Quest Runs Calculator Component
 * 
 * Calculates the number of quest runs needed to reach target bond levels.
 * Includes quest selection, custom points mode, AP costs, time estimates,
 * and bond bonus calculations for farming efficiency.
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.1 - Added Custom Points mode with toggle switch and dynamic calculations
 * @created 2025-06-04
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React, { useState, useEffect } from "react";
import "./RunsCalculator.css";

// Quest data with base bond points
const QUEST_DATA = {
  daily_doors: { name: "Daily Doors (40 AP)", ap: 40, baseBond: 1395 },
  daily_embers: { name: "Daily Embers (40 AP)", ap: 40, baseBond: 1395 },
  daily_training: { name: "Daily Training (40 AP)", ap: 40, baseBond: 1395 },
  free_quest_90plus: { name: "90+ Nodes (21-23 AP)", ap: 22, baseBond: 910 },
  free_quest_90: { name: "90 Nodes (20-21 AP)", ap: 21, baseBond: 845 },
  free_quest_80: { name: "80+ Nodes (18-19 AP)", ap: 19, baseBond: 760 },
  event_high: { name: "Event Quests (High)", ap: 40, baseBond: 1820 },
  event_medium: { name: "Event Quests (Medium)", ap: 30, baseBond: 1365 },
  event_low: { name: "Event Quests (Low)", ap: 20, baseBond: 910 },
};

const RunsCalculator = ({ selectedServant, targetBond, pointsNeeded }) => {
  const [selectedQuest, setSelectedQuest] = useState("daily_doors");
  const [bondBonus, setBondBonus] = useState(0);
  const [results, setResults] = useState(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customBondPoints, setCustomBondPoints] = useState("");
  const [customAP, setCustomAP] = useState("");

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
        
        bondPerRun = Math.floor(customPoints * (1 + bondBonus / 100));
        runsNeeded = Math.ceil(points / bondPerRun);
        totalAP = runsNeeded * customAPValue;
        questName = "Custom Quest";
      } else {
        const quest = QUEST_DATA[selectedQuest];
        bondPerRun = Math.floor(quest.baseBond * (1 + bondBonus / 100));
        runsNeeded = Math.ceil(points / bondPerRun);
        totalAP = runsNeeded * quest.ap;
        questName = quest.name;
      }

      // Calculate estimated time (assuming 1 run = 3 minutes average)
      const estimatedMinutes = runsNeeded * 3;
      const hours = Math.floor(estimatedMinutes / 60);
      const minutes = estimatedMinutes % 60;

      setResults({        runsNeeded,
        totalAP,
        pointsNeeded: points,
        bondPerRun,
        questName,
        estimatedTime: { hours, minutes },
        apPerDay: Math.floor(totalAP / (24 * 6)) // Assuming 1 AP per 6 minutes natural regen
      });
    };    if (selectedServant && targetBond && typeof pointsNeeded === "number") {
      calculateRuns();
    }
  }, [selectedServant, targetBond, pointsNeeded, selectedQuest, bondBonus, isCustomMode, customBondPoints, customAP]);

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
              setCustomBondPoints("");
              setCustomAP("");
            }}
          >
            Quest Type
          </button>
          <button 
            className={`toggle-btn ${isCustomMode ? 'active' : ''}`}
            onClick={() => {
              setIsCustomMode(true);
              setCustomBondPoints("");
              setCustomAP("");
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
                <optgroup label="Daily Quests">
                  <option value="daily_doors">Daily Doors (40 AP)</option>
                  <option value="daily_embers">Daily Embers (40 AP)</option>
                  <option value="daily_training">Daily Training (40 AP)</option>
                </optgroup>
                <optgroup label="Free Quests">
                  <option value="free_quest_90plus">90+ Nodes (21-23 AP)</option>
                  <option value="free_quest_90">90 Nodes (20-21 AP)</option>
                  <option value="free_quest_80">80+ Nodes (18-19 AP)</option>
                </optgroup>
                <optgroup label="Event Quests">
                  <option value="event_high">Event Quests (High)</option>
                  <option value="event_medium">Event Quests (Medium)</option>
                  <option value="event_low">Event Quests (Low)</option>
                </optgroup>
              </select>            </div>

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
          </>
        )}

        {/* Bond Bonus input for Custom Points mode */}
        {isCustomMode && (
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
        )}
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
                <span className="runs-label">Days with Natural AP:</span>
                <span className="runs-value">{Math.ceil(results.apPerDay)} days</span>
              </div>
            )}
          </div>
          
          <div className="quest-info">
            Running: <strong>{results.questName}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunsCalculator;