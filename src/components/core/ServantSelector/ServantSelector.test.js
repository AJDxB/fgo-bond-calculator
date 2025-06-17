/**
 * ServantSelector.test.js
 * FGO Bond Calculator - ServantSelector Component Tests
 * 
 * Tests for the ServantSelector component functionality
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4
 * @created 2025-06-16
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServantSelector from './ServantSelector';

// Mock axios to prevent actual API calls during testing
jest.mock('axios');

describe('ServantSelector', () => {
  const mockProps = {
    selectedServant: null,
    onServantChange: jest.fn(),
    isJPServer: false,
    onServantsLoaded: jest.fn()
  };

  test('renders servant selector component', () => {
    render(<ServantSelector {...mockProps} />);
    expect(screen.getByText('Search for a NA servant...')).toBeInTheDocument();
  });

  test('shows JP placeholder when JP server is selected', () => {
    render(<ServantSelector {...mockProps} isJPServer={true} />);
    expect(screen.getByText('Search for a JP servant...')).toBeInTheDocument();
  });
});
