import { type ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { Badge, type BadgeVariant } from './Badge';
import { SkeletonLoader } from './SkeletonLoader';

export interface CourseCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  /** Image URI or a custom node rendered in the media slot. */
  thumbnail?: { uri: string } | ReactNode;
  /** Optional badge shown over / near the title. */
  badge?: { label: string; variant?: BadgeVariant };
  /** Arbitrary footer content (e.g. price, rating, metadata row). */
  footer?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  /** Renders skeleton placeholders instead of content. */
  loading?: boolean;
  accessibilityLabel?: string;
}

function isImageSource(value: unknown): value is { uri: string } {
  return typeof value === 'object' && value !== null && 'uri' in value;
}

export function CourseCard({
  title,
  subtitle,
  description,
  thumbnail,
  badge,
  footer,
  onPress,
  disabled = false,
  loading = false,
  accessibilityLabel,
}: CourseCardProps) {
  const theme = useTheme();

  const cardStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
  };

  const content = loading ? (
    <View style={styles.body}>
      <SkeletonLoader height={160} radius={theme.radius.md} />
      <SkeletonLoader width="70%" height={18} />
      <SkeletonLoader width="45%" height={14} />
      <SkeletonLoader width="90%" height={12} />
    </View>
  ) : (
    <>
      {thumbnail ? (
        <View style={[styles.media, { borderRadius: theme.radius.md }]}>
          {isImageSource(thumbnail) ? (
            <Image source={thumbnail} style={styles.image} resizeMode="cover" />
          ) : (
            thumbnail
          )}
        </View>
      ) : null}

      <View style={styles.body}>
        {badge ? <Badge label={badge.label} variant={badge.variant} /> : null}
        <Text numberOfLines={2} style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            {subtitle}
          </Text>
        ) : null}
        {description ? (
          <Text numberOfLines={3} style={[styles.description, { color: theme.colors.textMuted }]}>
            {description}
          </Text>
        ) : null}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </>
  );

  // Static (non-interactive) card.
  if (!onPress || loading) {
    return <View style={[styles.card, cardStyle]}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.card,
        cardStyle,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  media: {
    overflow: 'hidden',
  },
  image: { width: '100%', height: 160 },
  body: { padding: 16, gap: 6 },
  title: { fontSize: 16, fontWeight: '700' },
  subtitle: { fontSize: 14 },
  description: { fontSize: 12, lineHeight: 18 },
  footer: { marginTop: 4 },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
});
