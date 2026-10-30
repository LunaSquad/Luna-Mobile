import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  BackHandler,
  TextInput,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../services/ip";

const TEMPO_ATIVIDADE_SEGUNDOS = 5 * 60 + 30;
const TEMPO_BLOQUEIO_MS = 5 * 60 * 1000;

type TemaVisualConfig = {
  id: string;
  nomeJogo: string;
  nomeItemContagem: string;
  emojiInline: string;
  isDark: boolean;
  formatoOpcao: "ovo" | "arcade";
  formatoGrupoSoma: "cupula" | "neon";
  corPrimaria: string;
  corSecundaria: string;
  corSinalSoma: string;
  corCardFundo: string;
  corTextoCard: string;
  corSubtextoCard: string;
  corBalaoFundo: string;
  corBalaoTexto: string;
  corPillHeaderFundo: string;
  corPillHeaderTexto: string;
  corBadgePontosFundo: string;
  corBadgePontosTexto: string;
  corGrupoSomaFundo: string;
  corGrupoSomaBorda: string;
  corOpcaoFundo: string;
  corOpcaoBorda: string;
  corOpcaoTexto: string;
  corOpcaoCertaFundo: string;
  corOpcaoErradaFundo: string;
  bgFallback: string;
  mascotFallback: string;
  secondaryMascotFallback: string;
  itemFallback: string;
};

function obterTemaGamificado(hiperfoco: string): TemaVisualConfig {
  const raw = (hiperfoco || "dinossauros").trim();
  const chave = raw.toLowerCase();

  if (chave.includes("video game") || chave.includes("game") || chave.includes("arcade")) {
    return {
      id: "arcade",
      nomeJogo: "SOMA ARCADE",
      nomeItemContagem: "moedas",
      emojiInline: "🪙",
      isDark: true,
      formatoOpcao: "arcade",
      formatoGrupoSoma: "neon",
      corPrimaria: "#00E5FF",
      corSecundaria: "#FF2E93",
      corSinalSoma: "#FF2E93",
      corCardFundo: "rgba(22, 20, 48, 0.95)",
      corTextoCard: "#FFFFFF",
      corSubtextoCard: "#D1D5F0",
      corBalaoFundo: "rgba(30, 27, 64, 0.95)",
      corBalaoTexto: "#FFFFFF",
      corPillHeaderFundo: "rgba(30, 27, 64, 0.92)",
      corPillHeaderTexto: "#FFFFFF",
      corBadgePontosFundo: "#5E35B1",
      corBadgePontosTexto: "#FFFFFF",
      corGrupoSomaFundo: "rgba(49, 43, 107, 0.82)",
      corGrupoSomaBorda: "#00E5FF",
      corOpcaoFundo: "#262349",
      corOpcaoBorda: "#00E5FF",
      corOpcaoTexto: "#FFFFFF",
      corOpcaoCertaFundo: "#00E5FF",
      corOpcaoErradaFundo: "#EC5B56",
      bgFallback:
        "https://image.pollinations.ai/prompt/masterpiece%2016-bit%20pixel%20art%20retro%20arcade%20platformer%20night%20landscape%20vibrant%20neon%20purple%20mountains%20floating%20pixel%20grass%20platforms%20golden%20coins%20big%20cyan%20synthwave%20moon?width=1080&height=1920&nologo=true&seed=8088",
      mascotFallback:
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png",
      secondaryMascotFallback:
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Video%20Game.png",
      itemFallback:
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Coin.png",
    };
  }

  if (chave.includes("espaço") || chave.includes("espaco") || chave.includes("astronauta")) {
    return {
      id: "espaco",
      nomeJogo: "MISSÃO GALÁXIA",
      nomeItemContagem: "estrelas",
      emojiInline: "🚀",
      isDark: true,
      formatoOpcao: "arcade",
      formatoGrupoSoma: "neon",
      corPrimaria: "#00E676",
      corSecundaria: "#FFEA00",
      corSinalSoma: "#FFEA00",
      corCardFundo: "rgba(18, 24, 56, 0.95)",
      corTextoCard: "#FFFFFF",
      corSubtextoCard: "#CFD8DC",
      corBalaoFundo: "rgba(26, 35, 126, 0.95)",
      corBalaoTexto: "#FFFFFF",
      corPillHeaderFundo: "rgba(26, 35, 126, 0.92)",
      corPillHeaderTexto: "#FFFFFF",
      corBadgePontosFundo: "#3949AB",
      corBadgePontosTexto: "#FFD700",
      corGrupoSomaFundo: "rgba(40, 53, 147, 0.82)",
      corGrupoSomaBorda: "#00E5FF",
      corOpcaoFundo: "#1E2759",
      corOpcaoBorda: "#00E5FF",
      corOpcaoTexto: "#FFFFFF",
      corOpcaoCertaFundo: "#00E676",
      corOpcaoErradaFundo: "#FF5252",
      bgFallback:
        "https://image.pollinations.ai/prompt/masterpiece%20vibrant%202D%20vector%20outer%20space%20game%20background%20glowing%20neon%20Saturn%20planet%20colorful%20nebula%20bright%20stars?width=1080&height=1920&nologo=true&seed=8088",
      mascotFallback:
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png",
      secondaryMascotFallback:
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Ringed%20Planet.png",
      itemFallback:
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Star.png",
    };
  }

  if (chave.includes("carro")) {
    return {
      id: "carros",
      nomeJogo: "COPA VELOZ",
      nomeItemContagem: "carrinhos",
      emojiInline: "🏎️",
      isDark: false,
      formatoOpcao: "arcade",
      formatoGrupoSoma: "neon",
      corPrimaria: "#D32F2F",
      corSecundaria: "#FFB300",
      corSinalSoma: "#D32F2F",
      corCardFundo: "rgba(255, 253, 247, 0.96)",
      corTextoCard: "#2B2B2B",
      corSubtextoCard: "#4E342E",
      corBalaoFundo: "#FFFFFF",
      corBalaoTexto: "#2B2B2B",
      corPillHeaderFundo: "#FFFFFF",
      corPillHeaderTexto: "#B71C1C",
      corBadgePontosFundo: "#FFCA28",
      corBadgePontosTexto: "#3E2723",
      corGrupoSomaFundo: "#FFF3E0",
      corGrupoSomaBorda: "#FFB74D",
      corOpcaoFundo: "#FFFDF5",
      corOpcaoBorda: "#FFB74D",
      corOpcaoTexto: "#4E342E",
      corOpcaoCertaFundo: "#389826",
      corOpcaoErradaFundo: "#E53935",
      bgFallback:
        "https://image.pollinations.ai/prompt/masterpiece%20vibrant%202D%20vector%20cartoon%20racing%20track%20stadium%20landscape%20green%20hills%20sunny%20blue%20sky?width=1080&height=1920&nologo=true&seed=8088",
      mascotFallback:
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Racing%20Car.png",
      secondaryMascotFallback:
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Sport%20Utility%20Vehicle.png",
      itemFallback:
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Trophy.png",
    };
  }

  return {
    id: "dino",
    nomeJogo: "Dino Soma",
    nomeItemContagem: "dinossauros",
    emojiInline: "🦖",
    isDark: false,
    formatoOpcao: "ovo",
    formatoGrupoSoma: "cupula",
    corPrimaria: "#3A9B23",
    corSecundaria: "#F57C00",
    corSinalSoma: "#F06A24",
    corCardFundo: "rgba(251, 248, 236, 0.96)",
    corTextoCard: "#38220F",
    corSubtextoCard: "#4A3018",
    corBalaoFundo: "#FFFDF7",
    corBalaoTexto: "#2F1B0C",
    corPillHeaderFundo: "#FFFDF7",
    corPillHeaderTexto: "#2F1B0C",
    corBadgePontosFundo: "#F3C63F",
    corBadgePontosTexto: "#2F1B0C",
    corGrupoSomaFundo: "#FDE7B4",
    corGrupoSomaBorda: "#F5A64C",
    corOpcaoFundo: "#FDF9EC",
    corOpcaoBorda: "#F5D77F",
    corOpcaoTexto: "#462A13",
    corOpcaoCertaFundo: "#3A9B23",
    corOpcaoErradaFundo: "#E5534B",
    bgFallback:
      "https://image.pollinations.ai/prompt/masterpiece%202D%20flat%20vector%20mobile%20game%20background%20illustration%20vibrant%20prehistoric%20valley%20with%20a%20smoking%20volcano%20in%20the%20center%20distance%20sparkling%20waterfall%20lush%20green%20palm%20trees%20warm%20golden%20sunset%20sky%20Khan%20Academy%20Kids%20style?width=1080&height=1920&nologo=true&seed=8088",
    mascotFallback:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/T-Rex.png",
    secondaryMascotFallback:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Sauropod.png",
    itemFallback:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Egg.png",
  };
}

