import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import FinancialProductsScreen from './FinancialProductsScreen';
import { FINANCIAL_PRODUCTS } from '../data/financial-products-data';
import { EnabledFeaturesProvider } from '../contexts/EnabledFeaturesContext';
import { EnabledFeatures } from '../Services/http';

describe('FinancialProductsScreen', () => {
  const mockNavigate = jest.fn();
  const mockNavigation = {
    navigate: mockNavigate,
  } as unknown as NavigationProp<any>;

  const renderWithProvider = (
    enabledFeatures: EnabledFeatures | null = null,
    isLoading: boolean = false,
    error: string | null = null
  ) => {
    return render(
      <EnabledFeaturesProvider
        enabledFeatures={enabledFeatures}
        isLoading={isLoading}
        error={error}
      >
        <FinancialProductsScreen navigation={mockNavigation} />
      </EnabledFeaturesProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders only enabled financial products', () => {
      const enabledFeatures: EnabledFeatures = {
        partnerId: 'partner123',
        enabledFeatureNames: ['Wills', 'Mortgages'],
      };

      renderWithProvider(enabledFeatures);

      // Should show enabled products
      expect(screen.getByText('Wills')).toBeTruthy();
      expect(screen.getByText('Mortgages')).toBeTruthy();

      // Should not show disabled products
      expect(screen.queryByText('AVC')).toBeNull();
      expect(screen.queryByText('Protection')).toBeNull();
      expect(screen.queryByText('Payroll Savings')).toBeNull();
    });

    it('shows loading state when features are loading', () => {
      renderWithProvider(null, true);

      expect(screen.getByText('Loading products...')).toBeTruthy();
      expect(screen.queryByText('Wills')).toBeNull();
    });

    it('shows empty state when no products are enabled', () => {
      const enabledFeatures: EnabledFeatures = {
        partnerId: 'partner123',
        enabledFeatureNames: [],
      };

      renderWithProvider(enabledFeatures);

      expect(screen.getByText('No products available')).toBeTruthy();
    });

    it('filters products correctly based on enabled features', () => {
      const enabledFeatures: EnabledFeatures = {
        partnerId: 'partner123',
        enabledFeatureNames: ['AVC', 'Protection'],
      };

      renderWithProvider(enabledFeatures);

      expect(screen.getByText('AVC')).toBeTruthy();
      expect(screen.getByText('Protection')).toBeTruthy();
      expect(screen.queryByText('Wills')).toBeNull();
      expect(screen.queryByText('Mortgages')).toBeNull();
    });
  });

  describe('Navigation', () => {
    it('navigates to AVC screen when AVC tile is pressed', () => {
      const enabledFeatures: EnabledFeatures = {
        partnerId: 'partner123',
        enabledFeatureNames: ['AVC'],
      };

      renderWithProvider(enabledFeatures);
      
      const avcTile = screen.getByText('AVC');
      const pressable = avcTile.parent?.parent;
      
      if (pressable) {
        fireEvent.press(pressable);
        expect(mockNavigate).toHaveBeenCalledWith('AVC');
      }
    });

    it('navigates to Mortgages screen when Mortgages tile is pressed', () => {
      const enabledFeatures: EnabledFeatures = {
        partnerId: 'partner123',
        enabledFeatureNames: ['Mortgages'],
      };

      renderWithProvider(enabledFeatures);
      
      const mortgagesTile = screen.getByText('Mortgages');
      const pressable = mortgagesTile.parent?.parent;
      
      if (pressable) {
        fireEvent.press(pressable);
        expect(mockNavigate).toHaveBeenCalledWith('Mortgages');
      }
    });

    it('navigates to Wills screen when Wills tile is pressed', () => {
      const enabledFeatures: EnabledFeatures = {
        partnerId: 'partner123',
        enabledFeatureNames: ['Wills'],
      };

      renderWithProvider(enabledFeatures);
      
      const willsTile = screen.getByText('Wills');
      const pressable = willsTile.parent?.parent;
      
      if (pressable) {
        fireEvent.press(pressable);
        expect(mockNavigate).toHaveBeenCalledWith('Wills');
      }
    });

    it('navigates to Protection screen when Protection tile is pressed', () => {
      const enabledFeatures: EnabledFeatures = {
        partnerId: 'partner123',
        enabledFeatureNames: ['Protection'],
      };

      renderWithProvider(enabledFeatures);
      
      const protectionTile = screen.getByText('Protection');
      const pressable = protectionTile.parent?.parent;
      
      if (pressable) {
        fireEvent.press(pressable);
        expect(mockNavigate).toHaveBeenCalledWith('Protection');
      }
    });

    it('navigates to PayrollSavings screen when Payroll Savings tile is pressed', () => {
      const enabledFeatures: EnabledFeatures = {
        partnerId: 'partner123',
        enabledFeatureNames: ['Payroll Savings'],
      };

      renderWithProvider(enabledFeatures);
      
      const payrollTile = screen.getByText('Payroll Savings');
      const pressable = payrollTile.parent?.parent;
      
      if (pressable) {
        fireEvent.press(pressable);
        expect(mockNavigate).toHaveBeenCalledWith('PayrollSavings');
      }
    });

    it('calls pressHandler with correct screen name for enabled products only', () => {
      const enabledFeatures: EnabledFeatures = {
        partnerId: 'partner123',
        enabledFeatureNames: ['Wills', 'Mortgages'],
      };

      renderWithProvider(enabledFeatures);
      
      // Only test enabled products
      const enabledProducts = FINANCIAL_PRODUCTS.filter(p => 
        enabledFeatures.enabledFeatureNames.includes(p.name)
      );
      
      enabledProducts.forEach((product) => {
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

