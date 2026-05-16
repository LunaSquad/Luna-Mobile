import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
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
  const { userId } = route.params;

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

  function getImagensGenericasPorHiperfoco() {
    const h = hiperfocoAluno.toLowerCase();

    if (h.includes("dino")) {
      return [];
    }

    return [];
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

  function renderPageDots(total: number) {
    return (
      <View style={localStyles.dotsContainer}>
        {Array.from({ length: total }).map((_, index) => {
          const pagina = index + 1;
          const ativo = paginaAtual === pagina;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => setPaginaAtual(pagina)}
              activeOpacity={0.8}
              style={[localStyles.dot, ativo && localStyles.dotActive]}
            />
          );
        })}
      </View>
    );
  }

  function avancarPagina(total: number) {
    if (paginaAtual >= total) {
      setPaginaAtual(total + 1);
      return;
    }

    setPaginaAtual(paginaAtual + 1);
  }

  function voltarPagina() {
    if (paginaAtual === 1) {
      setPaginaAtual(0);
      return;
    }

    setPaginaAtual(paginaAtual - 1);
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
        <View style={localStyles.introCard}>
          <View style={localStyles.kickerRow}>
            <Text style={localStyles.kicker}>🧩 PLANO ADAPTADO</Text>
          </View>

          <Text style={localStyles.title}>{planoAdaptado.tituloAdaptado}</Text>

          <View style={localStyles.themeBanner}>
            <View style={localStyles.themeCircleLeft} />
            <View style={localStyles.themeCircleRight} />

            <Text style={localStyles.themeDino}>🦖</Text>

            <View>
              <Text style={localStyles.themeSmall}>TEMA VISUAL</Text>
              <Text style={localStyles.themeTitle}>{hiperfocoAluno}</Text>
              <Text style={localStyles.themeSubtitle}>
                Rugido! Vamos explorar 🦕
              </Text>
            </View>
          </View>

          <View style={localStyles.explanationTitleRow}>
            <View style={localStyles.bookIconBox}>
              <Text style={localStyles.explanationIcon}>📖</Text>
            </View>

            <Text style={localStyles.label}>Explicação</Text>
          </View>

          <View style={localStyles.textBox}>
            <Text style={localStyles.text}>
              {planoAdaptado.explicacaoAdaptada}
            </Text>

            <View style={localStyles.exampleBox}>
              <Text style={localStyles.exampleEmoji}>🦕 🦕</Text>
              <Text style={localStyles.examplePlus}>+</Text>
              <Text style={localStyles.exampleEmoji}>🦕 🦕 🦕</Text>
              <Text style={localStyles.examplePlus}>=</Text>
              <Text style={localStyles.exampleResult}>5</Text>
            </View>
          </View>

          <TouchableOpacity
            style={localStyles.primaryButton}
            activeOpacity={0.85}
            onPress={() => setPaginaAtual(1)}
          >
            <Text style={localStyles.primaryButtonText}>
              Vamos praticar! 🦕
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderAtividade() {
    if (!planoAdaptado) return null;

    const totalAtividades = planoAdaptado.atividades.length;
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
              Você concluiu todas as atividades de{" "}
              {planoAdaptado.tituloAdaptado}.
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
        <TouchableOpacity style={localStyles.backButton} onPress={voltarPagina}>
          <Text style={localStyles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={localStyles.logo}>luna</Text>

        <Text style={localStyles.progress}>
          Atividade {indexAtividade + 1} de {totalAtividades}
        </Text>

        {renderPageDots(totalAtividades)}

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

        <View style={localStyles.navigationArea}>
          <TouchableOpacity
            style={[
              localStyles.navButton,
              paginaAtual === 1 && localStyles.navButtonDisabled,
            ]}
            disabled={paginaAtual === 1}
            onPress={() => setPaginaAtual(paginaAtual - 1)}
          >
            <Text style={localStyles.navButtonText}>Anterior</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={localStyles.navButton}
            onPress={() => avancarPagina(totalAtividades)}
          >
            <Text style={localStyles.navButtonText}>
              {indexAtividade + 1 >= totalAtividades ? "Finalizar" : "Avançar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={localStyles.center}>
        <ActivityIndicator size="large" color="#006d77" />
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
    backgroundColor: "#FFF3DE",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 22,
  },

  page: {
    flex: 1,
  },

  center: {
    flex: 1,
    backgroundColor: "#FFF3DE",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 14,
    fontSize: 16,
    color: "#006d77",
    fontWeight: "800",
  },

  introCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 5,
  },

  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    marginBottom: 14,
  },

  backButtonText: {
    color: "#006d77",
    fontWeight: "900",
    fontSize: 13,
  },

  // backButtonText: {
  //   color: "#006d77",
  //   fontWeight: "900",
  //   fontSize: 13,
  // },

  logo: {
    textAlign: "center",
    fontSize: 34,
    fontWeight: "300",
    color: "#8ABFC0",
    letterSpacing: 1,
    marginBottom: 22,
  },

  explanationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 24,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 6,
  },

  kickerRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  kicker: {
    alignSelf: "flex-start",
    backgroundColor: "#E9F7F6",
    color: "#006d77",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    overflow: "hidden",
  },

  title: {
    fontSize: 25,
    lineHeight: 32,
    fontWeight: "900",
    color: "#051B3F",
    marginBottom: 18,
  },

  themeBanner: {
    minHeight: 108,
    backgroundColor: "#FFD042",
    borderRadius: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },

  themeCircleLeft: {
    position: "absolute",
    left: -24,
    top: -20,
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#FFE58A",
  },

  themeCircleRight: {
    position: "absolute",
    right: -28,
    bottom: -28,
    width: 84,
    height: 84,
    borderRadius: 50,
    backgroundColor: "#FFB83D",
    opacity: 0.55,
  },

  themeDino: {
    fontSize: 58,
    marginRight: 20,
  },

  themeSmall: {
    color: "#7A5A00",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  themeTitle: {
    color: "#051B3F",
    fontSize: 21,
    fontWeight: "900",
    marginTop: 2,
  },

  themeSubtitle: {
    color: "#6B5A2A",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },

  explanationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  bookIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DFF4F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  explanationIcon: {
    fontSize: 16,
  },

  label: {
    fontSize: 22,
    fontWeight: "900",
    color: "#006d77",
  },

  textBox: {
    backgroundColor: "#FFF3DE",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  text: {
    fontSize: 14,
    lineHeight: 23,
    color: "#263548",
    fontWeight: "600",
  },

  exampleBox: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    minHeight: 74,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },

  exampleEmoji: {
    fontSize: 21,
    color: "#006d77",
    fontWeight: "900",
  },

  examplePlus: {
    fontSize: 22,
    fontWeight: "900",
    color: "#91A4AF",
    marginHorizontal: 10,
  },

  exampleResult: {
    fontSize: 27,
    fontWeight: "900",
    color: "#FF5C56",
  },

  primaryButton: {
    backgroundColor: "#00928D",
    height: 58,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,

    shadowColor: "#004B4B",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  imagePlaceholder: {
    minHeight: 170,
    borderRadius: 26,
    backgroundColor: "#FFD827",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    padding: 18,
  },

  imageEmoji: {
    fontSize: 64,
    marginBottom: 10,
    textAlign: "center",
  },

  imageText: {
    fontSize: 17,
    fontWeight: "900",
    color: "#17264A",
    textAlign: "center",
  },

  progress: {
    alignSelf: "center",
    backgroundColor: "#EEF4F1",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 24,
    fontSize: 13,
    fontWeight: "900",
    color: "#006d77",
    marginBottom: 12,
    textAlign: "center",
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#D7E6E3",
  },

  dotActive: {
    width: 26,
    backgroundColor: "#006d77",
  },

  activityTitle: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "900",
    color: "#17264A",
    textAlign: "center",
    marginBottom: 12,
  },

  activityDescription: {
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#E8F0EE",
    borderRadius: 22,
    padding: 18,
    fontSize: 15,
    lineHeight: 23,
    color: "#49606A",
    textAlign: "center",
    marginBottom: 18,
    fontWeight: "700",
  },

  navigationArea: {
    marginTop: 18,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
  },

  navButton: {
    backgroundColor: "#EEF4F1",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
  },

  navButtonDisabled: {
    opacity: 0.4,
  },

  navButtonText: {
    color: "#006d77",
    fontSize: 14,
    fontWeight: "900",
  },

  errorText: {
    color: "#B00020",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 18,
  },

  explanationHeader: {
    marginBottom: 14,
  },
});