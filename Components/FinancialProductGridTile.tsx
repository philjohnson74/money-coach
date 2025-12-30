import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FinancialProductGridTileProps } from '../types/financialProduct';

/**
 * Component that displays a single financial product in a grid tile
 */
function FinancialProductGridTile({ name }: Readonly<FinancialProductGridTileProps>): React.ReactElement {
    return (
        <View style={styles.gridItem}>
            <Pressable style={styles.button}>
                <Text style={styles.text}>{name}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    gridItem: {
        flex: 1,
        margin: 16,
        height: 100,
        borderRadius: 8,
        elevation: 4,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
    },
    button: {
        flex: 1,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 16,
    },
});

export default FinancialProductGridTile;

