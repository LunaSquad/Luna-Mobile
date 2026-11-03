// src/components/input/customInput.tsx
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from "react-native";
import { theme } from "../../styles/theme";
import { Feather } from "@expo/vector-icons";

interface CustomInputProps extends TextInputProps {
  title: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
}

export default function CustomInput({ title, icon, isPassword, style, ...rest }: CustomInputProps) {
  const [ocultarSenha, setOcultarSenha] = useState(isPassword);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.inputArea}>
        <View style={styles.leftIcon}>{icon}</View>
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.textInput}
          secureTextEntry={ocultarSenha}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => setOcultarSenha(!ocultarSenha)}
          >
            <Feather
              name={ocultarSenha ? "eye-off" : "eye"}
              size={20}
              color={theme.colors.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.textInput,
    paddingBottom: 4,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    paddingLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.normal,
    fontFamily: theme.fonts.light,
    color: theme.colors.textPrimary,
    paddingVertical: 4,
  },
});