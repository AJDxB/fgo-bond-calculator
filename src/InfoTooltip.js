/**
 * InfoTooltip.js
 * FGO Bond Calculator - Reusable Tooltip Component
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4 - New component for click-based help tooltips with mobile responsiveness
 * @created 2025-06-16
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React, { useState, useEffect, useRef } from 'react';
import './InfoTooltip.css';

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

  return (    <span className="info-tooltip-wrapper">
      <button
        ref={tooltipRef}
        className="info-icon"
        onClick={handleClick}
        aria-expanded={isActive}
        aria-label="Help information"
      >
        ℹ
      </button>
      {isActive && <div className="tooltip-backdrop" />}
      <div className={`tooltip-content ${isActive ? 'active' : ''}`} role="tooltip">
        {text}
      </div>
    </span>
  );
};

export default InfoTooltip;
