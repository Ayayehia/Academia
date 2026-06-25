import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import HomeScreen from '../screens/app/HomeScreen';
import ListingScreen from '../screens/app/ListingScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import { useTheme } from '../theme';
import { type MainTabsParamList } from './types';

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Simple emoji icon (no icon library). Sized by the tab bar; the active/inactive
// state is conveyed by the label tint colors below.
const tabIcon = (glyph: string) => ({ size }: { size: number }) => (
  <Text style={{ fontSize: size }}>{glyph}</Text>
);

// Bottom navigation for the main app sections. Theme-aware colors keep labels
// readable in light and dark mode.
export default function MainTabs() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: t('app.tabs.home'), tabBarIcon: tabIcon('🏠') }}
      />
      <Tab.Screen
        name="Listing"
        component={ListingScreen}
        options={{ tabBarLabel: t('app.tabs.listing'), tabBarIcon: tabIcon('📋') }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: t('app.tabs.settings'), tabBarIcon: tabIcon('⚙️') }}
      />
    </Tab.Navigator>
  );
}
