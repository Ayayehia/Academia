import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { passwordRules, RULE_KEYS } from '../../lib/validation';
import { useTheme } from '../../theme';

interface PasswordChecklistProps {
  /** The current password value; the checklist re-derives on every keystroke. */
  value: string;
}

// Live password-rules checklist, shared by Register and New Password. Reuses
// the `auth.register.rules.*` i18n keys and the shared `passwordRules` helper.
export function PasswordChecklist({ value }: PasswordChecklistProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const rules = passwordRules(value);

  return (
    <View style={{ gap: theme.spacing.xs }}>
      {RULE_KEYS.map((key) => {
        const met = rules[key];
        const color = met ? theme.colors.success : theme.colors.textMuted;
        return (
          <View key={key} style={styles.ruleRow}>
            <Text style={{ color, fontSize: theme.typography.sizes.md }}>{met ? '✓' : '○'}</Text>
            <Text style={{ color, fontSize: theme.typography.sizes.sm }}>
              {t(`auth.register.rules.${key}`)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
