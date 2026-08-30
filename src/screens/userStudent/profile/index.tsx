import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";


import styles from "./style/style";

import API_BASE_URL from "../../../services/ip";
import testPerfil from "../../../assets/assets-home/PerfilTest.png";

export default function Perfil({ route }: any) {

  const navigation = useNavigation<any>();

  const { userId, tipoUser } = route.params || {};

  const [aluno, setAluno] = useState<any>(null);

  useEffect(() => {

    async function carregarAluno() {

      try {

        if (!userId) return;

        const response = await fetch(
          `${API_BASE_URL}/students/aluno/${userId}`
        );

        const data = await response.json();

        if (data.ok) {
          setAluno(data.aluno || null);
        }

      } catch (error) {

        console.log("Erro ao carregar aluno:", error);

      }

    }

    carregarAluno();

  }, [userId]);

  function formatarData(dataISO: string) {
    if (!dataISO) return "Usuário";

    const [data] = dataISO.split("T"); 
    const [ano, mes, dia] = data.split("-"); 

    return `${dia}/${mes}/${ano}`; 
  }

  function formatarCPF(cpf: string) {
    if (!cpf) return "Usuário";

    const cpfLimpo = cpf.replace(/\D/g, "");

    return cpfLimpo.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4"
    );   
  }

  return (

    <View style={styles.container}>

      <View style={styles.topSection}>

        <View style={styles.header}>

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

        <View style={styles.profileSummary}>

          <View>

            <Text style={styles.userName}>
              {aluno?.nome || "Usuário"}
            </Text>

          </View>

          <Image
            style={styles.profilePhoto}
            source={
              aluno?.urlFotoAluno
                ? { uri: aluno.urlFotoAluno }
                : testPerfil
            }
          />

        </View>

      </View>

      <View style={styles.card}>
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.titleInfo}>NOME</Text>
            <Text style={styles.infoItem}>
                  {aluno?.nome || "Usuário"}
            </Text>
          </View>
          <View>
            <Text style={styles.titleInfo}>CPF</Text>
            <Text style={styles.infoItem}>
              {aluno?.cpf ? formatarCPF(aluno.cpf) : "Usuário"}
            </Text>
          </View>
          <View>
            <Text style={styles.titleInfo}>E-MAIL</Text>
            <Text style={styles.infoItem}>
                  {aluno?.email || "Usuário"}
            </Text>
          </View>
          <View>
            <Text style={styles.titleInfo}>DATA DE NASCIMENTO</Text>
            <Text style={styles.infoItem}>
              {aluno?.dataNasc ? formatarData(aluno.dataNasc) : "Usuário"}
            </Text>
          </View>
          <Text style={styles.titleInfo}>LAUDO</Text>
          <TouchableOpacity
            style={styles.infoItemContainer}
            activeOpacity={0.6}
            onPress={() => {
              if (aluno?.urlFotoLaudo) {
                Linking.openURL(aluno.urlFotoLaudo);
              }
            }}
          >
            <MaterialIcons
              name="description"
              size={18}
              color="#006d77"
            />
            <Text style={styles.infoItemLaudo}>Ver laudo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.editButtons}>
          <View style={styles.divider} />
          <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.6}
              onPress={() => {
                navigation.navigate('EditHyperfocus'); 
              }}
            >
              <MaterialIcons
                name="edit"
                size={22}
                color="#006d77"
              />

              <Text style={styles.actionText}>
                Editar hiperfoco
              </Text>

              <MaterialIcons
                name="arrow-forward"
                size={24}
                color="#006d77"
              />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.6}
              onPress={() => {
                // aqui vai a função de ir pra tela de edição de dados do aluno
              }}
            >
              <MaterialIcons
                name="edit-square"
                size={22}
                color="#006d77"
              />

              <Text style={styles.actionText}>
                Editar dados
              </Text>

              <MaterialIcons
                name="arrow-forward"
                size={24}
                color="#006d77"
              />
            </TouchableOpacity>
          </View>

      </View>

    </View>

  );
}