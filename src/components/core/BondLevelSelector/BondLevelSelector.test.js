/**
 * BondLevelSelector Component Tests
 * 
 * Tests for the BondLevelSelector component functionality including:
 * - Bond level selection
 * - Points input formatting
 * - Disabled states
 * - Event handlers
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BondLevelSelector from './BondLevelSelector';

// Mock bond levels data
const mockBondLevels = [
  { value: 0, label: 'Bond 0 (0 pts)', points: 0 },
  { value: 1, label: 'Bond 1 (1,000 pts)', points: 1000 },
  { value: 2, label: 'Bond 2 (2,500 pts)', points: 2500 },
  { value: 3, label: 'Bond 3 (4,500 pts)', points: 4500 },
];

describe('BondLevelSelector', () => {
  const defaultProps = {
    bondLevels: mockBondLevels,
    currentBondLevel: 1,
    onBondLevelChange: jest.fn(),
    currentPointsLeft: '',
    onPointsLeftChange: jest.fn(),
    disabled: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders bond level selector and points input', () => {
    render(<BondLevelSelector {...defaultProps} />);
    
    expect(screen.getByLabelText('Current Bond Level')).toBeInTheDocument();
    expect(screen.getByLabelText('Points Left to Next Level')).toBeInTheDocument();
  });

  test('displays bond level options correctly', () => {
    render(<BondLevelSelector {...defaultProps} />);
    
    const select = screen.getByLabelText('Current Bond Level');
    expect(select).toHaveValue('1');
    
    // Check that all bond levels are present
    mockBondLevels.forEach(level => {
      expect(screen.getByText(level.label)).toBeInTheDocument();
    });
  });

  test('calls onBondLevelChange when bond level is selected', () => {
    const onBondLevelChange = jest.fn();
    render(<BondLevelSelector {...defaultProps} onBondLevelChange={onBondLevelChange} />);
    
    const select = screen.getByLabelText('Current Bond Level');
    fireEvent.change(select, { target: { value: '2' } });
    
    expect(onBondLevelChange).toHaveBeenCalledWith(2);
  });

  test('formats points input correctly', () => {
    const onPointsLeftChange = jest.fn();
    render(<BondLevelSelector {...defaultProps} onPointsLeftChange={onPointsLeftChange} />);
    
    const input = screen.getByLabelText('Points Left to Next Level');
    fireEvent.change(input, { target: { value: '1234567' } });
    
    expect(onPointsLeftChange).toHaveBeenCalledWith('1,234,567');
  });

  test('removes non-numeric characters from points input', () => {
    const onPointsLeftChange = jest.fn();
    render(<BondLevelSelector {...defaultProps} onPointsLeftChange={onPointsLeftChange} />);
    
    const input = screen.getByLabelText('Points Left to Next Level');
    fireEvent.change(input, { target: { value: 'abc123def456' } });
    
    expect(onPointsLeftChange).toHaveBeenCalledWith('123,456');
  });

  test('disables inputs when disabled prop is true', () => {
    render(<BondLevelSelector {...defaultProps} disabled={true} />);
    
    expect(screen.getByLabelText('Current Bond Level')).toBeDisabled();
    expect(screen.getByLabelText('Points Left to Next Level')).toBeDisabled();
  });

  test('disables inputs when no bond levels available', () => {
    render(<BondLevelSelector {...defaultProps} bondLevels={[]} />);
    
    expect(screen.getByLabelText('Current Bond Level')).toBeDisabled();
    expect(screen.getByLabelText('Points Left to Next Level')).toBeDisabled();
    expect(screen.getByText('Select a servant first')).toBeInTheDocument();
  });

  test('disables points input when at maximum bond level', () => {
    render(<BondLevelSelector {...defaultProps} currentBondLevel={3} />);
    
    expect(screen.getByLabelText('Current Bond Level')).not.toBeDisabled();
    expect(screen.getByLabelText('Points Left to Next Level')).toBeDisabled();
  });

  test('displays current points left value', () => {
    render(<BondLevelSelector {...defaultProps} currentPointsLeft="1,500" />);
    
    const input = screen.getByLabelText('Points Left to Next Level');
    expect(input).toHaveValue('1,500');
  });
});
