import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Fuse from "fuse.js";
import fgoLogo from "./fgo_calc_logo.png"; // adjust path if needed

function capitalizeClass(className) {
  if (!className) return "";
  return className.charAt(0).toUpperCase() + className.slice(1);
}

function App() {
  const [servants, setServants] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedServant, setSelectedServant] = useState(null);
  const [bondLevels, setBondLevels] = useState([]);
  const [currentBondPoints, setCurrentBondPoints] = useState("");
  const [targetBond, setTargetBond] = useState(null);
  const [result, setResult] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme colors
  const theme = {
    light: {
      background: "#f7f7f9",
      cardBackground: "#fff",
      textColor: "#333",
      borderColor: "#bbb",
      inputBackground: "#fff",
      selectBackground: "#fafbfc",
      resultBackground: "#eef5ff",
      resultTextColor: "#204b86"
    },
    dark: {
      background: "#1a1a1a",
      cardBackground: "#2d2d2d",
      textColor: "#e0e0e0",
      borderColor: "#555",
      inputBackground: "#3a3a3a",
      selectBackground: "#3a3a3a",
      resultBackground: "#2a3f5f",
      resultTextColor: "#a8c5ff"
    }
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      minHeight: "clamp(44px, 8vw, 52px)",
      fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
      borderRadius: "10px",
      boxShadow: "none",
      borderColor: currentTheme.borderColor,
      backgroundColor: currentTheme.inputBackground,
      marginBottom: 16,
    }),
    menu: (provided) => ({
      ...provided,
      width: "100%",
      borderRadius: "10px",
      zIndex: 9999,
      backgroundColor: currentTheme.cardBackground,
    }),
    option: (provided, state) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "clamp(1rem, 2.8vw, 1.22rem)",
      fontWeight: state.isSelected ? "bold" : "normal",
      color: state.isSelected ? "#3142b7" : currentTheme.textColor,
      background: state.isFocused ? (isDarkMode ? "#404040" : "#f4f6fa") : currentTheme.cardBackground,
      padding: "clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)",
      borderBottom: `1px solid ${isDarkMode ? "#404040" : "#f2f2f2"}`,
    }),
    singleValue: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      fontSize: "clamp(1rem, 2.8vw, 1.22rem)",
      color: currentTheme.textColor,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isDarkMode ? "#888" : "#969ca1",
      fontSize: "clamp(1rem, 2.8vw, 1.2rem)",
    }),
    input: (provided) => ({
      ...provided,
      fontSize: "clamp(1rem, 2.6vw, 1.18rem)",
      color: currentTheme.textColor,
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
    "aŋra mainiiu": { rarity: "Silver", class: "avenger" }, // Correct spelling with special character
    // Add more special cases here if needed
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
    
    // Check for special cases first (also check if name contains "aŋra" for the special character)
    if (specialCases[servantName] || servantName.includes("aŋra") || servantName.includes("mainiiu")) {
      const special = specialCases[servantName] || { rarity: "Silver", class: "avenger" };
      return `${process.env.PUBLIC_URL}/ServantClassImages/${special.rarity}/Class-${capitalizeClass(special.class)}-${special.rarity}.png`;
    }
    
    // Normal case - get rarity-appropriate icon
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
        // First fallback: try Gold version
        setCurrentSrc(getFallbackClassIcon(servant));
        setHasFailed(true);
      } else {
        // Final fallback: use emoji
        setCurrentSrc(null);
      }
    };

    if (currentSrc === null) {
      // Show emoji fallback
      return (
        <span style={{ fontSize: "clamp(1rem, 2.5vw, 1.2em)" }}>
          {getEmojiSymbol(servant.className)}
        </span>
      );
    }

    return (
      <img
        src={currentSrc}
        alt={`${servant.className} class`}
        onError={handleImageError}
        style={{
          width: "clamp(20px, 4vw, 24px)",
          height: "clamp(20px, 4vw, 24px)",
          objectFit: "contain"
        }}
      />
    );
  };

  // Fetch servants
  useEffect(() => {
    axios
      .get("https://api.atlasacademy.io/export/NA/nice_servant.json")
      .then((response) => {
        const filtered = response.data.filter(
          (servant) =>
            servant.bondGrowth &&
            servant.className &&
            !servant.collectionNo.toString().startsWith("9") && // No friend/temporary/unused
            !servant.id.toString().startsWith("99") && // No enemy-only servants like Solomon, Goetia
            !(servant.name.toLowerCase().includes("solomon") && servant.className.toLowerCase().includes("caster")) && // Extra Solomon filter
            (servant.cost > 0 || servant.className.toLowerCase() === "shielder") // Include servants with cost OR Mash (Shielder)
        );
        setServants(filtered);

        const opts = filtered.map((servant) => ({
          value: servant.collectionNo,
          label: servant.name,
          className: capitalizeClass(servant.className),
          servant: servant,
        }));
        setOptions(opts);
      });
  }, []);

  // Update bond levels when servant changes
  useEffect(() => {
    if (selectedServant && selectedServant.servant && selectedServant.servant.bondGrowth) {
      const bondGrowth = selectedServant.servant.bondGrowth;
      setBondLevels(
        bondGrowth.map((points, idx) => ({
          value: idx + 1,
          label: `Bond ${idx + 1} (${points.toLocaleString()} pts)`,
          points,
        }))
      );
      setTargetBond({
        value: 1,
        label: `Bond 1 (${bondGrowth[0].toLocaleString()} pts)`,
        points: bondGrowth[0],
      });
    } else {
      setBondLevels([]);
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

  // Format option
  const formatOptionLabel = (option) => {
    // Generate rarity stars with FGO colors
    const rarity = option.servant.rarity;
    const stars = "★".repeat(rarity || 0); // Handle case where rarity might be undefined
    
    // FGO authentic color scheme
    let starColor;
    if (!rarity || rarity <= 2) {
      starColor = "#CD7F32"; // Bronze
    } else if (rarity === 3) {
      starColor = "#C0C0C0"; // Silver
    } else {
      starColor = "#FFD700"; // Gold
    }

    return (
      <div style={{ 
        display: "flex", 
        width: "100%", 
        alignItems: "center",
        minHeight: "clamp(20px, 4vw, 24px)"
      }}>
        <span style={{ 
          width: "15%", 
          textAlign: "left",
          paddingRight: "clamp(4px, 1.5vw, 8px)",
          color: starColor,
          fontSize: "clamp(0.7rem, 2vw, 0.9em)",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
        }}>
          {stars}
        </span>
        <div style={{
          width: "1px",
          height: "clamp(16px, 3vw, 20px)",
          backgroundColor: "#ddd",
          marginRight: "clamp(4px, 1.5vw, 8px)"
        }}></div>
        <span style={{ 
          width: "75%", 
          textAlign: "left",
          paddingRight: "clamp(4px, 1.5vw, 8px)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {option.label}
        </span>
        <div style={{
          width: "1px",
          height: "clamp(16px, 3vw, 20px)",
          backgroundColor: "#ddd",
          marginRight: "clamp(4px, 1.5vw, 8px)"
        }}></div>
        <span style={{ 
          width: "calc(10% - 9px)", 
          textAlign: "right", 
          color: "#a3a3a3", 
          fontWeight: 600,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontSize: "clamp(1rem, 2.5vw, 1.2em)",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center"
        }}>
          <ClassIcon servant={option.servant} />
        </span>
      </div>
    );
  };

  // Submit calculation
  const handleCalculate = (e) => {
    e.preventDefault();
    if (!selectedServant || !bondLevels.length || !targetBond) return;

    const currPoints = parseInt(currentBondPoints.replace(/,/g, "")) || 0;
    const totalTarget = targetBond.points;
    const needed = Math.max(0, totalTarget - currPoints);

    setResult({
      needed,
      targetLabel: targetBond.label,
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: currentTheme.background,
        paddingTop: "clamp(20px, 5vw, 40px)",
        paddingBottom: "clamp(20px, 5vw, 40px)",
        paddingLeft: "clamp(10px, 3vw, 20px)",
        paddingRight: "clamp(10px, 3vw, 20px)",
        boxSizing: "border-box",
        transition: "background 0.3s ease",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          background: currentTheme.cardBackground,
          borderRadius: "clamp(16px, 4vw, 24px)",
          boxShadow: "0 8px 48px 0 rgba(30,40,90,0.13)",
          padding: "clamp(24px, 6vw, 48px) clamp(18px, 4.5vw, 36px) clamp(21px, 5.25vw, 42px) clamp(18px, 4.5vw, 36px)",
          position: "relative",
          transition: "background 0.3s ease",
        }}
      >
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            position: "absolute",
            top: "clamp(15px, 3vw, 20px)",
            right: "clamp(15px, 3vw, 20px)",
            width: "clamp(35px, 6vw, 40px)",
            height: "clamp(35px, 6vw, 40px)",
            borderRadius: "50%",
            border: `2px solid ${currentTheme.borderColor}`,
            background: currentTheme.cardBackground,
            color: currentTheme.textColor,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "clamp(14px, 2.5vw, 16px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        >
          {isDarkMode ? "☀" : "☽"}
        </button>
        {/* LOGO WITH RESPONSIVE SIZING */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "clamp(15px, 3vw, 20px)",
            marginTop: "clamp(-8px, -1.5vw, -10px)",
          }}
        >
          <img
            src={fgoLogo}
            alt="FGO Bond Level Calculator"
            style={{
              width: "clamp(280px, 70vw, 500px)",
              height: "auto",
              display: "block",
              background: "transparent",
              filter: "drop-shadow(0 4px 18px rgba(90,120,180,0.10))",
            }}
          />
        </div>

        <form onSubmit={handleCalculate}>
          <div style={{ marginBottom: "clamp(15px, 3vw, 20px)" }}>
            <label style={{ 
              fontSize: "clamp(1.1rem, 2.8vw, 1.28rem)", 
              fontWeight: 400, 
              display: "block", 
              marginBottom: "clamp(5px, 1.2vw, 7px)", 
              color: currentTheme.textColor 
            }}>
              Servant
            </label>
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
              theme={(theme) => ({
                ...theme,
                borderRadius: 10,
                spacing: {
                  ...theme.spacing,
                  controlHeight: 48,
                  baseUnit: 3,
                },
                colors: {
                  ...theme.colors,
                  primary25: "#e4e9f5",
                  primary: "#4668e9",
                  neutral10: "#e7e9f2",
                  neutral20: currentTheme.borderColor,
                  neutral30: "#888",
                },
              })}
            />
          </div>

          <div style={{ marginBottom: "clamp(15px, 3vw, 20px)" }}>
            <label style={{ 
              fontSize: "clamp(1.1rem, 2.8vw, 1.28rem)", 
              fontWeight: 400, 
              display: "block", 
              marginBottom: "clamp(5px, 1.2vw, 7px)", 
              color: currentTheme.textColor 
            }}>
              Current Cumulative Bond Points
            </label>
            <input
              type="text"
              value={currentBondPoints}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, ""); // Remove all non-digits
                const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
                setCurrentBondPoints(formatted);
              }}
              style={{
                width: "100%",
                minHeight: "clamp(44px, 8vw, 52px)",
                fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
                borderRadius: 10,
                border: `1px solid ${currentTheme.borderColor}`,
                padding: "clamp(10px, 2.5vw, 12px) clamp(14px, 3.5vw, 18px)",
                outline: "none",
                background: currentTheme.inputBackground,
                color: currentTheme.textColor,
                boxSizing: "border-box",
                transition: "all 0.3s ease",
              }}
              placeholder="0"
              inputMode="numeric"
            />
          </div>

          <div style={{ marginBottom: "clamp(18px, 4vw, 24px)" }}>
            <label style={{ 
              fontSize: "clamp(1.1rem, 2.8vw, 1.28rem)", 
              fontWeight: 400, 
              display: "block", 
              marginBottom: "clamp(5px, 1.2vw, 7px)", 
              color: currentTheme.textColor 
            }}>
              Target Bond Level
            </label>
            <select
              value={targetBond ? targetBond.value : ""}
              onChange={(e) => {
                const found = bondLevels.find((lvl) => String(lvl.value) === e.target.value);
                setTargetBond(found || null);
              }}
              style={{
                width: "100%",
                fontSize: "clamp(1rem, 2.6vw, 1.15rem)",
                borderRadius: 10,
                border: `1px solid ${currentTheme.borderColor}`,
                padding: "clamp(10px, 2.5vw, 12px) clamp(14px, 3.5vw, 18px)",
                outline: "none",
                background: currentTheme.selectBackground,
                color: currentTheme.textColor,
                transition: "all 0.3s ease",
              }}
              disabled={!bondLevels.length}
            >
              {bondLevels.length === 0 && <option value="">Select a servant first</option>}
              {bondLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              background: "#4076e9",
              color: "#fff",
              fontWeight: 700,
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              border: "none",
              borderRadius: 13,
              padding: "clamp(10px, 2.5vw, 13px) 0",
              marginTop: "clamp(8px, 2vw, 10px)",
              transition: "background 0.18s",
              cursor: "pointer",
              boxShadow: "0 2px 10px 0 rgba(30,40,90,0.10)",
            }}
            disabled={!selectedServant || !targetBond}
          >
            Calculate
          </button>
        </form>

        {result && (
          <div
            style={{
              marginTop: "clamp(20px, 5vw, 28px)",
              background: currentTheme.resultBackground,
              padding: "clamp(15px, 3.5vw, 19px) clamp(20px, 5vw, 26px)",
              borderRadius: 14,
              textAlign: "center",
              fontSize: "clamp(1.1rem, 3vw, 1.36rem)",
              fontWeight: 600,
              color: currentTheme.resultTextColor,
              boxShadow: "0 2px 9px 0 rgba(70,90,140,0.09)",
              transition: "all 0.3s ease",
            }}
          >
            Bond points needed to reach <b>{result.targetLabel}</b>:<br />
            <span style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.2rem)", fontWeight: 700 }}>
              {result.needed.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;