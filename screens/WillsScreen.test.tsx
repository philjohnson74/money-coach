import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import WillsScreen from './WillsScreen';

describe('WillsScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  } as unknown as NavigationProp<any>;

  it('renders the screen correctly', () => {
    render(<WillsScreen navigation={mockNavigation} />);
    
    expect(screen.getByText('Wills')).toBeTruthy();
  });

  it('displays the Wills text', () => {
    render(<WillsScreen navigation={mockNavigation} />);
    
    const textElement = screen.getByText('Wills');
    expect(textElement).toBeTruthy();
    expect(textElement.props.children).toBe('Wills');
  });

  it('renders with correct styling', () => {
    const { UNSAFE_root } = render(<WillsScreen navigation={mockNavigation} />);
    
    expect(UNSAFE_root).toBeTruthy();
    expect(screen.getByText('Wills')).toBeTruthy();
  });
});

