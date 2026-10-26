import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { theme } from "../../styles/theme";

type Props = {
  title: string;
  image: ImageSourcePropType;
  backgroundColor: string;
  buttonColor: string;
  number: string | number;
  onPress?: () => void;
};

export function MateriaCard({
  title,
  image,
  backgroundColor,
  buttonColor,
  number,
  onPress,
}: Props) {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View
        style={[
          styles.numberContainer,
          { backgroundColor: buttonColor },
        ]}
      >
        <Text style={styles.numberText}>{number}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>

      <Image
        source={image}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.description}>
        Clique no botão para visualizar as lições atribuídas pelo professor.
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: buttonColor },
        ]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>Visualizar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 190,
    height: 310,
    borderRadius: 14,
    padding: theme.spacing.md || 12,
    marginRight: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: "space-between",
    alignItems: "center",
  },
  numberContainer: {
    alignSelf: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 12,
    marginTop: -4,
    marginRight: -4,
  },
  numberText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 2,
  },
  image: {
    width: "100%",
    height: 85,
    alignSelf: "center",
  },
  description: {
    fontSize: 11,
    lineHeight: 15,
    textAlign: "center",
    color: "#4B5563",
    paddingHorizontal: 4,
  },
  button: {
    paddingVertical: 7,
    width: 105,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});