function formatarTempo(totalSegundos: number) {
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

function extrairNumerosDoTextoPortugues(texto: string): number[] {
  const mapaPalavras: Record<string, number> = {
    um: 1,
    uma: 1,
    dois: 2,
    duas: 2,
    tres: 3,
    três: 3,
    quatro: 4,
    cinco: 5,
    seis: 6,
    sete: 7,
    oito: 8,
    nove: 9,
    dez: 10,
  };

  const tokens = texto
    .toLowerCase()
    .replace(/[\,\.\!\?\:\;\(\)\[\]]/g, " ")
    .split(/\s+/);

  const encontrados: number[] = [];
  for (const tk of tokens) {
    if (/^\d+$/.test(tk)) {
      const val = parseInt(tk, 10);
      if (val >= 0 && val <= 20) encontrados.push(val);
    } else if (mapaPalavras[tk] !== undefined) {
      encontrados.push(mapaPalavras[tk]);
    }
  }
  return encontrados;
}

function decorarTextoComFiguras(texto: string, emojiTema: string): string {
  if (!texto) return "";
  let resultado = texto;
  const substituicoes: Array<[RegExp, string]> = [
    [/\b(t-rex|tiranossauro|dinossauros|dinossauro|dinos|dino)\b/gi, `$1 🦖`],
    [/\b(brontossauros|brontossauro|braquiossauro|sauropode|pescoçudo)\b/gi, `$1 🦕`],
    [/\b(pterodáctilos|pterodáctilo|pterodactilos|pterodactilo)\b/gi, `$1 🦖`],
    [/\b(triceratops|tricerátops|stegosaurus|estegossauro|oviraptor|compsognathus)\b/gi, `$1 🦕`],
    [/\b(ovinhos|ovinho|ovos|ovo)\b/gi, `$1 🥚`],
    [/\b(vulcão|vulcao)\b/gi, `$1 🌋`],
    [/\b(moedinhas|moedinha|moedas|moeda)\b/gi, `$1 🪙`],
    [/\b(foguetes|foguete)\b/gi, `$1 🚀`],
    [/\b(estrelas|estrela)\b/gi, `$1 ⭐`],
    [/\b(carrinhos|carrinho|carros|carro)\b/gi, `$1 🏎️`],
  ];

  for (const [regex, subst] of substituicoes) {
    resultado = resultado.replace(regex, subst);
  }

  if (resultado === texto && emojiTema) {
    return `${emojiTema} ${resultado}`;
  }
  return resultado;
}

type PassoQuestao = {
  tituloAtividade: string;
  comandoAtividade: string;
  tipo: "dissertativa" | "objetiva";
  pergunta: string;
  dicaTDAH: string;
  respostaCorreta: string;
  alternativas: string[];
};

type EtapaFluxo =
  | { tipoEtapa: "explicacao" }
  | { tipoEtapa: "exemplo" }
  | { tipoEtapa: "questao"; questao: PassoQuestao; numeroQuestao: number; totalQuestoes: number };

export default function AdaptedActivityScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { userId, planoId, turmaId, materiaId, urlPlanoDeAula } = route.params || {};

  const idUnicoAtividade = `${userId || "aluno"}_${planoId || materiaId || "geral"}`;
  const chaveBloqueio = `@luna_cooldown_${idUnicoAtividade}`;
  const chaveFimAtividade = `@luna_timer_end_${idUnicoAtividade}`;

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Preparando o jogo...");
  const [planoAdaptado, setPlanoAdaptado] = useState<any>(null);
  const [bgCustomizado, setBgCustomizado] = useState<string>("");
  const [hiperfocoAluno, setHiperfocoAluno] = useState("dinossauros");

  const [etapaIndex, setEtapaIndex] = useState(0);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | null>(null);
  const [respostaDissertativa, setRespostaDissertativa] = useState<string>("");
  const [feedbackExibido, setFeedbackExibido] = useState(false);
  const [acertouQuestao, setAcertouQuestao] = useState<boolean | null>(null);
  const [acertosTotais, setAcertosTotais] = useState(0);

  const [segundosRestantes, setSegundosRestantes] = useState(TEMPO_ATIVIDADE_SEGUNDOS);
  const [bloqueado, setBloqueado] = useState(false);
  const [segundosBloqueio, setSegundosBloqueio] = useState(0);

  const tempoEsgotadoAcionado = useRef(false);

  const topicosExplicacao = useMemo(() => {
    if (Array.isArray(planoAdaptado?.topicosExplicacao) && planoAdaptado.topicosExplicacao.length > 0) {
      return planoAdaptado.topicosExplicacao;
    }
    const textoBruto = String(planoAdaptado?.explicacaoTeorica || planoAdaptado?.explicacaoAdaptada || "").trim();
    const blocos = textoBruto.split(/\n\n+/).map((b: string) => b.trim()).filter(Boolean);
    if (blocos.length === 0) {
      return [{ subtitulo: "Introdução", textoAdaptado: "Vamos aprender jogando!", dicaVisual: "" }];
    }
    return blocos.map((bloco: string, idx: number) => ({
      subtitulo: idx === 0 ? "Como Funciona" : `Parte ${idx + 1}`,
      textoAdaptado: bloco,
      dicaVisual: "",
    }));
  }, [planoAdaptado]);

  const topicosExemplo = useMemo(() => {
    if (Array.isArray(planoAdaptado?.topicosExemplo) && planoAdaptado.topicosExemplo.length > 0) {
      return planoAdaptado.topicosExemplo;
    }
    const exemploTexto = String(planoAdaptado?.exemploPratico || "").trim();
    if (exemploTexto) {
      return [{ titulo: "Exemplo na Prática", passoAPasso: exemploTexto, conclusao: "Pronto para começar?" }];
    }
    return [];
  }, [planoAdaptado]);

  const listaQuestoes = useMemo<PassoQuestao[]>(() => {
    const fonteBruta: any[] = [];
    if (Array.isArray(planoAdaptado?.questoesGerais) && planoAdaptado.questoesGerais.length > 0) {
      fonteBruta.push(...planoAdaptado.questoesGerais);
    } else if (Array.isArray(planoAdaptado?.atividades)) {
      planoAdaptado.atividades.forEach((atv: any, idxAtv: number) => {
        const qs = Array.isArray(atv?.questoes) ? atv.questoes : [];
        qs.forEach((q: any) => {
          fonteBruta.push({
            ...q,
            tituloAtividade: atv?.titulo || `Fase ${idxAtv + 1}`,
            comandoAtividade: atv?.conteudoAdaptado || "",
          });
        });
      });
    }

    const processadas: PassoQuestao[] = fonteBruta
      .map((q: any, i: number) => {
        const perguntaStr = String(q?.pergunta || "").trim();
        if (!perguntaStr) return null;

        let respFinal = String(q?.respostaCorreta || "").trim();
        let alts: string[] = Array.isArray(q?.alternativas) ? q.alternativas.map(String) : [];

        const numerosExtraidos = extrairNumerosDoTextoPortugues(perguntaStr);
        const ehPerguntaNumerica =
          numerosExtraidos.length >= 2 ||
          /\d+\s*[\+\-\*\/x÷]/.test(perguntaStr) ||
          (alts.length > 0 && alts.every((a: string) => /^\d+$/.test(a.trim())));

        if (ehPerguntaNumerica) {
          const somaInferida =
            numerosExtraidos.length >= 2 ? numerosExtraidos[0] + numerosExtraidos[1] : 4;
          const ans = parseInt(respFinal, 10) || somaInferida;
          respFinal = String(ans);

          const opcoes3 = new Set<string>([String(ans)]);
          const candidatos = [ans + 2, Math.max(1, ans - 1), ans + 1, Math.max(1, ans - 2), ans + 3];
          for (const c of candidatos) {
            if (opcoes3.size < 3) opcoes3.add(String(c));
          }
          alts = Array.from(opcoes3).sort((a: string, b: string) => Number(a) - Number(b));
        }

        const tipoInferido: "dissertativa" | "objetiva" =
          q?.tipo === "dissertativa" && !ehPerguntaNumerica ? "dissertativa" : "objetiva";

        return {
          tituloAtividade: q?.tituloAtividade || `Fase ${i + 1}`,
          comandoAtividade: q?.comandoAtividade || "",
          tipo: tipoInferido,
          pergunta: perguntaStr,
          dicaTDAH: String(q?.dicaTDAH || "Conte os números com calma!"),
          respostaCorreta: respFinal,
          alternativas: alts,
        };
      })
      .filter(Boolean) as PassoQuestao[];

    if (processadas.length === 0) {
      processadas.push({
        tituloAtividade: "Fase 1",
        comandoAtividade: "",
        tipo: "objetiva",
        pergunta: "Quantos dinossauros temos se juntarmos 3 dinossauros com mais 2 dinossauros?",
        dicaTDAH: "Some 3 mais 2!",
        respostaCorreta: "5",
        alternativas: ["4", "5", "6"],
      });
    }

    return processadas;
  }, [planoAdaptado]);

  const etapasFluxo = useMemo<EtapaFluxo[]>(() => {
    const etapas: EtapaFluxo[] = [{ tipoEtapa: "explicacao" }];
    if (topicosExemplo.length > 0) {
      etapas.push({ tipoEtapa: "exemplo" });
    }
    listaQuestoes.forEach((q, idx) => {
      etapas.push({
        tipoEtapa: "questao",
        questao: q,
        numeroQuestao: idx + 1,
        totalQuestoes: listaQuestoes.length,
      });
    });
    return etapas;
  }, [topicosExemplo, listaQuestoes]);

  const indicePrimeiraQuestao = useMemo(() => {
    const idx = etapasFluxo.findIndex((e) => e.tipoEtapa === "questao");
    return idx >= 0 ? idx : 0;
  }, [etapasFluxo]);

  const etapaAtual = etapasFluxo[etapaIndex];
  const atividadeEmAndamento = etapaIndex >= indicePrimeiraQuestao && etapaIndex < etapasFluxo.length;
  const atividadeConcluida = etapasFluxo.length > 0 && etapaIndex >= etapasFluxo.length;

  const ativarBloqueioCincoMinutos = useCallback(async () => {
    const expiraEm = Date.now() + TEMPO_BLOQUEIO_MS;
    await AsyncStorage.setItem(chaveBloqueio, String(expiraEm));
    await AsyncStorage.removeItem(chaveFimAtividade);
  }, [chaveBloqueio, chaveFimAtividade]);

  const limparSessaoAoConcluir = useCallback(async () => {
    await AsyncStorage.removeItem(chaveFimAtividade);
  }, [chaveFimAtividade]);

  const carregarDadosDaAula = useCallback(
    async (forcarRegeneracao = false) => {
      try {
        setLoading(true);
        let hiperfoco = "dinossauros";

        try {
          const respAluno = await fetch(`${API_BASE_URL}/students/aluno/${userId}`);
          const dataAluno = await respAluno.json();
          hiperfoco = dataAluno.aluno?.hiperfoco?.nome || dataAluno.aluno?.hiperfoco || "dinossauros";
        } catch (err) { }

        setHiperfocoAluno(hiperfoco);
        setLoadingText(`Preparando mundo de ${hiperfoco}...`);

        const respIA = await fetch(`${API_BASE_URL}/ai/adaptar-plano`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planoId,
            turmaId,
            materiaId,
            hiperfoco,
            urlPlanoDeAula,
            alunoId: userId,
            forcarRegeneracao: forcarRegeneracao,
          }),
        });
        const dataIA = await respIA.json();
        setPlanoAdaptado(dataIA.plano_adaptado);

        const temaCfg = obterTemaGamificado(hiperfoco);
        setBgCustomizado(temaCfg.bgFallback);

        if (forcarRegeneracao) {
          await limparSessaoAoConcluir();
          setEtapaIndex(0);
          setAcertosTotais(0);
          setOpcaoSelecionada(null);
          setRespostaDissertativa("");
          setFeedbackExibido(false);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    },
    [userId, planoId, turmaId, materiaId, urlPlanoDeAula, limparSessaoAoConcluir]
  );

  useEffect(() => {
    if (userId) carregarDadosDaAula(false);
    else setLoading(false);
  }, [userId, carregarDadosDaAula]);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });
    return () => sub.remove();
  }, [navigation]);

  useEffect(() => {
    if (!bloqueado) return;
    const int = setInterval(async () => {
      const bloqueioSalvo = await AsyncStorage.getItem(chaveBloqueio);
      if (!bloqueioSalvo) {
        setBloqueado(false);
        setSegundosBloqueio(0);
        clearInterval(int);
        return;
      }
      const expiraEm = parseInt(bloqueioSalvo, 10);
      const restante = Math.max(0, Math.ceil((expiraEm - Date.now()) / 1000));
      setSegundosBloqueio(restante);
      if (restante <= 0) {
        clearInterval(int);
        await AsyncStorage.removeItem(chaveBloqueio);
        setBloqueado(false);
        setEtapaIndex(0);
        setSegundosRestantes(TEMPO_ATIVIDADE_SEGUNDOS);
      }
    }, 1000);
    return () => clearInterval(int);
  }, [bloqueado, chaveBloqueio]);

  useEffect(() => {
    if (loading || bloqueado || !atividadeEmAndamento) return;
    const int = setInterval(async () => {
      const fimSalvo = await AsyncStorage.getItem(chaveFimAtividade);
      if (!fimSalvo) return;
      const timestampFim = parseInt(fimSalvo, 10);
      const restante = Math.max(0, Math.ceil((timestampFim - Date.now()) / 1000));
      setSegundosRestantes(restante);
      if (restante <= 0 && !tempoEsgotadoAcionado.current) {
        tempoEsgotadoAcionado.current = true;
        clearInterval(int);
        await ativarBloqueioCincoMinutos();
        setBloqueado(true);
      }
    }, 1000);
    return () => clearInterval(int);
  }, [loading, bloqueado, atividadeEmAndamento, chaveFimAtividade, ativarBloqueioCincoMinutos]);

  const iniciarCronometroEIrParaQuestoes = async () => {
    const novoFim = Date.now() + TEMPO_ATIVIDADE_SEGUNDOS * 1000;
    await AsyncStorage.setItem(chaveFimAtividade, String(novoFim));
    setSegundosRestantes(TEMPO_ATIVIDADE_SEGUNDOS);
    setOpcaoSelecionada(null);
    setRespostaDissertativa("");
    setFeedbackExibido(false);
    setAcertouQuestao(null);
    setEtapaIndex(indicePrimeiraQuestao);
  };

  const selecionarEVerificarAlternativa = (alt: string) => {
    if (feedbackExibido || etapaAtual?.tipoEtapa !== "questao") return;
    setOpcaoSelecionada(alt);

    const q = etapaAtual.questao;
    const sl = alt.trim().toLowerCase();
    const cl = (q.respostaCorreta || "").trim().toLowerCase();
    const acertou = sl === cl || sl.startsWith(`${cl})`) || cl.includes(sl);

    setAcertouQuestao(acertou);
    if (acertou) {
      setAcertosTotais((p) => p + 1);
    }
    setFeedbackExibido(true);
  };

  const confirmarDissertativa = () => {
    if (respostaDissertativa.trim().length < 2) return;
    setAcertouQuestao(true);
    setAcertosTotais((p) => p + 1);
    setFeedbackExibido(true);
  };

  const handleProximaQuestao = async () => {
    const nx = etapaIndex + 1;
    setOpcaoSelecionada(null);
    setRespostaDissertativa("");
    setFeedbackExibido(false);
    setAcertouQuestao(null);
    setEtapaIndex(nx);
    if (nx >= etapasFluxo.length) {
      await limparSessaoAoConcluir();
    }
  };

  const tema = useMemo(() => obterTemaGamificado(hiperfocoAluno), [hiperfocoAluno]);
  const bgUri = bgCustomizado || tema.bgFallback;
  const mascotUri = tema.mascotFallback;
  const secondaryMascotUri = tema.secondaryMascotFallback;
  const itemUri = tema.itemFallback;
  const galeriaSpritesLimpos = [mascotUri, secondaryMascotUri, itemUri];

  const questaoAtual = etapaAtual?.tipoEtapa === "questao" ? etapaAtual.questao : null;
  const alternativasDaQuestao: string[] = questaoAtual?.alternativas ?? [];
  const ehDissertativa = questaoAtual?.tipo === "dissertativa";

  const numerosExtraidosQuestao = useMemo(() => {
    if (!questaoAtual) return [];
    return extrairNumerosDoTextoPortugues(questaoAtual.pergunta);
  }, [questaoAtual]);

  const alternativasSaoNumericas = useMemo(() => {
    if (alternativasDaQuestao.length === 0) return false;
    return alternativasDaQuestao.every((a: string) => /^\d+$/.test(a.trim()));
  }, [alternativasDaQuestao]);

  const ehContaMatematica = useMemo(() => {
    if (!questaoAtual || ehDissertativa) return false;
    return numerosExtraidosQuestao.length >= 2 || alternativasSaoNumericas;
  }, [questaoAtual, ehDissertativa, numerosExtraidosQuestao, alternativasSaoNumericas]);

  const numerosConta = useMemo(() => {
    if (numerosExtraidosQuestao.length >= 2) {
      return [numerosExtraidosQuestao[0], numerosExtraidosQuestao[1]];
    }
    const respNum = parseInt(questaoAtual?.respostaCorreta || "", 10);
    if (!isNaN(respNum) && respNum >= 2) {
      const metade = Math.floor(respNum / 2);
      return [metade, respNum - metade];
    }
    return [2, 1];
  }, [numerosExtraidosQuestao, questaoAtual]);

  const figuraDaQuestao = useMemo(() => {
    const p = (questaoAtual?.pergunta || "").toLowerCase();
    if (p.includes("ovo") || p.includes("ovinho") || p.includes("moeda") || p.includes("estrela")) {
      return itemUri;
    }
    if (p.includes("brontossauro") || p.includes("triceratops") || p.includes("stegosaurus")) {
      return secondaryMascotUri;
    }
    return mascotUri;
  }, [questaoAtual, itemUri, secondaryMascotUri, mascotUri]);

  const falaDoMascote = useMemo(() => {
    if (etapaAtual?.tipoEtapa === "explicacao") {
      return `Bem-vindo ao ${tema.nomeJogo}! Vamos aprender rapidinho!`;
    }
    if (etapaAtual?.tipoEtapa === "exemplo") {
      return "Olhe este exemplo com a nossa turma antes de jogar!";
    }
    if (atividadeConcluida) {
      return "Parabéns! Você completou todas as fases!";
    }
    if (feedbackExibido) {
      if (acertouQuestao) {
        return "Isso! Você acertou! 🎉";
      }
      return `Quase! O resultado certo é ${questaoAtual?.respostaCorreta}!`;
    }
    return questaoAtual?.dicaTDAH || `Me ajude a somar: ${numerosConta[0]} + ${numerosConta[1]}!`;
  }, [etapaAtual, tema, atividadeConcluida, feedbackExibido, acertouQuestao, questaoAtual, numerosConta]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: tema.isDark ? "#121026" : "#2E7D32" }]}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={{ color: "#FFF", marginTop: 12, fontWeight: "900", fontSize: 16 }}>
          {loadingText}
        </Text>
      </View>
    );
  }

  if (bloqueado) {
    return (
      <View style={[styles.center, { backgroundColor: tema.corCardFundo, paddingHorizontal: 24 }]}>
        <Text style={{ fontSize: 64, textAlign: "center", marginBottom: 12 }}>⏳</Text>
        <Text style={[styles.cardHeaderTitle, { color: tema.corTextoCard, textAlign: "center" }]}>
          Hora de Respirar!
        </Text>
        <Text
          style={{
            color: tema.corSubtextoCard,
            textAlign: "center",
            marginBottom: 12,
            fontSize: 15,
            fontWeight: "600",
          }}
        >
          Uma pequena pausa ajuda seu cérebro a recarregar. Aguarde o cronômetro para tentar novamente:
        </Text>
        <View
          style={{
            backgroundColor: tema.corGrupoSomaFundo,
            padding: 16,
            borderRadius: 16,
            marginBottom: 24,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="timer" size={28} color={tema.corPrimaria} />
          <Text style={{ fontSize: 28, fontWeight: "900", color: tema.corPrimaria, marginLeft: 10 }}>
            {formatarTempo(segundosBloqueio)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.nextActionButton, { backgroundColor: tema.corPrimaria, width: "100%" }]}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={[
              styles.nextActionButtonText,
              { color: tema.id === "arcade" ? "#0D0B26" : "#FFFFFF" },
            ]}
          >
            Voltar ao Mapa
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalFasesBarra = Math.min(5, Math.max(1, listaQuestoes.length));
  const faseAtualBarra =
    etapaAtual?.tipoEtapa === "questao"
      ? Math.ceil((etapaAtual.numeroQuestao / etapaAtual.totalQuestoes) * totalFasesBarra)
      : 1;

  return (
    <ImageBackground source={{ uri: bgUri }} style={styles.container} resizeMode="cover">
      <View style={styles.topHudWrapper}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={[styles.gameTitlePill, { backgroundColor: tema.corPillHeaderFundo }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Image source={{ uri: mascotUri }} style={styles.miniHeaderIcon} resizeMode="contain" />
            <Text style={[styles.gameTitlePillText, { color: tema.corPillHeaderTexto }]}>
              {tema.nomeJogo}
            </Text>
          </TouchableOpacity>

          <View style={styles.rightBadgesRow}>
            <View
              style={[
                styles.timerBadge,
                atividadeEmAndamento && segundosRestantes <= 60
                  ? { backgroundColor: "#FFEBEE", borderWidth: 1.5, borderColor: "#D32F2F" }
                  : { backgroundColor: tema.corPillHeaderFundo },
              ]}
            >
              <MaterialIcons
                name="schedule"
                size={15}
                color={
                  atividadeEmAndamento && segundosRestantes <= 60
                    ? "#D32F2F"
                    : tema.corPillHeaderTexto
                }
              />
              <Text
                style={[
                  styles.timerText,
                  {
                    color:
                      atividadeEmAndamento && segundosRestantes <= 60
                        ? "#D32F2F"
                        : tema.corPillHeaderTexto,
                  },
                ]}
              >
                {formatarTempo(segundosRestantes)}
              </Text>
            </View>

            <View style={[styles.scorePill, { backgroundColor: tema.corBadgePontosFundo }]}>
              <FontAwesome5
                name={tema.id === "arcade" ? "coins" : "star"}
                size={14}
                color={tema.id === "arcade" ? "#FFD54F" : "#E6A100"}
              />
              <Text style={[styles.scorePillText, { color: tema.corBadgePontosTexto }]}>
                {acertosTotais}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.refreshMiniBtn, { backgroundColor: tema.corPillHeaderFundo }]}
              onPress={() => carregarDadosDaAula(true)}
            >
              <MaterialIcons name="autorenew" size={17} color={tema.corPillHeaderTexto} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.segmentedBarRow}>
          {Array.from({ length: totalFasesBarra }).map((_, idx) => {
            const preenchido = idx < faseAtualBarra;
            return (
              <View
                key={idx}
                style={[
                  styles.segmentPill,
                  {
                    backgroundColor: preenchido
                      ? tema.corPrimaria
                      : tema.isDark
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(255,255,255,0.65)",
                    borderColor: tema.isDark ? "rgba(0, 229, 255, 0.4)" : "#FFFFFF",
                  },
                ]}
              />
            );
          })}
        </View>

        <View style={styles.mascotSpeechRow}>
          <Image source={{ uri: mascotUri }} style={styles.floatingMascotImg} resizeMode="contain" />
          <View style={[styles.speechBubble, { backgroundColor: tema.corBalaoFundo }]}>
            <Text style={[styles.speechBubbleText, { color: tema.corBalaoTexto }]}>
              {falaDoMascote}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomStageWrapper}>
        <View style={[styles.bottomGameCard, { backgroundColor: tema.corCardFundo }]}>
          {etapaAtual?.tipoEtapa === "explicacao" ? (
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 330 }}>
              <Text style={[styles.cardHeaderTitle, { color: tema.corTextoCard }]}>
                {planoAdaptado?.tituloAdaptado || "Prepare-se para a Missão!"}
              </Text>

              {topicosExplicacao.map((t: any, i: number) => {
                const imgTopico = galeriaSpritesLimpos[i % galeriaSpritesLimpos.length];
                return (
                  <View
                    key={i}
                    style={[
                      styles.topicBox,
                      {
                        backgroundColor: tema.isDark ? "rgba(255,255,255,0.08)" : "#FFF5D6",
                        borderColor: tema.corGrupoSomaBorda,
                      },
                    ]}
                  >
                    <View style={styles.topicHeaderWithIcon}>
                      <Image
                        source={{ uri: imgTopico }}
                        style={styles.topicInlineIcon}
                        resizeMode="contain"
                      />
                      <Text style={[styles.topicBoxTitle, { color: tema.corPrimaria, flex: 1 }]}>
                        {t.subtitulo}
                      </Text>
                    </View>
                    <Text style={[styles.topicBoxBody, { color: tema.corTextoCard }]}>
                      {decorarTextoComFiguras(t.textoAdaptado, tema.emojiInline)}
                    </Text>
                  </View>
                );
              })}

              <TouchableOpacity
                style={[styles.nextActionButton, { backgroundColor: tema.corPrimaria }]}
                onPress={() =>
                  topicosExemplo.length > 0 ? setEtapaIndex(1) : iniciarCronometroEIrParaQuestoes()
                }
              >
                <Text
                  style={[
                    styles.nextActionButtonText,
                    { color: tema.id === "arcade" ? "#0D0B26" : "#FFFFFF" },
                  ]}
                >
                  {topicosExemplo.length > 0 ? "Ver Exemplo ➔" : "Jogar Agora ➔"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          ) : etapaAtual?.tipoEtapa === "exemplo" ? (
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 330 }}>
              <Text style={[styles.cardHeaderTitle, { color: tema.corTextoCard }]}>
                Veja como é fácil!
              </Text>

              {topicosExemplo.map((e: any, i: number) => {
                const imgExemplo = galeriaSpritesLimpos[(i + 1) % galeriaSpritesLimpos.length];
                return (
                  <View
                    key={i}
                    style={[
                      styles.topicBox,
                      {
                        backgroundColor: tema.isDark ? "rgba(255,255,255,0.08)" : "#FFF5D6",
                        borderColor: tema.corGrupoSomaBorda,
                      },
                    ]}
                  >
                    <View style={styles.topicHeaderWithIcon}>
                      <Image
                        source={{ uri: imgExemplo }}
                        style={styles.topicInlineIcon}
                        resizeMode="contain"
                      />
                      <Text style={[styles.topicBoxTitle, { color: tema.corPrimaria, flex: 1 }]}>
                        {e.titulo || "Exemplo Prático"}
                      </Text>
                    </View>
                    <Text style={[styles.topicBoxBody, { color: tema.corTextoCard }]}>
                      {decorarTextoComFiguras(e.passoAPasso, tema.emojiInline)}
                    </Text>
                  </View>
                );
              })}

              <TouchableOpacity
                style={[styles.nextActionButton, { backgroundColor: tema.corPrimaria }]}
                onPress={iniciarCronometroEIrParaQuestoes}
              >
                <Text
                  style={[
                    styles.nextActionButtonText,
                    { color: tema.id === "arcade" ? "#0D0B26" : "#FFFFFF" },
                  ]}
                >
                  Começar Fases ➔
                </Text>
              </TouchableOpacity>
            </ScrollView>
          ) : atividadeConcluida ? (
            <View style={{ alignItems: "center", paddingVertical: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 8 }}>
                <Image source={{ uri: mascotUri }} style={{ width: 78, height: 78 }} resizeMode="contain" />
                <Image
                  source={{ uri: secondaryMascotUri }}
                  style={{ width: 72, height: 72 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.cardHeaderTitle, { color: tema.corTextoCard }]}>
                Fase Concluída! 🏆
              </Text>
              <Text
                style={[
                  styles.topicBoxBody,
                  { color: tema.corSubtextoCard, textAlign: "center", marginBottom: 14 },
                ]}
              >
                Você mandou super bem e conquistou {acertosTotais} estrelas nesta missão!
              </Text>
              <TouchableOpacity
                style={[
                  styles.nextActionButton,
                  { backgroundColor: tema.corPrimaria, width: "100%" },
                ]}
                onPress={() => navigation.goBack()}
              >
                <Text
                  style={[
                    styles.nextActionButtonText,
                    { color: tema.id === "arcade" ? "#0D0B26" : "#FFFFFF" },
                  ]}
                >
                  Voltar ao Mapa ➔
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 355 }}>
              <Text style={[styles.promptQuestionLabel, { color: tema.corTextoCard }]}>
                {decorarTextoComFiguras(questaoAtual?.pergunta || "", tema.emojiInline)}
              </Text>

              {ehContaMatematica ? (
                <>
                  <View style={styles.visualMathContainersRow}>
                    <View
                      style={[
                        styles.mathVisualGroupBox,
                        tema.formatoGrupoSoma === "cupula"
                          ? styles.domeGroupShape
                          : styles.neonGroupShape,
                        {
                          backgroundColor: tema.corGrupoSomaFundo,
                          borderColor: tema.corGrupoSomaBorda,
                        },
                      ]}
                    >
                      <Text style={[styles.mathBigCountText, { color: tema.corTextoCard }]}>
                        {numerosConta[0]}
                      </Text>
                      <Image
                        source={{ uri: figuraDaQuestao }}
                        style={styles.countableItemImgLarge}
                        resizeMode="contain"
                      />
                    </View>

                    <Text style={[styles.middlePlusSign, { color: tema.corSinalSoma }]}>+</Text>

                    <View
                      style={[
                        styles.mathVisualGroupBox,
                        tema.formatoGrupoSoma === "cupula"
                          ? styles.domeGroupShape
                          : styles.neonGroupShape,
                        {
                          backgroundColor: tema.corGrupoSomaFundo,
                          borderColor: tema.corGrupoSomaBorda,
                        },
                      ]}
                    >
                      <Text style={[styles.mathBigCountText, { color: tema.corTextoCard }]}>
                        {numerosConta[1]}
                      </Text>
                      <Image
                        source={{ uri: figuraDaQuestao }}
                        style={styles.countableItemImgLarge}
                        resizeMode="contain"
                      />
                    </View>
                  </View>

                  <View style={styles.bigEquationRow}>
                    <Text style={[styles.bigEquationNumber, { color: tema.corTextoCard }]}>
                      {numerosConta[0]}
                    </Text>
                    <Text style={[styles.bigEquationPlus, { color: tema.corSinalSoma }]}> + </Text>
                    <Text style={[styles.bigEquationNumber, { color: tema.corTextoCard }]}>
                      {numerosConta[1]}
                    </Text>
                    <Text style={[styles.bigEquationNumber, { color: tema.corTextoCard }]}> = </Text>
                    <Text style={[styles.bigEquationResult, { color: tema.corPrimaria }]}>
                      {feedbackExibido ? questaoAtual?.respostaCorreta : "?"}
                    </Text>
                  </View>
                </>
              ) : null}

              {ehDissertativa ? (
                <View>
                  <TextInput
                    style={[
                      styles.dissertativaInput,
                      {
                        borderColor: tema.corGrupoSomaBorda,
                        color: tema.corTextoCard,
                        backgroundColor: tema.isDark ? "rgba(255,255,255,0.08)" : "#FFFFFF",
                      },
                    ]}
                    multiline
                    editable={!feedbackExibido}
                    placeholder="Escreva sua resposta aqui..."
                    placeholderTextColor="#888"
                    value={respostaDissertativa}
                    onChangeText={setRespostaDissertativa}
                  />
                  {!feedbackExibido ? (
                    <TouchableOpacity
                      style={[styles.nextActionButton, { backgroundColor: tema.corPrimaria }]}
                      onPress={confirmarDissertativa}
                    >
                      <Text
                        style={[
                          styles.nextActionButtonText,
                          { color: tema.id === "arcade" ? "#0D0B26" : "#FFFFFF" },
                        ]}
                      >
                        Confirmar Resposta
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : ehContaMatematica ? (
                <View style={styles.horizontalChoicesRow}>
                  {alternativasDaQuestao.slice(0, 3).map((alt, idx) => {
                    const isSelected = opcaoSelecionada === alt;
                    const ehCorreta =
                      alt.trim().toLowerCase() ===
                      (questaoAtual?.respostaCorreta || "").trim().toLowerCase();

                    let bgOpcao = tema.corOpcaoFundo;
                    let bordaOpcao = tema.corOpcaoBorda;
                    let corTextoOpcao = tema.corOpcaoTexto;

                    if (feedbackExibido) {
                      if (ehCorreta) {
                        bgOpcao = tema.corOpcaoCertaFundo;
                        bordaOpcao = tema.corOpcaoCertaFundo;
                        corTextoOpcao = tema.id === "arcade" ? "#0D0B26" : "#FFFFFF";
                      } else if (isSelected) {
                        bgOpcao = tema.corOpcaoErradaFundo;
                        bordaOpcao = tema.corOpcaoErradaFundo;
                        corTextoOpcao = "#FFFFFF";
                      }
                    }

                    return (
                      <TouchableOpacity
                        key={idx}
                        activeOpacity={0.85}
                        disabled={feedbackExibido}
                        onPress={() => selecionarEVerificarAlternativa(alt)}
                        style={[
                          styles.choiceShapeBase,
                          tema.formatoOpcao === "ovo"
                            ? styles.eggChoiceShape
                            : styles.arcadeChoiceShape,
                          {
                            backgroundColor: bgOpcao,
                            borderColor: bordaOpcao,
                          },
                        ]}
                      >
                        <Text style={[styles.choiceBigNumberText, { color: corTextoOpcao }]}>
                          {alt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View style={{ marginTop: 6 }}>
                  {alternativasDaQuestao.map((alt, idx) => {
                    const isSelected = opcaoSelecionada === alt;
                    const ehCorreta =
                      alt.trim().toLowerCase() ===
                      (questaoAtual?.respostaCorreta || "").trim().toLowerCase();

                    let bgOpcao = tema.corOpcaoFundo;
                    let bordaOpcao = tema.corOpcaoBorda;
                    let corTextoOpcao = tema.corOpcaoTexto;

                    if (feedbackExibido) {
                      if (ehCorreta) {
                        bgOpcao = tema.corOpcaoCertaFundo;
                        bordaOpcao = tema.corOpcaoCertaFundo;
                        corTextoOpcao = tema.id === "arcade" ? "#0D0B26" : "#FFFFFF";
                      } else if (isSelected) {
                        bgOpcao = tema.corOpcaoErradaFundo;
                        bordaOpcao = tema.corOpcaoErradaFundo;
                        corTextoOpcao = "#FFFFFF";
                      }
                    }

                    return (
                      <TouchableOpacity
                        key={idx}
                        disabled={feedbackExibido}
                        onPress={() => selecionarEVerificarAlternativa(alt)}
                        style={[
                          styles.textChoiceButton,
                          { backgroundColor: bgOpcao, borderColor: bordaOpcao },
                        ]}
                      >
                        <Text style={[styles.textChoiceLabel, { color: corTextoOpcao }]}>{alt}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {feedbackExibido ? (
                <TouchableOpacity
                  style={[styles.nextActionButton, { backgroundColor: tema.corPrimaria }]}
                  onPress={handleProximaQuestao}
                >
                  <Text
                    style={[
                      styles.nextActionButtonText,
                      { color: tema.id === "arcade" ? "#0D0B26" : "#FFFFFF" },
                    ]}
                  >
                    Próximo ➔
                  </Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, width: "100%", height: "100%", justifyContent: "space-between" },

  topHudWrapper: {
    paddingTop: 42,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gameTitlePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  miniHeaderIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  gameTitlePillText: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  rightBadgesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    elevation: 4,
  },
  timerText: {
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 4,
  },
  scorePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    elevation: 4,
    marginLeft: 6,
  },
  scorePillText: {
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 5,
  },
  refreshMiniBtn: {
    marginLeft: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  segmentedBarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 8,
  },
  segmentPill: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },

  mascotSpeechRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  floatingMascotImg: {
    width: 78,
    height: 78,
  },
  speechBubble: {
    flex: 1,
    marginLeft: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  speechBubbleText: {
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 19,
  },

  bottomStageWrapper: {
    paddingHorizontal: 14,
    paddingBottom: 16,
  },
  bottomGameCard: {
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
    elevation: 14,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 14,
  },

  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  topicBox: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 8,
  },
  topicHeaderWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  topicInlineIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  topicBoxTitle: {
    fontSize: 14,
    fontWeight: "900",
  },
  topicBoxBody: {
    fontSize: 13.5,
    fontWeight: "600",
    lineHeight: 19,
  },

  promptQuestionLabel: {
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 10,
    paddingTop: 2,
  },

  visualMathContainersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  mathVisualGroupBox: {
    width: "40%",
    minHeight: 74,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  domeGroupShape: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderWidth: 2.5,
    borderStyle: "dashed",
  },
  neonGroupShape: {
    borderRadius: 18,
    borderWidth: 2.5,
  },
  mathBigCountText: {
    fontSize: 32,
    fontWeight: "900",
    marginRight: 8,
  },
  countableItemImgLarge: {
    width: 42,
    height: 42,
  },
  middlePlusSign: {
    fontSize: 26,
    fontWeight: "900",
    marginHorizontal: 8,
  },

  bigEquationRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  bigEquationNumber: {
    fontSize: 30,
    fontWeight: "900",
  },
  bigEquationPlus: {
    fontSize: 28,
    fontWeight: "900",
  },
  bigEquationResult: {
    fontSize: 30,
    fontWeight: "900",
  },

  horizontalChoicesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  choiceShapeBase: {
    width: "30.5%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  eggChoiceShape: {
    height: 88,
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    borderWidth: 3,
  },
  arcadeChoiceShape: {
    height: 82,
    borderRadius: 18,
    borderWidth: 2.5,
  },
  choiceBigNumberText: {
    fontSize: 28,
    fontWeight: "900",
  },

  textChoiceButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 2,
    marginBottom: 8,
  },
  textChoiceLabel: {
    fontSize: 14,
    fontWeight: "800",
  },

  dissertativaInput: {
    borderWidth: 2.5,
    borderRadius: 16,
    padding: 12,
    minHeight: 85,
    textAlignVertical: "top",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  nextActionButton: {
    width: "100%",
    paddingVertical: 13,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    elevation: 4,
  },
  nextActionButtonText: {
    fontSize: 16,
    fontWeight: "900",
  },
});