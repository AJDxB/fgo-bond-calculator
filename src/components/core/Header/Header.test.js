/**
 * Header.test.js
 * FGO Bond Calculator - Header Component Tests
 * 
 * @author AJDxB <ajdxb4787@gmail.com>
 * @version 0.3.4 - Component extraction testing
 * @created 2025-06-17
 * @github https://github.com/AJDxB/fgo-bond-calculator
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  test('renders logo with correct alt text', () => {
    render(<Header />);
    
    const logo = screen.getByAltText('FGO Bond Level Calculator');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src');
  });

  test('renders footer with credits', () => {
    render(<Header />);
    
    expect(screen.getByText(/Made with/)).toBeInTheDocument();
    expect(screen.getByText('AJDxB')).toBeInTheDocument();
  });

  test('renders GitHub link with correct attributes', () => {
    render(<Header />);
    
    const githubLink = screen.getByRole('link', { name: 'AJDxB' });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/AJDxB');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('renders version information', () => {
    render(<Header />);
    
    expect(screen.getByText('v0.3.4')).toBeInTheDocument();
  });

  test('renders saint quartz icon', () => {
    render(<Header />);
    
    const icon = screen.getByAltText('Saint Quartz');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  test('renders footer separator', () => {
    render(<Header />);
    
    expect(screen.getByText('|')).toBeInTheDocument();
  });
});
