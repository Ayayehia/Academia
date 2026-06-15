import { useEffect, useRef } from 'react';
import { Animated, type DimensionValue, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: DimensionValue;
  /** Corner radius; defaults to `radius.sm`. Pass a large value for circles. */
  radius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({ width = '100%', height = 16, radius, style }: SkeletonLoaderProps) {
  const theme = useTheme();
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <Animated.View
      // Decorative only — hide from assistive tech.
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width,
          height,
          borderRadius: radius ?? theme.radius.sm,
          backgroundColor: theme.colors.border,
          opacity: pulse,
        },
        style,
      ]}
    />
  );
}
