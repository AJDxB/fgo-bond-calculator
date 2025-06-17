/**
 * ThemeToggle.test.js
 * FGO Bond Calculator - Theme Toggle Component Tests
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4 - Component extraction testing
 * @created 2025-06-17
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  const mockOnThemeChange = jest.fn();

  beforeEach(() => {
    mockOnThemeChange.mockClear();
  });

  test('renders theme toggle button', () => {
    render(
      <ThemeToggle
        isDarkMode={false}
        onThemeChange={mockOnThemeChange}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('shows moon icon when in light mode', () => {
    render(
      <ThemeToggle
        isDarkMode={false}
        onThemeChange={mockOnThemeChange}
      />
    );
    
    expect(screen.getByText('☽')).toBeInTheDocument();
  });

  test('shows sun icon when in dark mode', () => {
    render(
      <ThemeToggle
        isDarkMode={true}
        onThemeChange={mockOnThemeChange}
      />
    );
    
    expect(screen.getByText('☀')).toBeInTheDocument();
  });

  test('shows correct tooltip for light mode', () => {
    render(
      <ThemeToggle
        isDarkMode={false}
        onThemeChange={mockOnThemeChange}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Switch to Dark Mode');
  });

  test('shows correct tooltip for dark mode', () => {
    render(
      <ThemeToggle
        isDarkMode={true}
        onThemeChange={mockOnThemeChange}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Switch to Light Mode');
  });

  test('calls onThemeChange with opposite value when clicked', () => {
    render(
      <ThemeToggle
        isDarkMode={false}
        onThemeChange={mockOnThemeChange}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnThemeChange).toHaveBeenCalledWith(true);
  });

  test('calls onThemeChange with opposite value when in dark mode', () => {
    render(
      <ThemeToggle
        isDarkMode={true}
        onThemeChange={mockOnThemeChange}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnThemeChange).toHaveBeenCalledWith(false);
  });
});
