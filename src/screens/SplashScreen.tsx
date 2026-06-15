import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components';
import { useTheme } from '../theme';

// Presentational only — branding shown during the boot phase.
// All timing and auth decisions live in RootNavigator, never here.
export default function SplashScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ScreenContainer>
      <View style={[styles.center, { gap: theme.spacing.md }]}>
        {/* Logo placeholder — themed rounded square with app initials. */}
        <View
          style={[
            styles.logo,
            { backgroundColor: theme.colors.primary, borderRadius: theme.radius.lg },
          ]}
        >
          <Text
            style={[
              styles.logoText,
              {
                color: theme.colors.background,
                fontSize: theme.typography.sizes.xxl,
                fontWeight: theme.typography.weights.bold,
              },
            ]}
          >
            RN
          </Text>
        </View>

        <Text
          style={[
            styles.name,
            {
              color: theme.colors.text,
              fontSize: theme.typography.sizes.xl,
              fontWeight: theme.typography.weights.bold,
            },
          ]}
        >
          {t('common.appName')}
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 96, height: 96, alignItems: 'center', justifyContent: 'center' },
  logoText: { textAlign: 'center' },
  name: { textAlign: 'center' },
});
