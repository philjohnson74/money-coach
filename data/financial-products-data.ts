import FinancialProduct from '../models/FinancialProduct';
import { IFinancialProduct } from '../types/financialProduct';

/**
 * Array of financial products available in the app
 * Note the screen names are the same as the stack navigator screen names in App.tsx
 */
export const FINANCIAL_PRODUCTS: readonly IFinancialProduct[] = [
    new FinancialProduct('fp1', 'AVC', 'AVC'),
    new FinancialProduct('fp2', 'Mortgages', 'Mortgages'),
    new FinancialProduct('fp3', 'Wills', 'Wills'),
    new FinancialProduct('fp4', 'Protection', 'Protection'),
    new FinancialProduct('fp5', 'Payroll Savings', 'PayrollSavings'),
] as const;

