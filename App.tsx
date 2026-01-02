import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FinancialProductsScreen from './screens/FinancialProductsScreen';
import AVCScreen from './screens/AVCScreen';
import MortgagesScreen from './screens/MortgagesScreen';
import WillsScreen from './screens/WillsScreen';
import ProtectionScreen from './screens/ProtectionScreen';
import PayrollSavingsScreen from './screens/PayrollSavingsScreen';
import { useEnabledFeatures } from './hooks/useEnabledFeatures';
import { EnabledFeaturesProvider } from './contexts/EnabledFeaturesContext';

const Stack = createNativeStackNavigator();

export default function App(): React.ReactElement {
  // TODO: Replace with actual partnerId from your app state/auth
  const partnerId = 'partner123';
  
  const { enabledFeatures, isLoading, error } = useEnabledFeatures(partnerId);

  // Log enabled features for debugging (remove in production)
  React.useEffect(() => {
    if (enabledFeatures) {
      console.log('Enabled features:', enabledFeatures.enabledFeatureNames);
    }
    if (error) {
      console.error('Error loading enabled features:', error);
    }
  }, [enabledFeatures, error]);

  return (
    <EnabledFeaturesProvider 
      enabledFeatures={enabledFeatures}
      isLoading={isLoading}
      error={error}
    >
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator 
          id="MainStack"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#ffffff',
            contentStyle: {
              backgroundColor: '#000000',
            },
          }}
        >
          <Stack.Screen 
            name="FinancialProducts" 
            component={FinancialProductsScreen}
            options={{
              title: 'Financial Products',
            }}
          />
          <Stack.Screen 
            name="AVC" 
            component={AVCScreen} 
            options={{
              title: 'AVC',
            }}
          />
          <Stack.Screen 
            name="Mortgages" 
            component={MortgagesScreen} 
            options={{
              title: 'Mortgages',
            }}
          />
          <Stack.Screen 
            name="Wills" 
            component={WillsScreen} 
            options={{
              title: 'Wills',
            }}
          />
          <Stack.Screen 
            name="Protection" 
            component={ProtectionScreen} 
            options={{
              title: 'Protection',
            }}
          />
          <Stack.Screen 
            name="PayrollSavings" 
            component={PayrollSavingsScreen} 
            options={{
              title: 'Payroll Savings',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </EnabledFeaturesProvider>
  );
}

