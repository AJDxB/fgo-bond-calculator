/**
 * QuickListPanel.test.js
 * FGO Bond Calculator - Quick List Panel Component Tests
 * 
 * Unit tests for the QuickListPanel component to ensure proper functionality
 * and integration with predefined quest selection.
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4
 * @created 2025-06-18
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuickListPanel from './QuickListPanel';

// Mock react-select to avoid complex DOM testing
jest.mock('react-select', () => {
  return function MockSelect({ value, onChange, options, placeholder }) {
    return (
      <select
        data-testid="quest-select"
        value={value?.value || ''}
        onChange={(e) => {
          const selectedOption = options
            .flatMap(group => group.options || [group])
            .find(opt => opt.value === e.target.value);
          onChange(selectedOption);
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((group, groupIndex) => {
          if (group.options) {
            return (
              <optgroup key={groupIndex} label={group.label}>
                {group.options.map((option, optionIndex) => (
                  <option key={`${groupIndex}-${optionIndex}`} value={option.value}>
                    {typeof option.label === 'string' ? option.label : `Quest ${option.value}`}
                  </option>
                ))}
              </optgroup>
            );
          }
          return (
            <option key={groupIndex} value={group.value}>
              {typeof group.label === 'string' ? group.label : `Quest ${group.value}`}
            </option>
          );
        })}
      </select>
    );
  };
});

describe('QuickListPanel', () => {
  const mockQuickListOptions = [
    {
      label: 'Dailies',
      options: [
        { value: 'extreme_training', label: 'Extreme Training Grounds' },
        { value: 'extreme_treasure', label: 'Extreme Treasure Vault' }
      ]
    },
    {
      label: 'Free Quests',
      options: [
        { value: 'free_quest_80', label: 'Free Quest Lv80' },
        { value: 'free_quest_84', label: 'Free Quest Lv84' }
      ]
    }
  ];

  const defaultProps = {
    quickListOptions: mockQuickListOptions,
    selectedQuest: 'extreme_training',
    onQuestChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders QuickListPanel with quest selection', () => {
    render(<QuickListPanel {...defaultProps} />);
    
    expect(screen.getByText('Quest List')).toBeInTheDocument();
    expect(screen.getByTestId('quest-select')).toBeInTheDocument();
  });

  test('displays placeholder text', () => {
    render(<QuickListPanel {...defaultProps} />);
    
    expect(screen.getByText('Select a quest...')).toBeInTheDocument();
  });

  test('calls onQuestChange when quest selection changes', () => {
    const mockOnQuestChange = jest.fn();
    const props = { ...defaultProps, onQuestChange: mockOnQuestChange };
    
    render(<QuickListPanel {...props} />);
    
    const select = screen.getByTestId('quest-select');
    fireEvent.change(select, { target: { value: 'extreme_treasure' } });
    
    expect(mockOnQuestChange).toHaveBeenCalledWith('extreme_treasure');
  });
  test('handles quest options with grouped structure', () => {
    render(<QuickListPanel {...defaultProps} />);
    
    // In the mocked select, optgroup labels become part of the DOM but are harder to find
    // Let's check for the option values instead which are more reliable
    expect(screen.getByText('Extreme Training Grounds')).toBeInTheDocument();
    expect(screen.getByText('Extreme Treasure Vault')).toBeInTheDocument();
    expect(screen.getByText('Free Quest Lv80')).toBeInTheDocument();
    expect(screen.getByText('Free Quest Lv84')).toBeInTheDocument();
    
    // Check that the structure includes optgroups by looking at the DOM
    const select = screen.getByTestId('quest-select');
    const optgroups = select.querySelectorAll('optgroup');
    expect(optgroups).toHaveLength(2);
  });

  test('renders with empty quest selection', () => {
    const props = { 
      ...defaultProps, 
      selectedQuest: '',
      quickListOptions: []
    };
    
    render(<QuickListPanel {...props} />);
    
    const select = screen.getByTestId('quest-select');
    expect(select.value).toBe('');
  });

  test('handles selection of current quest', () => {
    render(<QuickListPanel {...defaultProps} />);
    
    const select = screen.getByTestId('quest-select');
    expect(select.value).toBe('extreme_training');
  });

  test('applies correct CSS classes', () => {
    const { container } = render(<QuickListPanel {...defaultProps} />);
    
    expect(container.firstChild).toHaveClass('quickListPanel');
    expect(container.querySelector('.formGroup')).toBeInTheDocument();
    expect(container.querySelector('.formLabel')).toBeInTheDocument();
  });

  test('maintains accessibility with proper labels', () => {
    render(<QuickListPanel {...defaultProps} />);
    
    const label = screen.getByText('Quest List');
    expect(label).toBeInTheDocument();
  });

  test('handles empty quickListOptions gracefully', () => {
    const props = { ...defaultProps, quickListOptions: [] };
    
    render(<QuickListPanel {...props} />);
    
    const select = screen.getByTestId('quest-select');
    expect(select).toBeInTheDocument();
    expect(select.children).toHaveLength(1); // Only placeholder option
  });
});
