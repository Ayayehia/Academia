import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import NewPasswordScreen from '../screens/auth/NewPasswordScreen';
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
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
    </Stack.Navigator>
  );
}
