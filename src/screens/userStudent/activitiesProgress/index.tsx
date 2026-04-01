import { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./style/style";
import { ProgressCard } from "../../../components/activities/index";
import API_BASE_URL from "../../../services/ip";

const { height } = Dimensions.get("window");

type RouteParams = {
  materiaId?: string;
  materiaNome?: string;
};

type Plano = {
  idPlano?: string;
  titulo: string;
  descricao: string;
  status: "andamento" | "vencida" | "concluida" | string;
};

type ActivitiesProgressScreenProps = {
  route?: {
    params?: RouteParams;
  };
};

export default function ActivitiesProgressScreen({
  route,
}: ActivitiesProgressScreenProps) {
  const navigation = useNavigation<any>();
  const { materiaId, materiaNome } = route?.params || {};

  const [loading, setLoading] = useState(true);
  const [planos, setPlanos] = useState<Plano[]>([]);

  const logoPosition = useSharedValue(height / 2 - 100);
  const logoSize = useSharedValue(200);
  const modalTranslate = useSharedValue(height * 0.7);

  useEffect(() => {
    const timer = setTimeout(() => {
      logoSize.value = withTiming(150, {
        duration: 600,
        easing: Easing.out(Easing.exp),
      });

      logoPosition.value = withTiming(90, {
        duration: 600,
        easing: Easing.out(Easing.exp),
      });

      modalTranslate.value = withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [logoPosition, logoSize, modalTranslate]);

  const lunaStyle = useAnimatedStyle(() => ({
    top: logoPosition.value - 70,
    width: logoSize.value * 0.5,
    height: logoSize.value * 0.5,
  }));

useEffect(() => {
  async function carregarPlanos() {
    console.log("PARAMS ATIVIDADES:", route?.params);

    try {
      if (!materiaId) {
        console.log("❌ Sem materiaId vindo da Home");
        setLoading(false);
        return;
      }

      const resp = await fetch(`${API_BASE_URL}/planos/${materiaId}`);
      const data: { ok: boolean; planos?: Plano[] } = await resp.json();

      console.log("PLANOS:", data);

      if (data.ok) {
        const planosBanco = data.planos || [];

        const planoExtra: Plano = {
          idPlano: "mock-2",
          titulo: "Rimas e Leitura Divertida",
          descricao:
            "Leitura e interpretação de pequenas histórias com rimas e palavras infantis.",
          status: "andamento",
        };

        setPlanos([...planosBanco, planoExtra]);
      }
    } catch (e) {
      console.log("ERRO AO BUSCAR PLANOS:", e);
    } finally {
      setLoading(false);
    }
  }

  carregarPlanos();
}, [materiaId, route?.params]);useEffect(() => {
  async function carregarPlanos() {
    console.log("PARAMS ATIVIDADES:", route?.params);

    try {
      if (!materiaId) {
        console.log("❌ Sem materiaId vindo da Home");
        setLoading(false);
        return;
      }

      const resp = await fetch(`${API_BASE_URL}/planos/${materiaId}`);
      const data: { ok: boolean; planos?: Plano[] } = await resp.json();

      console.log("PLANOS:", data);

      if (data.ok) {
        const planosBanco = data.planos || [];

        const planoExtra: Plano = {
          idPlano: "mock-2",
          titulo: "Rimas e Leitura Divertida",
          descricao:
            "Leitura e interpretação de pequenas histórias com rimas e palavras infantis.",
          status: "andamento",
        };

        setPlanos([...planosBanco, planoExtra]);
      }
    } catch (e) {
      console.log("ERRO AO BUSCAR PLANOS:", e);
    } finally {
      setLoading(false);
    }
  }

  carregarPlanos();
}, [materiaId, route?.params]);

  const emAndamento = planos.filter((p) => p.status === "andamento");
  const vencidas = planos.filter((p) => p.status === "vencida");
  const concluidas = planos.filter((p) => p.status === "concluida");

  function abrirAtividadeAdaptada(plano: Plano) {
    navigation.navigate("AdaptedActivity", {
      planoTitulo: plano.titulo,
      planoDescricao: plano.descricao,
      hiperfoco: "videogames",
    });
  }

  function renderLista(lista: Plano[], mensagemVazia: string) {
    if (lista.length === 0) {
      return <Text style={{ marginLeft: 16 }}>{mensagemVazia}</Text>;
    }

    return lista.map((p) => (
      <TouchableOpacity
        key={p.idPlano || p.titulo}
        activeOpacity={0.8}
        onPress={() => abrirAtividadeAdaptada(p)}
      >
        <ProgressCard
          title={p.titulo}
          description={p.descricao}
          image={require("../../../assets/img1-atividade-andamento.png")}
        />
      </TouchableOpacity>
    ));
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.viewBorderRadius}>
          <Animated.Image
            source={require("../../../assets/luna-positivo.png")}
            style={[styles.luna, lunaStyle]}
            resizeMode="contain"
          />

          <Image
            source={require("../../../assets/logo mobile-positivo.png")}
            style={styles.logo}
          />

          <Text style={styles.titleActivitie}>
            Atividades {materiaNome ? `- ${materiaNome}` : ""}
          </Text>

          <Text style={styles.titleData}>Hoje</Text>
          <Text style={{ marginLeft: 16 }}>materiaId: {String(materiaId)}</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : (
          <>
            <Text style={styles.textAndamento}>Atividades em Andamento</Text>
            {renderLista(emAndamento, "Nenhuma atividade em andamento")}

            <Text style={styles.textAndamento}>Atividades Vencidas</Text>
            {renderLista(vencidas, "Nenhuma atividade vencida")}

            <Text style={styles.textAndamento}>Atividades Concluídas</Text>
            {renderLista(concluidas, "Nenhuma atividade concluída")}
          </>
        )}
      </View>
    </ScrollView>
  );
}