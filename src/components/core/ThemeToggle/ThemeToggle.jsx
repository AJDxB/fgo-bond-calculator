/**
 * ThemeToggle.jsx
 * FGO Bond Calculator - Theme Toggle Component
 * 
 * Toggle between dark and light themes with persistent state management
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4 - Extracted from App.js for better organization
 * @created 2025-06-17
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React from 'react';
import styles from './ThemeToggle.module.css';

const ThemeToggle = ({
  isDarkMode,
  onThemeChange
}) => {
  return (
    <button
      onClick={() => onThemeChange(!isDarkMode)}
      className={styles.themeToggle}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? "☀" : "☽"}
    </button>
  );
};

export default ThemeToggle;
