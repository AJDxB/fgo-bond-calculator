/**
 * BondProgressDisplay.test.js
 * FGO Bond Calculator - Bond Progress Display Component Tests
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4 - Component extraction testing
 * @created 2025-06-17
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import BondProgressDisplay from './BondProgressDisplay';

// Mock servant data for testing
const mockServant = {
  id: 1,
  name: "Altria Pendragon",
  class: "Saber",
  rarity: 5
};

const mockTargetBond = {
  value: 10,
  points: 375000
};

describe('BondProgressDisplay', () => {
  test('does not render when no servant selected', () => {
    const { container } = render(
      <BondProgressDisplay
        selectedServant={null}
        currentBondLevel={1}
        targetBond={mockTargetBond}
        result={{ totalPoints: 10000 }}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('does not render when no bond level selected', () => {
    const { container } = render(
      <BondProgressDisplay
        selectedServant={mockServant}
        currentBondLevel={null}
        targetBond={mockTargetBond}
        result={{ totalPoints: 10000 }}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders bond points needed message', () => {
    render(
      <BondProgressDisplay
        selectedServant={mockServant}
        currentBondLevel={1}
        targetBond={mockTargetBond}
        result={{ totalPoints: 10000 }}
      />
    );
    
    expect(screen.getByText(/Bond points needed to reach Bond 10/)).toBeInTheDocument();
    expect(screen.getByText('10,000')).toBeInTheDocument();
  });

  test('renders congratulations message when goal reached', () => {
    render(
      <BondProgressDisplay
        selectedServant={mockServant}
        currentBondLevel={10}
        targetBond={mockTargetBond}
        result={{ totalPoints: 0 }}
      />
    );
    
    expect(screen.getByText(/Congratulations! You've reached Bond 10!/)).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('renders validation message when no valid result', () => {
    render(
      <BondProgressDisplay
        selectedServant={mockServant}
        currentBondLevel={1}
        targetBond={mockTargetBond}
        result={null}
      />
    );
    
    expect(screen.getByText('Please enter valid values above.')).toBeInTheDocument();
  });

  test('renders error message when present', () => {
    render(
      <BondProgressDisplay
        selectedServant={mockServant}
        currentBondLevel={1}
        targetBond={mockTargetBond}
        result={{ totalPoints: 10000, error: 'Something went wrong' }}
      />
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
