import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

export interface ScreenContainerProps {
  children: ReactNode;
  /** Wrap content in a vertical ScrollView. */
  scroll?: boolean;
  /** Inner padding; defaults to `spacing.md` (16). Pass 0 for edge-to-edge content. */
  padding?: number;
  /** Safe-area edges to apply. Defaults to top/bottom/left/right. */
  edges?: readonly Edge[];
  /** Background override; defaults to the theme background. */
  backgroundColor?: string;
  style?: ViewStyle;
}

const DEFAULT_EDGES: readonly Edge[] = ['top', 'bottom', 'left', 'right'];

export function ScreenContainer({
  children,
  scroll = false,
  padding,
  edges = DEFAULT_EDGES,
  backgroundColor,
  style,
}: ScreenContainerProps) {
  const theme = useTheme();
  const pad = padding ?? theme.spacing.md;
  const bg = backgroundColor ?? theme.colors.background;

  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: bg }]}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[{ padding: pad }, style]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, { padding: pad }, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
});
