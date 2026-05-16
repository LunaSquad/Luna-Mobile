import { useState } from "react";

import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

import styles from "./style/style";

type Props = {
  route?: {
    params?: {
      userId?: string;
      hiperfocoAtual?: string;
    };
  };
};

export default function EditarHiperfoco({ route }: Props) {
  const navigation = useNavigation<any>();

  const { userId, hiperfocoAtual } = route?.params || {};

  const [hiperfoco, setHiperfoco] = useState("");

  function salvarHiperfoco() {
    if (!hiperfoco.trim()) {
      Alert.alert("Atenção", "Digite um hiperfoco antes de salvar.");
      return;
    }

    console.log("USER ID:", userId);
    console.log("NOVO HIPERFOCO:", hiperfoco);

    Alert.alert("Sucesso", "Hiperfoco salvo com sucesso!");

    navigation.goBack();
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
            {hiperfocoAtual || "Não informado"}
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
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={salvarHiperfoco}
        >
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}