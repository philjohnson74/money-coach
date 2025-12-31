/**
 * Type definition for FinancialProduct
 */
export interface IFinancialProduct {
  id: string;
  name: string;
  screenName: string;
}

/**
 * Props for FinancialProductGridTile component
 */
export interface FinancialProductGridTileProps {
  readonly name: string;
  readonly onPress: () => void;
}

