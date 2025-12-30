import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { FinancialProductGridTileProps } from '../types/financialProduct';

/**
 * Component that displays a single financial product in a grid tile
 */
function FinancialProductGridTile({ name }: Readonly<FinancialProductGridTileProps>): React.ReactElement {
    return (
        <View style={styles.gridItem}>
            <Pressable 
                android_ripple={Platform.OS === 'android' ? { 
                    color: '#CCCCCC',
                    borderless: false,
                } : undefined}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed
                ]}
            >
                <View style={styles.content}>
                    <Text style={styles.text}>{name}</Text>
                </View>
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
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible', 
    },
    button: {
        flex: 1,
        borderRadius: 8,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonPressed: {
        opacity: 0.5,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 16,
    },  
});

export default FinancialProductGridTile;

