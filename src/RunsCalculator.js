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

const RunsCalculator = ({ selectedServant, currentBondPoints, targetBond }) => {
  const [selectedQuest, setSelectedQuest] = useState("daily_doors");
  const [bondBonus, setBondBonus] = useState(0);
  const [results, setResults] = useState(null);

  // Calculate runs when inputs change
  useEffect(() => {
    const calculateRuns = () => {
      if (!selectedServant || !targetBond) return;

      const currPoints = parseInt(currentBondPoints.replace(/,/g, "")) || 0;
      const targetPoints = targetBond.points;
      const pointsNeeded = Math.max(0, targetPoints - currPoints);

      if (pointsNeeded === 0) {
        setResults({
          runsNeeded: 0,
          totalAP: 0,
          pointsNeeded,
          bondPerRun: 0,
          message: "Target bond level already reached!"
        });
        return;
      }

      const quest = QUEST_DATA[selectedQuest];
      const bondPerRun = Math.floor(quest.baseBond * (1 + bondBonus / 100));
      const runsNeeded = Math.ceil(pointsNeeded / bondPerRun);
      const totalAP = runsNeeded * quest.ap;

      // Calculate estimated time (assuming 1 run = 3 minutes average)
      const estimatedMinutes = runsNeeded * 3;
      const hours = Math.floor(estimatedMinutes / 60);
      const minutes = estimatedMinutes % 60;

      setResults({
        runsNeeded,
        totalAP,
        pointsNeeded,
        bondPerRun,
        questName: quest.name,
        estimatedTime: { hours, minutes },
        apPerDay: Math.floor(totalAP / (24 * 6)) // Assuming 1 AP per 6 minutes natural regen
      });
    };

    if (selectedServant && targetBond && currentBondPoints !== "") {
      calculateRuns();
    }
  }, [selectedServant, targetBond, currentBondPoints, selectedQuest, bondBonus]);

  const handleBonusChange = (e) => {
    const value = Math.max(0, Math.min(300, parseInt(e.target.value) || 0)); // Cap at 300%
    setBondBonus(value);
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
      
      <div className="runs-form">
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
          </select>
        </div>

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
      </div>

      {results && (
        <div className="results-container fade-in">
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Runs Needed:</span>
              <span className="result-value">{results.runsNeeded.toLocaleString()}</span>
            </div>
            
            <div className="result-item">
              <span className="result-label">Total AP Cost:</span>
              <span className="result-value">{results.totalAP.toLocaleString()}</span>
            </div>
            
            <div className="result-item">
              <span className="result-label">Bond per Run:</span>
              <span className="result-value">{results.bondPerRun.toLocaleString()}</span>
            </div>
            
            <div className="result-item">
              <span className="result-label">Points Needed:</span>
              <span className="result-value">{results.pointsNeeded.toLocaleString()}</span>
            </div>
            
            {results.estimatedTime && (
              <div className="result-item full-width">
                <span className="result-label">Estimated Time:</span>
                <span className="result-value">
                  {results.estimatedTime.hours > 0 && `${results.estimatedTime.hours}h `}
                  {results.estimatedTime.minutes}m
                </span>
              </div>
            )}
            
            {results.apPerDay > 0 && (
              <div className="result-item full-width">
                <span className="result-label">Days with Natural AP:</span>
                <span className="result-value">{Math.ceil(results.apPerDay)} days</span>
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