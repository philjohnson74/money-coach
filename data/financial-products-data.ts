import FinancialProduct from '../models/FinancialProduct';
import { FinancialProduct as IFinancialProduct } from '../types/financialProduct';

/**
 * Array of financial products available in the app
 */
export const FINANCIAL_PRODUCTS: readonly IFinancialProduct[] = [
    new FinancialProduct('fp1', 'AVC'),
    new FinancialProduct('fp2', 'Mortgages'),
    new FinancialProduct('fp3', 'Wills'),
    new FinancialProduct('fp4', 'Protection'),
    new FinancialProduct('fp5', 'Payroll Savings'),
] as const;

