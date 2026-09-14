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

function StepDots({
  currentStep,
  totalSteps = 4,
}: {
  currentStep: number;
  totalSteps?: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginBottom: 24,
      }}
    >
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;
        return <Dot key={i} active={isActive} done={isDone} />;
      })}
    </View>
  );
}

function Dot({ active, done }: { active: boolean; done: boolean }) {
  const width = useSharedValue(active ? 22 : 8);

  useEffect(() => {
    width.value = withTiming(active ? 22 : 8, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [active]);

  const dotStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <Animated.View
      style={[
        {
          height: 8,
          borderRadius: 4,
          backgroundColor:
            active || done ? theme.colors.primary : theme.colors.secondary,
        },
        dotStyle,
      ]}
    />
  );
}

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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

  // Etapa 4 (Opcional na edição)
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Animação Modal
  const modalTranslate = useSharedValue(height * 0.88);

  useEffect(() => {
    modalTranslate.value = withTiming(0, {
      duration: 750,
      easing: Easing.out(Easing.exp),
    });

    fetchUserProfile();
  }, []);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalTranslate.value }],
  }));

  // 1. Carrega os dados do estudante ao abrir a tela
  async function fetchUserProfile() {
    try {
      setInitialLoading(true);
      const response = await fetch(`${API_BASE_URL}/student/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      console.log("STATUS:", response.status);
      const data = await response.json();

      if (response.ok && data) {
        setNome(data.nome || "");
        setNomeResponsavel(data.nomeResponsavel || "");
        setCpf(data.cpf ? maskCPF(data.cpf) : "");
        setCpfResponsavel(data.cpfResponsavel ? maskCPF(data.cpfResponsavel) : "");
        setEmail(data.email || "");
        setTelefone(data.telefone ? maskPhone(data.telefone) : "");
        setHiperfoco(data.hiperfoco || "");

        if (data.dataNascimento) {
          setDataNascimento(new Date(data.dataNascimento));
        }
        if (data.fotoRosto) {
          setFotoRosto(data.fotoRosto);
        }
        if (data.laudos && Array.isArray(data.laudos)) {
          setLaudos(data.laudos);
        }
      }
    } catch (error) {
      console.log("ERRO AO CARREGAR PERFIL:", error);
    } finally {
      setInitialLoading(false);
    }
  }

  // Máscaras e Validações
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
      soma += parseInt(clean.substring(i - 1, i)) * (11 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(clean.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(clean.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(clean.substring(10, 11));
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

  // 2. Submissão da Atualização (PUT/PATCH)
  async function handleUpdateProfile() {
    if (senha.trim()) {
      if (senha.length < 6) {
        Alert.alert("Senha fraca", "A nova senha deve ter no mínimo 6 caracteres.");
        return;
      }
      if (senha !== confirmarSenha) {
        Alert.alert("Erro", "As senhas não coincidem.");
        return;
      }
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("nomeResponsavel", nomeResponsavel);
      formData.append("cpf", cpf.replace(/\D/g, ""));
      formData.append("cpfResponsavel", cpfResponsavel.replace(/\D/g, ""));
      formData.append(
        "dataNascimento",
        dataNascimento ? dataNascimento.toISOString().split("T")[0] : ""
      );
      formData.append("email", email);
      formData.append("telefone", telefone.replace(/\D/g, ""));
      if (hiperfoco) formData.append("hiperfoco", hiperfoco);
      if (senha.trim()) formData.append("senha", senha);

      if (fotoRosto && fotoRosto.startsWith("file://")) {
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
        if (uri.startsWith("file://")) {
          const filename = uri.split("/").pop() || `laudo_${index}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image/jpeg`;
          formData.append("laudos", {
            uri,
            name: filename,
            type,
          } as any);
        }
      });

      const response = await fetch(`${API_BASE_URL}/student/profile`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Erro na Atualização",
          data.detail || data.message || "Falha ao atualizar perfil."
        );
      }
    } catch (error) {
      console.log("ERRO EDICAO:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (step === 1) {
      if (cpf.trim() && !validateCPF(cpf)) {
        Alert.alert("CPF Inválido", "O CPF do aluno informado não é válido.");
        return;
      }
      if (cpfResponsavel.trim() && !validateCPF(cpfResponsavel)) {
        Alert.alert(
          "CPF Inválido",
          "O CPF do responsável informado não é válido."
        );
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (email.trim() && !validateEmail(email)) {
        Alert.alert("E-mail Inválido", "Por favor, insira um e-mail válido.");
        return;
      }
      if (telefone.trim() && !validatePhone(telefone)) {
        Alert.alert(
          "Telefone Inválido",
          "Informe um número de telefone válido com DDD."
        );
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      setStep(4);
      return;
    }

    if (step === 4) {
      handleUpdateProfile();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons
            name="chevron-left"
            size={36}
            color={theme.colors.background}
          />
        </TouchableOpacity>

        <Image
          source={require("../../../assets/luna-positivo.png")}
          style={styles.lunaLogo}
          resizeMode="contain"
        />
      </View>

      <Animated.View style={[styles.card, modalStyle]}>
         <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>EDITAR DADOS DA CRIANÇA</Text>
            
            <Image
              source={require("../../../assets/imagem-edit.png")}
              style={styles.titleImage}
              resizeMode="contain"
            />
          </View>

          <StepDots currentStep={step} totalSteps={4} />

          {/* ETAPA 1 */}
          {step === 1 && (
            <View style={styles.inputsContainer}>
              <CustomInput
                title="NOME"
                titleColor={theme.colors.primary}
                borderColor={theme.colors.primary}
                placeholder="Nome completo do aluno"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
                icon={
                  <Octicons name="person" size={20} color={theme.colors.primary} />
                }
              />

              <CustomInput
                title="NOME DO RESPONSÁVEL"
                titleColor={theme.colors.primary}
                borderColor={theme.colors.primary}
                placeholder="Nome completo do responsável"
                value={nomeResponsavel}
                onChangeText={setNomeResponsavel}
                style={styles.input}
                icon={
                  <Octicons name="person" size={20} color={theme.colors.primary} />
                }
              />

              <CustomInput
                title="CPF"
                titleColor={theme.colors.primary}
                borderColor={theme.colors.primary}
                placeholder="000.000.000-00"
                keyboardType="numeric"
                maxLength={14}
                value={cpf}
                onChangeText={(text) => setCpf(maskCPF(text))}
                style={styles.input}
                icon={
                  <MaterialIcons name="badge" size={20} color={theme.colors.primary} />
                }
              />

              <CustomInput
                title="CPF DO RESPONSÁVEL"
                titleColor={theme.colors.primary}
                borderColor={theme.colors.primary}
                placeholder="000.000.000-00"
                keyboardType="numeric"
                maxLength={14}
                value={cpfResponsavel}
                onChangeText={(text) => setCpfResponsavel(maskCPF(text))}
                style={styles.input}
                icon={
                  <MaterialIcons name="badge" size={20} color={theme.colors.primary} />
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
                    titleColor={theme.colors.primary}
                    borderColor={theme.colors.primary}
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
                        color={theme.colors.primary}
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
                titleColor={theme.colors.primary}
                borderColor={theme.colors.primary}
                placeholder="exemplo@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                icon={
                  <MaterialIcons name="email" size={20} color={theme.colors.primary} />
                }
              />

              <CustomInput
                title="TELEFONE"
                titleColor={theme.colors.primary}
                borderColor={theme.colors.primary}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                maxLength={15}
                value={telefone}
                onChangeText={(text) => setTelefone(maskPhone(text))}
                style={styles.input}
                icon={
                  <Feather name="smartphone" size={20} color={theme.colors.primary} />
                }
              />

              <CustomInput
                title="HIPERFOCO"
                titleColor={theme.colors.primary}
                borderColor={theme.colors.primary}
                placeholder="Indique o hiperfoco da criança"
                value={hiperfoco}
                onChangeText={setHiperfoco}
                style={styles.input}
                icon={
                  <MaterialCommunityIcons
                    name="emoticon-happy-outline"
                    size={20}
                    color={theme.colors.primary}
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
                  <Feather name="camera" size={22} color={theme.colors.secondary} />
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
                  <Feather name="image" size={22} color={theme.colors.secondary} />
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
                  IMAGEM DO ROSTO DO ALUNO {fotoRosto ? "(Cadastrada)" : ""}
                </Text>

                <TouchableOpacity
                  style={styles.actionCard}
                  activeOpacity={0.8}
                  onPress={() => takePhotoWithCamera("rosto")}
                >
                  <View style={styles.iconCircle}>
                    <Feather name="camera" size={22} color={theme.colors.secondary} />
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
                    <Feather name="image" size={22} color={theme.colors.secondary} />
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
              <View style={styles.passwordStepWrapper}>
                  <CustomInput
                    title="NOVA SENHA"
                    titleColor={theme.colors.primary}
                    borderColor={theme.colors.primary}
                    placeholder="Deixe em branco para manter a atual"
                    secureTextEntry={true}
                    value={senha}
                    onChangeText={setSenha}
                    style={styles.input}
                    icon={
                      <MaterialIcons name="lock" size={20} color={theme.colors.primary} />
                    }
                  />

                  <CustomInput
                    title="CONFIRMAR NOVA SENHA"
                    titleColor={theme.colors.primary}
                    borderColor={theme.colors.primary}
                    placeholder="Confirme a nova senha"
                    secureTextEntry={true}
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    style={styles.input}
                    icon={
                      <MaterialIcons
                        name="lock-outline"
                        size={20}
                        color={theme.colors.primary}
                      />
                    }
                  />
              </View>
            )}
        </View>

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <CustomButton
              title={step === 4 ? "Editar" : "Continuar"}
              style={[styles.customButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleNext}
              textColor={theme.colors.secondary}
            />
          )}
        </View>
      </Animated.View>
    </View>
  );
}