import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import { preAdaptarTudoEmSegundoPlano } from "../../../services/iaBackgroundservice";
import CustomInput from "../../../components/input/customInput";
import CustomButton from "../../../components/mainButton/customButton";
import API_BASE_URL from "../../../services/ip";
import { styles } from "./style/style";

const { height } = Dimensions.get("window");

type LoginResponse = {
  ok: boolean;
  userId?: string;
  tipoUser?: string;
  message?: string;
};

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  const logoPosition = useSharedValue(height * 0.28);
  const logoScale = useSharedValue(1.15);
  const modalTranslate = useSharedValue(height * 0.68);

  useEffect(() => {
    const timer = setTimeout(() => {
      logoScale.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.exp),
      });

      logoPosition.value = withTiming(110, {
        duration: 600,
        easing: Easing.out(Easing.exp),
      });

      modalTranslate.value = withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      });
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    top: logoPosition.value,
    transform: [{ scale: logoScale.value }],
  }));

  const lunaStyle = useAnimatedStyle(() => ({
    top: logoPosition.value - 54,
    transform: [{ scale: logoScale.value }],
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalTranslate.value }],
  }));

  function handleBackToProfile() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("ChooseProfile");
    }
  }

  async function handleLogin(): Promise<void> {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha o e-mail e a senha.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), senha }),
      });

      const data: LoginResponse = await response.json();

      if (data.ok) {
        if (data.tipoUser === "aluno") {
          if (data.userId) {
            preAdaptarTudoEmSegundoPlano(data.userId);
          }

          navigation.replace("StudentTabs", {
            userId: data.userId,
            tipoUser: data.tipoUser,
          });
          return;
        }

        if (data.tipoUser === "professor") {
          return;
        }
      }

      Alert.alert("Erro", data.message || "E-mail ou senha inválidos");
    } catch (err) {
      Alert.alert("Erro", "Falha ao conectar no servidor");
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={handleBackToProfile}
      >
        <MaterialIcons
          name="chevron-left"
          size={38}
          color={theme.colors.primary || "#005A63"}
        />
      </TouchableOpacity>

      <Animated.Image
        source={require("../../../assets/luna.png")}
        style={[styles.luna, lunaStyle]}
        resizeMode="contain"
        resizeMethod="scale"
        fadeDuration={0}
      />

      <Animated.Image
        source={require("../../../assets/cuate.png")}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
        resizeMethod="scale"
        fadeDuration={0}
      />

      <Animated.View style={[styles.login, modalStyle]}>
        <Text style={styles.titleModal}>LOGIN</Text>

        <CustomInput
          title="E-MAIL"
          placeholder="Digite seu e-mail:"
          keyboardType="email-address"
          autoCapitalize="none"
          icon={
            <MaterialIcons
              name="email"
              size={22}
              color={theme.colors.secondary}
            />
          }
          style={styles.inputEmail}
          value={email}
          onChangeText={setEmail}
        />

        <CustomInput
          title="Senha"
          placeholder="Digite sua senha: "
          secureTextEntry={true}
          icon={
            <MaterialIcons
              name="lock"
              size={22}
              color={theme.colors.secondary}
            />
          }
          style={styles.inputSenha}
          value={senha}
          onChangeText={setSenha}
        />

        <CustomButton
          title="Login"
          onPress={handleLogin}
          style={styles.CustomButton}
        />

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Novo por aqui? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.signUpLink}>Cadastre-se!</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row} />

        <View style={styles.socialIcons}>
          <FontAwesome name="whatsapp" size={34} color="#FFDDD2" />
          <FontAwesome name="instagram" size={34} color="#FFDDD2" />
          <FontAwesome name="facebook-official" size={34} color="#FFDDD2" />
        </View>
      </Animated.View>
    </View>
  );
}