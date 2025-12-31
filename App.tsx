import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FinancialProductsScreen from './screens/FinancialProductsScreen';
import MortgagesScreen from './screens/MortgagesScreen';

const Stack = createNativeStackNavigator();

export default function App(): React.ReactElement {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator id="MainStack">
        <Stack.Screen 
          name="FinancialProducts" 
          component={FinancialProductsScreen}
          options={{
            title: 'Financial Products',
          }}
        />
        <Stack.Screen 
          name="Mortgages" 
          component={MortgagesScreen} 
          options={{
            title: 'Mortgages',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

