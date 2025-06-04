/**
 * App.js
 * FGO Bond Calculator - Main Application Component
 * 
 * Main calculator interface with servant selection, bond calculations,
 * runs calculator with custom points mode, and farming efficiency tools
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.1 - Added Custom Points mode, local data, and improved documentation
 * @created 2025-06-04
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Fuse from "fuse.js";
import fgoLogo from "./fgo_calc_logo.png";
import saintQuartzIcon from "./saintquartz.png";
import RunsCalculator from "./RunsCalculator";
import "./App.css";

function capitalizeClass(className) {
  if (!className) return "";
  return className.charAt(0).toUpperCase() + className.slice(1);
}

function App() {
  const [servants, setServants] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedServant, setSelectedServant] = useState(null);
  const [bondLevels, setBondLevels] = useState([]);
  const [currentBondLevel, setCurrentBondLevel] = useState(1);
  const [currentPointsLeft, setCurrentPointsLeft] = useState("");
  const [targetBond, setTargetBond] = useState(null);
  const [result, setResult] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or default to false
    const saved = localStorage.getItem('fgo-calculator-dark-mode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Apply theme to document and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('fgo-calculator-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Custom styles for react-select (keeping these as they're component-specific)
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      minHeight: "clamp(44px, 8vw, 52px)",
      fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
      borderRadius: "10px",
      boxShadow: "none",
      borderColor: "var(--border-color)",
      backgroundColor: "var(--input-bg)",
      marginBottom: 16,
    }),
    menu: (provided) => ({
      ...provided,
      width: "100%",
      borderRadius: "10px",
      zIndex: 9999,
      backgroundColor: "var(--card-bg)",
    }),
    option: (provided, state) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "clamp(1rem, 2.8vw, 1.22rem)",
      fontWeight: state.isSelected ? "bold" : "normal",
      color: state.isSelected ? "#3142b7" : "var(--text-color)",
      background: state.isFocused ? "var(--option-hover)" : "var(--card-bg)",
      padding: "clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)",
      borderBottom: "1px solid var(--divider-color)",
    }),
    singleValue: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      fontSize: "clamp(1rem, 2.8vw, 1.22rem)",
      color: "var(--text-color)",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "var(--placeholder-color)",
      fontSize: "clamp(1rem, 2.8vw, 1.2rem)",
    }),
    input: (provided) => ({
      ...provided,
      fontSize: "clamp(1rem, 2.6vw, 1.18rem)",
      color: "var(--text-color)",
    }),
  };

  // Fuzzy search config
  const fuse = new Fuse(servants, {
    keys: ["name", "className"],
    threshold: 0.28,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });

  // Special cases for servants with specific icon requirements
  const specialCases = {
    "angra mainyu": { rarity: "Silver", class: "avenger" },
    "anjra mainiiu": { rarity: "Silver", class: "avenger" },
    "angra mainiyu": { rarity: "Silver", class: "avenger" },
    "aŋra mainiiu": { rarity: "Silver", class: "avenger" },
  };

  // Helper function to get rarity folder name
  const getRarityFolder = (rarity) => {
    if (rarity <= 2) return "Bronze";
    if (rarity === 3) return "Silver";
    return "Gold";
  };

  // Helper function to get class icon with fallback
  const getClassIcon = (servant) => {
    const className = servant.className.toLowerCase();
    const servantName = servant.name.toLowerCase();
    
    if (specialCases[servantName] || servantName.includes("aŋra") || servantName.includes("mainiiu")) {
      const special = specialCases[servantName] || { rarity: "Silver", class: "avenger" };
      return `${process.env.PUBLIC_URL}/ServantClassImages/${special.rarity}/Class-${capitalizeClass(special.class)}-${special.rarity}.png`;
    }
    
    const rarityFolder = getRarityFolder(servant.rarity);
    const capitalizedClass = capitalizeClass(className);
    
    return `${process.env.PUBLIC_URL}/ServantClassImages/${rarityFolder}/Class-${capitalizedClass}-${rarityFolder}.png`;
  };

  // Helper function to get fallback class icon (Gold version)
  const getFallbackClassIcon = (servant) => {
    const className = servant.className.toLowerCase();
    const capitalizedClass = capitalizeClass(className);
    return `${process.env.PUBLIC_URL}/ServantClassImages/Gold/Class-${capitalizedClass}-Gold.png`;
  };

  // Helper function to get emoji fallback
  const getEmojiSymbol = (className) => {
    const symbols = {
      'saber': '⚔️',
      'archer': '🏹',
      'lancer': '🔱',
      'rider': '🐎',
      'caster': '✨',
      'assassin': '🗡️',
      'berserker': '💥',
      'ruler': '⚖️',
      'avenger': '🔥',
      'mooncancer': '🌙',
      'alterego': '👥',
      'foreigner': '🌌',
      'pretender': '🎭',
      'shielder': '🛡️',
      'beast': '👹',
      'loregrandcaster': '📚'
    };
    return symbols[className.toLowerCase()] || '❓';
  };

  // Component for class icon with fallback handling
  const ClassIcon = ({ servant }) => {
    const [currentSrc, setCurrentSrc] = useState(getClassIcon(servant));
    const [hasFailed, setHasFailed] = useState(false);

    const handleImageError = () => {
      if (!hasFailed) {
        setCurrentSrc(getFallbackClassIcon(servant));
        setHasFailed(true);
      } else {
        setCurrentSrc(null);
      }
    };

    if (currentSrc === null) {
      return <span className="class-emoji">{getEmojiSymbol(servant.className)}</span>;
    }

    return (
      <img
        src={currentSrc}
        alt={`${servant.className} class`}
        onError={handleImageError}
        className="class-icon"
      />
    );
  };
  // Fetch servants from local file
  useEffect(() => {
    let isMounted = true;    const fetchLocalServants = async () => {
      try {
        const url = "servants.json";
        console.log('Fetching from:', url);
        const response = await axios.get(url);
        console.log('Data received:', response.data ? 'yes' : 'no');
        const filtered = response.data.filter(
          (servant) =>
            servant.bondGrowth &&
            servant.className &&
            !servant.collectionNo.toString().startsWith("9") &&
            !servant.id.toString().startsWith("99") &&
            !(servant.name.toLowerCase().includes("solomon") && servant.className.toLowerCase().includes("caster")) &&
            (servant.cost > 0 || servant.className.toLowerCase() === "shielder")
        );
        console.log('Filtered servants:', filtered.length);
        if (isMounted) {
          setServants(filtered);
          setOptions(
            filtered.map((servant) => ({
              value: servant.collectionNo,
              label: servant.name,
              className: capitalizeClass(servant.className),
              servant: servant,
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching servants:', err);
        setServants([]);
        setOptions([]);
      }
    };
    fetchLocalServants();
    return () => {
      isMounted = false;
    };
  }, []);

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

  // Fuzzy search for servants
  const handleInputChange = (inputValue) => {
    if (!inputValue) {
      setOptions(
        servants.map((servant) => ({
          value: servant.collectionNo,
          label: servant.name,
          className: capitalizeClass(servant.className),
          servant: servant,
        }))
      );
      return;
    }
    const results = fuse.search(inputValue);
    setOptions(
      results.map(({ item }) => ({
        value: item.collectionNo,
        label: item.name,
        className: capitalizeClass(item.className),
        servant: item,
      }))
    );
  };

  // Format option with CSS classes
  const formatOptionLabel = (option) => {
    const rarity = option.servant.rarity;
    const stars = "★".repeat(rarity || 0);
    
    let starClass = "option-stars ";
    if (!rarity || rarity <= 2) {
      starClass += "bronze";
    } else if (rarity === 3) {
      starClass += "silver";
    } else {
      starClass += "gold";
    }

    return (
      <div className="option-container">
        <span className={starClass}>{stars}</span>
        <div className="option-divider"></div>
        <span className="option-name">{option.label}</span>
        <div className="option-divider"></div>
        <span className="option-class">
          <ClassIcon servant={option.servant} />
        </span>
      </div>
    );
  };

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
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="theme-toggle"
        >
          {isDarkMode ? "☀" : "☽"}
        </button>

        <div className="logo-container">
          <img
            src={fgoLogo}
            alt="FGO Bond Level Calculator"
            className="logo"
          />
        </div>

        <div>
          <div className="form-group">
            <label className="form-label">Servant</label>
            <Select
              styles={customStyles}
              isSearchable
              placeholder="Type to search and select a servant..."
              options={options}
              value={selectedServant}
              onChange={setSelectedServant}
              onInputChange={handleInputChange}
              formatOptionLabel={formatOptionLabel}
              noOptionsMessage={() => "No servants found"}
            />
          </div>

          <div className="form-row bond-row">
            <div className="form-group bond-level-group">
              <label className="form-label">Current Bond Level</label>
              <select
                value={currentBondLevel}
                onChange={e => {
                  setCurrentBondLevel(Number(e.target.value));
                  setCurrentPointsLeft("");
                }}
                className="form-select"
                disabled={!bondLevels.length}
              >
                {bondLevels.length === 0 && <option value="">Select a servant first</option>}
                {bondLevels.map((level, idx) => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group bond-points-group">
              <label className="form-label">Points Left to Next Level</label>
              <input
                type="text"
                value={currentPointsLeft}
                onChange={e => {
                  const value = e.target.value.replace(/[^\d]/g, "");
                  const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  setCurrentPointsLeft(formatted);
                }}
                className="form-input"
                placeholder="0"
                inputMode="numeric"
                disabled={!bondLevels.length || currentBondLevel === bondLevels[bondLevels.length-1]?.value}
              />
            </div>
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
          </div>
        </div>        {/* Always show result section if servant and bond level are selected */}
        {selectedServant && currentBondLevel !== null && currentBondLevel !== undefined && (
          <div className="result-section">
            {result && result.totalPoints !== null && result.totalPoints !== undefined ? (
              <div className={`result-box ${result.totalPoints === 0 ? 'goal-reached' : ''}`}>
                <div className="result-description">
                  {result.totalPoints === 0 
                    ? `Congratulations! You've reached Bond ${targetBond?.value}!`
                    : `Bond points needed to reach Bond ${targetBond?.value} (${targetBond?.points?.toLocaleString()} pts):`
                  }
                </div>
                <div className="result-value">
                  {result.totalPoints.toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="result-row">Please enter valid values above.</div>
            )}
          </div>
        )}
        {result && result.error && (
          <div className="error-message">{result.error}</div>
        )}

        {/* Runs Calculator Component */}        <RunsCalculator 
          selectedServant={selectedServant}
          targetBond={targetBond}
          pointsNeeded={result ? result.totalPoints : 0}
        />

        <footer className="footer-credit">
          Made with <img
            src={saintQuartzIcon}
            alt="Saint Quartz"
            className="footer-icon"
            aria-hidden="true"
          /> by <a href="https://github.com/AJDxB" target="_blank" rel="noopener noreferrer">AJDxB</a>
          <span className="footer-separator"> | </span>
          <span className="footer-version">v0.3.1</span>
        </footer>
      </div>
    </div>
  );
}

export default App;