import { render, screen } from '@testing-library/react-native';
import App from './App';

describe('App', () => {
  it('renders the title', () => {
    render(<App />);
    expect(screen.getByText('Money Coach')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    render(<App />);
    expect(screen.getByText('Welcome to your personal finance app')).toBeTruthy();
  });
});

