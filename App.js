import 'react-native-gesture-handler'; // MUST BE FIRST
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getDBConnection, createTables } from './database/database';

// Import Screens
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import AddStock from './screens/AddStock';
import BackSide from './screens/BackSide';
import BillList from './screens/BillList';
import EightFLOORPAYMENT from './screens/EightFLOORPAYMENT';
import FifthFLOORPAYMENT from './screens/FifthFLOORPAYMENT';
import FirstFLOORPAYMENT from './screens/FirstFLOORPAYMENT';
import FourthFLOORPAYMENT from './screens/FourthFLOORPAYMENT';
import FrontSide from './screens/FrontSide';
import GroundFloor from './screens/GroundFloor';
import LowerGroundFloor from './screens/LowerGroundFloor';
import NewBill from './screens/NewBill';
import NinthFLOORPAYMENT from './screens/NinthFLOORPAYMENT';
import PayrollScreen from './screens/PayrollScreen';
import SecondFLOORPAYMENT from './screens/SecondFLOORPAYMENT';
import SeventhFLOORPAYMENT from './screens/SeventhFLOORPAYMENT';
import SixthFLOORPAYMENT from './screens/SixthFLOORPAYMENT';
import StockList from './screens/StockList';
import SupplierBalance from './screens/SupplierBalance';
import SupplierPayments from './screens/SupplierPayments';
import SupplierReceipts from './screens/SupplierReceipts';
import Suppliers from './screens/Suppliers';
import TenthFLOORPAYMENT from './screens/TenthFLOORPAYMENT';

const Stack = createStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const initDB = async () => {
      try {
        const db = await getDBConnection();
        await createTables(db);
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database', error);
      }
    };
    initDB();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Loading"
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
          }}
        >
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddStock" component={AddStock} />
          <Stack.Screen name="BackSide" component={BackSide} />
          <Stack.Screen name="BillList" component={BillList} />
          <Stack.Screen name="EightFLOORPAYMENT" component={EightFLOORPAYMENT} />
          <Stack.Screen name="FifthFLOORPAYMENT" component={FifthFLOORPAYMENT} />
          <Stack.Screen name="FirstFLOORPAYMENT" component={FirstFLOORPAYMENT} />
          <Stack.Screen name="FourthFLOORPAYMENT" component={FourthFLOORPAYMENT} />
          <Stack.Screen name="FrontSide" component={FrontSide} />
          <Stack.Screen name="GroundFloor" component={GroundFloor} />
          <Stack.Screen name="LowerGroundFloor" component={LowerGroundFloor} />
          <Stack.Screen name="NewBill" component={NewBill} />
          <Stack.Screen name="NinthFLOORPAYMENT" component={NinthFLOORPAYMENT} />
          <Stack.Screen name="Payroll" component={PayrollScreen} />
          <Stack.Screen name="SecondFLOORPAYMENT" component={SecondFLOORPAYMENT} />
          <Stack.Screen name="SeventhFLOORPAYMENT" component={SeventhFLOORPAYMENT} />
          <Stack.Screen name="SixthFLOORPAYMENT" component={SixthFLOORPAYMENT} />
          <Stack.Screen name="StockList" component={StockList} />
          <Stack.Screen name="SupplierBalance" component={SupplierBalance} />
          <Stack.Screen name="SupplierPayments" component={SupplierPayments} />
          <Stack.Screen name="SupplierReceipts" component={SupplierReceipts} />
          <Stack.Screen name="Suppliers" component={Suppliers} />
          <Stack.Screen name="TenthFLOORPAYMENT" component={TenthFLOORPAYMENT} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;