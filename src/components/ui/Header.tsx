import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  /** When provided, renders a back affordance that invokes this callback. */
  onBack?: () => void;
  /** Label announced for the back affordance. */
  backAccessibilityLabel?: string;
  /** Optional action(s) rendered on the trailing edge. */
  right?: ReactNode;
  /** Title alignment. Defaults to 'left'. */
  align?: 'left' | 'center';
}

export function Header({
  title,
  subtitle,
  onBack,
  backAccessibilityLabel = 'Go back',
  right,
  align = 'left',
}: HeaderProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border },
      ]}
    >
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={backAccessibilityLabel}
            hitSlop={8}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={[styles.back, { color: theme.colors.primary }]}>‹</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={[styles.titleWrap, align === 'center' && styles.center]}>
        <Text
          numberOfLines={1}
          accessibilityRole="header"
          style={[styles.title, { color: theme.colors.text }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  side: { minWidth: 32, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  titleWrap: { flex: 1 },
  center: { alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 2 },
  back: { fontSize: 34, lineHeight: 34, fontWeight: '400' },
  pressed: { opacity: 0.6 },
});
