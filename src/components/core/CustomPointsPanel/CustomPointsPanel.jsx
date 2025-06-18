/**
 * CustomPointsPanel.jsx
 * FGO Bond Calculator - Custom Points Panel Component
 * 
 * Handles custom bond points and AP input fields for manual quest configuration.
 * Includes number formatting and validation for user inputs.
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4
 * @created 2025-06-18
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React from 'react';
import styles from './CustomPointsPanel.module.css';

const CustomPointsPanel = ({ 
  customBondPoints, 
  onCustomBondPointsChange, 
  customAP, 
  onCustomAPChange 
}) => {
  return (
    <div className={styles.customPointsPanel}>
      <div className={styles.customInputsRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Bond Points per Run</label>
          <input
            type="text"
            value={customBondPoints}
            onChange={onCustomBondPointsChange}
            className={styles.formInput}
            placeholder="Enter bond points"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>AP Cost per Run</label>
          <input
            type="text"
            value={customAP}
            onChange={onCustomAPChange}
            className={styles.formInput}
            placeholder="Enter AP cost"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomPointsPanel;
