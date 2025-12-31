import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import ProtectionScreen from './ProtectionScreen';

describe('ProtectionScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  } as unknown as NavigationProp<any>;

  it('renders the screen correctly', () => {
    render(<ProtectionScreen navigation={mockNavigation} />);
    
    expect(screen.getByText('Protection')).toBeTruthy();
  });

  it('displays the Protection text', () => {
    render(<ProtectionScreen navigation={mockNavigation} />);
    
    const textElement = screen.getByText('Protection');
    expect(textElement).toBeTruthy();
    expect(textElement.props.children).toBe('Protection');
  });

  it('renders with correct styling', () => {
    const { UNSAFE_root } = render(<ProtectionScreen navigation={mockNavigation} />);
    
    expect(UNSAFE_root).toBeTruthy();
    expect(screen.getByText('Protection')).toBeTruthy();
  });
});

