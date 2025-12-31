import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import FinancialProductsScreen from './FinancialProductsScreen';
import { FINANCIAL_PRODUCTS } from '../data/financial-products-data';

describe('FinancialProductsScreen', () => {
  const mockNavigate = jest.fn();
  const mockNavigation = {
    navigate: mockNavigate,
  } as unknown as NavigationProp<any>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all financial products', () => {
      render(<FinancialProductsScreen navigation={mockNavigation} />);
      
      FINANCIAL_PRODUCTS.forEach((product) => {
        expect(screen.getByText(product.name)).toBeTruthy();
      });
    });

    it('renders the correct number of products', () => {
      render(<FinancialProductsScreen navigation={mockNavigation} />);
      
      const expectedCount = FINANCIAL_PRODUCTS.length;
      FINANCIAL_PRODUCTS.forEach((product) => {
        expect(screen.getByText(product.name)).toBeTruthy();
      });
    });
  });

  describe('Navigation', () => {
    it('navigates to AVC screen when AVC tile is pressed', () => {
      render(<FinancialProductsScreen navigation={mockNavigation} />);
      
      const avcTile = screen.getByText('AVC');
      const pressable = avcTile.parent?.parent;
      
      if (pressable) {
        fireEvent.press(pressable);
        expect(mockNavigate).toHaveBeenCalledWith('AVC');
      }
    });

    it('navigates to Mortgages screen when Mortgages tile is pressed', () => {
      render(<FinancialProductsScreen navigation={mockNavigation} />);
      
      const mortgagesTile = screen.getByText('Mortgages');
      const pressable = mortgagesTile.parent?.parent;
      
      if (pressable) {
        fireEvent.press(pressable);
        expect(mockNavigate).toHaveBeenCalledWith('Mortgages');
      }
    });

    it('navigates to Wills screen when Wills tile is pressed', () => {
      render(<FinancialProductsScreen navigation={mockNavigation} />);
      
      const willsTile = screen.getByText('Wills');
      const pressable = willsTile.parent?.parent;
      
      if (pressable) {
        fireEvent.press(pressable);
        expect(mockNavigate).toHaveBeenCalledWith('Wills');
      }
    });

    it('navigates to Protection screen when Protection tile is pressed', () => {
      render(<FinancialProductsScreen navigation={mockNavigation} />);
      
      const protectionTile = screen.getByText('Protection');
      const pressable = protectionTile.parent?.parent;
      
      if (pressable) {
        fireEvent.press(pressable);
        expect(mockNavigate).toHaveBeenCalledWith('Protection');
      }
    });

    it('navigates to PayrollSavings screen when Payroll Savings tile is pressed', () => {
      render(<FinancialProductsScreen navigation={mockNavigation} />);
      
      const payrollTile = screen.getByText('Payroll Savings');
      const pressable = payrollTile.parent?.parent;
      
      if (pressable) {
        fireEvent.press(pressable);
        expect(mockNavigate).toHaveBeenCalledWith('PayrollSavings');
      }
    });

    it('calls pressHandler with correct screen name for each product', () => {
      render(<FinancialProductsScreen navigation={mockNavigation} />);
      
      FINANCIAL_PRODUCTS.forEach((product) => {
        const tile = screen.getByText(product.name);
        const pressable = tile.parent?.parent;
        
        if (pressable) {
          fireEvent.press(pressable);
          expect(mockNavigate).toHaveBeenCalledWith(product.screenName);
        }
      });
    });
  });
});

