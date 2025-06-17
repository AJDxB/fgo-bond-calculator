/**
 * ServerToggle.test.js
 * FGO Bond Calculator - Server Toggle Component Tests
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4 - Component extraction testing
 * @created 2025-06-17
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ServerToggle from './ServerToggle';

describe('ServerToggle', () => {
  const mockOnServerChange = jest.fn();

  beforeEach(() => {
    mockOnServerChange.mockClear();
  });

  test('renders both server buttons', () => {
    render(
      <ServerToggle
        isJPServer={false}
        onServerChange={mockOnServerChange}
      />
    );
    
    expect(screen.getByText('NA Server')).toBeInTheDocument();
    expect(screen.getByText('JP Server')).toBeInTheDocument();
  });

  test('shows NA as active when isJPServer is false', () => {
    render(
      <ServerToggle
        isJPServer={false}
        onServerChange={mockOnServerChange}
      />
    );
    
    const naButton = screen.getByText('NA Server');
    const jpButton = screen.getByText('JP Server');
    
    expect(naButton).toHaveClass('active');
    expect(jpButton).not.toHaveClass('active');
  });

  test('shows JP as active when isJPServer is true', () => {
    render(
      <ServerToggle
        isJPServer={true}
        onServerChange={mockOnServerChange}
      />
    );
    
    const naButton = screen.getByText('NA Server');
    const jpButton = screen.getByText('JP Server');
    
    expect(jpButton).toHaveClass('active');
    expect(naButton).not.toHaveClass('active');
  });

  test('calls onServerChange with false when NA button clicked', () => {
    render(
      <ServerToggle
        isJPServer={true}
        onServerChange={mockOnServerChange}
      />
    );
    
    fireEvent.click(screen.getByText('NA Server'));
    expect(mockOnServerChange).toHaveBeenCalledWith(false);
  });

  test('calls onServerChange with true when JP button clicked', () => {
    render(
      <ServerToggle
        isJPServer={false}
        onServerChange={mockOnServerChange}
      />
    );
    
    fireEvent.click(screen.getByText('JP Server'));
    expect(mockOnServerChange).toHaveBeenCalledWith(true);
  });
});
