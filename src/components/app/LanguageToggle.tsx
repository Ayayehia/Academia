import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type AppLanguage } from '../../i18n';
import { useSettingsStore } from '../../store/settingsStore';
import { useTheme } from '../../theme';

const LANGS: { value: AppLanguage; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'ar', label: 'AR' },
];

// Compact EN/AR toggle for the Home header. Reads/writes the same settings
// store as the Settings selector, so the two are always in sync.
export function LanguageToggle() {
  const { t } = useTranslation();
  const theme = useTheme();
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  return (
    <View
      accessibilityLabel={t('app.home.languageA11y')}
      style={[
        styles.row,
        { borderColor: theme.colors.border, borderRadius: theme.radius.full },
      ]}
    >
      {LANGS.map(({ value, label }) => {
        const selected = value === language;
        return (
          <Pressable
            key={value}
            onPress={() => setLanguage(value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            hitSlop={6}
            style={[
              styles.segment,
              { borderRadius: theme.radius.full },
              selected && { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text
              style={{
                color: selected ? '#FFFFFF' : theme.colors.textMuted,
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.weights.medium,
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', borderWidth: StyleSheet.hairlineWidth, padding: 2 },
  segment: { paddingHorizontal: 10, paddingVertical: 4 },
});
