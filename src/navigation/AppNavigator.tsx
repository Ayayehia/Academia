import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/app/HomeScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import { type AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

// Shown when the user is authenticated. Real app screens added later.
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
