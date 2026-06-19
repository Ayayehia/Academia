import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { type AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

type AuthNavigatorProps = {
  /** Which auth screen to land on. Defaults to Register; RootNavigator passes
   *  'Login' when a biometric unlock fails on launch. */
  initialRouteName?: keyof AuthStackParamList;
};

// Shown when the user is not authenticated.
export default function AuthNavigator({ initialRouteName = 'Register' }: AuthNavigatorProps) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
