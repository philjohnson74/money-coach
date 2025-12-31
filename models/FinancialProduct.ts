import { IFinancialProduct } from '../types/financialProduct';

/**
 * FinancialProduct model class
 */
class FinancialProduct implements IFinancialProduct {
  id: string;
  name: string;
  screenName: string;

  constructor(id: string, name: string, screenName: string) {
    this.id = id;
    this.name = name;
    this.screenName = screenName;
  }
}

export default FinancialProduct;


