import React, { ReactNode } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  KeyboardTypeOptions,
} from "react-native";
import { theme } from "../../styles/theme";

export interface Props {
  title?: string;
  titleColor?: string;
  borderColor?: string;
  placeholder?: string;
  icon?: ReactNode;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export default function CustomInput({
  title,
  titleColor,
  borderColor,
  placeholder,
  icon,
  value,
  onChangeText,
  secureTextEntry = false,
  style,
  keyboardType = "default",
  maxLength,
  autoCapitalize = "sentences",
}: Props) {
  return (
    <View style={[styles.container, style]}>
      {title && (
        <Text style={[styles.label, titleColor ? { color: titleColor } : null]}>
          {title}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          borderColor ? { borderColor: borderColor } : null,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textInput}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
        />

        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.textPrimary,
    fontFamily: "Inter_700Bold",
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: theme.colors.textPrimary,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: theme.fontSize.small,
    color: theme.colors.textDark,
  },
  icon: {
    marginLeft: 8,
  },
});