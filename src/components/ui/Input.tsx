import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export interface InputProps
  extends Omit<TextInputProps, 'style' | 'editable' | 'placeholderTextColor'> {
  /** Field label rendered above the input. */
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  /** Error message; also turns the border red and marks the field invalid. */
  error?: string;
  /** Helper text shown below when there is no error. */
  helperText?: string;
  disabled?: boolean;
  /** Wrapper style override. */
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  value,
  onChangeText,
  error,
  helperText,
  disabled = false,
  containerStyle,
  placeholder,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      ) : null}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        accessibilityHint={error}
        style={[
          styles.input,
          {
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
            borderColor,
            borderRadius: theme.radius.md,
            fontSize: theme.typography.sizes.lg,
          },
          disabled && styles.disabled,
        ]}
        {...rest}
      />

      {error ? (
        <Text accessibilityRole="alert" style={[styles.message, { color: theme.colors.danger }]}>
          {error}
        </Text>
      ) : helperText ? (
        <Text style={[styles.message, { color: theme.colors.textMuted }]}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 14, fontWeight: '500' },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
  },
  disabled: { opacity: 0.5 },
  message: { fontSize: 12 },
});
