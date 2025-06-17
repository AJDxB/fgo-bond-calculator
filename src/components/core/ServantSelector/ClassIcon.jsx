/**
 * ClassIcon.jsx
 * FGO Bond Calculator - Class Icon Component
 * 
 * Displays servant class icons with fallback handling
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4
 * @created 2025-06-16
 */

import React, { useState } from 'react';

function capitalizeClass(className) {
  if (!className) return "";
  const specialCases = {
    mooncancer: "MoonCancer",
    alterego: "AlterEgo",
    pretender: "Pretender",
    shielder: "Shielder",
    ruler: "Ruler",
    avenger: "Avenger",
    beast: "Beast",
    beastEresh: "Beast",
    foreigner: "Foreigner",
    saber: "Saber",
    archer: "Archer",
    lancer: "Lancer",
    rider: "Rider",
    caster: "Caster",
    assassin: "Assassin",
    berserker: "Berserker",
    loregrandcaster: "LoreGrandCaster"
  };
  return specialCases[className.toLowerCase()] || (className.charAt(0).toUpperCase() + className.slice(1));
}

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
  
  // Handle beast-related classes first
  if (className === 'beasteresh' || className.startsWith('beast')) {
    const rarityFolder = getRarityFolder(servant.rarity);
    return `${process.env.PUBLIC_URL}/ServantClassImages/${rarityFolder}/Class-Beast-${rarityFolder}.png`;
  }
  
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
export const ClassIcon = ({ servant }) => {
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
