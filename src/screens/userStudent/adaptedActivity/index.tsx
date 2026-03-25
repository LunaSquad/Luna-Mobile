import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { styles } from "./style/style";

type RootStackParamList = {
  AdaptedActivity: {
    planoTitulo: string;
    planoDescricao: string;
    hiperfoco: string;
  };
};

type AdaptedActivityRouteProp = RouteProp<
  RootStackParamList,
  "AdaptedActivity"
>;

type Props = {
  route: AdaptedActivityRouteProp;
  navigation: any;
};

type PerguntaQuiz = {
  pergunta: string;
  alternativas?: string[];
  correta?: string;
  resposta_esperada?: string;
};

type FaseJogo = {
  fase: number;
  desafio: string;
  resposta: string;
};

type AtividadeAdaptada = {
  titulo: string;
  tipo: string;
  descricao: string;
  conteudo: {
    perguntas?: PerguntaQuiz[];
    texto?: string;
    instrucoes?: string[];
    proposta?: string;
    fases?: FaseJogo[];
    resumo_plano?: string;
    palavras_chave?: string[];
  };
};

type AdaptarResponse = {
  molde_id: string;
  molde?: {
    id: string;
    titulo: string;
    tema_visual: string;
    palavras_chave: string[];
  } | null;
  confianca?: number | null;
  prompt_imagem: string;
  atividade: AtividadeAdaptada;
};

export default function AdaptedActivityScreen({
  route,
  navigation,
}: Props) {
  const { planoTitulo, planoDescricao, hiperfoco } = route.params;

  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<AdaptarResponse | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarAtividadeAdaptada() {
      try {
        setLoading(true);
        setErro("");

        const resp = await fetch("http://192.168.1.73:8000/ai/adaptar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plano: `${planoTitulo}. ${planoDescricao}`,
            hiperfoco,
          }),
        });

        const data = await resp.json();

        if (!resp.ok) {
          throw new Error(data?.detail || "Erro ao adaptar atividade");
        }

        setDados(data);
      } catch (e: any) {
        setErro(e.message || "Erro ao carregar atividade adaptada");
      } finally {
        setLoading(false);
      }
    }

    carregarAtividadeAdaptada();
  }, [planoTitulo, planoDescricao, hiperfoco]);

  function renderConteudo() {
    if (!dados?.atividade) return null;

    const atividade = dados.atividade;

    return (
      <View style={styles.card}>
        <Text style={styles.label}>Título da atividade</Text>
        <Text style={styles.title}>{atividade.titulo}</Text>

        <Text style={styles.label}>Tipo</Text>
        <Text style={styles.value}>{atividade.tipo}</Text>

        <Text style={styles.label}>Descrição</Text>
        <Text style={styles.value}>{atividade.descricao}</Text>

        {atividade.conteudo.texto ? (
          <>
            <Text style={styles.label}>Texto</Text>
            <Text style={styles.value}>{atividade.conteudo.texto}</Text>
          </>
        ) : null}

        {atividade.conteudo.perguntas?.length ? (
          <>
            <Text style={styles.label}>Perguntas</Text>
            {atividade.conteudo.perguntas.map((item, index) => (
              <View key={index} style={styles.block}>
                <Text style={styles.question}>
                  {index + 1}. {item.pergunta}
                </Text>

                {item.alternativas?.map((alt, i) => (
                  <Text key={i} style={styles.option}>
                    • {alt}
                  </Text>
                ))}

                {item.resposta_esperada ? (
                  <Text style={styles.answer}>
                    Resposta esperada: {item.resposta_esperada}
                  </Text>
                ) : null}
              </View>
            ))}
          </>
        ) : null}

        {atividade.conteudo.instrucoes?.length ? (
          <>
            <Text style={styles.label}>Instruções</Text>
            {atividade.conteudo.instrucoes.map((instrucao, index) => (
              <Text key={index} style={styles.option}>
                • {instrucao}
              </Text>
            ))}
          </>
        ) : null}

        {atividade.conteudo.proposta ? (
          <>
            <Text style={styles.label}>Proposta</Text>
            <Text style={styles.value}>{atividade.conteudo.proposta}</Text>
          </>
        ) : null}

        {atividade.conteudo.fases?.length ? (
          <>
            <Text style={styles.label}>Fases</Text>
            {atividade.conteudo.fases.map((fase, index) => (
              <View key={index} style={styles.block}>
                <Text style={styles.question}>Fase {fase.fase}</Text>
                <Text style={styles.value}>{fase.desafio}</Text>
              </View>
            ))}
          </>
        ) : null}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Atividade Adaptada</Text>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Plano original</Text>
        <Text style={styles.value}>{planoTitulo}</Text>

        <Text style={styles.label}>Descrição original</Text>
        <Text style={styles.value}>{planoDescricao}</Text>

        <Text style={styles.label}>Hiperfoco</Text>
        <Text style={styles.value}>{hiperfoco}</Text>
      </View>

      {loading ? <ActivityIndicator size="large" /> : null}

      {erro ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{erro}</Text>
        </View>
      ) : null}

      {!loading && !erro && dados ? (
        <>
          <View style={styles.card}>
            <Text style={styles.label}>Molde escolhido</Text>
            <Text style={styles.value}>{dados.molde?.titulo || dados.molde_id}</Text>

            <Text style={styles.label}>ID do molde</Text>
            <Text style={styles.value}>{dados.molde_id}</Text>

            <Text style={styles.label}>Prompt da imagem</Text>
            <Text style={styles.value}>{dados.prompt_imagem}</Text>
          </View>

          {renderConteudo()}
        </>
      ) : null}
    </ScrollView>
  );
}