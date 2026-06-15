import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  /** Spinner color; defaults to the theme primary. */
  color?: string;
  /** Optional caption rendered under the spinner. */
  label?: string;
  /** Fill and center within the parent (flex: 1) instead of hugging content. */
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = 'large',
  color,
  label,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label ?? 'Loading'}
      accessibilityState={{ busy: true }}
      style={[styles.container, fullScreen && styles.fullScreen]}
    >
      <ActivityIndicator size={size} color={color ?? theme.colors.primary} />
      {label ? (
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>{label}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', gap: 8 },
  fullScreen: { flex: 1 },
  label: { fontSize: 14 },
});
