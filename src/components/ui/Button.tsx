import { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { useTheme, type Theme } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Pick<PressableProps, 'onPress' | 'testID'> {
  /** Text label shown inside the button. */
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and blocks presses. */
  loading?: boolean;
  disabled?: boolean;
  /** Stretch to fill the available horizontal space. */
  fullWidth?: boolean;
  /** Optional node rendered before the title (e.g. an icon). */
  leftIcon?: ReactNode;
  /** Overrides the announced label (defaults to `title`). */
  accessibilityLabel?: string;
}

const SIZES: Record<ButtonSize, { paddingV: number; paddingH: number; fontSize: number }> = {
  sm: { paddingV: 8, paddingH: 12, fontSize: 14 },
  md: { paddingV: 12, paddingH: 16, fontSize: 16 },
  lg: { paddingV: 16, paddingH: 20, fontSize: 16 },
};

/** Resolves background / text / border colors for a given variant. */
function variantColors(theme: Theme, variant: ButtonVariant) {
  switch (variant) {
    case 'secondary':
      return { bg: theme.colors.surface, fg: theme.colors.text, border: theme.colors.border };
    case 'ghost':
      return { bg: 'transparent', fg: theme.colors.primary, border: 'transparent' };
    case 'danger':
      return { bg: theme.colors.danger, fg: '#FFFFFF', border: theme.colors.danger };
    case 'primary':
    default:
      return { bg: theme.colors.primary, fg: '#FFFFFF', border: theme.colors.primary };
  }
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  const theme = useTheme();
  const colors = variantColors(theme, variant);
  const dims = SIZES[size];
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: dims.paddingV,
    paddingHorizontal: dims.paddingH,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
  };

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        containerStyle,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.fg} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
          <Text
            numberOfLines={1}
            style={[
              styles.label,
              { color: colors.fg, fontSize: dims.fontSize, fontWeight: theme.typography.weights.medium },
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { alignItems: 'center', justifyContent: 'center' },
  label: { textAlign: 'center' },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.5 },
});
