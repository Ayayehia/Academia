import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme';

export interface SegmentOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

// Reusable theme-aware selector: a row of segments where the active one is
// highlighted. Used for Light/Dark, font size, and language choices.
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.md },
      ]}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[
              styles.segment,
              { borderRadius: theme.radius.sm },
              selected && { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text
              style={{
                // White-on-primary for the active segment (same convention as Button).
                color: selected ? '#FFFFFF' : theme.colors.text,
                fontSize: theme.typography.sizes.md,
                fontWeight: theme.typography.weights.medium,
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', borderWidth: StyleSheet.hairlineWidth, padding: 4, gap: 4 },
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
});
