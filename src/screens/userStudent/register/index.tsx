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
  Octicons,
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

  // Etapas: 1 (Dados Pessoais), 2 (Contato/Nasc), 3 (Fotos), 4 (Senha)
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  // Etapa 1
  const [nome, setNome] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [cpf, setCpf] = useState("");
  const [cpfResponsavel, setCpfResponsavel] = useState("");

  // Etapa 2
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [hiperfoco, setHiperfoco] = useState("");

  // Etapa 3
  const [laudos, setLaudos] = useState<string[]>([]);
  const [fotoRosto, setFotoRosto] = useState<string | null>(null);

  // Etapa 4
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Animação
  const modalTranslate = useSharedValue(height * 0.88);

  useEffect(() => {
    modalTranslate.value = withTiming(0, {
      duration: 750,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalTranslate.value }],
  }));

  // Formatador e Validador de CPF
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
    for (let i = 1; i <= 9; i++) soma += parseInt(clean.substring(i - 1, i)) * (11 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(clean.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(clean.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(clean.substring(10, 11));
  }

  // Formatador e Validador de Telefone (celular brasileiro: 11 dígitos)
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

  // Captura de Imagens
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

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  }

  // Submissão Final para a API
  async function handleRegister() {
    if (!senha.trim() || !confirmarSenha.trim()) {
      Alert.alert("Atenção", "Preencha a senha e a confirmação.");
      return;
    }
    if (senha.length < 6) {
      Alert.alert("Senha fraca", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("nomeResponsavel", nomeResponsavel);
      formData.append("cpf", cpf);
      formData.append("cpfResponsavel", cpfResponsavel);
      formData.append(
        "dataNascimento",
        dataNascimento ? dataNascimento.toISOString().split("T")[0] : ""
      );
      formData.append("email", email);
      formData.append("telefone", telefone);
      if (hiperfoco) formData.append("hiperfoco", hiperfoco);
      formData.append("senha", senha);

      // Foto do Rosto
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

      // Laudos
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
        Alert.alert("Erro no Cadastro", data.detail || data.message || "Falha ao cadastrar.");
      }
    } catch (error) {
      console.log("ERRO CADASTRO:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (step === 1) {
      if (!nome.trim() || !nomeResponsavel.trim() || !cpf.trim() || !cpfResponsavel.trim()) {
        Alert.alert("Atenção", "Preencha todos os campos.");
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
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!dataNascimento || !email.trim() || !telefone.trim()) {
        Alert.alert("Atenção", "Preencha data de nascimento, e-mail e telefone.");
        return;
      }
      if (!validateEmail(email)) {
        Alert.alert("E-mail Inválido", "Por favor, insira um e-mail válido.");
        return;
      }
      if (!validatePhone(telefone)) {
        Alert.alert("Telefone Inválido", "Informe um número de telefone válido com DDD.");
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (laudos.length === 0) {
        Alert.alert("Atenção", "Adicione pelo menos 1 foto do laudo.");
        return;
      }
      if (!fotoRosto) {
        Alert.alert("Atenção", "Adicione a foto do rosto do aluno.");
        return;
      }
      setStep(4);
      return;
    }

    if (step === 4) {
      handleRegister();
    }
  }

  return (
    <View style={styles.container}>
      {/* Topo fixo com botão voltar e logo */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons
            name="chevron-left"
            size={36}
            color={theme.colors.primary}
          />
        </TouchableOpacity>

        <Image
          source={require("../../../assets/luna.png")}
          style={styles.lunaLogo}
          resizeMode="contain"
        />
      </View>

      {/* Card Animado */}
      <Animated.View style={[styles.card, modalStyle]}>
        <View>
          <Text style={styles.title}>CADASTRO</Text>
          <Text style={styles.subtitle}>
            {step === 4 ? "Defina sua senha de acesso" : "Dados do aluno"}
          </Text>

          {/* ETAPA 1 */}
          {step === 1 && (
            <View style={styles.inputsContainer}>
              <CustomInput
                title="NOME"
                placeholder="Nome completo do aluno"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
                icon={
                  <Octicons
                    name="person"
                    size={20}
                    color={theme.colors.secondary}
                  />
                }
              />

              <CustomInput
                title="NOME DO RESPONSÁVEL"
                placeholder="Nome completo do responsável"
                value={nomeResponsavel}
                onChangeText={setNomeResponsavel}
                style={styles.input}
                icon={
                  <Octicons
                    name="person"
                    size={20}
                    color={theme.colors.secondary}
                  />
                }
              />

              <CustomInput
                title="CPF"
                placeholder="000.000.000-00"
                keyboardType="numeric"
                maxLength={14}
                value={cpf}
                onChangeText={(text) => setCpf(maskCPF(text))}
                style={styles.input}
                icon={
                  <MaterialIcons
                    name="badge"
                    size={20}
                    color={theme.colors.secondary}
                  />
                }
              />

              <CustomInput
                title="CPF DO RESPONSÁVEL"
                placeholder="000.000.000-00"
                keyboardType="numeric"
                maxLength={14}
                value={cpfResponsavel}
                onChangeText={(text) => setCpfResponsavel(maskCPF(text))}
                style={styles.input}
                icon={
                  <MaterialIcons
                    name="badge"
                    size={20}
                    color={theme.colors.secondary}
                  />
                }
              />
            </View>
          )}

          {/* ETAPA 2 */}
          {step === 2 && (
            <View style={styles.inputsContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowDatePicker(true)}
              >
                <View pointerEvents="none">
                  <CustomInput
                    title="DATA DE NASCIMENTO"
                    placeholder="Selecione no calendário"
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
                  value={dataNascimento || new Date(2012, 0, 1)}
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
                placeholder="exemplo@email.com"
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
                placeholder="(00) 00000-0000"
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
            </View>
          )}

          {/* ETAPA 3 */}
          {step === 3 && (
            <View style={styles.uploadSection}>
              <Text style={styles.uploadSectionTitle}>
                LAUDO DE TDAH DO ALUNO ({laudos.length}/2)
              </Text>

              <TouchableOpacity
                style={styles.actionCard}
                activeOpacity={0.8}
                onPress={() => takePhotoWithCamera("laudo")}
              >
                <View style={styles.iconCircle}>
                  <Feather name="camera" size={22} color={theme.colors.primary} />
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
                activeOpacity={0.8}
                onPress={() => pickImageFromGallery("laudo")}
              >
                <View style={styles.iconCircle}>
                  <Feather name="image" size={22} color={theme.colors.primary} />
                </View>
                <View style={styles.actionCardTexts}>
                  <Text style={styles.actionCardTitle}>Escolha da galeria</Text>
                  <Text style={styles.actionCardSubtitle}>
                    Selecione uma imagem salva
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={{ marginTop: 24 }}>
                <Text style={styles.uploadSectionTitle}>
                  IMAGEM DO ROSTO DO ALUNO {fotoRosto ? "(Selecionada)" : ""}
                </Text>

                <TouchableOpacity
                  style={styles.actionCard}
                  activeOpacity={0.8}
                  onPress={() => takePhotoWithCamera("rosto")}
                >
                  <View style={styles.iconCircle}>
                    <Feather name="camera" size={22} color={theme.colors.primary} />
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
                  activeOpacity={0.8}
                  onPress={() => pickImageFromGallery("rosto")}
                >
                  <View style={styles.iconCircle}>
                    <Feather name="image" size={22} color={theme.colors.primary} />
                  </View>
                  <View style={styles.actionCardTexts}>
                    <Text style={styles.actionCardTitle}>Escolha da galeria</Text>
                    <Text style={styles.actionCardSubtitle}>
                      Selecione uma imagem salva
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ETAPA 4 */}
          {step === 4 && (
            <View style={styles.inputsContainer}>
              <CustomInput
                title="SENHA"
                placeholder="Digite sua senha"
                secureTextEntry={true}
                value={senha}
                onChangeText={setSenha}
                style={[styles.input, { marginTop: 28 }]}
                icon={
                  <MaterialIcons
                    name="lock"
                    size={20}
                    color={theme.colors.secondary}
                  />
                }
              />

              <CustomInput
                title="CONFIRMAR SENHA"
                placeholder="Confirme sua senha"
                secureTextEntry={true}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                style={[styles.input, { marginTop: 58 }]}
                icon={
                  <MaterialIcons
                    name="lock-outline"
                    size={20}
                    color={theme.colors.secondary}
                  />
                }
              />
            </View>
          )}
        </View>

        {/* Botão Inferior com Spinner durante carregamento */}
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.secondary} />
          ) : (
            <CustomButton
              title={step === 4 ? "Cadastrar" : "Continuar"}
              onPress={handleNext}
              style={styles.customButton}
            />
          )}
        </View>
      </Animated.View>
    </View>
  );
}