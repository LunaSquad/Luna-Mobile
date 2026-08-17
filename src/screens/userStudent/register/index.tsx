import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import {
  MaterialIcons,
  Octicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import CustomInput from "../../../components/input/customInput";
import CustomButton from "../../../components/mainButton/customButton";
import { styles } from "./style/style";

const { height } = Dimensions.get("window");

export default function RegisterScreen() {
  const navigation = useNavigation<any>();

  // Controle da Etapa Atual (1, 2, 3 ou 4)
  const [step, setStep] = useState<number>(1);

  // Dados da Etapa 1
  const [nome, setNome] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [cpf, setCpf] = useState("");
  const [cpfResponsavel, setCpfResponsavel] = useState("");

  // Dados da Etapa 2
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [hiperfoco, setHiperfoco] = useState("");

  // Dados da Etapa 3 (Imagens)
  const [laudos, setLaudos] = useState<string[]>([]);
  const [fotoRosto, setFotoRosto] = useState<string | null>(null);

  // Dados da Etapa 4 (Senhas)
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Animação de subida do card
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

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  }

  // Funções de captura de imagem
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
      const uri = result.assets[0].uri;
      if (tipo === "laudo") {
        if (laudos.length >= 2) {
          Alert.alert("Limite atingido", "Você já adicionou 2 fotos do laudo.");
          return;
        }
        setLaudos((prev) => [...prev, uri]);
      } else {
        setFotoRosto(uri);
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
      const uri = result.assets[0].uri;
      if (tipo === "laudo") {
        if (laudos.length >= 2) {
          Alert.alert("Limite atingido", "Você já adicionou 2 fotos do laudo.");
          return;
        }
        setLaudos((prev) => [...prev, uri]);
      } else {
        setFotoRosto(uri);
      }
    }
  }

  function handleNext() {
    if (step === 1) {
      if (
        !nome.trim() ||
        !nomeResponsavel.trim() ||
        !cpf.trim() ||
        !cpfResponsavel.trim()
      ) {
        Alert.alert("Atenção", "Preencha todos os campos da etapa 1.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (
        !dataNascimento.trim() ||
        !email.trim() ||
        !telefone.trim() ||
        !hiperfoco.trim()
      ) {
        Alert.alert("Atenção", "Preencha todos os campos da etapa 2.");
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (laudos.length === 0) {
        Alert.alert("Atenção", "Por favor, adicione pelo menos 1 foto do laudo.");
        return;
      }
      if (!fotoRosto) {
        Alert.alert("Atenção", "Por favor, adicione a foto do rosto do aluno.");
        return;
      }
      setStep(4);
      return;
    }

    if (step === 4) {
      if (!senha.trim() || !confirmarSenha.trim()) {
        Alert.alert("Atenção", "Por favor, preencha a senha e a confirmação.");
        return;
      }

      if (senha !== confirmarSenha) {
        Alert.alert("Erro", "As senhas informadas não coincidem.");
        return;
      }

      const payload = {
        nome,
        nomeResponsavel,
        cpf,
        cpfResponsavel,
        dataNascimento,
        email,
        telefone,
        hiperfoco,
        laudos,
        fotoRosto,
        senha,
      };

      console.log("DADOS CONSOLIDADOS DO CADASTRO:", payload);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.navigate("Login");
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

      {/* Card Animado Verde */}
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
                placeholder="Nome"
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
                placeholder="Nome do responsável"
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
                placeholder="CPF"
                value={cpf}
                onChangeText={setCpf}
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
                placeholder="CPF do responsável"
                value={cpfResponsavel}
                onChangeText={setCpfResponsavel}
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
              <CustomInput
                title="DATA DE NASCIMENTO"
                placeholder="Data de nascimento"
                value={dataNascimento}
                onChangeText={setDataNascimento}
                style={styles.input}
                icon={
                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={20}
                    color={theme.colors.secondary}
                  />
                }
              />

              <CustomInput
                title="E-MAIL"
                placeholder="E-mail"
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
                value={telefone}
                onChangeText={setTelefone}
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

          {/* ETAPA 3: LAUDO E FOTO DO ROSTO */}
          {step === 3 && (
            <View style={styles.uploadSection}>
              {/* LAUDO DE TDAH */}
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

              {/* IMAGEM DO ROSTO */}
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

            {/* ETAPA 4: SENHA E CONFIRMAR SENHA */}
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

        {/* Botão Inferior */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={step === 4 ? "Cadastrar" : "Continuar"}
            onPress={handleNext}
            style={styles.customButton}
          />
        </View>
      </Animated.View>
    </View>
  );
}