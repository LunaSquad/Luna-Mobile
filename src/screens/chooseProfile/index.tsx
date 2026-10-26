import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./style";

export default function ChooseProfileScreen() {
  const navigation = useNavigation<any>();

  function handleSelectProfile(perfil: "aluno" | "professor") {
    navigation.navigate("Login", { perfil });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Image
          source={require("../../assets/logo mobile.png")}
          style={styles.logo}
          resizeMode="contain"
          resizeMethod="scale"
          fadeDuration={0}
        />
      </View>

      <Image
        source={require("../../assets/luna.png")}
        style={styles.luna}
        resizeMode="contain"
        resizeMethod="scale"
        fadeDuration={0}
      />

      <Image
        source={require("../../assets/gif-luna.gif")}
        style={styles.boneca}
        resizeMode="contain"
      />

      <View style={styles.buttonsArea}>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.85}
          onPress={() => handleSelectProfile("aluno")}
        >
          <Text style={styles.textButton}>Aluno</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.85}
          onPress={() => handleSelectProfile("professor")}
        >
          <Text style={styles.textButton}>Professor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}