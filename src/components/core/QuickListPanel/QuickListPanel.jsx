/**
 * QuickListPanel.jsx
 * FGO Bond Calculator - Quick List Panel Component
 * 
 * Handles quest selection from predefined quick list options including
 * dailies, free quests, Bleached Earth, and event quests.
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4
 * @created 2025-06-18
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React from 'react';
import Select from 'react-select';
import styles from './QuickListPanel.module.css';

const QuickListPanel = ({ 
  quickListOptions, 
  selectedQuest, 
  onQuestChange 
}) => {
  return (
    <div className={styles.quickListPanel}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Quest List</label>
        <Select
          className="quest-select"
          classNamePrefix="quest-select"
          value={quickListOptions
            .flatMap(group => group.options)
            .find(opt => opt.value === selectedQuest) || null}
          onChange={(option) => onQuestChange(option ? option.value : '')}
          options={quickListOptions}
          styles={{
            control: (base) => ({
              ...base,
              padding: "2px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--input-bg)",
              minHeight: "42px",
              boxShadow: "none",
              "&:hover": {
                borderColor: "var(--highlight-color, #3142b7)",
              },
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              overflow: "hidden",
            }),
            menuList: (provided) => ({
              ...provided,
              padding: "4px",
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected 
                ? "var(--highlight-color, #3142b7)"
                : state.isFocused 
                  ? "var(--option-hover)"
                  : "transparent",
              color: state.isSelected ? "white" : "var(--text-color)",
              cursor: "pointer",
              padding: "8px 12px",
              "&:hover": {
                backgroundColor: "var(--option-hover)",
              },
            }),
            groupHeading: (provided) => ({
              ...provided,
              color: "var(--text-color)",
              fontWeight: "600",
              fontSize: "0.9rem",
              textTransform: "none",
              padding: "8px 12px 4px",
            }),
            input: (provided) => ({
              ...provided,
              color: "var(--text-color)",
            }),
            singleValue: (provided) => ({
              ...provided,
              color: "var(--text-color)",
            }),
            placeholder: (provided) => ({
              ...provided,
              color: "var(--text-muted, #666)",
            }),
          }}
          isSearchable
          placeholder="Select a quest..."
        />
      </div>
    </div>
  );
};

export default QuickListPanel;
