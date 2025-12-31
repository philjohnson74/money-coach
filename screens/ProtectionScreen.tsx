import React from 'react';
import { NavigationProp } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";

function ProtectionScreen({navigation}: Readonly<{navigation: NavigationProp<any>}>): React.ReactElement {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Protection</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default ProtectionScreen;

