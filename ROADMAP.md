# FGO Bond Calculator - Technical Roadmap

## 🎯 Project Vision
Transform the FGO Bond Calculator from a monolithic React application into a modern, maintainable, and scalable codebase through systematic refactoring and technology upgrades.

---

## 📍 Current Status (Phase 2A - Mostly Complete)

### ✅ **Completed Phases:**
- **Phase 1:** Component Extraction (6 components extracted)
- **Phase 2A:** RunsCalculator Modularization (4 subcomponents + CSS consistency system)

### 📊 **Current Metrics:**
- **App.js:** 62% reduction (580 → 221 lines)
- **RunsCalculator.js:** 24% reduction (792 → 595 lines) *updated*
- **Files Created:** 39+ new organized files *updated*
- **Shared Components:** 1 (QuestSelect) *new*
- **Functionality:** 100% preserved (zero breaking changes)

---

## 🗺️ Migration Strategy & Timeline

### **ARCHITECTURAL DECISION (2025-06-20)**
**Optimal Migration Path:** Component Extraction → TypeScript → CSS-in-JS

**Rationale:** 
- Smaller, focused components are easier to type
- TypeScript migration benefits from organized structure
- CSS-in-JS leverages full TypeScript integration

---

## 📋 Phase Breakdown

### **🔄 Phase 2B: Component Organization (Next - Q3 2025)**
**Goal:** Complete component extraction and establish clean architecture

#### Immediate Priorities:
1. **✅ QuestSelect Component Extraction (COMPLETED 2025-06-20)**
   - ✅ Extracted shared QuestSelect component from panels
   - ✅ Migrated QuestSelect.css to CSS module
   - ✅ Updated panels to use shared component
   - ✅ Reduced code duplication and improved maintainability

2. **InfoTooltip Migration** 🎯 *Next Priority*
   - Move to `/components/ui/InfoTooltip/`
   - Convert to CSS module
   - Add comprehensive tests

3. **Asset Organization**
   - Consolidate `/assets/images/` directory
   - Organize class icons
   - Update import paths

#### Secondary Tasks:
- Extract custom hooks (useServantData, useBondCalculations)
- Create utility functions (bondCalculations.js, formatters.js)
- Establish services layer (servantService, questService)

---

### **🎯 Phase 3: TypeScript Migration (Q4 2025)**
**Goal:** Add type safety and improved developer experience

#### Migration Strategy:
1. **Setup TypeScript Configuration**
   - Add TypeScript dependencies
   - Configure tsconfig.json
   - Setup build pipeline

2. **Incremental Component Conversion**
   - Convert extracted components (.jsx → .tsx)
   - Define PropTypes → TypeScript interfaces
   - Type API responses and data structures

3. **Type Safety Improvements**
   - Servant data interfaces
   - Quest data interfaces
   - Calculation result types
   - Event handler types

#### Expected Benefits:
- Better IDE support and autocomplete
- Compile-time error detection
- Improved refactoring safety
- Enhanced documentation through types

---

### **🎨 Phase 4: CSS-in-JS Migration (Q1 2026)**
**Goal:** Modern styled-components with full TypeScript integration

#### Technology Choice:
- **styled-components** with TypeScript support
- Runtime theming capabilities
- Component-scoped styling

#### Migration Approach:
1. **Theme System Enhancement**
   - TypeScript theme interfaces
   - Runtime theme switching
   - CSS custom properties → TS theme objects

2. **Component Styling Migration**
   - CSS modules → styled-components
   - Global styles → theme providers
   - Responsive design with TS helpers

3. **Advanced Features**
   - Dynamic styling based on props
   - Animation libraries integration
   - Performance optimizations

---

### **🚀 Phase 5: Advanced Features (Q2+ 2026)**
**Goal:** Modern React patterns and enhanced user experience

#### Technical Improvements:
- **State Management:** Context API → Zustand/Redux Toolkit
- **Data Fetching:** React Query implementation
- **Performance:** React.memo, useMemo, virtual scrolling
- **Testing:** Comprehensive test suite (unit, integration, E2E)

