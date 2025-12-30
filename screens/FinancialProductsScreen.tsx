import React from 'react';
import { FlatList, StyleSheet, View } from "react-native";
import { FINANCIAL_PRODUCTS } from "../data/financial-products-data";
import FinancialProductGridTile from "../Components/FinancialProductGridTile";
import { FinancialProduct } from "../types/financialProduct";

/**
 * Screen component that displays a list of financial products
 */
function FinancialProductsScreen(): React.ReactElement {
    return (
        <View style={styles.container}>
            <FlatList<FinancialProduct>
                data={FINANCIAL_PRODUCTS}
                keyExtractor={(item: FinancialProduct) => item.id}
                renderItem={({ item }: { item: FinancialProduct }) => (
                    <FinancialProductGridTile name={item.name} />
                )}
                numColumns={1}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
});

export default FinancialProductsScreen;

