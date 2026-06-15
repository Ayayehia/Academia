import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PlaceholderHomeScreen from '../screens/app/PlaceholderHomeScreen';
import { type AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

// Shown when the user is authenticated. Real app screens added later.
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePlaceholder" component={PlaceholderHomeScreen} />
    </Stack.Navigator>
  );
}
