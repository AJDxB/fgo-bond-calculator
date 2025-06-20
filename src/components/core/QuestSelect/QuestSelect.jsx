/**
 * QuestSelect.jsx
 * FGO Bond Calculator - Quest Selection Component
 * 
 * Shared component for rendering quest option displays with AP and bond information.
 * Used across QuestModePanel and QuickListPanel for consistent quest formatting.
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4
 * @created 2025-06-20
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React from 'react';
import styles from './QuestSelect.module.css';

/**
 * QuestOption Component
 * Renders a formatted quest option with name, AP cost, and bond points
 */
const QuestOption = ({ name, ap, bond }) => (
  <div className={styles.questOption}>
    <span className={styles.questName}>{name}</span>
    <span className={styles.questAp}>{ap} AP</span>
    <span className={styles.questBond}>{bond} Bond</span>
  </div>
);

/**
 * Helper function to format quest options for Quick List
 * Maintains compatibility with existing formatQuickListOption function
 */
export const formatQuickListOption = (name, ap, bond) => (
  <QuestOption name={name} ap={ap} bond={bond} />
);

/**
 * Helper function to format quest options for Quest Mode
 * Creates quest display with JSX for React Select options
 */
export const formatQuestModeOption = (spotName, ap, bondValue) => (
  <QuestOption name={spotName} ap={ap} bond={bondValue} />
);

export default QuestOption;
