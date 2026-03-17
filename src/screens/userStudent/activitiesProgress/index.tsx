import { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { styles } from "./style/style";
import { ProgressCard } from "../../../components/activities/index";

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
  route: {
    params?: RouteParams;
  };
};

export default function ActivitiesProgressScreen({
  route,
}: ActivitiesProgressScreenProps) {
  const { materiaId, materiaNome } = route.params || {};

  const [loading, setLoading] = useState<boolean>(true);
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

        const resp = await fetch(`http://192.168.1.73:8000/planos/${materiaId}`);
        const data: { ok: boolean; planos?: Plano[] } = await resp.json();

        console.log("PLANOS:", data);

        if (data.ok) {
          setPlanos(data.planos || []);
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
            {emAndamento.length === 0 ? (
              <Text style={{ marginLeft: 16 }}>
                Nenhuma atividade em andamento
              </Text>
            ) : (
              emAndamento.map((p) => (
                <ProgressCard
                  key={p.idPlano || p.titulo}
                  title={p.titulo}
                  description={p.descricao}
                  image={require("../../../assets/img1-atividade-andamento.png")}
                />
              ))
            )}

            <Text style={styles.textAndamento}>Atividades Vencidas</Text>
            {vencidas.length === 0 ? (
              <Text style={{ marginLeft: 16 }}>
                Nenhuma atividade vencida
              </Text>
            ) : (
              vencidas.map((p) => (
                <ProgressCard
                  key={p.idPlano || p.titulo}
                  title={p.titulo}
                  description={p.descricao}
                  image={require("../../../assets/img1-atividade-andamento.png")}
                />
              ))
            )}

            <Text style={styles.textAndamento}>Atividades Concluídas</Text>
            {concluidas.length === 0 ? (
              <Text style={{ marginLeft: 16 }}>
                Nenhuma atividade concluída
              </Text>
            ) : (
              concluidas.map((p) => (
                <ProgressCard
                  key={p.idPlano || p.titulo}
                  title={p.titulo}
                  description={p.descricao}
                  image={require("../../../assets/img1-atividade-andamento.png")}
                />
              ))
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}