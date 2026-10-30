import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../services/ip";
import styles from "./style/style";

type Props = {
  route?: {
    params?: {
      userId?: string;
      hiperfocoAtual?: string;
      alunoData?: any;
    };
  };
};

export default function EditarHiperfoco({ route }: Props) {
  const navigation = useNavigation<any>();
  const { userId, hiperfocoAtual, alunoData } = route?.params || {};

  const [hiperfoco, setHiperfoco] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) setToken(storedToken);
    };
    getToken();
  }, []);

  async function salvarHiperfoco() {
    if (!hiperfoco.trim()) {
      Alert.alert("Atenção", "Digite um hiperfoco antes de salvar.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("hiperfoco", hiperfoco);

      // Repassando os dados obrigatórios para não apagar o resto do perfil
      if (alunoData) {
        if (alunoData.nome) formData.append("nome", alunoData.nome);
        if (alunoData.nomeResponsavel) formData.append("nomeResponsavel", alunoData.nomeResponsavel);
        if (alunoData.cpf) formData.append("cpf", alunoData.cpf);
        if (alunoData.cpfResponsavel) formData.append("cpfResponsavel", alunoData.cpfResponsavel);
        if (alunoData.email) formData.append("email", alunoData.email);
        if (alunoData.telefone) formData.append("telefone", alunoData.telefone);
        if (alunoData.dataNasc) {
          formData.append("dataNascimento", new Date(alunoData.dataNasc).toISOString().split("T")[0]);
        }
      }

      const response = await fetch(`${API_BASE_URL}/student/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        Alert.alert("Sucesso", "Hiperfoco atualizado com sucesso!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Erro", data.detail || data.message || "Falha ao atualizar hiperfoco.");
      }
    } catch (error) {
      console.log("ERRO AO SALVAR HIPERFOCO:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="chevron-left" size={34} color="#ffffff" />
        </TouchableOpacity>

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
        <Text style={styles.title}>EDITAR{"\n"}HIPERFOCO</Text>

        <Image
          source={require("../../../assets/hiperfoco.png")}
          style={styles.imageKids}
          resizeMode="contain"
        />

        <View style={styles.formArea}>
          <Text style={styles.label}>HIPERFOCO ATUAL</Text>

          <Text style={styles.currentText}>
            {hiperfocoAtual || alunoData?.hiperfoco || "Não informado"}
          </Text>

          <Text style={styles.label}>HIPERFOCO</Text>

          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Editar hiperfoco"
              placeholderTextColor="#555"
              value={hiperfoco}
              onChangeText={setHiperfoco}
            />

            <Image
              source={require("../../../assets/logo mobile.png")}
              style={styles.inputIcon}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity style={styles.photoButton} activeOpacity={0.8}>
            <MaterialIcons name="photo-camera" size={22} color="#ffffff" />
            <Text style={styles.photoButtonText}>
              Adicione uma foto do hiperfoco
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          activeOpacity={0.8}
          onPress={salvarHiperfoco}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}