#### User Experience:
- **PWA Implementation:** Offline support, caching
- **Accessibility:** WCAG 2.1 AA compliance
- **Internationalization:** Multi-language support
- **Mobile Experience:** Touch-optimized interactions

---

## 🔧 Technical Architecture Goals

### **Component Structure:**
```
/src
  /components
    /core         # Extracted components (✅ Done - 4 components)
      /QuestSelect      # ✅ NEW! Shared quest formatting (2025-06-20)
      /QuestModePanel   # ✅ Quest database selection
      /CustomPointsPanel# ✅ Manual input panel  
      /QuickListPanel   # ✅ Predefined quest dropdown
    /ui           # Reusable UI components (⏳ In Progress)
    /layout       # Layout components (📋 Planned)
  /hooks          # Custom React hooks (📋 Planned)
  /utils          # Pure utility functions (📋 Planned)
  /services       # API and data services (📋 Planned)
  /types          # TypeScript definitions (🎯 Phase 3)
  /styles         # Theme and global styles (✅ Enhanced)
```

### **Code Quality Standards:**
- **Linting:** ESLint + TypeScript rules
- **Formatting:** Prettier integration
- **Testing:** Jest + React Testing Library + Playwright
- **Git Hooks:** Pre-commit linting and testing
- **Documentation:** JSDoc → TypeScript interfaces

---

## 📈 Success Metrics

### **Technical Metrics:**
- **Bundle Size:** Monitor and optimize
- **Performance:** Core Web Vitals compliance
- **Test Coverage:** >90% for critical paths
- **Type Coverage:** >95% TypeScript coverage

### **Developer Experience:**
- **Build Time:** <30 seconds for development builds
- **Hot Reload:** <2 seconds for component changes
- **Error Detection:** Compile-time vs runtime error ratio
- **IDE Performance:** Intellisense response time

### **User Experience:**
- **Load Time:** <3 seconds initial load
- **Interaction:** <100ms response to user actions
- **Accessibility:** WCAG 2.1 AA score
- **Mobile:** Responsive design across devices

---

## 🛡️ Risk Mitigation

### **Technical Risks:**
- **Breaking Changes:** Incremental migration with extensive testing
- **Performance Regression:** Monitoring and rollback strategies
- **TypeScript Learning Curve:** Gradual adoption with training

### **Mitigation Strategies:**
- **Git Branching:** Feature branches with thorough review
- **Backup Strategy:** Regular commits and remote backups
- **Testing Strategy:** Automated testing at each phase
- **Documentation:** Comprehensive migration guides

---

## 📚 Learning Resources

### **TypeScript Migration:**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Migrating to TypeScript Guide](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)

### **CSS-in-JS:**
- [styled-components Documentation](https://styled-components.com/docs)
- [TypeScript with styled-components](https://styled-components.com/docs/api#typescript)

### **Modern React Patterns:**
- [React Patterns](https://reactpatterns.com/)
- [React Performance](https://react.dev/learn/render-and-commit)

---

## 📞 Contact & Contribution

**Maintainer:** AJDxB (ajdxb4787@gmail.com)
**Repository:** [GitHub - fgo-bond-calculator](https://github.com/AJDxB/fgo-bond-calculator)
**Branch:** clean-up (active development)

**Last Updated:** 2025-06-20
**Next Review:** After Phase 2B completion

---

## 📈 Recent Achievements (2025-06-20)

### ✅ **QuestSelect Component Extraction - SUCCESS!**
**Impact:** Eliminated code duplication and created first shared component

**Technical Details:**
- **Files Created:** 3 new files (`QuestSelect.jsx`, `QuestSelect.module.css`, `index.js`)
- **Code Reduction:** ~50 lines removed from `RunsCalculator.js` 
- **Shared Functions:** `formatQuickListOption()`, `formatQuestModeOption()`
- **CSS Migration:** Global `QuestSelect.css` → CSS module
- **Zero Breaking Changes:** 100% functionality preserved

**Architecture Benefits:**
- **DRY Principle:** Quest formatting now centralized
- **Maintainability:** Single source of truth for quest displays
- **Reusability:** Component can be used across any panel
- **Consistency:** Unified quest option styling

**Next Target:** InfoTooltip component migration

---
