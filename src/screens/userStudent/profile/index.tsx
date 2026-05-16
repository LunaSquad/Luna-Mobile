import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from './style/style'

export default function Perfil() {
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
          <MaterialIcons name="construction" size={52} color="#006d77" />
        </View>

        <Text style={styles.title}>Perfil em construção</Text>

        <Text style={styles.description}>
          Estamos preparando essa área para exibir suas informações de perfil de
          forma simples e organizada.
        </Text>

        <Text style={styles.descriptionSmall}>
          Em breve você poderá visualizar seus dados, editar informações e
          acompanhar detalhes da sua conta.
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

