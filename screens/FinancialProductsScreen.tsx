import React from 'react';
import { FlatList, StyleSheet, View } from "react-native";
import { FINANCIAL_PRODUCTS } from "../data/financial-products-data";
import FinancialProductGridTile from "../Components/FinancialProductGridTile";
import { IFinancialProduct } from "../types/financialProduct";
import { NavigationProp } from '@react-navigation/native';

/**
 * Screen component that displays a list of financial products
 */
function FinancialProductsScreen({navigation}: Readonly<{navigation: NavigationProp<any>}>): React.ReactElement {
    function pressHandler(screenName: string): void {
        console.log(`Pressed: ${screenName}`);
        navigation.navigate(screenName);
    }

    return (
        <View style={styles.container}>
            <FlatList<IFinancialProduct>
                data={FINANCIAL_PRODUCTS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <FinancialProductGridTile name={item.name} onPress={() => pressHandler(item.screenName)} />
                )}
                numColumns={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});

export default FinancialProductsScreen;

