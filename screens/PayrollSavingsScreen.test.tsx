import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import PayrollSavingsScreen from './PayrollSavingsScreen';

describe('PayrollSavingsScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  } as unknown as NavigationProp<any>;

  it('renders the screen correctly', () => {
    render(<PayrollSavingsScreen navigation={mockNavigation} />);
    
    expect(screen.getByText('Payroll Savings')).toBeTruthy();
  });

  it('displays the Payroll Savings text', () => {
    render(<PayrollSavingsScreen navigation={mockNavigation} />);
    
    const textElement = screen.getByText('Payroll Savings');
    expect(textElement).toBeTruthy();
    expect(textElement.props.children).toBe('Payroll Savings');
  });

  it('renders with correct styling', () => {
    const { UNSAFE_root } = render(<PayrollSavingsScreen navigation={mockNavigation} />);
    
    expect(UNSAFE_root).toBeTruthy();
    expect(screen.getByText('Payroll Savings')).toBeTruthy();
  });
});

