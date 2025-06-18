/**
 * CustomPointsPanel.test.js
 * FGO Bond Calculator - Custom Points Panel Component Tests
 * 
 * Unit tests for the CustomPointsPanel component to ensure proper functionality
 * and input handling for custom bond points and AP values.
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4
 * @created 2025-06-18
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomPointsPanel from './CustomPointsPanel';

describe('CustomPointsPanel', () => {
  const defaultProps = {
    customBondPoints: '1,000',
    onCustomBondPointsChange: jest.fn(),
    customAP: '40',
    onCustomAPChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders CustomPointsPanel with input fields', () => {
    render(<CustomPointsPanel {...defaultProps} />);
    
    expect(screen.getByText('Bond Points per Run')).toBeInTheDocument();
    expect(screen.getByText('AP Cost per Run')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter bond points')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter AP cost')).toBeInTheDocument();
  });

  test('displays current values in input fields', () => {
    render(<CustomPointsPanel {...defaultProps} />);
    
    const bondPointsInput = screen.getByPlaceholderText('Enter bond points');
    const apInput = screen.getByPlaceholderText('Enter AP cost');
    
    expect(bondPointsInput).toHaveValue('1,000');
    expect(apInput).toHaveValue('40');
  });
  test('calls onCustomBondPointsChange when bond points input changes', () => {
    const mockOnBondPointsChange = jest.fn();
    const props = { ...defaultProps, onCustomBondPointsChange: mockOnBondPointsChange };
    
    render(<CustomPointsPanel {...props} />);
    
    const bondPointsInput = screen.getByPlaceholderText('Enter bond points');
    fireEvent.change(bondPointsInput, { target: { value: '2000' } });
      expect(mockOnBondPointsChange).toHaveBeenCalled();
  });
  test('calls onCustomAPChange when AP input changes', () => {
    const mockOnAPChange = jest.fn();
    const props = { ...defaultProps, onCustomAPChange: mockOnAPChange };
    
    render(<CustomPointsPanel {...props} />);
    
    const apInput = screen.getByPlaceholderText('Enter AP cost');
    fireEvent.change(apInput, { target: { value: '50' } });
    
    expect(mockOnAPChange).toHaveBeenCalled();
  });

  test('renders with empty values', () => {
    const props = { 
      ...defaultProps, 
      customBondPoints: '', 
      customAP: '' 
    };
    
    render(<CustomPointsPanel {...props} />);
    
    const bondPointsInput = screen.getByPlaceholderText('Enter bond points');
    const apInput = screen.getByPlaceholderText('Enter AP cost');
    
    expect(bondPointsInput).toHaveValue('');
    expect(apInput).toHaveValue('');
  });

  test('applies correct CSS classes', () => {
    const { container } = render(<CustomPointsPanel {...defaultProps} />);
    
    expect(container.firstChild).toHaveClass('customPointsPanel');
    expect(container.querySelector('.customInputsRow')).toBeInTheDocument();
    expect(container.querySelectorAll('.formGroup')).toHaveLength(2);
    expect(container.querySelectorAll('.formLabel')).toHaveLength(2);
    expect(container.querySelectorAll('.formInput')).toHaveLength(2);
  });

  test('maintains accessibility with proper labels', () => {
    render(<CustomPointsPanel {...defaultProps} />);
    
    const bondPointsLabel = screen.getByText('Bond Points per Run');
    const apLabel = screen.getByText('AP Cost per Run');
    
    expect(bondPointsLabel).toBeInTheDocument();
    expect(apLabel).toBeInTheDocument();
  });

  test('handles focus and blur events on inputs', () => {
    render(<CustomPointsPanel {...defaultProps} />);
    
    const bondPointsInput = screen.getByPlaceholderText('Enter bond points');
    const apInput = screen.getByPlaceholderText('Enter AP cost');
    
    // Test that inputs can receive focus
    bondPointsInput.focus();
    expect(bondPointsInput).toHaveFocus();
    
    apInput.focus();
    expect(apInput).toHaveFocus();
    expect(bondPointsInput).not.toHaveFocus();
  });
});
