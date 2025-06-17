/**
 * BondProgressDisplay.jsx
 * FGO Bond Calculator - Bond Progress Display Component
 * 
 * Displays bond calculation results, progress towards target bond level,
 * and congratulations messages when goals are reached
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4 - Extracted from App.js for better organization
 * @created 2025-06-17
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React from 'react';
import styles from './BondProgressDisplay.module.css';

const BondProgressDisplay = ({
  selectedServant,
  currentBondLevel,
  targetBond,
  result
}) => {
  // Don't render if no servant or bond level selected
  if (!selectedServant || currentBondLevel === null || currentBondLevel === undefined) {
    return null;
  }

  return (
    <div className={styles.resultSection}>
      {result && result.totalPoints !== null && result.totalPoints !== undefined ? (
        <div className={`${styles.resultBox} ${result.totalPoints === 0 ? styles.goalReached : ''}`}>
          <div className={styles.resultDescription}>
            {result.totalPoints === 0 
              ? `Congratulations! You've reached Bond ${targetBond?.value}!`
              : `Bond points needed to reach Bond ${targetBond?.value} (${targetBond?.points?.toLocaleString()} pts):`
            }
          </div>
          <div className={styles.resultValue}>
            {result.totalPoints.toLocaleString()}
          </div>
        </div>
      ) : (
        <div className={styles.resultRow}>Please enter valid values above.</div>
      )}
      
      {result && result.error && (
        <div className={styles.errorMessage}>{result.error}</div>
      )}
    </div>
  );
};

export default BondProgressDisplay;
