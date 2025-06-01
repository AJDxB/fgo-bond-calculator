# FGO Bond Level Calculator

[![GitHub stars](https://img.shields.io/github/stars/AJDxB/fgo-bond-calculator?style=flat-square)](https://github.com/AJDxB/fgo-bond-calculator/stargazers)
[![GitHub license](https://img.shields.io/github/license/AJDxB/fgo-bond-calculator?style=flat-square)](https://github.com/AJDxB/fgo-bond-calculator/blob/main/LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/AJDxB/fgo-bond-calculator?style=flat-square)](https://github.com/AJDxB/fgo-bond-calculator/commits/main)
[![Issues](https://img.shields.io/github/issues/AJDxB/fgo-bond-calculator?style=flat-square)](https://github.com/AJDxB/fgo-bond-calculator/issues)

## Overview

A React web app for Fate/Grand Order players to calculate bond points needed to reach target bond levels.

**Live Demo:** [https://ajdxb.github.io/fgo-bond-calculator](https://ajdxb.github.io/fgo-bond-calculator)

Data provided by [Atlas Academy](https://atlasacademy.io/).

## Features

- Bond point calculation for all FGO servants
- Fuzzy search for servant selection
- Dark/light mode toggle
- Class icons and rarity stars
- Filters out enemy-only and temporary servants
- Responsive design

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
4. Click "Calculate" to see required bond points

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