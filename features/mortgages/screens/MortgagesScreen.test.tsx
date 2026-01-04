import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import MortgagesScreen from './MortgagesScreen';

describe('MortgagesScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  } as unknown as NavigationProp<any>;

  it('renders the screen correctly', () => {
    render(<MortgagesScreen navigation={mockNavigation} />);
    
    expect(screen.getByText('Mortgages')).toBeTruthy();
  });

  it('displays the Mortgages text', () => {
    render(<MortgagesScreen navigation={mockNavigation} />);
    
    const textElement = screen.getByText('Mortgages');
    expect(textElement).toBeTruthy();
    expect(textElement.props.children).toBe('Mortgages');
  });

  it('renders with correct styling', () => {
    const { UNSAFE_root } = render(<MortgagesScreen navigation={mockNavigation} />);
    
    expect(UNSAFE_root).toBeTruthy();
    expect(screen.getByText('Mortgages')).toBeTruthy();
  });
});

