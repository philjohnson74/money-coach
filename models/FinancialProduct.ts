import { FinancialProduct as IFinancialProduct } from '../types/financialProduct';

/**
 * FinancialProduct model class
 */
class FinancialProduct implements IFinancialProduct {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export default FinancialProduct;


