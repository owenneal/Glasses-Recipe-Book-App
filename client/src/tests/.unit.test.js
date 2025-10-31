import { render, screen } from '@testing-library/react';
import Button from '../../src/components/Button';

test('renders button with correct text', () => {
  render(<Button text="Click Me" />);
  const buttonElement = screen.getByText(/Click Me/i);
  expect(buttonElement).toBeInTheDocument();
});
