import { StyleSheet, Text, View } from 'react-native';
import { useTheme, type Theme } from '../../theme';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

/** Resolves background + foreground for each variant from theme tokens. */
function variantColors(theme: Theme, variant: BadgeVariant) {
  switch (variant) {
    case 'primary':
      return { bg: theme.colors.primary, fg: '#FFFFFF' };
    case 'success':
      return { bg: theme.colors.success, fg: '#FFFFFF' };
    case 'warning':
      return { bg: theme.colors.warning, fg: '#FFFFFF' };
    case 'danger':
      return { bg: theme.colors.danger, fg: '#FFFFFF' };
    case 'default':
    default:
      return { bg: theme.colors.surface, fg: theme.colors.textMuted };
  }
}

const SIZES: Record<BadgeSize, { paddingV: number; paddingH: number; fontSize: number }> = {
  sm: { paddingV: 2, paddingH: 8, fontSize: 12 },
  md: { paddingV: 4, paddingH: 10, fontSize: 14 },
};

export function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  const theme = useTheme();
  const colors = variantColors(theme, variant);
  const dims = SIZES[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderRadius: theme.radius.full,
          paddingVertical: dims.paddingV,
          paddingHorizontal: dims.paddingH,
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[styles.label, { color: colors.fg, fontSize: dims.fontSize }]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignSelf: 'flex-start' },
  label: { fontWeight: '500' },
});
