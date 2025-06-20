/**
 * InfoTooltip.jsx
 * FGO Bond Calculator - Reusable Tooltip Component
 * 
 * Interactive tooltip component with click-based activation and mobile responsiveness.
 * Migrated to /components/ui/ with CSS modules for better organization.
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4 - Migrated to CSS modules and UI component directory
 * @created 2025-06-16
 * @updated 2025-06-20
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React, { useState, useEffect, useRef } from 'react';
import styles from './InfoTooltip.module.css';

const InfoTooltip = ({ text }) => {
  const [isActive, setIsActive] = useState(false);
  const tooltipRef = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
    setIsActive(!isActive);
  };

  const handleClickOutside = (e) => {
    if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    if (isActive) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isActive]);

  return (
    <span className={styles.infoTooltipWrapper}>
      <button
        ref={tooltipRef}
        className={styles.infoIcon}
        onClick={handleClick}
        aria-expanded={isActive}
        aria-label="Help information"
      >
        ℹ
      </button>
      {isActive && <div className={styles.tooltipBackdrop} />}
      <div className={`${styles.tooltipContent} ${isActive ? styles.active : ''}`} role="tooltip">
        {text}
      </div>
    </span>
  );
};

export default InfoTooltip;
