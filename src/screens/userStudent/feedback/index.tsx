import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Feedback() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../../assets/luna-positivo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Image
          source={require("../../../assets/logo mobile-positivo.png")}
          style={styles.logoBorboleta}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
        <View style={styles.iconBox}>
          <MaterialIcons name="forum" size={52} color="#006d77" />
        </View>

        <Text style={styles.title}>Feedback em construção</Text>

        <Text style={styles.description}>
          Estamos preparando uma área para você enviar sugestões, opiniões e
          compartilhar sua experiência com o aplicativo.
        </Text>

        <Text style={styles.descriptionSmall}>
          Em breve você poderá nos ajudar a melhorar ainda mais a experiência
          do Luna.
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={20} color="#ffffff" />

          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#006d77",
    paddingHorizontal: 28,
  },

  header: {
    height: 120,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },

  logo: {
    width: 65,
    height: 32,
  },

  logoBorboleta: {
    position: "absolute",
    right: 0,
    top: 52,
    width: 24,
    height: 24,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 36,
    alignItems: "center",
    marginTop: 35,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 7,
  },

  iconBox: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: "#e9f7f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 23,
    fontWeight: "800",
    color: "#006d77",
    textAlign: "center",
    marginBottom: 14,
  },

  description: {
    fontSize: 15,
    color: "#333333",
    textAlign: "center",
    lineHeight: 22,
  },

  descriptionSmall: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 14,
  },

  button: {
    marginTop: 32,
    backgroundColor: "#006d77",
    height: 48,
    paddingHorizontal: 28,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});