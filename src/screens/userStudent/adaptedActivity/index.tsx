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
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../services/ip";

const TEMPO_ATIVIDADE_SEGUNDOS = 5 * 60 + 50;
const TEMPO_BLOQUEIO_MS = 5 * 60 * 1000;

const theme = {
  primaryGreen: "#0F5C4A",
  lightGreen: "#E6F4F1",
  lightGray: "#F5F7F8",
  textColor: "#333333",
  radioBorder: "#B0C2BE",
};

type TemaVisualConfig = {
  nomeItemContagem: string;
  emojiInline: string;
  bgFallback: string;
  mascotFallback: string;
  secondaryMascotFallback: string;
  itemFallback: string;
};

function obterTemaGamificado(hiperfoco: string): TemaVisualConfig {
  const raw = (hiperfoco || "dinossauros").trim().toLowerCase();

  const base: TemaVisualConfig = {
    bgFallback:
      "https://image.pollinations.ai/prompt/masterpiece%202D%20flat%20vector%20mobile%20game%20background%20illustration%20vibrant%20prehistoric%20valley%20with%20a%20smoking%20volcano%20in%20the%20center%20distance%20sparkling%20waterfall%20lush%20green%20palm%20trees%20warm%20golden%20sunset%20sky%20Khan%20Academy%20Kids%20style?width=1080&height=1920&nologo=true&seed=8088",
    nomeItemContagem: "dinossauros",
    emojiInline: "🦖",
    mascotFallback:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/T-Rex.png",
    secondaryMascotFallback:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Person%20Standing.png",
    itemFallback:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Egg.png",
  };

  if (raw.includes("video game") || raw.includes("game") || raw.includes("jogo")) {
    base.nomeItemContagem = "moedas";
    base.emojiInline = "🪙";
    base.bgFallback =
      "https://image.pollinations.ai/prompt/masterpiece%2016-bit%20pixel%20art%20retro%20arcade%20platformer%20night%20landscape%20vibrant%20neon%20purple%20mountains%20floating%20pixel%20grass%20platforms%20golden%20coins%20big%20cyan%20synthwave%20moon?width=1080&height=1920&nologo=true&seed=8088";
    base.mascotFallback =
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png";
    base.secondaryMascotFallback =
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Video%20Game.png";
    base.itemFallback =
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Coin.png";
  } else if (raw.includes("espaço") || raw.includes("espaco") || raw.includes("astronauta") || raw.includes("planeta")) {
    base.nomeItemContagem = "estrelas";
    base.emojiInline = "🚀";
    base.bgFallback =
      "https://image.pollinations.ai/prompt/masterpiece%20vibrant%202D%20vector%20outer%20space%20game%20background%20glowing%20neon%20Saturn%20planet%20colorful%20nebula%20bright%20stars?width=1080&height=1920&nologo=true&seed=8088";
    base.mascotFallback =
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png";
    base.secondaryMascotFallback =
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Ringed%20Planet.png";
    base.itemFallback =
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Star.png";
  } else if (raw.includes("carro") || raw.includes("corrida")) {
    base.nomeItemContagem = "carrinhos";
    base.emojiInline = "🏎️";
    base.bgFallback =
      "https://image.pollinations.ai/prompt/masterpiece%20vibrant%202D%20vector%20cartoon%20racing%20track%20stadium%20landscape%20green%20hills%20sunny%20blue%20sky?width=1080&height=1920&nologo=true&seed=8088";
    base.mascotFallback =
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Racing%20Car.png";
    base.secondaryMascotFallback =
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Trophy.png";
    base.itemFallback =
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Sport%20Utility%20Vehicle.png";
  } else if (raw.includes("futebol") || raw.includes("bola") || raw.includes("esporte")) {
    base.nomeItemContagem = "bolas";
    base.emojiInline = "⚽";
    base.bgFallback =
      "https://image.pollinations.ai/prompt/masterpiece%202D%20flat%20vector%20soccer%20stadium%20green%20grass%20field%20sunny%20sky%20cartoon%20game%20background?width=1080&height=1920&nologo=true&seed=8088";
    base.mascotFallback =
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Soccer%20Ball.png";
    base.secondaryMascotFallback =
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Trophy.png";
    base.itemFallback =
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Goal%20Net.png";
  }

  return base;
}

