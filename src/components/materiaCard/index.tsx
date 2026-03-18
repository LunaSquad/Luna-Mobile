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
    width: 250,
    height: 400,
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginRight: 16,
    elevation: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },

  numberContainer: {
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 16,
  },

  numberText: {
    color: "#fff",
    fontWeight: "bold",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },

  image: {
    width: "100%",
    height: 120,
    alignSelf: "center",
  },

  description: {
    fontSize: theme.fontSize.small,
    textAlign: "center",
  },

  button: {
    paddingVertical: 10,
    width: 120,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});