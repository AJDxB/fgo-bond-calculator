/**
 * useQuestData.js
 * FGO Bond Calculator - Quest Data Loading Hook
 * 
 * Custom hook for loading and filtering FGO quest data from the API.
 * Handles loading states, error management, and quest filtering logic.
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4
 * @created 2025-06-20
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook for loading quest data
 * @returns {Object} - { filteredQuests, isLoading, error, selectedQuestId, setSelectedQuestId }
 */
const useQuestData = () => {
  const [filteredQuests, setFilteredQuests] = useState([]);
  const [selectedQuestId, setSelectedQuestId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Handle both development and production environments
        const publicUrl = process.env.PUBLIC_URL || '';
        const response = await fetch(`${publicUrl}/quests.json`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter quests: afterClear "repeatLast"/"resetInterval", consumeType "ap", questType "free"
        const filtered = data.filter(quest => 
          quest.questType === "free" &&
          quest.consumeType === "ap" &&
          (quest.afterClear === "repeatLast" || quest.afterClear === "resetInterval")
        );
        
        setFilteredQuests(filtered);
        
        // Set default selection to first quest if available
        if (filtered.length > 0) {
          setSelectedQuestId(`${filtered[0].questId}`);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading quest data:', error);
        setError(error.message);
        setFilteredQuests([]);
        setIsLoading(false);
      }
    };

    loadQuestData();
  }, []);

  return {
    filteredQuests,
    isLoading,
    error,
    selectedQuestId,
    setSelectedQuestId
  };
};

export default useQuestData;
