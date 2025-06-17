/**
 * BondLevelSelector.jsx
 * 
 * Component for selecting current bond level and entering points left to next level.
 * Handles bond level dropdown and points input with validation and formatting.
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.bondLevels - Array of available bond levels
 * @param {number} props.currentBondLevel - Currently selected bond level
 * @param {Function} props.onBondLevelChange - Callback when bond level changes
 * @param {string} props.currentPointsLeft - Points left to next level (formatted string)
 * @param {Function} props.onPointsLeftChange - Callback when points left changes
 * @param {boolean} props.disabled - Whether the component is disabled
 */

import React from 'react';
import styles from './BondLevelSelector.module.css';

const BondLevelSelector = ({
  bondLevels,
  currentBondLevel,
  onBondLevelChange,
  currentPointsLeft,
  onPointsLeftChange,
  disabled = false
}) => {
  // Handle bond level selection change
  const handleBondLevelChange = (e) => {
    const newLevel = Number(e.target.value);
    onBondLevelChange(newLevel);
  };

  // Handle points left input change with formatting
  const handlePointsLeftChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    onPointsLeftChange(formatted);
  };

  // Check if points input should be disabled
  const isPointsInputDisabled = disabled || 
    !bondLevels.length || 
    currentBondLevel === bondLevels[bondLevels.length - 1]?.value;

  return (
    <div className={styles.bondRow}>
      <div className={styles.bondLevelGroup}>
        <label className="form-label">Current Bond Level</label>
        <select
          value={currentBondLevel}
          onChange={handleBondLevelChange}
          className="form-select"
          disabled={disabled || !bondLevels.length}
        >
          {bondLevels.length === 0 && (
            <option value="">Select a servant first</option>
          )}
          {bondLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.bondPointsGroup}>
        <label className="form-label">Points Left to Next Level</label>
        <input
          type="text"
          value={currentPointsLeft}
          onChange={handlePointsLeftChange}
          className="form-input"
          placeholder="0"
          inputMode="numeric"
          disabled={isPointsInputDisabled}
        />
      </div>
    </div>
  );
};

export default BondLevelSelector;
