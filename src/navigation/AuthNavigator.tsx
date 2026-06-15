import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PlaceholderAuthScreen from '../screens/auth/PlaceholderAuthScreen';
import { type AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Shown when the user is not authenticated. Real auth screens added later.
export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthPlaceholder" component={PlaceholderAuthScreen} />
    </Stack.Navigator>
  );
}
