import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import LoginScreen from './src/screens/LoginScreen';
import OpenShiftScreen from './src/screens/OpenShiftScreen';
import POSScreen from './src/screens/POSScreen';
import CashierClosingScreen from './src/screens/CashierClosingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              cardStyle: { flex: 1 },
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OpenShift" component={OpenShiftScreen} />
            <Stack.Screen name="POS" component={POSScreen} />
            <Stack.Screen name="CashierClosing" component={CashierClosingScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="dark" />
      </CartProvider>
    </AuthProvider>
  );
}
