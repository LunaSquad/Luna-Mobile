import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import CustomInput from "../../../components/input/customInput";
import CustomButton from "../../../components/mainButton/customButton";
import API_BASE_URL from "../../../services/ip";
import { styles } from "./style/style";

const { height } = Dimensions.get("window");

export default function RegisterScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [cpf, setCpf] = useState("");
  const [cpfResponsavel, setCpfResponsavel] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [hiperfoco, setHiperfoco] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [laudos, setLaudos] = useState<string[]>([]);
  const [fotoRosto, setFotoRosto] = useState<string | null>(null);

  const modalTranslate = useSharedValue(height * 0.84);

  useEffect(() => {
    modalTranslate.value = withTiming(0, {
      duration: 700,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalTranslate.value }],
  }));

  function maskCPF(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  }

  function validateCPF(cpfString: string): boolean {
    const clean = cpfString.replace(/\D/g, "");
    if (clean.length !== 11 || !!clean.match(/(\d)\1{10}/)) return false;

    let soma = 0;
    for (let i = 1; i <= 9; i++)
      soma += parseInt(clean.substring(i - 1, i), 10) * (11 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(clean.substring(9, 10), 10)) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(clean.substring(i - 1, i), 10) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(clean.substring(10, 11), 10);
  }

  function maskPhone(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  }

  function validatePhone(phone: string): boolean {
    const clean = phone.replace(/\D/g, "");
    return clean.length === 10 || clean.length === 11;
  }

  function validateEmail(emailStr: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  }

  async function pickImageFromGallery(tipo: "laudo" | "rosto") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      if (tipo === "laudo") {
        if (laudos.length >= 2) {
          Alert.alert("Limite atingido", "Você já adicionou 2 fotos do laudo.");
          return;
        }
        setLaudos((prev) => [...prev, result.assets[0].uri]);
      } else {
        setFotoRosto(result.assets[0].uri);
      }
    }
  }

  async function takePhotoWithCamera(tipo: "laudo" | "rosto") {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à câmera.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      if (tipo === "laudo") {
        if (laudos.length >= 2) {
          Alert.alert("Limite atingido", "Você já adicionou 2 fotos do laudo.");
          return;
        }
        setLaudos((prev) => [...prev, result.assets[0].uri]);
      } else {
        setFotoRosto(result.assets[0].uri);
      }
    }
  }

  async function handleRegister() {
    if (
      !nome.trim() ||
      !nomeResponsavel.trim() ||
      !cpf.trim() ||
      !cpfResponsavel.trim()
    ) {
      Alert.alert("Atenção", "Preencha o nome e o CPF do aluno e do responsável.");
      return;
    }
    if (!validateCPF(cpf)) {
      Alert.alert("CPF Inválido", "O CPF do aluno informado não é válido.");
      return;
    }
    if (!validateCPF(cpfResponsavel)) {
      Alert.alert("CPF Inválido", "O CPF do responsável informado não é válido.");
      return;
    }
    if (!dataNascimento || !email.trim() || !telefone.trim()) {
      Alert.alert("Atenção", "Preencha data de nascimento, e-mail e telefone.");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("E-mail Inválido", "Por favor, insira um e-mail válido.");
      return;
    }
    if (!validatePhone(telefone)) {
      Alert.alert("Telefone Inválido", "Informe um telefone válido com DDD.");
      return;
    }
    if (!senha.trim() || senha.length < 6) {
      Alert.alert("Senha fraca", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (laudos.length === 0) {
      Alert.alert("Atenção", "Adicione pelo menos 1 foto do laudo de TDAH.");
      return;
    }
    if (!fotoRosto) {
      Alert.alert("Atenção", "Adicione a foto do rosto do aluno.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("nome", nome.trim());
      formData.append("nomeResponsavel", nomeResponsavel.trim());
      formData.append("cpf", cpf);
      formData.append("cpfResponsavel", cpfResponsavel);
      formData.append(
        "dataNascimento",
        dataNascimento ? dataNascimento.toISOString().split("T")[0] : ""
      );
      formData.append("email", email.trim());
      formData.append("telefone", telefone);
      formData.append("hiperfoco", hiperfoco.trim() || "dinossauros");
      formData.append("senha", senha);

      if (fotoRosto) {
        const filename = fotoRosto.split("/").pop() || "foto_aluno.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        formData.append("fotoRosto", {
          uri: fotoRosto,
          name: filename,
          type,
        } as any);
      }

      laudos.forEach((uri, index) => {
        const filename = uri.split("/").pop() || `laudo_${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        formData.append("laudos", {
          uri,
          name: filename,
          type,
        } as any);
      });

      const response = await fetch(`${API_BASE_URL}/register/student`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert(
          "Erro no Cadastro",
          data.detail || data.message || "Falha ao cadastrar."
        );
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons
            name="chevron-left"
            size={38}
            color={theme.colors.primary || "#005A63"}
          />
        </TouchableOpacity>

        <Image
          source={require("../../../assets/luna.png")}
          style={styles.lunaLogo}
          resizeMode="contain"
          resizeMethod="scale"
          fadeDuration={0}
        />
      </View>

      <Animated.View style={[styles.card, modalStyle]}>
        <Text style={styles.title}>CADASTRO</Text>
        <Text style={styles.subtitle}>Dados do aluno</Text>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <CustomInput
            title="NOME"
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            icon={
              <MaterialCommunityIcons
                name="account-edit-outline"
                size={22}
                color={theme.colors.secondary}
              />
            }
          />

          <CustomInput
            title="NOME DO RESPONSÁVEL"
            placeholder="Nome do responsável"
            value={nomeResponsavel}
            onChangeText={setNomeResponsavel}
            style={styles.input}
            icon={
              <MaterialCommunityIcons
                name="account-edit-outline"
                size={22}
                color={theme.colors.secondary}
              />
            }
          />

          <CustomInput
            title="CPF"
            placeholder="CPF"
            keyboardType="numeric"
            maxLength={14}
            value={cpf}
            onChangeText={(text) => setCpf(maskCPF(text))}
            style={styles.input}
            icon={
              <MaterialCommunityIcons
                name="card-account-details-outline"
                size={20}
                color={theme.colors.secondary}
              />
            }
          />

          <CustomInput
            title="CPF DO RESPONSÁVEL"
            placeholder="CPF do responsável"
            keyboardType="numeric"
            maxLength={14}
            value={cpfResponsavel}
            onChangeText={(text) => setCpfResponsavel(maskCPF(text))}
            style={styles.input}
            icon={
              <MaterialCommunityIcons
                name="card-account-details-outline"
                size={20}
                color={theme.colors.secondary}
              />
            }
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowDatePicker(true)}
          >
            <View pointerEvents="none">
              <CustomInput
                title="DATA DE NASCIMENTO"
                placeholder="Data de nascimento"
                value={
                  dataNascimento
                    ? dataNascimento.toLocaleDateString("pt-BR")
                    : ""
                }
                style={styles.input}
                icon={
                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={20}
                    color={theme.colors.secondary}
                  />
                }
              />
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dataNascimento || new Date(2015, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDataNascimento(selectedDate);
              }}
            />
          )}

          <CustomInput
            title="E-MAIL"
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            icon={
              <MaterialIcons
                name="email"
                size={20}
                color={theme.colors.secondary}
              />
            }
          />

          <CustomInput
            title="TELEFONE"
            placeholder="Telefone"
            keyboardType="phone-pad"
            maxLength={15}
            value={telefone}
            onChangeText={(text) => setTelefone(maskPhone(text))}
            style={styles.input}
            icon={
              <Feather
                name="smartphone"
                size={20}
                color={theme.colors.secondary}
              />
            }
          />

          <CustomInput
            title="HIPERFOCO"
            placeholder="Indique o hiperfoco da criança"
            value={hiperfoco}
            onChangeText={setHiperfoco}
            style={styles.input}
            icon={
              <MaterialCommunityIcons
                name="emoticon-happy-outline"
                size={20}
                color={theme.colors.secondary}
              />
            }
          />

          <CustomInput
            title="SENHA"
            placeholder="Senha"
            secureTextEntry={!mostrarSenha}
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
            icon={
              <TouchableOpacity
                onPress={() => setMostrarSenha((prev) => !prev)}
              >
                <Feather
                  name={mostrarSenha ? "eye" : "eye-off"}
                  size={20}
                  color={theme.colors.secondary}
                />
              </TouchableOpacity>
            }
          />

          <View style={styles.uploadSection}>
            <Text style={styles.uploadSectionTitle}>
              LAUDO DE TDAH DO ALUNO{" "}
              {laudos.length > 0 ? `(${laudos.length}/2)` : ""}
            </Text>

            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.85}
              onPress={() => takePhotoWithCamera("laudo")}
            >
              <View style={styles.iconCircle}>
                <MaterialIcons
                  name="photo-camera"
                  size={22}
                  color={theme.colors.primary || "#005A63"}
                />
              </View>
              <View style={styles.actionCardTexts}>
                <Text style={styles.actionCardTitle}>Tire uma foto</Text>
                <Text style={styles.actionCardSubtitle}>
                  Use a câmera do seu dispositivo
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.85}
              onPress={() => pickImageFromGallery("laudo")}
            >
              <View style={styles.iconCircle}>
                <MaterialIcons
                  name="image"
                  size={22}
                  color={theme.colors.primary || "#005A63"}
                />
              </View>
              <View style={styles.actionCardTexts}>
                <Text style={styles.actionCardTitle}>Escolha da galeria</Text>
                <Text style={styles.actionCardSubtitle}>
                  Selecione uma imagem salva
                </Text>
              </View>
            </TouchableOpacity>

            <Text style={[styles.uploadSectionTitle, { marginTop: 22 }]}>
              IMAGEM DO ROSTO DO ALUNO {fotoRosto ? "✓" : ""}
            </Text>

            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.85}
              onPress={() => takePhotoWithCamera("rosto")}
            >
              <View style={styles.iconCircle}>
                <MaterialIcons
                  name="photo-camera"
                  size={22}
                  color={theme.colors.primary || "#005A63"}
                />
              </View>
              <View style={styles.actionCardTexts}>
                <Text style={styles.actionCardTitle}>Tire uma foto</Text>
                <Text style={styles.actionCardSubtitle}>
                  Use a câmera do seu dispositivo
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.85}
              onPress={() => pickImageFromGallery("rosto")}
            >
              <View style={styles.iconCircle}>
                <MaterialIcons
                  name="image"
                  size={22}
                  color={theme.colors.primary || "#005A63"}
                />
              </View>
              <View style={styles.actionCardTexts}>
                <Text style={styles.actionCardTitle}>Escolha da galeria</Text>
                <Text style={styles.actionCardSubtitle}>
                  Selecione uma imagem salva
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.secondary} />
          ) : (
            <CustomButton
              title="Cadastrar"
              onPress={handleRegister}
              style={styles.customButton}
            />
          )}
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}