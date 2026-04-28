import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import QuizMolde from "../../../components/moldes/quizMolde";
import FasesMolde from "../../../components/moldes/fasesMolde";
import API_BASE_URL from "../../../services/ip";

type RootStackParamList = {
  AdaptedActivity: {
    planoId?: string;
    planoTitulo: string;
    planoDescricao: string;
    userId: string;
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

type Hiperfoco = {
  hiperfocoID?: string;
  nome?: string;
  descricao?: string;
  urlFotoHiperfoco?: string;
};

type Aluno = {
  nome?: string;
  RA?: string;
  turmaID?: string;
  escolaID?: string;
  urlFotoAluno?: string;
  hiperfoco?: Hiperfoco;
  hyperfoco?: Hiperfoco;
};

type AlunoResponse = {
  ok: boolean;
  aluno?: Aluno;
  message?: string;
};

type QuestaoAdaptada = {
  pergunta: string;
  respostaCorreta: string;
  alternativas?: string[];
};

type AtividadePlanoAdaptado = {
  titulo: string;
  conteudoAdaptado: string;
  questoes: QuestaoAdaptada[];
};

type PlanoAdaptado = {
  tituloAdaptado: string;
  temaOriginal: string;
  hiperfoco: string;
  explicacaoAdaptada: string;
  atividades: AtividadePlanoAdaptado[];
};

type AdaptarPlanoResponse = {
  ok: boolean;
  hiperfoco: string;
  json_path?: string;
  pdf_path?: string;
  plano_adaptado: PlanoAdaptado;
};

export default function AdaptedActivityScreen({ route, navigation }: Props) {
  const { planoTitulo, planoDescricao, userId } = route.params;

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [hiperfocoAluno, setHiperfocoAluno] = useState("");
  const [planoAdaptado, setPlanoAdaptado] = useState<PlanoAdaptado | null>(
    null
  );

  const [paginaAtual, setPaginaAtual] = useState(0);

  useEffect(() => {
    async function carregarPlanoAdaptado() {
      try {
        setLoading(true);
        setErro("");

        if (!userId) {
          throw new Error("userId não foi enviado para a atividade adaptada");
        }

        const respAluno = await fetch(`${API_BASE_URL}/aluno/${userId}`);
        const dataAluno: AlunoResponse = await respAluno.json();

        if (!respAluno.ok || !dataAluno.ok) {
          throw new Error(dataAluno.message || "Não foi possível buscar aluno");
        }

        const hiperfoco =
          dataAluno.aluno?.hiperfoco?.nome ||
          dataAluno.aluno?.hyperfoco?.nome ||
          "";

        if (!hiperfoco) {
          throw new Error("O aluno não possui hiperfoco cadastrado");
        }

        setHiperfocoAluno(hiperfoco);

        const resp = await fetch(`${API_BASE_URL}/ai/adaptar-plano`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hiperfoco,
          }),
        });

        const data: AdaptarPlanoResponse = await resp.json();

        if (!resp.ok || !data.ok) {
          throw new Error("Erro ao adaptar plano de aula");
        }

        setPlanoAdaptado(data.plano_adaptado);
      } catch (e: any) {
        setErro(e.message || "Erro ao carregar plano adaptado");
      } finally {
        setLoading(false);
      }
    }

    carregarPlanoAdaptado();
  }, [userId]);

  function extrairAlternativas(pergunta: string): string[] {
    const alternativas: string[] = [];

    const regex = /[a-d]\)\s*([^\n]+)/gi;
    let match;

    while ((match = regex.exec(pergunta)) !== null) {
      alternativas.push(match[1].trim());
    }

    return alternativas;
  }

  function limparPergunta(pergunta: string): string {
    return pergunta.replace(/[a-d]\)\s*[^\n]+/gi, "").trim();
  }

  // function gerarAlternativasPadrao(respostaCorreta: string): string[] {
  //   const numero = Number(respostaCorreta);

  //   if (Number.isNaN(numero)) {
  //     return [respostaCorreta];
  //   }

  //   const opcoes = [
  //     String(Math.max(0, numero - 1)),
  //     String(numero),
  //     String(numero + 1),
  //     String(numero + 2),
  //   ];

  //   return Array.from(new Set(opcoes));
  // }

  function getImagensGenericasPorHiperfoco() {
    const h = hiperfocoAluno.toLowerCase();

    if (h.includes("dino")) {
      return [];
    }

    return [];
  }

  function renderExplicacao() {
    if (!planoAdaptado) return null;

    return (
      <View style={localStyles.page}>
        <TouchableOpacity
          style={localStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={localStyles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={localStyles.logo}>luna</Text>

        <View style={localStyles.explanationCard}>
          <Text style={localStyles.kicker}>Plano adaptado</Text>
          <Text style={localStyles.title}>{planoAdaptado.tituloAdaptado}</Text>

          <View style={localStyles.imagePlaceholder}>
            <Text style={localStyles.imageEmoji}>🦖</Text>
            <Text style={localStyles.imageText}>
              Tema visual: {hiperfocoAluno}
            </Text>
          </View>

          <Text style={localStyles.label}>Explicação</Text>
          <Text style={localStyles.text}>
            {planoAdaptado.explicacaoAdaptada}
          </Text>

          <TouchableOpacity
            style={localStyles.primaryButton}
            onPress={() => setPaginaAtual(1)}
          >
            <Text style={localStyles.primaryButtonText}>
              Começar atividades
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function extrairQuestoesDoConteudo(conteudo: string): QuestaoAdaptada[] {
  if (!conteudo) return [];

  const linhas = conteudo
    .split("\n")
    .map((linha) => linha.trim())
    .filter((linha) => linha.length > 0);

  const questoes = linhas
    .filter((linha) => {
      return (
        linha.includes("=") ||
        linha.includes("______") ||
        linha.includes("_____") ||
        linha.includes("?")
      );
    })
    .map((linha) => {
      const numeros = linha.match(/\d+/g) || [];

      let respostaCorreta = "";

      if (numeros.length >= 2) {
        const soma = numeros.reduce((total, n) => total + Number(n), 0);
        respostaCorreta = String(soma);
      }

      return {
        pergunta: linha.replace("______", "?").replace("_____", "?"),
        respostaCorreta,
      };
    })
    .filter((q) => q.respostaCorreta !== "");

  return questoes;
}




  function renderAtividade() {
    if (!planoAdaptado) return null;

    const indexAtividade = paginaAtual - 1;
    const atividade = planoAdaptado.atividades[indexAtividade];

    if (!atividade) {
      return (
        <View style={localStyles.page}>
          <Text style={localStyles.logo}>luna</Text>

          <View style={localStyles.explanationCard}>
            <Text style={localStyles.imageEmoji}>🏆</Text>
            <Text style={localStyles.title}>Parabéns!</Text>
            <Text style={localStyles.text}>
              Você concluiu todas as atividades de {planoAdaptado.tituloAdaptado}.
            </Text>

            <TouchableOpacity
              style={localStyles.primaryButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={localStyles.primaryButtonText}>Finalizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    const questoesDaAtividade =
  atividade.questoes && atividade.questoes.length > 0
    ? atividade.questoes
    : extrairQuestoesDoConteudo(atividade.conteudoAdaptado);

const primeiraQuestao = questoesDaAtividade[0];

    if (!primeiraQuestao) {
      return (
        <View style={localStyles.page}>
          <Text style={localStyles.title}>{atividade.titulo}</Text>
          <Text>Nenhuma questão encontrada.</Text>
        </View>
      );
    }

    const alternativasExtraidas = extrairAlternativas(primeiraQuestao.pergunta);

    const alternativas =
      primeiraQuestao.alternativas?.length
        ? primeiraQuestao.alternativas
        : alternativasExtraidas.length
        ? alternativasExtraidas
        : [];

    const perguntaLimpa = alternativasExtraidas.length
      ? limparPergunta(primeiraQuestao.pergunta)
      : primeiraQuestao.pergunta;

    const usarQuiz = alternativas.length > 0;

    return (
      <View style={localStyles.page}>
        <TouchableOpacity
          style={localStyles.backButton}
          onPress={() => {
            if (paginaAtual === 1) {
              setPaginaAtual(0);
            } else {
              setPaginaAtual(paginaAtual - 1);
            }
          }}
        >
          <Text style={localStyles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={localStyles.logo}>luna</Text>

        <Text style={localStyles.progress}>
          Atividade {indexAtividade + 1} de {planoAdaptado.atividades.length}
        </Text>

        <Text style={localStyles.activityTitle}>{atividade.titulo}</Text>
        <Text style={localStyles.activityDescription}>
          {atividade.conteudoAdaptado}
        </Text>

        {usarQuiz ? (
        <QuizMolde
          key={`quiz-${paginaAtual}-${primeiraQuestao.pergunta}`}
          pergunta={perguntaLimpa}
          opcoes={alternativas}
          respostaCorreta={primeiraQuestao.respostaCorreta}
          imagens={getImagensGenericasPorHiperfoco()}
          titulo="luna"
          subtitulo={atividade.titulo}
        />
        ) : (
        <FasesMolde
          key={`fases-${paginaAtual}-${atividade.titulo}`}
          fases={questoesDaAtividade.map((q, index) => ({
            fase: index + 1,
            desafio: q.pergunta,
            resposta: q.respostaCorreta,
          }))}
          titulo="luna"
          subtitulo={atividade.titulo}
        />
        )}

        <TouchableOpacity
          style={localStyles.primaryButton}
          onPress={() => setPaginaAtual(paginaAtual + 1)}
        >
          <Text style={localStyles.primaryButtonText}>
            {indexAtividade + 1 >= planoAdaptado.atividades.length
              ? "Concluir"
              : "Próxima atividade"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={localStyles.center}>
        <ActivityIndicator size="large" />
        <Text style={localStyles.loadingText}>Adaptando plano de aula...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={localStyles.center}>
        <Text style={localStyles.errorText}>{erro}</Text>

        <TouchableOpacity
          style={localStyles.primaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={localStyles.primaryButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={localStyles.container}>
      {paginaAtual === 0 ? renderExplicacao() : renderAtividade()}
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EAF7F8",
    padding: 20,
  },

  page: {
    flex: 1,
  },

  center: {
    flex: 1,
    backgroundColor: "#EAF7F8",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#355C63",
    fontWeight: "700",
  },

  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 10,
  },

  backButtonText: {
    color: "#005A63",
    fontWeight: "800",
  },

  logo: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "300",
    color: "#69AAB0",
    letterSpacing: 1,
    marginBottom: 18,
  },

  explanationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  kicker: {
    fontSize: 13,
    fontWeight: "800",
    color: "#005A63",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  title: {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "900",
    color: "#172B4D",
    marginBottom: 16,
  },

  imagePlaceholder: {
    minHeight: 150,
    borderRadius: 20,
    backgroundColor: "#F4D52C",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    padding: 16,
  },

  imageEmoji: {
    fontSize: 52,
    marginBottom: 8,
    textAlign: "center",
  },

  imageText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1C2B38",
    textAlign: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "900",
    color: "#005A63",
    marginBottom: 8,
  },

  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#25313C",
    fontWeight: "500",
  },

  primaryButton: {
    backgroundColor: "#005A63",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 10,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  progress: {
    fontSize: 14,
    fontWeight: "800",
    color: "#005A63",
    marginBottom: 10,
    textAlign: "center",
  },

  activityTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "900",
    color: "#172B4D",
    textAlign: "center",
    marginBottom: 8,
  },

  activityDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: "#425466",
    textAlign: "center",
    marginBottom: 14,
    fontWeight: "600",
  },

  errorText: {
    color: "#B00020",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});