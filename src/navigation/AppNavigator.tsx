import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CourseDetailScreen from '../screens/app/CourseDetailScreen';
import SubscriptionScreen from '../screens/app/SubscriptionScreen';
import MainTabs from './MainTabs';
import { type AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

// Shown when the user is authenticated. MainTabs holds the bottom navigation;
// CourseDetail and Subscription are pushed *over* the tabs, so the tab bar is
// hidden on those screens.
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
    </Stack.Navigator>
  );
}
