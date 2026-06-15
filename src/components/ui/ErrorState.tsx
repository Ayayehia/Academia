import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  /** When provided, renders a retry button that invokes this callback. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Optional illustration / icon rendered above the title. */
  icon?: ReactNode;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  icon,
}: ErrorStateProps) {
  const theme = useTheme();

  return (
    <View accessibilityRole="alert" style={styles.container}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {message ? (
        <Text style={[styles.message, { color: theme.colors.textMuted }]}>{message}</Text>
      ) : null}
      {onRetry ? (
        <View style={styles.action}>
          <Button title={retryLabel} variant="secondary" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  icon: { marginBottom: 4 },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  message: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  action: { marginTop: 8 },
});
