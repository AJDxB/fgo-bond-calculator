# FGO Bond Level Calculator

[![GitHub stars](https://img.shields.io/github/stars/AJDxB/fgo-bond-calculator?style=flat-square)](https://github.com/AJDxB/fgo-bond-calculator/stargazers)
[![GitHub license](https://img.shields.io/github/license/AJDxB/fgo-bond-calculator?style=flat-square)](https://github.com/AJDxB/fgo-bond-calculator/blob/main/LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/AJDxB/fgo-bond-calculator?style=flat-square)](https://github.com/AJDxB/fgo-bond-calculator/commits/main)
[![Issues](https://img.shields.io/github/issues/AJDxB/fgo-bond-calculator?style=flat-square)](https://github.com/AJDxB/fgo-bond-calculator/issues)

## Overview

A React web app for Fate/Grand Order players to calculate bond points needed to reach target bond levels and plan quest runs efficiently.

**Live Demo:** [FGO Bond Calculator](https://ajdxb.github.io/fgo-bond-calculator)

Data provided by [Atlas Academy](https://atlasacademy.io/).

## Features

- Bond point calculation for all FGO servants
- Real-time quest runs calculator for farming efficiency
- Fuzzy search for servant selection
- Dark/light mode toggle with persistent preference
- Bond bonus calculation for CEs and event bonuses
- Multiple quest types with AP costs and time estimates
- Filters out enemy-only and temporary servants
- Fully responsive design for mobile and desktop
- Local servant data loaded from `public/servants.json` for fast, reliable access
- Automated servant data updates via GitHub Actions workflow (twice daily)
- Custom Points mode to Runs Calculator for flexible farming calculations

## Getting Started

### Requirements

- Node.js and npm

### Installation

```bash
git clone https://github.com/AJDxB/fgo-bond-calculator.git
cd fgo-bond-calculator
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

```bash
npm run deploy
```

## Usage

1. Select a servant from the dropdown
2. Enter your current cumulative bond points
3. Select your target bond level
4. View automatic calculation results and quest runs needed
5. Adjust quest type and bond bonuses for optimal farming strategy

## License

This project is licensed under the MIT License.  
See the LICENSE file for details.

## Contributing

Contributions, issues, and suggestions are welcome.

## Acknowledgments

- [Atlas Academy](https://atlasacademy.io/) for FGO data API
- React team for the frontend framework
- FGO community for inspiration and feedback

## Changelog

### v0.3.2 - Major Quest Data, Bonus, and UI Overhaul
- Replaced and improved quest data and quest selection UI in Runs Calculator
- Added Heroic Portrait bonus and Frontline Bonus (multiplicative) with styled UI and multiplier dropdowns
- Various bugfixes and consistency improvements for quest, bonus, and calculation logic

### v0.3.1 - Local Data, Custom Points & UI Enhancements
- Added Custom Points mode to Runs Calculator for flexible farming calculations
- Switched to local servant data (`public/servants.json`) for faster and more reliable access
- Added GitHub Actions workflow for automated data updates
- Optimized data size by storing only required fields

### v0.3.0 - Runs to Max Calculator & Auto-calculations
- Added quest runs calculator with multiple quest types
- Implemented automatic calculations without manual button clicks
- Added bond bonus calculation for CEs and event bonuses
- Enhanced result display with quest efficiency metrics
- Added persistent dark/light mode preference using localStorage
- Improved code organization by separating CSS from JavaScript
- Added goal reached detection with enhanced visual feedback

### v0.2.2 - Responsive Design & Image Fixes
- Implemented fully responsive design using CSS clamp() functions
- Fixed class icon paths for GitHub Pages deployment
- Added proper mobile scaling while maintaining desktop appearance
- Fixed desktop centering issues with flexbox layout
- Enhanced image fallback system with emoji alternatives

### v0.2.1 - Deployment Improvements
- Updated site title and favicon
- Improved metadata for web deployment

### v0.2.0 - UI Overhaul and Enhanced Search
- Added dark/light mode toggle
- Implemented fuzzy search for servants
- Smart filtering of unplayable servants
- Enhanced UI with class icons and rarity stars
- Improved spacing and typography

### v0.1.0 - Initial Release
- Basic bond point calculation
- Servant selection dropdown
- Responsive design