/**
 * ServerToggle.jsx
 * FGO Bond Calculator - Server Toggle Component
 * 
 * Toggle between NA and JP servers with persistent state management
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4 - Extracted from App.js for better organization
 * @created 2025-06-17
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React from 'react';
import styles from './ServerToggle.module.css';

const ServerToggle = ({
  isJPServer,
  onServerChange
}) => {
  return (
    <div className={styles.serverToggle}>
      <button 
        onClick={() => onServerChange(false)}
        className={`${styles.serverBtn} ${!isJPServer ? styles.active : ''}`}
      >
        NA Server
      </button>
      <button 
        onClick={() => onServerChange(true)}
        className={`${styles.serverBtn} ${isJPServer ? styles.active : ''}`}
      >
        JP Server
      </button>
    </div>
  );
};

export default ServerToggle;
