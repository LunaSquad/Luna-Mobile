import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import QuizMolde from "../../../components/moldes/quizMolde";
import FasesMolde from "../../../components/moldes/fasesMolde";
import API_BASE_URL from "../../../services/ip";
import { styles } from "./style/style";

const DEBUG_MOLDE: "quiz" | "fases" | null = "fases";

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

        if (DEBUG_MOLDE === "quiz") {
          const dataMockQuiz: AdaptarResponse = {
            molde_id: "quiz",
            molde: {
              id: "quiz",
              titulo: "Quiz Interativo",
              tema_visual: "gamificado",
              palavras_chave: ["quiz", "resposta", "alternativas"],
            },
            confianca: 0.98,
            prompt_imagem: "Minions fazendo uma atividade de matemática",
            atividade: {
              titulo: "Quiz de Matemática",
              tipo: "quiz",
              descricao: "Escolha a alternativa correta.",
              conteudo: {
                perguntas: [
                  {
                    pergunta: "Quanto é 2 + 2?",
                    alternativas: ["3", "4", "5"],
                    correta: "4",
                  },
                ],
              },
            },
          };

          setDados(dataMockQuiz);
          return;
        }

        if (DEBUG_MOLDE === "fases") {
          const dataMockFases: AdaptarResponse = {
            molde_id: "fases",
            molde: {
              id: "fases",
              titulo: "Jogo de Fases",
              tema_visual: "aventura",
              palavras_chave: ["fases", "desafio", "missão"],
            },
            confianca: 0.96,
            prompt_imagem: "Personagem infantil em missão educativa",
            atividade: {
              titulo: "Missão Matemática",
              tipo: "jogo em fases",
              descricao: "Resolva cada fase para avançar.",
              conteudo: {
                fases: [
                  {
                    fase: 1,
                    desafio: "Quanto é 2 + 2?",
                    resposta: "4",
                  },
                  {
                    fase: 2,
                    desafio: "Quanto é 5 + 3?",
                    resposta: "8",
                  },
                  {
                    fase: 3,
                    desafio: "Quanto é 10 - 6?",
                    resposta: "4",
                  },
                ],
              },
            },
          };

          setDados(dataMockFases);
          return;
        }

        const resp = await fetch(`${API_BASE_URL}/ai/adaptar`, {
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

  function renderQuizMolde(atividade: AtividadeAdaptada) {
    const primeiraPergunta = atividade.conteudo.perguntas?.[0];

    if (!primeiraPergunta) {
      return (
        <View style={styles.card}>
          <Text style={styles.label}>Atividade adaptada</Text>
          <Text style={styles.value}>
            Nenhuma pergunta foi encontrada para o molde de quiz.
          </Text>
        </View>
      );
    }

    return (
      <QuizMolde
        pergunta={primeiraPergunta.pergunta}
        opcoes={primeiraPergunta.alternativas || []}
        respostaCorreta={
          primeiraPergunta.correta || primeiraPergunta.resposta_esperada || ""
        }
        imagens={[]}
        titulo="luna"
        subtitulo={dados?.molde?.titulo || "Atividade adaptada"}
      />
    );
  }

  function renderFasesMolde(atividade: AtividadeAdaptada) {
    const fases = atividade.conteudo.fases || [];

    if (!fases.length) {
      return (
        <View style={styles.card}>
          <Text style={styles.label}>Atividade adaptada</Text>
          <Text style={styles.value}>
            Nenhuma fase foi encontrada para o molde de desafios.
          </Text>
        </View>
      );
    }

    return (
      <FasesMolde
        fases={fases}
        titulo="luna"
        subtitulo={dados?.molde?.titulo || "Missão interativa"}
      />
    );
  }

  function renderConteudoGenerico(atividade: AtividadeAdaptada) {
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

                {(item.correta || item.resposta_esperada) ? (
                  <Text style={styles.answer}>
                    Resposta esperada:{" "}
                    {item.correta || item.resposta_esperada}
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
                <Text style={styles.answer}>Resposta: {fase.resposta}</Text>
              </View>
            ))}
          </>
        ) : null}

        {atividade.conteudo.resumo_plano ? (
          <>
            <Text style={styles.label}>Resumo do plano</Text>
            <Text style={styles.value}>{atividade.conteudo.resumo_plano}</Text>
          </>
        ) : null}

        {atividade.conteudo.palavras_chave?.length ? (
          <>
            <Text style={styles.label}>Palavras-chave</Text>
            <Text style={styles.value}>
              {atividade.conteudo.palavras_chave.join(", ")}
            </Text>
          </>
        ) : null}
      </View>
    );
  }

  function renderConteudo() {
    if (!dados?.atividade) return null;

    const atividade = dados.atividade;
    const tipoAtividade = atividade.tipo?.toLowerCase?.() || "";
    const moldeId = dados.molde_id?.toLowerCase?.() || "";
    const tituloMolde = dados.molde?.titulo?.toLowerCase?.() || "";

    const ehQuiz =
      tipoAtividade.includes("quiz") ||
      moldeId.includes("quiz") ||
      tituloMolde.includes("quiz");

    const ehFases =
      tipoAtividade.includes("fase") ||
      tipoAtividade.includes("jogo") ||
      tipoAtividade.includes("desafio") ||
      moldeId.includes("fase") ||
      moldeId.includes("jogo") ||
      moldeId.includes("desafio") ||
      tituloMolde.includes("fase") ||
      tituloMolde.includes("jogo") ||
      tituloMolde.includes("desafio");

    if (ehQuiz) {
      return renderQuizMolde(atividade);
    }

    if (ehFases) {
      return renderFasesMolde(atividade);
    }

    return renderConteudoGenerico(atividade);
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
            <Text style={styles.value}>
              {dados.molde?.titulo || dados.molde_id}
            </Text>

            <Text style={styles.label}>ID do molde</Text>
            <Text style={styles.value}>{dados.molde_id}</Text>

            {dados.confianca !== undefined && dados.confianca !== null ? (
              <>
                <Text style={styles.label}>Confiança</Text>
                <Text style={styles.value}>
                  {(dados.confianca * 100).toFixed(1)}%
                </Text>
              </>
            ) : null}

            <Text style={styles.label}>Prompt da imagem</Text>
            <Text style={styles.value}>{dados.prompt_imagem}</Text>
          </View>

          {renderConteudo()}
        </>
      ) : null}
    </ScrollView>
  );
}