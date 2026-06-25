import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme';
import { Button } from '../ui/Button';

interface SubscriptionBannerProps {
  onSubscribe: () => void;
}

// Promo card shown on Home for non-subscribed users. Headline + description +
// CTA. Purely presentational; visibility is decided by the caller.
export function SubscriptionBanner({ onSubscribe }: SubscriptionBannerProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.lg,
          gap: theme.spacing.sm,
        },
      ]}
    >
      <Text
        style={{
          color: theme.colors.text,
          fontSize: theme.typography.sizes.lg,
          fontWeight: theme.typography.weights.bold,
        }}
      >
        {t('app.subscriptionBanner.headline')}
      </Text>
      <Text
        style={{
          color: theme.colors.textMuted,
          fontSize: theme.typography.sizes.md,
          marginBottom: theme.spacing.xs,
        }}
      >
        {t('app.subscriptionBanner.description')}
      </Text>
      <Button title={t('app.subscriptionBanner.cta')} onPress={onSubscribe} fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth },
});
