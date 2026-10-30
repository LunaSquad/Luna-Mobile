import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles } from "./style/style";
import API_BASE_URL from "../../../services/ip";

export default function Feedback() {
  const navigation = useNavigation<any>();
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserData() {
      const storedUserId = await AsyncStorage.getItem("@luna_user_id");
      const storedToken = await AsyncStorage.getItem("token");
      if (storedUserId) setUserId(storedUserId);
      if (storedToken) setToken(storedToken);
    }
    loadUserData();
  }, []);

  const handleStarPress = (rating: number) => {
    setNota(rating);
  };

  const enviarFeedback = async () => {
    if (nota === 0) {
      Alert.alert("Atenção", "Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    if (!comentario.trim()) {
      Alert.alert("Atenção", "Por favor, escreva um comentário.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/feedbacks`, { // Ajuste a rota da API se for diferente
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userID: userId,
          comentario: comentario.trim(),
          nota: nota,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Feedback enviado com sucesso! Obrigado por nos ajudar a melhorar.", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert("Erro", data.message || "Não foi possível enviar o feedback.");
      }
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      Alert.alert("Erro", "Falha na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>

        {/* Fundo Branco (Topo) */}
        <View style={styles.topBackground}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="chevron-left" size={36} color="#005A63" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Image
                source={require("../../../assets/luna.png")} // Ajuste para a logo azul escuro
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Image
              source={require("../../../assets/logo mobile.png")} // Borboleta
              style={styles.logoBorboleta}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Feedback</Text>

          {/* Troque a imagem abaixo pela ilustração correta que você tem no seu projeto */}
          <Image
            source={require("../../../assets/hiperfoco.png")} // Coloque o caminho da ilustração correta aqui
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Fundo Verde Escuro (Base) */}
        <View style={styles.bottomBackground}>

          {/* Cartão Branco Sobreposto */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Deixe seu feedback</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escreva aqui..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={comentario}
                onChangeText={setComentario}
              />
              <MaterialIcons
                name="chat-bubble-outline"
                size={20}
                color="#005A63"
                style={styles.inputIcon}
              />
            </View>

            <Text style={styles.ratingTitle}>AVALIE SUA EXPERIÊNCIA</Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  activeOpacity={0.7}
                  onPress={() => handleStarPress(star)}
                >
                  <FontAwesome
                    name={star <= nota ? "star" : "star-o"}
                    size={32}
                    color="#005A63"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={enviarFeedback}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>Enviar</Text>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}