function formatarTempo(totalSegundos: number) {
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

function detectarOperadorMatematico(pergunta: string): "+" | "-" | "×" | "÷" {
  const p = (pergunta || "").toLowerCase();
  if (/\d+\s*\-\s*\d+/.test(p) || p.includes("menos") || p.includes("tirou") || p.includes("perdeu") || p.includes("restaram") || p.includes("fugiram")) {
    return "-";
  }
  if (/\d+\s*[\*x×]\s*\d+/.test(p) || p.includes("vezes") || p.includes("multiplicado")) {
    return "×";
  }
  if (/\d+\s*[\/÷]\s*\d+/.test(p) || p.includes("dividido") || p.includes("repartiu")) {
    return "÷";
  }
  return "+";
}

function extrairNumerosDoTextoPortugues(texto: string): number[] {
  if (!texto) return [];

  const expressaoExplicita = texto.match(/(\d+)\s*[\+\-\*\/x×÷]\s*(\d+)/i);
  if (expressaoExplicita) {
    return [parseInt(expressaoExplicita[1], 10), parseInt(expressaoExplicita[2], 10)];
  }

  const digitosExplicitos = Array.from(texto.matchAll(/\b(\d+)\b/g))
    .map((m) => parseInt(m[1], 10))
    .filter((val) => val >= 0 && val <= 100);

  if (digitosExplicitos.length >= 2) {
    return digitosExplicitos;
  }

  const mapaPalavras: Record<string, number> = {
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

  const tokens = texto.toLowerCase().replace(/[\,\.\!\?\:\;\(\)\[\]]/g, " ").split(/\s+/);
  const encontrados: number[] = [];

  for (const tk of tokens) {
    if (/^\d+$/.test(tk)) {
      const val = parseInt(tk, 10);
      if (val >= 0 && val <= 100) encontrados.push(val);
    } else if (mapaPalavras[tk] !== undefined) {
      encontrados.push(mapaPalavras[tk]);
    }
  }

  return encontrados;
}

function calcularResultadoOperacao(n1: number, n2: number, op: "+" | "-" | "×" | "÷"): number {
  if (op === "-") return Math.max(0, n1 - n2);
  if (op === "×") return n1 * n2;
  if (op === "÷") return n2 !== 0 ? Math.round(n1 / n2) : n1;
  return n1 + n2;
}

function decorarTextoComFiguras(texto: string, emojiTema: string): string {
  if (!texto) return "";
  let resultado = texto;
  const substituicoes: Array<[RegExp, string]> = [
    [/\b(t-rex|tiranossauro|dinossauros|dinossauro|dinos|dino)\b/gi, `$1 🦖`],
    [/\b(brontossauros|brontossauro|braquiossauro|sauropode|pescoçudo|triceratops|estegossauro|velociraptor)\b/gi, `$1 🦕`],
    [/\b(ovinhos|ovinho|ovos|ovo)\b/gi, `$1 🥚`],
    [/\b(moedinhas|moedinha|moedas|moeda)\b/gi, `$1 🪙`],
    [/\b(foguetes|foguete)\b/gi, `$1 🚀`],
    [/\b(estrelas|estrela)\b/gi, `$1 ⭐`],
    [/\b(carrinhos|carrinho|carros|carro)\b/gi, `$1 🏎️`],
    [/\b(bolas|bola)\b/gi, `$1 ⚽`],
  ];

  for (const [regex, subst] of substituicoes) {
    resultado = resultado.replace(regex, subst);
  }
  return resultado;
}

type PassoQuestao = {
  tituloAtividade: string;
  comandoAtividade: string;
  tipo: "dissertativa" | "objetiva";
  pergunta: string;
  respostaCorreta: string;
  alternativas: string[];
};

type RespostaRegistrada = {
  numeroQuestao: number;
  pergunta: string;
  respostaAluno: string;
  respostaCorreta: string;
  acertou: boolean;
  tipo: "dissertativa" | "objetiva";
};

type EtapaFluxo =
  | { tipoEtapa: "explicacao" }
  | { tipoEtapa: "exemplo" }
  | { tipoEtapa: "questao"; questao: PassoQuestao; numeroQuestao: number; totalQuestoes: number };

export default function AdaptedActivityScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {
    userId,
    planoId,
    turmaId,
    materiaId,
    urlPlanoDeAula,
    planoTitulo,
    planoDescricao,
    materiaNome,
  } = route.params || {};

  const idUnicoAtividade = `${userId || "aluno"}_${planoId || materiaId || "geral"}`;
  const chaveBloqueio = `@luna_cooldown_${idUnicoAtividade}`;
  const chaveFimAtividade = `@luna_timer_end_${idUnicoAtividade}`;
  const chaveRespostasSalvas = `@luna_respostas_${idUnicoAtividade}`;

  const [loading, setLoading] = useState(true);
  const [salvandoRespostas, setSalvandoRespostas] = useState(false);
  const [planoAdaptado, setPlanoAdaptado] = useState<any>(null);
  const [bgCustomizado, setBgCustomizado] = useState<string>("");
  const [hiperfocoAluno, setHiperfocoAluno] = useState("dinossauros");

  const [etapaIndex, setEtapaIndex] = useState(0);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | null>(null);
  const [respostaDissertativa, setRespostaDissertativa] = useState<string>("");
  const [feedbackExibido, setFeedbackExibido] = useState(false);
  const [acertouQuestao, setAcertouQuestao] = useState<boolean | null>(null);

  const [respostasAluno, setRespostasAluno] = useState<Record<number, RespostaRegistrada>>({});
  const [atividadeJaRespondida, setAtividadeJaRespondida] = useState(false);

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
    if (blocos.length === 0) return [];
    return blocos.map((bloco: string, idx: number) => ({
      subtitulo: idx === 0 ? "Explicação" : `Parte ${idx + 1}`,
      textoAdaptado: bloco,
    }));
  }, [planoAdaptado]);

  const topicosExemplo = useMemo(() => {
    if (Array.isArray(planoAdaptado?.topicosExemplo) && planoAdaptado.topicosExemplo.length > 0) {
      return planoAdaptado.topicosExemplo;
    }
    const exemploTexto = String(planoAdaptado?.exemploPratico || "").trim();
    if (exemploTexto) {
      return [{ titulo: "Exemplo Prático", passoAPasso: exemploTexto }];
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
        let alts: string[] = Array.isArray(q?.alternativas) ? q.alternativas.map((a: any) => String(a).trim()) : [];

        const ehDissertativaReal =
          String(q?.tipo || "").toLowerCase() === "dissertativa" || alts.length === 0;

        if (!ehDissertativaReal) {
          const numerosExtraidos = extrairNumerosDoTextoPortugues(perguntaStr);
          const op = detectarOperadorMatematico(perguntaStr);
          const alternativasSaoNumericas = alts.length > 0 && alts.every((a: string) => /^\d+$/.test(a));
          const ehPerguntaCalculo =
            /\d+\s*[\+\-\*\/x×÷]/.test(perguntaStr) ||
            alternativasSaoNumericas ||
            numerosExtraidos.length >= 2;

          if (ehPerguntaCalculo) {
            const valorCalculado =
              numerosExtraidos.length >= 2
                ? calcularResultadoOperacao(numerosExtraidos[0], numerosExtraidos[1], op)
                : null;

            const respEhNumeroValido = /^\d+$/.test(respFinal);

            if (!respEhNumeroValido || !alts.includes(respFinal)) {
              if (valorCalculado !== null) {
                respFinal = String(valorCalculado);
              } else if (alts.length > 0) {
                respFinal = alts[0];
              }
            } else if (
              valorCalculado !== null &&
              parseInt(respFinal, 10) !== valorCalculado &&
              alts.includes(String(valorCalculado))
            ) {
              respFinal = String(valorCalculado);
            }

            if (alts.length < 2) {
              const ans = parseInt(respFinal, 10) || (valorCalculado ?? 4);
              respFinal = String(ans);
              const opcoes = new Set<string>([String(ans)]);
              const candidatos = [ans + 1, Math.max(1, ans - 1), ans + 2, Math.max(1, ans - 2)];
              for (const c of candidatos) {
                if (opcoes.size < 3) opcoes.add(String(c));
              }
              alts = Array.from(opcoes).sort((a: string, b: string) => Number(a) - Number(b));
            } else if (!alts.includes(respFinal) && /^\d+$/.test(respFinal)) {
              alts[0] = respFinal;
              alts.sort((a: string, b: string) => Number(a) - Number(b));
            }
          } else {
            const respExisteNasAlternativas = alts.some(
              (a) => a.toLowerCase() === respFinal.toLowerCase()
            );
            if (!respExisteNasAlternativas && alts.length > 0) {
              respFinal = alts[0];
            }
          }
        }

        return {
          tituloAtividade: q?.tituloAtividade || `Fase ${i + 1}`,
          comandoAtividade: q?.comandoAtividade || "",
          tipo: ehDissertativaReal ? "dissertativa" : "objetiva",
          pergunta: perguntaStr,
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
        pergunta: "Vamos contar rápido os objetos e fazer a soma: 2 + 2?",
        respostaCorreta: "4",
        alternativas: ["2", "3", "4", "5"],
      });
    }

    return processadas;
  }, [planoAdaptado]);

  const etapasFluxo = useMemo<EtapaFluxo[]>(() => {
    const etapas: EtapaFluxo[] = [];
    if (topicosExplicacao.length > 0) {
      etapas.push({ tipoEtapa: "explicacao" });
    }
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
  }, [topicosExplicacao, topicosExemplo, listaQuestoes]);

  const indicePrimeiraQuestao = useMemo(() => {
    const idx = etapasFluxo.findIndex((e) => e.tipoEtapa === "questao");
    return idx >= 0 ? idx : 0;
  }, [etapasFluxo]);

  const etapaAtual = etapasFluxo[etapaIndex];
  const atividadeEmAndamento =
    !atividadeJaRespondida && etapaIndex >= indicePrimeiraQuestao && etapaIndex < etapasFluxo.length;
  const atividadeConcluida =
    atividadeJaRespondida || (etapasFluxo.length > 0 && etapaIndex >= etapasFluxo.length);

  const questaoAtual = etapaAtual?.tipoEtapa === "questao" ? etapaAtual.questao : null;
  const ehDissertativa = questaoAtual?.tipo === "dissertativa";

  const numerosExtraidosQuestao = useMemo(() => {
    if (!questaoAtual) return [];
    return extrairNumerosDoTextoPortugues(questaoAtual.pergunta);
  }, [questaoAtual]);

  const contextoCompletoTexto = useMemo(() => {
    return `${materiaNome || ""} ${planoAdaptado?.disciplina || ""} ${planoAdaptado?.temaDetectado || ""} ${planoAdaptado?.materia || ""} ${planoTitulo || ""} ${planoDescricao || ""} ${questaoAtual?.pergunta || ""}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }, [materiaNome, planoAdaptado, planoTitulo, planoDescricao, questaoAtual]);

  const ehQuestaoMatematica = useMemo(() => {
    const textoPergunta = (questaoAtual?.pergunta || "").toLowerCase();
    const temSinalMatematico = /\d+\s*[\+\-\*\/x×÷]/.test(textoPergunta);
    const temPalavrasCalculo = /(soma|somar|juntar|mais|menos|subtrair|restaram|quantos|total|ao todo|calcul|adic|multipl|divid)/i.test(textoPergunta);
    const alternativasNumericas =
      questaoAtual?.alternativas &&
      questaoAtual.alternativas.length > 0 &&
      questaoAtual.alternativas.every((a) => /^\d+(\s+\w+)?$/.test(a.trim()));

    const contextoEhMat =
      contextoCompletoTexto.includes("mat") ||
      temSinalMatematico ||
      alternativasNumericas ||
      (numerosExtraidosQuestao.length >= 2 && temPalavrasCalculo);

    return Boolean(contextoEhMat);
  }, [questaoAtual, contextoCompletoTexto, numerosExtraidosQuestao]);

  const nomeDaMateriaTela = useMemo(() => {
    if (materiaNome) return materiaNome;
    if (planoAdaptado?.disciplina) return planoAdaptado.disciplina;
    if (planoAdaptado?.temaDetectado) return planoAdaptado.temaDetectado;
    if (planoAdaptado?.materia) return planoAdaptado.materia;
    if (ehQuestaoMatematica) return "Matemática";
    if (contextoCompletoTexto.includes("hist") || contextoCompletoTexto.includes("idade media") || contextoCompletoTexto.includes("tempo")) return "História";
    if (contextoCompletoTexto.includes("geo")) return "Geografia";
    if (contextoCompletoTexto.includes("port") || contextoCompletoTexto.includes("texto") || contextoCompletoTexto.includes("leitura")) return "Português";
    if (contextoCompletoTexto.includes("cien")) return "Ciências";
    return planoTitulo || "Atividade";
  }, [materiaNome, planoAdaptado, ehQuestaoMatematica, contextoCompletoTexto, planoTitulo]);

  const operadorMatematico = useMemo(() => {
    return detectarOperadorMatematico(questaoAtual?.pergunta || "");
  }, [questaoAtual]);

  const numerosConta = useMemo(() => {
    if (numerosExtraidosQuestao.length >= 2) {
      return [numerosExtraidosQuestao[0], numerosExtraidosQuestao[1]];
    }
    const respNum = parseInt(questaoAtual?.respostaCorreta || "", 10);
    if (!isNaN(respNum) && respNum >= 2) {
      const p1 = Math.floor(respNum / 2);
      return [p1, respNum - p1];
    }
    if (numerosExtraidosQuestao.length === 1) {
      return [numerosExtraidosQuestao[0], 1];
    }
    return [2, 1];
  }, [numerosExtraidosQuestao, questaoAtual]);

  const ativarBloqueio = useCallback(async () => {
    const expiraEm = Date.now() + TEMPO_BLOQUEIO_MS;
    await AsyncStorage.setItem(chaveBloqueio, String(expiraEm));
    await AsyncStorage.removeItem(chaveFimAtividade);
  }, [chaveBloqueio, chaveFimAtividade]);

  const limparSessao = useCallback(async () => {
    await AsyncStorage.removeItem(chaveFimAtividade);
  }, [chaveFimAtividade]);

  useEffect(() => {
    async function carregarDadosDaAula() {
      try {
        setLoading(true);
        let hiperfoco = "dinossauros";

        try {
          const respAluno = await fetch(`${API_BASE_URL}/students/aluno/${userId}`);
          const dataAluno = await respAluno.json();
          hiperfoco =
            dataAluno.aluno?.hiperfoco?.nome ||
            dataAluno.aluno?.hyperfoco?.nome ||
            dataAluno.aluno?.hiperfoco ||
            "dinossauros";
        } catch (err) { }

        setHiperfocoAluno(String(hiperfoco));

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
            forcarRegeneracao: false,
          }),
        });
        const dataIA = await respIA.json();
        setPlanoAdaptado(dataIA.plano_adaptado);

        const temaCfg = obterTemaGamificado(String(hiperfoco));
        setBgCustomizado(temaCfg.bgFallback);

        let encontrouSubmissao = false;
        if (userId && planoId) {
          try {
            const respSub = await fetch(
              `${API_BASE_URL}/activities/resposta?alunoId=${userId}&planoId=${planoId}`
            );
            if (respSub.ok) {
              const dataSub = await respSub.json();
              if (dataSub.ok && dataSub.atividade && Array.isArray(dataSub.atividade.respostas)) {
                const mapa: Record<number, RespostaRegistrada> = {};
                dataSub.atividade.respostas.forEach((r: RespostaRegistrada) => {
                  mapa[r.numeroQuestao] = r;
                });
                setRespostasAluno(mapa);
                setAtividadeJaRespondida(true);
                encontrouSubmissao = true;
              }
            }
          } catch (e) { }
        }

        if (!encontrouSubmissao) {
          const localSalvo = await AsyncStorage.getItem(chaveRespostasSalvas);
          if (localSalvo) {
            const parsed = JSON.parse(localSalvo);
            if (parsed && Object.keys(parsed).length > 0) {
              setRespostasAluno(parsed);
              setAtividadeJaRespondida(true);
            }
          }
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    if (userId) carregarDadosDaAula();
  }, [userId, planoId, turmaId, materiaId, urlPlanoDeAula, chaveRespostasSalvas]);

  useEffect(() => {
    if (!loading && !atividadeJaRespondida && etapasFluxo.length > 0 && indicePrimeiraQuestao === 0) {
      AsyncStorage.getItem(chaveFimAtividade).then((salvo) => {
        if (!salvo) {
          const novoFim = Date.now() + TEMPO_ATIVIDADE_SEGUNDOS * 1000;
          AsyncStorage.setItem(chaveFimAtividade, String(novoFim));
        }
      });
    }
  }, [loading, atividadeJaRespondida, etapasFluxo, indicePrimeiraQuestao, chaveFimAtividade]);

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
        await ativarBloqueio();
        setBloqueado(true);
      }
    }, 1000);
    return () => clearInterval(int);
  }, [loading, bloqueado, atividadeEmAndamento, chaveFimAtividade, ativarBloqueio]);

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

  const confirmarResposta = () => {
    if (feedbackExibido || etapaAtual?.tipoEtapa !== "questao") return;

    const q = etapaAtual.questao;
    const numQ = etapaAtual.numeroQuestao;

    if (q.tipo === "dissertativa") {
      if (respostaDissertativa.trim().length < 2) return;
      const registro: RespostaRegistrada = {
        numeroQuestao: numQ,
        pergunta: q.pergunta,
        respostaAluno: respostaDissertativa.trim(),
        respostaCorreta: q.respostaCorreta || "Resposta aberta",
        acertou: true,
        tipo: "dissertativa",
      };
      setRespostasAluno((prev) => ({ ...prev, [numQ]: registro }));
      setAcertouQuestao(true);
      setFeedbackExibido(true);
      return;
    }

    if (!opcaoSelecionada) return;

    const sl = opcaoSelecionada.trim().toLowerCase();
    const cl = (q.respostaCorreta || "").trim().toLowerCase();
    const acertou = sl === cl || sl.startsWith(`${cl} `) || sl.startsWith(`${cl})`);

    const registro: RespostaRegistrada = {
      numeroQuestao: numQ,
      pergunta: q.pergunta,
      respostaAluno: opcaoSelecionada.trim(),
      respostaCorreta: q.respostaCorreta,
      acertou,
      tipo: "objetiva",
    };

    setRespostasAluno((prev) => ({ ...prev, [numQ]: registro }));
    setAcertouQuestao(acertou);
    setFeedbackExibido(true);
  };

  const salvarRespostasNoBanco = async () => {
    try {
      setSalvandoRespostas(true);
      const listaRespostas = Object.values(respostasAluno).sort(
        (a, b) => a.numeroQuestao - b.numeroQuestao
      );
      const totalAcertos = listaRespostas.filter((r) => r.acertou).length;

      await AsyncStorage.setItem(chaveRespostasSalvas, JSON.stringify(respostasAluno));
      await limparSessao();

      try {
        await fetch(`${API_BASE_URL}/activities/responder`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            alunoID: String(userId || ""),
            planoID: String(planoId || ""),
            turmaID: String(turmaId || ""),
            materiaID: String(materiaId || ""),
            materia: nomeDaMateriaTela,
            titulo: planoAdaptado?.tituloAdaptado || planoTitulo || "Atividade Adaptada",
            respostas: listaRespostas,
            acertos: totalAcertos,
            totalQuestoes: listaQuestoes.length,
            status: "concluida",
          }),
        });
      } catch (err) { }

      setAtividadeJaRespondida(true);
      setEtapaIndex(etapasFluxo.length);
    } finally {
      setSalvandoRespostas(false);
    }
  };

  const handleProximaQuestao = () => {
    const ehUltimaQuestao =
      etapaAtual?.tipoEtapa === "questao" &&
      etapaAtual.numeroQuestao === etapaAtual.totalQuestoes;

    if (ehUltimaQuestao) {
      Alert.alert(
        "Finalizar Atividade",
        "Deseja mesmo enviar suas respostas?",
        [
          { text: "Revisar", style: "cancel" },
          {
            text: "Enviar",
            onPress: salvarRespostasNoBanco,
          },
        ]
      );
      return;
    }

    const nx = etapaIndex + 1;
    setOpcaoSelecionada(null);
    setRespostaDissertativa("");
    setFeedbackExibido(false);
    setAcertouQuestao(null);
    setEtapaIndex(nx);
  };

  const tema = useMemo(() => obterTemaGamificado(hiperfocoAluno), [hiperfocoAluno]);
  const bgUri = bgCustomizado || tema.bgFallback;
  const figuraPrincipal = tema.mascotFallback;
  const figuraSecundaria = tema.secondaryMascotFallback;

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: "#fff" }]}>
        <ActivityIndicator size="large" color={theme.primaryGreen} />
        <Text style={{ color: theme.primaryGreen, marginTop: 12, fontWeight: "bold", fontSize: 16 }}>
          Carregando Atividade...
        </Text>
      </View>
    );
  }

  if (bloqueado) {
    return (
      <View style={[styles.center, { backgroundColor: "#fff", paddingHorizontal: 24 }]}>
        <Text style={{ fontSize: 64, textAlign: "center", marginBottom: 12 }}>⏳</Text>
        <Text style={[styles.cardTitle, { textAlign: "center", color: theme.primaryGreen }]}>
          Hora de Respirar!
        </Text>
        <Text style={{ color: "#666", textAlign: "center", marginBottom: 24, fontSize: 15 }}>
          Uma pequena pausa ajuda seu cérebro a recarregar.
        </Text>
        <View style={styles.blockTimerBox}>
          <MaterialIcons name="timer" size={28} color={theme.primaryGreen} />
          <Text style={styles.blockTimerText}>{formatarTempo(segundosBloqueio)}</Text>
        </View>
        <TouchableOpacity style={styles.mainActionButton} onPress={() => navigation.goBack()}>
          <Text style={styles.mainActionButtonText}>Voltar para o Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalFasesBarra = listaQuestoes.length > 0 ? listaQuestoes.length : 1;
  const faseAtualBarra =
    atividadeConcluida
      ? totalFasesBarra
      : etapaAtual?.tipoEtapa === "questao"
        ? etapaAtual.numeroQuestao
        : 0;

  const listaRespostasOrdenadas = Object.values(respostasAluno).sort(
    (a, b) => a.numeroQuestao - b.numeroQuestao
  );
  const totalAcertos = listaRespostasOrdenadas.filter((r) => r.acertou).length;

  return (
    <ImageBackground source={{ uri: bgUri }} style={styles.container} resizeMode="cover">
      <View style={styles.overlayLight} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonCircular} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={theme.primaryGreen} />
        </TouchableOpacity>

        <Text style={styles.materiaTitle}>{nomeDaMateriaTela}</Text>

        {atividadeConcluida ? (
          <View style={styles.completedBadgeHeader}>
            <MaterialIcons name="check-circle" size={16} color={theme.primaryGreen} />
            <Text style={styles.timerText}>Respondida</Text>
          </View>
        ) : (
          <View style={styles.timerBadge}>
            <MaterialIcons name="schedule" size={16} color={theme.primaryGreen} />
            <Text style={styles.timerText}>{formatarTempo(segundosRestantes)}</Text>
          </View>
        )}
      </View>

      <View style={styles.dotsContainer}>
        {Array.from({ length: totalFasesBarra }).map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              totalFasesBarra > 8 ? { width: 10, height: 10, borderRadius: 5 } : {},
              { backgroundColor: idx < faseAtualBarra ? theme.primaryGreen : "transparent" },
            ]}
          />
        ))}
      </View>

      <View style={styles.contentWrapper}>
        {atividadeConcluida ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.mainCard}>
              <Text style={[styles.cardTitle, { textAlign: "center", fontSize: 22, marginBottom: 6 }]}>
                Atividade Concluída! 🎉
              </Text>
              <Text style={{ textAlign: "center", color: "#555", marginBottom: 16, fontSize: 15, fontWeight: "700" }}>
                Você acertou {totalAcertos} de {listaQuestoes.length} questões
              </Text>

              <Image
                source={{ uri: figuraPrincipal }}
                style={{ width: 72, height: 72, alignSelf: "center", marginBottom: 12 }}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.reviewSectionTitle}>Suas Respostas</Text>

            {listaQuestoes.map((q, idx) => {
              const numQ = idx + 1;
              const respSalva = respostasAluno[numQ];
              const acertou = respSalva?.acertou;
              const textoRespAluno = respSalva?.respostaAluno || "Não respondida";
              const textoRespCorreta = q.respostaCorreta;

              return (
                <View key={numQ} style={styles.reviewCard}>
                  <View style={styles.reviewHeaderRow}>
                    <Text style={styles.reviewQuestionNumber}>PERGUNTA {numQ}</Text>
                    <View
                      style={[
                        styles.reviewStatusBadge,
                        { backgroundColor: acertou ? "#E7F8EA" : "#FFEBEE" },
                      ]}
                    >
                      <MaterialIcons
                        name={acertou ? "check-circle" : "cancel"}
                        size={16}
                        color={acertou ? theme.primaryGreen : "#E53935"}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "800",
                          color: acertou ? theme.primaryGreen : "#E53935",
                          marginLeft: 4,
                        }}
                      >
                        {acertou ? "Acertou" : "Errou"}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.reviewQuestionText}>
                    {decorarTextoComFiguras(q.pergunta, tema.emojiInline)}
                  </Text>

                  <View
                    style={[
                      styles.reviewAnswerBox,
                      {
                        borderColor: acertou ? theme.primaryGreen : "#E53935",
                        backgroundColor: acertou ? "#F2FBF5" : "#FFF5F5",
                      },
                    ]}
                  >
                    <Text style={styles.reviewAnswerLabel}>Sua resposta:</Text>
                    <Text
                      style={[
                        styles.reviewAnswerValue,
                        { color: acertou ? theme.primaryGreen : "#E53935" },
                      ]}
                    >
                      {/^\d+$/.test(textoRespAluno) && ehQuestaoMatematica
                        ? `${textoRespAluno} ${tema.nomeItemContagem}`
                        : textoRespAluno}
                    </Text>
                  </View>

                  {!acertou && q.tipo !== "dissertativa" && (
                    <View style={styles.reviewCorrectBox}>
                      <Text style={styles.reviewAnswerLabel}>Resposta correta:</Text>
                      <Text style={[styles.reviewAnswerValue, { color: theme.primaryGreen }]}>
                        {/^\d+$/.test(textoRespCorreta) && ehQuestaoMatematica
                          ? `${textoRespCorreta} ${tema.nomeItemContagem}`
                          : textoRespCorreta}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}

            <TouchableOpacity style={styles.mainActionButton} onPress={() => navigation.goBack()}>
              <Text style={styles.mainActionButtonText}>Voltar para Atividades</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : etapaAtual?.tipoEtapa === "explicacao" ? (
          <View style={styles.mainCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.phaseLabel}>EXPLICAÇÃO DA AULA</Text>
              <Text style={styles.cardTitle}>{planoAdaptado?.tituloAdaptado || planoTitulo || "Vamos Aprender!"}</Text>

              <View style={styles.visualBanner}>
                <Image source={{ uri: figuraPrincipal }} style={styles.bannerIcon} resizeMode="contain" />
                <View style={styles.timelineContainer}>
                  <View style={styles.timelineLine} />
                  <MaterialIcons name="arrow-forward" size={24} color={theme.primaryGreen} style={{ marginLeft: -8 }} />
                </View>
                <Image source={{ uri: tema.itemFallback }} style={styles.bannerIcon} resizeMode="contain" />
              </View>

              {topicosExplicacao.map((t: any, i: number) => (
                <View key={i} style={{ marginBottom: 16 }}>
                  <Text style={styles.topicTitle}>{t.subtitulo}</Text>
                  <Text style={styles.topicBody}>{decorarTextoComFiguras(t.textoAdaptado, tema.emojiInline)}</Text>
                </View>
              ))}

              <TouchableOpacity
                style={styles.mainActionButton}
                onPress={() => (topicosExemplo.length > 0 ? setEtapaIndex(1) : iniciarCronometroEIrParaQuestoes())}
              >
                <Text style={styles.mainActionButtonText}>Continuar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        ) : etapaAtual?.tipoEtapa === "exemplo" ? (
          <View style={styles.mainCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.phaseLabel}>EXEMPLO PRÁTICO</Text>
              <Text style={styles.cardTitle}>Veja como é fácil</Text>

              {topicosExemplo.map((e: any, i: number) => (
                <View key={i} style={{ marginBottom: 16 }}>
                  <Text style={styles.topicTitle}>{e.titulo || "Passo a Passo"}</Text>
                  <Text style={styles.topicBody}>{decorarTextoComFiguras(e.passoAPasso, tema.emojiInline)}</Text>
                </View>
              ))}

              <TouchableOpacity style={styles.mainActionButton} onPress={iniciarCronometroEIrParaQuestoes}>
                <Text style={styles.mainActionButtonText}>Ir para Atividade</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.mainCard}>
              <Text style={styles.phaseLabel}>
                PERGUNTA {etapaAtual.numeroQuestao} DE {etapaAtual.totalQuestoes}
              </Text>

              <Text style={styles.questionText}>
                {decorarTextoComFiguras(questaoAtual?.pergunta || "", tema.emojiInline)}
              </Text>

              {ehQuestaoMatematica ? (
                <View style={styles.visualBanner}>
                  <View style={styles.mathGroup}>
                    <Text style={styles.mathNumberText}>{numerosConta[0]}</Text>
                    <Image source={{ uri: figuraPrincipal }} style={styles.mathFigure} resizeMode="contain" />
                  </View>

                  <Text style={styles.mathOperatorText}>{operadorMatematico}</Text>

                  <View style={styles.mathGroup}>
                    <Text style={styles.mathNumberText}>{numerosConta[1]}</Text>
                    <Image source={{ uri: figuraPrincipal }} style={styles.mathFigure} resizeMode="contain" />
                  </View>
                </View>
              ) : (
                <View style={styles.visualBanner}>
                  <Image source={{ uri: figuraPrincipal }} style={styles.bannerIcon} resizeMode="contain" />

                  <View style={styles.timelineContainer}>
                    <View style={styles.timelineLine}>
                      <View style={styles.timelineTick} />
                      <View style={styles.timelineTick} />
                      <View style={styles.timelineTick} />
                    </View>
                    <MaterialIcons
                      name="play-arrow"
                      size={26}
                      color={theme.primaryGreen}
                      style={{ marginLeft: -10 }}
                    />
                  </View>

                  <Image source={{ uri: figuraSecundaria }} style={styles.bannerIcon} resizeMode="contain" />
                </View>
              )}
            </View>

            <View style={styles.optionsContainer}>
              {ehDissertativa ? (
                <View style={styles.dissertativeWrapper}>
                  <Text style={styles.dissertativaLabel}>SUA RESPOSTA:</Text>
                  <TextInput
                    style={styles.dissertativaInput}
                    multiline
                    editable={!feedbackExibido}
                    placeholder="Digite sua resposta com calma aqui..."
                    placeholderTextColor="#888"
                    value={respostaDissertativa}
                    onChangeText={setRespostaDissertativa}
                  />
                </View>
              ) : (
                questaoAtual?.alternativas.map((alt, idx) => {
                  const isSelected = opcaoSelecionada === alt;
                  const respLimpa = (questaoAtual?.respostaCorreta || "").trim().toLowerCase();
                  const altLimpa = alt.trim().toLowerCase();
                  const ehCorreta = altLimpa === respLimpa || altLimpa.startsWith(`${respLimpa} `);

                  let boxStyle: any = styles.radioBox;
                  let dotStyle: any = styles.radioDotEmpty;

                  if (isSelected && !feedbackExibido) {
                    boxStyle = [styles.radioBox, styles.radioBoxSelected];
                    dotStyle = styles.radioDotFilled;
                  } else if (feedbackExibido) {
                    if (ehCorreta) {
                      boxStyle = [styles.radioBox, { borderColor: theme.primaryGreen, backgroundColor: "#E7F8EA" }];
                      dotStyle = styles.radioDotFilled;
                    } else if (isSelected && !ehCorreta) {
                      boxStyle = [styles.radioBox, { borderColor: "#E53935", backgroundColor: "#FFEBEE" }];
                      dotStyle = [styles.radioDotEmpty, { borderColor: "#E53935" }];
                    }
                  }

                  const textoExibicao = /^\d+$/.test(alt.trim())
                    ? `${alt.trim()} ${tema.nomeItemContagem}`
                    : alt;

                  return (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.8}
                      disabled={feedbackExibido}
                      onPress={() => setOpcaoSelecionada(alt)}
                      style={boxStyle}
                    >
                      <View style={dotStyle} />
                      <Text style={styles.radioText}>{textoExibicao}</Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>

            {feedbackExibido && (
              <View style={[styles.mainCard, { marginTop: 4, padding: 16 }]}>
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: acertouQuestao ? theme.primaryGreen : "#E53935",
                      marginBottom: 0,
                      fontSize: 17,
                      textAlign: "center",
                    },
                  ]}
                >
                  {ehDissertativa
                    ? "Muito bem! Resposta registrada! 🌟"
                    : acertouQuestao
                      ? "Mandou bem! Resposta correta! 🎉"
                      : `Quase lá! A resposta certa era: ${questaoAtual?.respostaCorreta}`}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.mainActionButton,
                ((!opcaoSelecionada && !ehDissertativa) || (ehDissertativa && respostaDissertativa.trim().length < 2)) &&
                  !feedbackExibido
                  ? { opacity: 0.55 }
                  : {},
              ]}
              activeOpacity={0.8}
              disabled={
                salvandoRespostas ||
                (((!opcaoSelecionada && !ehDissertativa) || (ehDissertativa && respostaDissertativa.trim().length < 2)) &&
                  !feedbackExibido)
              }
              onPress={feedbackExibido ? handleProximaQuestao : confirmarResposta}
            >
              {salvandoRespostas ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.mainActionButtonText}>
                  {feedbackExibido
                    ? etapaAtual.numeroQuestao === etapaAtual.totalQuestoes
                      ? "Finalizar Atividade"
                      : "Próxima Pergunta"
                    : "Enviar resposta"}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, width: "100%", height: "100%" },
  overlayLight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.38)",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 10,
    zIndex: 10,
  },
  backButtonCircular: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  materiaTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: theme.primaryGreen,
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
  },
  completedBadgeHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7F8EA",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
  },
  timerText: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.primaryGreen,
    marginLeft: 6,
  },

  dotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: theme.primaryGreen,
  },

  contentWrapper: {
    flex: 1,
    paddingHorizontal: 24,
  },

  mainCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 18,
  },
  phaseLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: theme.primaryGreen,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: theme.textColor,
    marginBottom: 14,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.textColor,
    lineHeight: 23,
    marginBottom: 18,
  },

  visualBanner: {
    backgroundColor: theme.lightGreen,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 20,
    paddingHorizontal: 12,
  },

  mathGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 1,
  },
  mathNumberText: {
    fontSize: 30,
    fontWeight: "900",
    color: theme.primaryGreen,
    marginRight: 6,
  },
  mathFigure: {
    width: 48,
    height: 48,
  },
  mathOperatorText: {
    fontSize: 32,
    fontWeight: "900",
    color: theme.primaryGreen,
    marginHorizontal: 6,
  },

  bannerIcon: {
    width: 68,
    height: 68,
  },
  timelineContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 10,
  },
  timelineLine: {
    height: 3,
    backgroundColor: theme.primaryGreen,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  timelineTick: {
    width: 3,
    height: 12,
    backgroundColor: theme.primaryGreen,
  },

  optionsContainer: {
    gap: 12,
    marginBottom: 18,
  },
  radioBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  radioBoxSelected: {
    borderColor: theme.primaryGreen,
  },
  radioDotEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.radioBorder,
    marginRight: 14,
  },
  radioDotFilled: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 7,
    borderColor: theme.primaryGreen,
    marginRight: 14,
  },
  radioText: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.textColor,
    flex: 1,
  },

  dissertativeWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  dissertativaLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: theme.primaryGreen,
    marginBottom: 8,
  },
  dissertativaInput: {
    height: 110,
    textAlignVertical: "top",
    fontSize: 15,
    fontWeight: "600",
    color: theme.textColor,
    backgroundColor: "#F9FBFB",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D0E0DC",
  },

  mainActionButton: {
    backgroundColor: theme.primaryGreen,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    marginTop: 6,
  },
  mainActionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },

  topicTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: theme.primaryGreen,
    marginBottom: 6,
  },
  topicBody: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.textColor,
    lineHeight: 22,
  },

  blockTimerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.lightGreen,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 24,
  },
  blockTimerText: {
    fontSize: 24,
    fontWeight: "900",
    color: theme.primaryGreen,
    marginLeft: 10,
  },

  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.primaryGreen,
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  reviewHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reviewQuestionNumber: {
    fontSize: 12,
    fontWeight: "900",
    color: theme.primaryGreen,
  },
  reviewStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reviewQuestionText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.textColor,
    lineHeight: 21,
    marginBottom: 12,
  },
  reviewAnswerBox: {
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
  },
  reviewCorrectBox: {
    marginTop: 8,
    backgroundColor: "#E7F8EA",
    borderRadius: 10,
    padding: 12,
  },
  reviewAnswerLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#666",
    marginBottom: 2,
  },
  reviewAnswerValue: {
    fontSize: 15,
    fontWeight: "900",
  },
});