/**
 * QuestModePanel.test.js
 * FGO Bond Calculator - Quest Mode Panel Component Tests
 * 
 * Unit tests for the QuestModePanel component to ensure proper functionality
 * and integration with quest selection and filtering.
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4
 * @created 2025-06-18
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestModePanel from './QuestModePanel';

// Mock react-select to avoid complex DOM testing
jest.mock('react-select', () => {
  return function MockSelect({ value, onChange, options, placeholder, isDisabled }) {
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
        disabled={isDisabled}
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

describe('QuestModePanel', () => {
  const mockQuestOptions = [
    {
      label: 'Test War',
      options: [
        { value: '1', label: 'Test Quest 1' },
        { value: '2', label: 'Test Quest 2' }
      ]
    }
  ];

  const mockFilteredQuests = [
    { questId: 1, spotName: 'Test Quest 1', ap: 40, bond: { '1': 815 } },
    { questId: 2, spotName: 'Test Quest 2', ap: 21, bond: { '1': 855 } }
  ];

  const defaultProps = {
    questOptions: mockQuestOptions,
    selectedQuestFromData: '1',
    onQuestChange: jest.fn(),
    filteredQuests: mockFilteredQuests
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders QuestModePanel with quest selection', () => {
    render(<QuestModePanel {...defaultProps} />);
    
    expect(screen.getByText('Free Quests')).toBeInTheDocument();
    expect(screen.getByTestId('quest-select')).toBeInTheDocument();
  });

  test('displays loading placeholder when no quests available', () => {
    const props = { ...defaultProps, filteredQuests: [] };
    render(<QuestModePanel {...props} />);
    
    const select = screen.getByTestId('quest-select');
    expect(select).toHaveAttribute('disabled');
    expect(screen.getByText('Loading quests...')).toBeInTheDocument();
  });

  test('displays search placeholder when quests are available', () => {
    render(<QuestModePanel {...defaultProps} />);
    
    const select = screen.getByTestId('quest-select');
    expect(select).not.toHaveAttribute('disabled');
    expect(screen.getByText('Search for a quest...')).toBeInTheDocument();
  });

  test('calls onQuestChange when quest selection changes', () => {
    const mockOnQuestChange = jest.fn();
    const props = { ...defaultProps, onQuestChange: mockOnQuestChange };
    
    render(<QuestModePanel {...props} />);
    
    const select = screen.getByTestId('quest-select');
    fireEvent.change(select, { target: { value: '2' } });
    
    expect(mockOnQuestChange).toHaveBeenCalledWith('2');
  });
  test('handles quest options with grouped structure', () => {
    render(<QuestModePanel {...defaultProps} />);
    
    // In the mocked select, optgroup labels become part of the DOM but are harder to find
    // Let's check for the option values instead which are more reliable
    expect(screen.getByText('Test Quest 1')).toBeInTheDocument();
    expect(screen.getByText('Test Quest 2')).toBeInTheDocument();
    
    // Check that the structure includes optgroups by looking at the DOM
    const select = screen.getByTestId('quest-select');
    expect(select.querySelector('optgroup')).toBeInTheDocument();
  });

  test('renders with empty quest selection', () => {
    const props = { 
      ...defaultProps, 
      selectedQuestFromData: '',
      questOptions: []
    };
    
    render(<QuestModePanel {...props} />);
    
    const select = screen.getByTestId('quest-select');
    expect(select.value).toBe('');
  });

  test('applies correct CSS classes', () => {
    const { container } = render(<QuestModePanel {...defaultProps} />);
    
    expect(container.firstChild).toHaveClass('questModePanel');
    expect(container.querySelector('.formGroup')).toBeInTheDocument();
    expect(container.querySelector('.formLabel')).toBeInTheDocument();
  });
});
