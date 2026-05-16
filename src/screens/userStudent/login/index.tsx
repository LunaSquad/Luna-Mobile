import { useEffect, useState } from "react";
import { View, Text, Dimensions, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { theme } from "../../../styles/theme";
import CustomInput  from "../../../components/input/customInput";
import CustomButton from "../../../components/mainButton/customButton";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import API_BASE_URL from "../../../services/ip";
import { styles } from "./style/style";

const { height } = Dimensions.get("window");

type LoginResponse = {
  ok: boolean;
  userId?: string;
  tipoUser?: string;
  message?: string;
};

type NavigationType = {
  navigate: (
    screen: string,
    params?: {
      materiaId?: string;
      materiaNome?: string;
      userId?: string;
      hiperfocoAtual?: string;
    }
  ) => void;

  reset: (state: {
    index: number;
    routes: {
      name: string;
      params?: any;
    }[];
  }) => void;
};

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  const logoPosition = useSharedValue(height / 2 - 100);
  const logoSize = useSharedValue(200);
  const modalTranslate = useSharedValue(height * 0.7);

  useEffect(() => {
    const timer = setTimeout(() => {
      logoSize.value = withTiming(150, {
        duration: 600,
        easing: Easing.out(Easing.exp),
      });

      logoPosition.value = withTiming(90, {
        duration: 600,
        easing: Easing.out(Easing.exp),
      });

      modalTranslate.value = withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      });
    }, 500);

    

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    top: logoPosition.value,
    width: logoSize.value,
    height: logoSize.value,
  }));

  const lunaStyle = useAnimatedStyle(() => ({
    top: logoPosition.value - 70,
    width: logoSize.value * 0.5,
    height: logoSize.value * 0.5,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalTranslate.value }],
  }));

  async function handleLogin(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data: LoginResponse = await response.json();
      console.log("BACKEND:", data);

      if (data.ok) {
        if (data.tipoUser === "aluno") {
          navigation.replace("StudentTabs", {
            userId: data.userId,
            tipoUser: data.tipoUser,

            
          });
          return;
        }

        if (data.tipoUser === "professor") {
          console.log("É professor");
          return;
        }
      }

      

      Alert.alert("Erro", data.message || "Email ou senha inválidos");
    } catch (err) {
      console.log("ERRO:", err);
      Alert.alert("Erro", "Falha ao conectar no servidor");
    }
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../../assets/luna.png")}
        style={[styles.luna, lunaStyle]}
        resizeMode="contain"
      />

      <Animated.Image
        source={require("../../../assets/cuate.png")}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />

      <Animated.View style={[styles.login, modalStyle]}>
        <Text style={styles.titleModal}>LOGIN</Text>

        <CustomInput
          title="E-MAIL INSTITUCIONAL"
          placeholder="Digite seu e-mail"
          icon={
            <MaterialIcons
              name="email"
              size={24}
              color={theme.colors.secondary}
            />
          }
          style={styles.inputEmail}
          value={email}
          onChangeText={setEmail}
        />

        <CustomInput
          title="RA"
          placeholder="Digite sua senha"
          secureTextEntry={true}
          icon={
            <MaterialIcons
              name="lock"
              size={24}
              color={theme.colors.secondary}
            />
          }
          style={styles.inputSenha}
          value={senha}
          onChangeText={setSenha}
        />

        <CustomButton
          title="Entrar"
          onPress={handleLogin}
          style={styles.CustomButton}
        />

        <View style={styles.row} />

        <View style={styles.socialIcons}>
          <FontAwesome name="whatsapp" size={40} color="#FFDDD2" />
          <FontAwesome name="instagram" size={40} color="#FFDDD2" />
          <MaterialIcons name="facebook" size={40} color="#FFDDD2" />
        </View>
      </Animated.View>
    </View>
  );
}