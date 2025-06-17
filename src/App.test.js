import { render, screen } from '@testing-library/react';
import App from './App';

test('renders FGO Bond Calculator', () => {
  render(<App />);
  const logoElement = screen.getByAltText(/FGO Bond Level Calculator/i);
  expect(logoElement).toBeInTheDocument();
});
