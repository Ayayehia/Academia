import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme';

interface HomeHeaderProps {
  onProfilePress: () => void;
  onNotificationPress: () => void;
  /** Optional trailing action (e.g. a Settings link). */
  right?: ReactNode;
}

// Fixed, Home-only screen header. Rendered as a sibling above the scroll view
// so it stays pinned while content scrolls. Profile + Notification icons sit on
// the left; an optional action sits on the right. All styling from theme tokens.
export function HomeHeader({ onProfilePress, onNotificationPress, right }: HomeHeaderProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border },
      ]}
    >
      <View style={styles.left}>
        <IconButton glyph="👤" label={t('app.home.profile')} onPress={onProfilePress} />
        <IconButton glyph="🔔" label={t('app.home.notifications')} onPress={onNotificationPress} />
      </View>

      <View style={styles.spacer} />

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

// Circular placeholder icon button (no icon library installed → emoji glyph).
function IconButton({
  glyph,
  label,
  onPress,
}: {
  glyph: string;
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => [
        styles.iconButton,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.full,
        },
        pressed && styles.pressed,
      ]}
    >
      <Text style={{ fontSize: theme.typography.sizes.lg }}>{glyph}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  spacer: { flex: 1 },
  right: { alignItems: 'flex-end' },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: { opacity: 0.6 },
});
