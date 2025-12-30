import { render, screen } from '@testing-library/react-native';
import App from './App';
import { FINANCIAL_PRODUCTS } from './data/financial-products-data';

describe('App', () => {
  it('renders all financial product names from data', () => {
    render(<App />);
    
    // Check that each financial product name is displayed
    FINANCIAL_PRODUCTS.forEach((product) => {
      expect(screen.getByText(product.name)).toBeTruthy();
    });
  });

  it('renders the correct number of financial products', () => {
    render(<App />);
    
    // Verify we have the expected number of products
    const expectedCount = FINANCIAL_PRODUCTS.length;
    const productElements = FINANCIAL_PRODUCTS.map(product => 
      screen.getByText(product.name)
    );
    
    expect(productElements).toHaveLength(expectedCount);
  });

  it('renders specific financial product names', () => {
    render(<App />);
    
    // Test for specific product names from the data file
    expect(screen.getByText('AVC')).toBeTruthy();
    expect(screen.getByText('Mortgages')).toBeTruthy();
    expect(screen.getByText('Wills')).toBeTruthy();
    expect(screen.getByText('Protection')).toBeTruthy();
    expect(screen.getByText('Payroll Savings')).toBeTruthy();
  });
});

