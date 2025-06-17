/**
 * App.js
 * FGO Bond Calculator - Main Application Component
 * 
 * Main calculator interface with servant selection, bond calculations,
 * runs calculator with custom points mode, and farming efficiency tools
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4 - Added Quest Mode with FGO quest data, enhanced server toggle UI
 * @created 2025-06-04
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React, { useState, useEffect } from "react";
import "./styles/theme.css";
import "./App.css";
import RunsCalculator from "./RunsCalculator";
import ServantSelector from "./components/core/ServantSelector";
import BondLevelSelector from "./components/core/BondLevelSelector";
import BondProgressDisplay from "./components/core/BondProgressDisplay";
import ServerToggle from "./components/core/ServerToggle";
import ThemeToggle from "./components/core/ThemeToggle";
import Header, { Footer } from "./components/core/Header";

function App() {
  const [selectedServant, setSelectedServant] = useState(null);
  const [bondLevels, setBondLevels] = useState([]);
  const [currentBondLevel, setCurrentBondLevel] = useState(1);
  const [currentPointsLeft, setCurrentPointsLeft] = useState("");
  const [targetBond, setTargetBond] = useState(null);
  const [result, setResult] = useState(null);
  const [isJPServer, setIsJPServer] = useState(() => {
    const saved = localStorage.getItem('fgo-calculator-jp-mode');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or default to false
    const saved = localStorage.getItem('fgo-calculator-dark-mode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Apply theme to document and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('fgo-calculator-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);  // Save JP server preference and clear data when switching
  useEffect(() => {
    localStorage.setItem('fgo-calculator-jp-mode', JSON.stringify(isJPServer));
    // Clear selected servant when switching servers
    setSelectedServant(null);
    console.log('Switched to', isJPServer ? 'JP' : 'NA', 'server');
  }, [isJPServer]);

  // Handle servants loaded from ServantSelector
  const handleServantsLoaded = (servants) => {
    console.log(`Loaded ${servants.length} ${isJPServer ? 'JP' : 'NA'} servants`);
  };

  // Update bond levels when servant changes
  useEffect(() => {
    if (selectedServant && selectedServant.servant && selectedServant.servant.bondGrowth) {
      const bondGrowth = selectedServant.servant.bondGrowth;
      // Add Bond 0 as an option for new servants
      setBondLevels([
        { value: 0, label: 'Bond 0 (0 pts)', points: 0 },
        ...bondGrowth.map((points, idx) => ({
          value: idx + 1,
          label: `Bond ${idx + 1} (${points.toLocaleString()} pts)`,
          points,
        }))
      ]);
      setCurrentBondLevel(0);
      setCurrentPointsLeft("");
      setTargetBond({
        value: 1,
        label: `Bond 1 (${bondGrowth[0].toLocaleString()} pts)`,
        points: bondGrowth[0],
      });
    } else {
      setBondLevels([]);
      setCurrentBondLevel(1);
      setCurrentPointsLeft("");
      setTargetBond(null);
    }
    setResult(null);
  }, [selectedServant]);


  // Calculate total bond points needed
  useEffect(() => {
    if (!selectedServant || currentBondLevel === null || currentBondLevel === undefined || !targetBond) {
      setResult(null);
      return;
    }

    const bondGrowth = selectedServant.servant.bondGrowth;
    const currLevelIdx = currentBondLevel;  // Current bond level (0-based index)
    const targetLevelIdx = targetBond.value; // Target bond level (0-based index)

    // If target is less than or equal to current, no points needed
    if (targetLevelIdx <= currLevelIdx) {
      setResult({ totalPoints: 0 });
      return;
    }

    // Get points left to next level (only used if points are specified)
    let pointsLeft = parseInt(currentPointsLeft.replace(/,/g, ''), 10);
    if (isNaN(pointsLeft) || pointsLeft < 0) {
      pointsLeft = 0;
    }

    // Calculate points needed based on milestone differences
    let totalPoints;
    
    if (currLevelIdx === 0) {
      // From Bond 0, we need the full first milestone
      totalPoints = bondGrowth[targetLevelIdx - 1];
    } else {
      // For levels after Bond 0, take the difference between target and current milestones
      totalPoints = bondGrowth[targetLevelIdx - 1] - bondGrowth[currLevelIdx - 1];
    }

    // If user specified remaining points, subtract what they've already earned
    if (pointsLeft > 0) {
      // Calculate what they've already earned towards next level
      const currentLevelTotal = bondGrowth[currLevelIdx - 1] || 0;
      const nextLevelTotal = bondGrowth[currLevelIdx];
      const levelDifference = nextLevelTotal - currentLevelTotal;
      const earnedPoints = levelDifference - pointsLeft;
      
      // Subtract their earned progress from the total
      totalPoints = totalPoints - earnedPoints;
    }

    setResult({
      totalPoints,
    });
  }, [selectedServant, bondLevels, targetBond, currentBondLevel, currentPointsLeft]);
  return (
    <div className="app-container">
      <div className="main-card">
        {/* Theme Toggle Component */}
        <ThemeToggle
          isDarkMode={isDarkMode}
          onThemeChange={setIsDarkMode}        />

        {/* Header Component - Logo */}
        <Header />

        {/* Server Toggle Component */}
        <ServerToggle
          isJPServer={isJPServer}
          onServerChange={setIsJPServer}
        />

        <div>
          <div className="form-group">
            <label className="form-label">Servant</label>
            <ServantSelector
              selectedServant={selectedServant}
              onServantChange={setSelectedServant}
              isJPServer={isJPServer}
              onServantsLoaded={handleServantsLoaded}
            />
          </div>          <div className="form-row bond-row">
            <BondLevelSelector
              bondLevels={bondLevels}
              currentBondLevel={currentBondLevel}
              onBondLevelChange={(newLevel) => {
                setCurrentBondLevel(newLevel);
                setCurrentPointsLeft("");
              }}
              currentPointsLeft={currentPointsLeft}
              onPointsLeftChange={setCurrentPointsLeft}
              disabled={!bondLevels.length}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Bond Level</label>
            <select
              value={targetBond ? targetBond.value : ""}
              onChange={e => {
                const found = bondLevels.find(lvl => String(lvl.value) === e.target.value);
                setTargetBond(found || null);
              }}
              className="form-select"
              disabled={!bondLevels.length}
            >
              {bondLevels.length === 0 && <option value="">Select a servant first</option>}
              {bondLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>        </div>

        {/* Bond Progress Display Component */}
        <BondProgressDisplay
          selectedServant={selectedServant}
          currentBondLevel={currentBondLevel}
          targetBond={targetBond}
          result={result}
        />

        {/* Runs Calculator Component */}
        <RunsCalculator
          selectedServant={selectedServant}
          targetBond={targetBond}
          pointsNeeded={result ? result.totalPoints : 0}        />

        {/* Footer Component */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
