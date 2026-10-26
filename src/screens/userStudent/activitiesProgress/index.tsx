import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles } from "./style/style";
import { ProgressCard } from "../../../components/activities/index";
import API_BASE_URL from "../../../services/ip";

type RouteParams = {
  materiaId?: string;
  materiaNome?: string;
  userId?: string;
  turmaId?: string;
};

type Plano = {
  idPlano: string;
  titulo: string;
  descricao: string;
  status: "andamento" | "vencida" | "concluida" | string;
  materia: string;
  urlPlanoDeAula?: string;
  turmaId?: string;
  materiaId?: string;
};

const materias = [
  { sigla: "LP", nome: "Português", cor: "#006d77" },
  { sigla: "MAT", nome: "Matemática", cor: "#06156f" },
  { sigla: "GEO", nome: "Geografia", cor: "#7c2d12" },
  { sigla: "HIS", nome: "História", cor: "#4b1d0d" },
];

function identificarSiglaPorNome(nome?: string): string {
  if (!nome) return "MAT";
  const limpo = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const encontrada = materias.find((m) =>
    limpo.includes(
      m.nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    )
  );

  return encontrada ? encontrada.sigla : "MAT";
}

export default function ActivitiesProgressScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { materiaId, materiaNome, userId, turmaId } = (route?.params || {}) as RouteParams;

  const siglaRota = identificarSiglaPorNome(materiaNome);

  const [loading, setLoading] = useState(true);
  const [materiaSelecionada, setMateriaSelecionada] = useState(siglaRota);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [userIdAtivo, setUserIdAtivo] = useState<string | undefined>(userId);
  const [turmaIdAtiva, setTurmaIdAtiva] = useState<string | undefined>(turmaId);

  useEffect(() => {
    if (materiaNome) {
      setMateriaSelecionada(identificarSiglaPorNome(materiaNome));
    }
  }, [materiaNome, materiaId]);

  useEffect(() => {
    async function sincronizarDadosLocais() {
      if (userId) {
        setUserIdAtivo(userId);
        await AsyncStorage.setItem("@luna_user_id", String(userId));
      } else {
        const salvoUser = await AsyncStorage.getItem("@luna_user_id");
        if (salvoUser) setUserIdAtivo(salvoUser);
      }

      if (turmaId) {
        setTurmaIdAtiva(turmaId);
        await AsyncStorage.setItem("@luna_turma_id", String(turmaId));
      } else {
        const salvoTurma = await AsyncStorage.getItem("@luna_turma_id");
        if (salvoTurma) setTurmaIdAtiva(salvoTurma);
      }
    }
    sincronizarDadosLocais();
  }, [userId, turmaId]);

  const carregarAtividades = useCallback(async () => {
    setLoading(true);

    try {
      const idUsuario = userId || userIdAtivo || (await AsyncStorage.getItem("@luna_user_id")) || "";
      const idTurma = turmaId || turmaIdAtiva || (await AsyncStorage.getItem("@luna_turma_id")) || "auto";

      const usarMateriaIdDaRota =
        Boolean(materiaId) &&
        Boolean(materiaNome) &&
        materiaSelecionada === identificarSiglaPorNome(materiaNome);

      const parametroMateria = usarMateriaIdDaRota ? materiaId : materiaSelecionada;

      const url = `${API_BASE_URL}/lesson-plans/turma/${idTurma}/materia/${parametroMateria}?sigla=${materiaSelecionada}&userId=${idUsuario}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && Array.isArray(data.planos)) {
        const planosMapeados: Plano[] = data.planos.map((plano: any) => ({
          idPlano: String(plano._id || plano.id),
          titulo: plano.titulo,
          descricao: plano.descricao,
          status: plano.status || "andamento",
          materia: materiaSelecionada,
          urlPlanoDeAula: plano.urlPlanoDeAula,
          turmaId: plano.turmaID ? String(plano.turmaID) : idTurma !== "auto" ? idTurma : undefined,
          materiaId: plano.materiaID ? String(plano.materiaID) : usarMateriaIdDaRota ? materiaId : undefined,
        }));

        if (planosMapeados.length > 0 && planosMapeados[0].turmaId) {
          await AsyncStorage.setItem("@luna_turma_id", planosMapeados[0].turmaId);
        }

        setPlanos(planosMapeados);
      } else {
        setPlanos([]);
      }
    } catch (error) {
      console.error("Erro ao buscar atividades reais:", error);
      setPlanos([]);
    } finally {
      setLoading(false);
    }
  }, [materiaSelecionada, turmaId, turmaIdAtiva, userId, userIdAtivo, materiaId, materiaNome]);

  useFocusEffect(
    useCallback(() => {
      carregarAtividades();
    }, [carregarAtividades])
  );

  function abrirAtividadeAdaptada(plano: Plano) {
    navigation.navigate("AdaptedActivity", {
      planoId: plano.idPlano,
      planoTitulo: plano.titulo,
      planoDescricao: plano.descricao,
      urlPlanoDeAula: plano.urlPlanoDeAula,
      userId: userId || userIdAtivo,
      turmaId: plano.turmaId || turmaId || turmaIdAtiva,
      materiaId: plano.materiaId || materiaId,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.phoneContent}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="chevron-left" size={32} color="#006d77" />
          </TouchableOpacity>

          <Image
            source={require("../../../assets/luna.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Image
            source={require("../../../assets/logo mobile.png")}
            style={styles.logoBorboleta}
            resizeMode="contain"
          />
        </View>

        <View style={styles.materiasContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.materiasScroll}
          >
            {materias.map((materia) => {
              const selecionada = materiaSelecionada === materia.sigla;

              return (
                <TouchableOpacity
                  key={materia.sigla}
                  activeOpacity={0.8}
                  onPress={() => setMateriaSelecionada(materia.sigla)}
                  style={[
                    styles.materiaButton,
                    {
                      backgroundColor: materia.cor,
                      opacity: selecionada ? 1 : 0.55,
                      transform: [{ scale: selecionada ? 1.08 : 1 }],
                      borderWidth: selecionada ? 3 : 0,
                      borderColor: selecionada ? "#ffffff" : "transparent",
                      elevation: selecionada ? 8 : 0,
                    },
                  ]}
                >
                  <Text style={styles.materiaText}>{materia.sigla}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <Text style={styles.titleSection}>Atividades lançadas</Text>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 30 }} color="#006d77" size="large" />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.activitiesList}
          >
            {planos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>
                  Nenhuma atividade lançada
                </Text>
                <Text style={styles.emptyText}>
                  Ainda não existem atividades disponíveis para essa matéria.
                </Text>
              </View>
            ) : (
              planos.map((plano) => (
                <TouchableOpacity
                  key={plano.idPlano}
                  activeOpacity={0.85}
                  onPress={() => abrirAtividadeAdaptada(plano)}
                >
                  <ProgressCard
                    materiaSigla={materiaSelecionada}
                    title={plano.titulo}
                    description={plano.descricao}
                  />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}