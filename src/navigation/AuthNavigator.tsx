import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterScreen from '../screens/auth/RegisterScreen';
// Login is not built yet (Story 1.3). The placeholder backs the `Login` route
// for now so the Register screen's "Log in" link has a valid destination.
import PlaceholderAuthScreen from '../screens/auth/PlaceholderAuthScreen';
import { type AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Shown when the user is not authenticated.
export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={PlaceholderAuthScreen} />
    </Stack.Navigator>
  );
}
