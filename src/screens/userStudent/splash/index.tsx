import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
    const navigation = useNavigation<any>();
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.85);

    useEffect(() => {
        // 1. Inicia a animação suave (fade-in e leve zoom)
        opacity.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.exp) });
        scale.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.exp) });

        // 2. Verifica autenticação e faz o redirecionamento
        const checkLoginStatus = async () => {
            try {
                // Mantém a splash visível por 2.5 segundos para a animação decorrer
                await new Promise((resolve) => setTimeout(resolve, 2500));

                const savedUserId = await AsyncStorage.getItem("@luna_user_id");

                // Se o utilizador já tiver sessão iniciada, vai para as abas. Se não, vai para o Login.
                if (savedUserId) {
                    navigation.replace("StudentTabs", {
                        userId: savedUserId,
                        tipoUser: "aluno",
                    });
                } else {
                    navigation.replace("Login");
                }
            } catch (error) {
                navigation.replace("Login");
            }
        };

        checkLoginStatus();
    }, [navigation, opacity, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require("../../../assets/luna.png")}
                style={[styles.logo, animatedStyle]}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: width * 0.35,
        height: 80,
    },
});