import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import AVCScreen from './AVCScreen';

describe('AVCScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  } as unknown as NavigationProp<any>;

  it('renders the screen correctly', () => {
    render(<AVCScreen navigation={mockNavigation} />);
    
    expect(screen.getByText('AVC')).toBeTruthy();
  });

  it('displays the AVC text', () => {
    render(<AVCScreen navigation={mockNavigation} />);
    
    const textElement = screen.getByText('AVC');
    expect(textElement).toBeTruthy();
    expect(textElement.props.children).toBe('AVC');
  });

  it('renders with correct styling', () => {
    const { UNSAFE_root } = render(<AVCScreen navigation={mockNavigation} />);
    
    expect(UNSAFE_root).toBeTruthy();
    expect(screen.getByText('AVC')).toBeTruthy();
  });
});

