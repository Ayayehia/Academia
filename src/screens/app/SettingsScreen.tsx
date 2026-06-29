import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Header, SegmentedControl } from '../../components';
import { type AppLanguage } from '../../i18n';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTheme } from '../../theme';
import { type FontSize } from '../../theme/tokens';

// Real Settings tab: theme, font size, language, biometrics — all persisted via
// the settings store. As a tab root it has no back button.
export default function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  const themeMode = useSettingsStore((s) => s.themeMode);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const language = useSettingsStore((s) => s.language);
  const biometricEnabled = useSettingsStore((s) => s.biometricEnabled);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const setFontSize = useSettingsStore((s) => s.setFontSize);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const setBiometricEnabled = useSettingsStore((s) => s.setBiometricEnabled);
  const signOut = useAuthStore((s) => s.signOut);

  // Story options are Light/Dark only; treat anything not 'dark' as Light.
  const themeValue: 'light' | 'dark' = themeMode === 'dark' ? 'dark' : 'light';

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <Header title={t('app.settings.title')} />

      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, gap: theme.spacing.lg }}>
        <SettingRow label={t('app.settings.themeLabel')}>
          <SegmentedControl<'light' | 'dark'>
            value={themeValue}
            onChange={setThemeMode}
            options={[
              { label: t('app.settings.themeLight'), value: 'light' },
              { label: t('app.settings.themeDark'), value: 'dark' },
            ]}
          />
        </SettingRow>

        <SettingRow label={t('app.settings.fontLabel')}>
          <SegmentedControl<FontSize>
            value={fontSize}
            onChange={setFontSize}
            options={[
              { label: t('app.settings.fontSmall'), value: 'small' },
              { label: t('app.settings.fontMedium'), value: 'medium' },
              { label: t('app.settings.fontLarge'), value: 'large' },
            ]}
          />
        </SettingRow>

        <SettingRow label={t('app.settings.languageLabel')}>
          <SegmentedControl<AppLanguage>
            value={language}
            onChange={setLanguage}
            options={[
              { label: t('app.settings.langEn'), value: 'en' },
              { label: t('app.settings.langAr'), value: 'ar' },
            ]}
          />
        </SettingRow>

        <View style={styles.switchRow}>
          <Text
            style={{
              color: theme.colors.text,
              fontSize: theme.typography.sizes.md,
              fontWeight: theme.typography.weights.medium,
            }}
          >
            {t('app.settings.biometricsLabel')}
          </Text>
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
          />
        </View>

        <Button
          title={t('app.settings.logout')}
          variant="danger"
          fullWidth
          onPress={() => signOut()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ label, children }: { label: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Text
        style={{
          color: theme.colors.text,
          fontSize: theme.typography.sizes.md,
          fontWeight: theme.typography.weights.medium,
        }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
