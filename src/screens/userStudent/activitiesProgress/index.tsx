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

const { height } = Dimensions.get("window");

type RouteParams = {
  materiaId?: string;
  materiaNome?: string;
  userId?: string;
};

type Plano = {
  idPlano: string;
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
  const { materiaId, materiaNome, userId } = route?.params || {};

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
  }, []);

  const lunaStyle = useAnimatedStyle(() => ({
    top: logoPosition.value - 70,
    width: logoSize.value * 0.5,
    height: logoSize.value * 0.5,
  }));

  function ehMatematica(nome?: string) {
    return (nome || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes("matematica");
  }

  useEffect(() => {
    function carregarAtividades() {
      setLoading(true);

      if (ehMatematica(materiaNome)) {
        const planoAdicao: Plano = {
          idPlano: "plano-pdf-adicao-simples",
          titulo: "Adição simples",
          descricao:
            "Aprenda a juntar quantidades e resolver somas simples até 10.",
          status: "andamento",
        };

        setPlanos([planoAdicao]);
      } else {
        setPlanos([]);
      }

      setLoading(false);
    }

    carregarAtividades();
  }, [materiaId, materiaNome, userId]);

  const emAndamento = planos.filter((p) => p.status === "andamento");
  const vencidas = planos.filter((p) => p.status === "vencida");
  const concluidas = planos.filter((p) => p.status === "concluida");

  function abrirAtividadeAdaptada(plano: Plano) {
    navigation.navigate("AdaptedActivity", {
      planoId: plano.idPlano,
      planoTitulo: plano.titulo,
      planoDescricao: plano.descricao,
      materiaId,
      materiaNome,
      userId,
    });
  }

  function renderLista(lista: Plano[], mensagemVazia: string) {
    if (lista.length === 0) {
      return <Text style={{ marginLeft: 16 }}>{mensagemVazia}</Text>;
    }

    return lista.map((p) => (
      <TouchableOpacity
        key={p.idPlano}
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

  const temAtividade = planos.length > 0;

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
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : !temAtividade ? (
          <View style={{ marginTop: 40, paddingHorizontal: 24 }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Sem aulas adaptadas no momento
            </Text>

            <Text
              style={{
                textAlign: "center",
                marginTop: 8,
                fontSize: 14,
                color: "#666",
              }}
            >
              Ainda não existem atividades adaptadas disponíveis para essa
              matéria.
            </Text>
          </View>
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