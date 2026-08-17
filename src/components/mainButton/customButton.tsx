import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { theme } from "../../styles/theme";

type Props = {
  title: string;
  onPress?: () => void | Promise<void>;
  style?: StyleProp<ViewStyle>;
};

export default function CustomButton({
  title,
  onPress,
  style,
}: Props) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: theme.colors.primary,
    fontFamily: "Inter_700Bold",
    fontSize: theme.fontSize.normal,
  },
});