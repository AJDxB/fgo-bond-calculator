/**
 * Header.jsx
 * FGO Bond Calculator - Header Component
 * 
 * Displays application logo and footer with credits and version information
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4 - Extracted from App.js for better organization
 * @created 2025-06-17
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React from 'react';
import fgoLogo from '../../../assets/images/fgo_calc_logo.png';
import saintQuartzIcon from '../../../assets/images/saintquartz.png';
import styles from './Header.module.css';

const Header = () => {
  return (
    <div className={styles.logoContainer}>
      <img
        src={fgoLogo}
        alt="FGO Bond Level Calculator"
        className={styles.logo}
      />
    </div>
  );
};

const Footer = () => {
  return (
    <footer className={styles.footerCredit}>
      Made with <img
        src={saintQuartzIcon}
        alt="Saint Quartz"
        className={styles.footerIcon}
        aria-hidden="true"
      /> by <a href="https://github.com/AJDxB" target="_blank" rel="noopener noreferrer">AJDxB</a>
      <span className={styles.footerSeparator}> | </span>
      <span className={styles.footerVersion}>v0.3.4</span>
    </footer>
  );
};

export default Header;
export { Footer };
