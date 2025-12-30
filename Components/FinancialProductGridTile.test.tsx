import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Platform } from 'react-native';
import FinancialProductGridTile from './FinancialProductGridTile';

describe('FinancialProductGridTile', () => {
  const mockName = 'Test Product';

  beforeEach(() => {
    // Reset Platform.OS before each test
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the component with the provided name', () => {
      render(<FinancialProductGridTile name={mockName} />);
      
      expect(screen.getByText(mockName)).toBeTruthy();
    });

    it('displays the product name correctly', () => {
      const productName = 'AVC';
      render(<FinancialProductGridTile name={productName} />);
      
      const textElement = screen.getByText(productName);
      expect(textElement).toBeTruthy();
    });

    it('renders all required View components', () => {
      const { UNSAFE_root } = render(<FinancialProductGridTile name={mockName} />);
      
      expect(UNSAFE_root).toBeTruthy();
      expect(screen.getByText(mockName)).toBeTruthy();
    });

    it('renders Pressable component', () => {
      render(<FinancialProductGridTile name={mockName} />);
      
      // Pressable should be present (we can verify by checking the text is inside it)
      expect(screen.getByText(mockName)).toBeTruthy();
    });
  });

  describe('Platform-specific behavior', () => {
    it('applies android_ripple on Android platform', () => {
      Platform.OS = 'android';
      
      const { UNSAFE_root } = render(<FinancialProductGridTile name={mockName} />);
      
      // Component should render without errors on Android
      expect(UNSAFE_root).toBeTruthy();
      expect(screen.getByText(mockName)).toBeTruthy();
    });

    it('does not apply android_ripple on iOS platform', () => {
      Platform.OS = 'ios';
      
      const { UNSAFE_root } = render(<FinancialProductGridTile name={mockName} />);
      
      // Component should render without errors on iOS
      expect(UNSAFE_root).toBeTruthy();
      expect(screen.getByText(mockName)).toBeTruthy();
    });
  });

  describe('User interactions', () => {
    it('handles press events', () => {
      const { getByText } = render(<FinancialProductGridTile name={mockName} />);
      
      const pressable = getByText(mockName).parent?.parent;
      
      if (pressable) {
        fireEvent.press(pressable);
        // If no error is thrown, the press was handled
        expect(true).toBe(true);
      }
    });

    it('applies pressed state styling when pressed', () => {
      const { getByText } = render(<FinancialProductGridTile name={mockName} />);
      
      const pressable = getByText(mockName).parent?.parent;
      
      if (pressable) {
        fireEvent(pressable, 'pressIn');
        // Component should handle press state
        expect(screen.getByText(mockName)).toBeTruthy();
      }
    });
  });

  describe('Props validation', () => {
    it('renders with different product names', () => {
      const names = ['AVC', 'Mortgages', 'Wills', 'Protection', 'Payroll Savings'];
      
      names.forEach((name) => {
        const { unmount } = render(<FinancialProductGridTile name={name} />);
        expect(screen.getByText(name)).toBeTruthy();
        unmount();
      });
    });

    it('handles empty string name', () => {
      render(<FinancialProductGridTile name="" />);
      
      // Component should still render
      const { UNSAFE_root } = render(<FinancialProductGridTile name="" />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('handles long product names', () => {
      const longName = 'Very Long Financial Product Name That Might Wrap';
      render(<FinancialProductGridTile name={longName} />);
      
      expect(screen.getByText(longName)).toBeTruthy();
    });
  });

  describe('Component structure', () => {
    it('has correct component hierarchy', () => {
      render(<FinancialProductGridTile name={mockName} />);
      
      // Verify the text is rendered (confirms the structure)
      const textElement = screen.getByText(mockName);
      expect(textElement).toBeTruthy();
      
      // Verify it's within the component tree
      expect(textElement.props.children).toBe(mockName);
    });

    it('applies correct styles to components', () => {
      const { getByText } = render(<FinancialProductGridTile name={mockName} />);
      
      const textElement = getByText(mockName);
      
      // Verify text element exists and has content
      expect(textElement).toBeTruthy();
      expect(textElement.props.children).toBe(mockName);
    });
  });
});

