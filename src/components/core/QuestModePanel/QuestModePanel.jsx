/**
 * QuestModePanel.jsx
 * FGO Bond Calculator - Quest Mode Panel Component
 * 
 * Handles quest selection in Quest Mode with search and filtering capabilities.
 * Includes the React Select dropdown with custom styling and quest data formatting.
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4
 * @created 2025-06-18
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React from 'react';
import Select from 'react-select';
import styles from './QuestModePanel.module.css';

const QuestModePanel = ({ 
  questOptions, 
  selectedQuestFromData, 
  onQuestChange, 
  filteredQuests 
}) => {
  return (
    <div className={styles.questModePanel}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Free Quests</label>
        <Select
          className="quest-select"
          classNamePrefix="quest-select"
          value={questOptions
            .flatMap(group => group.options)
            .find(opt => opt.value === selectedQuestFromData.toString()) || null}
          onChange={(option) => onQuestChange(option ? option.value : '')}
          options={questOptions}
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
          placeholder={filteredQuests.length === 0 ? "Loading quests..." : "Search for a quest..."}
          isDisabled={filteredQuests.length === 0}
          noOptionsMessage={() => "No quests found"}
        />
      </div>
    </div>
  );
};

export default QuestModePanel;
