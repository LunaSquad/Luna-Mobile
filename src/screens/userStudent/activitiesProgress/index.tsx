import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

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
};

type ActivitiesProgressScreenProps = {
  route?: {
    params?: RouteParams;
  };
};

const materias = [
  { sigla: "LP", nome: "Português", cor: "#006d77" },
  { sigla: "MAT", nome: "Matemática", cor: "#06156f" },
  { sigla: "GEO", nome: "Geografia", cor: "#7c2d12" },
  { sigla: "HIS", nome: "História", cor: "#4b1d0d" },
];

export default function ActivitiesProgressScreen({
  route,
}: ActivitiesProgressScreenProps) {
  const navigation = useNavigation<any>();
  const { materiaId, materiaNome, userId, turmaId } = route?.params || {};

  const materiaInicial =
    materias.find((m) =>
      materiaNome
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          m.nome
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        )
    )?.sigla || "MAT";

  const [loading, setLoading] = useState(true);
  const [materiaSelecionada, setMateriaSelecionada] = useState(materiaInicial);
  const [planos, setPlanos] = useState<Plano[]>([]);

  useEffect(() => {
    carregarAtividades();
  }, [materiaSelecionada, turmaId]);

  async function carregarAtividades() {
      setLoading(true);

      try {
        if (!turmaId || !materiaId) {
          setPlanos([]);
          return;
        }

        // Agora bate na rota correta de lesson-plans enviando turma e matéria
        const response = await fetch(`${API_BASE_URL}/lesson-plans/turma/${turmaId}/materia/${materiaId}`);
        const data = await response.json();

        if (response.ok && data.planos) {
          const planosMapeados = data.planos.map((plano: any) => ({
            idPlano: plano._id || plano.id,
            titulo: plano.titulo,
            descricao: plano.descricao,
            status: plano.status || "andamento",
            materia: materiaSelecionada,
            urlPlanoDeAula: plano.urlPlanoDeAula // Capturando o link do Cloudinary
          }));
          
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
    }

  // ATUALIZADO: Agora enviando todos os parâmetros necessários para a IA
  function abrirAtividadeAdaptada(plano: any) {
    navigation.navigate("AdaptedActivity", {
      planoId: plano.idPlano,
      planoTitulo: plano.titulo,
      planoDescricao: plano.descricao,
      urlPlanoDeAula: plano.urlPlanoDeAula, 
      userId,
      turmaId,     // Faltava enviar isso
      materiaId,   // Faltava enviar isso
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