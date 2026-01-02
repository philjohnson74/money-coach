import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View, Text } from "react-native";
import { FINANCIAL_PRODUCTS } from "../data/financial-products-data";
import FinancialProductGridTile from "../Components/FinancialProductGridTile";
import { IFinancialProduct } from "../types/financialProduct";
import { NavigationProp } from '@react-navigation/native';
import { useEnabledFeaturesContext } from '../contexts/EnabledFeaturesContext';

/**
 * Screen component that displays a list of financial products
 */
function FinancialProductsScreen({navigation}: Readonly<{navigation: NavigationProp<any>}>): React.ReactElement {
    const { enabledFeatures, isLoading } = useEnabledFeaturesContext();

    const enabledProducts = useMemo(() => {
        if (!enabledFeatures) {
            return [];
        }
        
        // Filter products to only show those that are enabled
        return FINANCIAL_PRODUCTS.filter((product) => 
            enabledFeatures.enabledFeatureNames.includes(product.name)
        );
    }, [enabledFeatures]);

    function pressHandler(screenName: string): void {
        console.log(`Pressed: ${screenName}`);
        navigation.navigate(screenName);
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading products...</Text>
            </View>
        );
    }

    if (enabledProducts.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>No products available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList<IFinancialProduct>
                data={enabledProducts}
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
        backgroundColor: '#000000',
    },
    loadingText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default FinancialProductsScreen;

