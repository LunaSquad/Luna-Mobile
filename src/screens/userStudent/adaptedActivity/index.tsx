import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  Alert,
  BackHandler,
  TextInput,
  StyleSheet,
  Dimensions
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../services/ip";

const { width } = Dimensions.get("window");
const TEMPO_ATIVIDADE_SEGUNDOS = 5 * 60 + 30;
const TEMPO_BLOQUEIO_MS = 5 * 60 * 1000;

function obterCoresDoTema(hiperfoco: string) {
  const tema = (hiperfoco || "dinossauros").toLowerCase().trim();
  const paletas: Record<string, { primary: string; secondary: string; dark: string; light: string; cardBg: string }> = {
    dinossauros: { primary: "#4CAF50", secondary: "#FFC107", dark: "#2E7D32", light: "#E8F5E9", cardBg: "#FFF9E6" },
    dinossauro: { primary: "#4CAF50", secondary: "#FFC107", dark: "#2E7D32", light: "#E8F5E9", cardBg: "#FFF9E6" },
    espaço: { primary: "#3F51B5", secondary: "#E91E63", dark: "#1A237E", light: "#E8EAF6", cardBg: "#12122b" },
    carros: { primary: "#F44336", secondary: "#FFEB3B", dark: "#B71C1C", light: "#FFEBEE", cardBg: "#FFFDE7" },
    princesas: { primary: "#E91E63", secondary: "#9C27B0", dark: "#880E4F", light: "#FCE4EC", cardBg: "#FFF0F5" },
    futebol: { primary: "#1E88E5", secondary: "#43A047", dark: "#0D47A1", light: "#E3F2FD", cardBg: "#F1F8E9" },
    minecraft: { primary: "#7CB342", secondary: "#8D6E63", dark: "#33691E", light: "#F1F8E9", cardBg: "#EFEBE9" },
    "video game": { primary: "#00E5FF", secondary: "#FF1744", dark: "#006064", light: "#E0F7FA", cardBg: "#1a1a2e" },
    default: { primary: "#00ACC1", secondary: "#FFA000", dark: "#006064", light: "#E0F7FA", cardBg: "#F5F5F5" },
  };
  return paletas[tema] || paletas.default;
}

function obterAssetsFallback(hiperfoco: string): string[] {
  const tema = encodeURIComponent((hiperfoco || "dinossauros").trim().toLowerCase());
  return [
    `https://image.pollinations.ai/prompt/immersive%20beautiful%202D%20flat%20vector%20mobile%20game%20background%20landscape%20of%20${tema}%20child%20friendly%20empty%20center?width=720&height=1280&nologo=true&seed=777`,
    `https://image.pollinations.ai/prompt/2D%20flat%20vector%20cute%20baby%20${tema}%20mascot%20isolated%20on%20pure%20solid%20white%20background?width=512&height=512&nologo=true&seed=111`,
    `https://image.pollinations.ai/prompt/2D%20flat%20vector%20cute%20${tema}%20item%20isolated%20on%20pure%20solid%20white%20background?width=512&height=512&nologo=true&seed=222`,
    `https://image.pollinations.ai/prompt/2D%20flat%20vector%20cute%20${tema}%20icon%20isolated%20on%20pure%20solid%20white%20background?width=512&height=512&nologo=true&seed=333`,
  ];
}

function formatarTempo(totalSegundos: number) {
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
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
  const chavePaginaSalva = `@luna_pagina_${idUnicoAtividade}`;

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Construindo a fase...");
  const [planoAdaptado, setPlanoAdaptado] = useState<any>(null);
  const [assetsVisuais, setAssetsVisuais] = useState<string[]>([]);
  const [hiperfocoAluno, setHiperfocoAluno] = useState("dinossauros");

  const [etapaIndex, setEtapaIndex] = useState(0);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | null>(null);
  const [respostaDissertativa, setRespostaDissertativa] = useState<string>("");
  const [feedbackExibido, setFeedbackExibido] = useState(false);
  const [acertouQuestao, setAcertouQuestao] = useState<boolean | null>(null);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [acertosTotais, setAcertosTotais] = useState(0);

  const [segundosRestantes, setSegundosRestantes] = useState(TEMPO_ATIVIDADE_SEGUNDOS);
  const [segundosBloqueio, setSegundosBloqueio] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);

  const avisoUmMinutoExibido = useRef(false);
  const tempoEsgotadoAcionado = useRef(false);

  const topicosExplicacao = useMemo(() => {
    if (Array.isArray(planoAdaptado?.topicosExplicacao) && planoAdaptado.topicosExplicacao.length > 0) {
      return planoAdaptado.topicosExplicacao;
    }
    const textoBruto = String(planoAdaptado?.explicacaoTeorica || planoAdaptado?.explicacaoAdaptada || "").trim();
    const blocos = textoBruto.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
    if (blocos.length === 0) {
      return [{ subtitulo: "Explicação", textoAdaptado: "Vamos começar!", dicaVisual: "" }];
    }
    return blocos.map((bloco, idx) => ({ subtitulo: idx === 0 ? "Conceito" : `Parte ${idx + 1}`, textoAdaptado: bloco, dicaVisual: "" }));
  }, [planoAdaptado]);

  const topicosExemplo = useMemo(() => {
    if (Array.isArray(planoAdaptado?.topicosExemplo) && planoAdaptado.topicosExemplo.length > 0) {
      return planoAdaptado.topicosExemplo;
    }
    const exemploTexto = String(planoAdaptado?.exemploPratico || "").trim();
    if (exemploTexto) {
      return [{ titulo: "Veja como faz", passoAPasso: exemploTexto, conclusao: "Pronto para tentar?" }];
    }
    return [];
  }, [planoAdaptado]);

  const listaQuestoes = useMemo<PassoQuestao[]>(() => {
    if (Array.isArray(planoAdaptado?.questoesGerais) && planoAdaptado.questoesGerais.length > 0) {
      return planoAdaptado.questoesGerais.map((q: any, i: number) => ({
        tituloAtividade: q.tituloAtividade || `Desafio ${i + 1}`,
        comandoAtividade: q.comandoAtividade || "",
        tipo: q.tipo === "dissertativa" ? "dissertativa" : "objetiva",
        pergunta: String(q.pergunta || ""),
        dicaTDAH: String(q.dicaTDAH || "Olhe com calma!"),
        respostaCorreta: String(q.respostaCorreta || ""),
        alternativas: Array.isArray(q.alternativas) ? q.alternativas.map(String) : [],
      }));
    }
    const todas: PassoQuestao[] = [];
    const atividades = Array.isArray(planoAdaptado?.atividades) ? planoAdaptado.atividades : [];
    atividades.forEach((atv: any, idxAtv: number) => {
      const questoes = Array.isArray(atv?.questoes) ? atv.questoes : [];
      if (questoes.length > 0) {
        questoes.forEach((q: any) => {
          const alts = Array.isArray(q?.alternativas) ? q.alternativas.map(String) : [];
          const perguntaStr = String(q?.pergunta || atv?.conteudoAdaptado || "").trim();
          if (!perguntaStr) return;
          const temOperacao = /\d+\s*[\+\-\*\/x÷]/.test(perguntaStr);
          let altsFinais = [...alts];
          let respFinal = String(q?.respostaCorreta || "").trim();
          if (altsFinais.length === 0 && temOperacao) {
            const nums = perguntaStr.match(/\d+/g)?.map(Number) || [2, 1];
            const soma = nums.length >= 2 ? nums[0] + nums[1] : 3;
            const ans = parseInt(respFinal, 10) || soma;
            respFinal = String(ans);
            altsFinais = [String(Math.max(0, ans - 1)), String(ans), String(ans + 1), String(ans + 2)];
          }
          const tipoInferido = q?.tipo === "dissertativa" || (altsFinais.length === 0 && !temOperacao) ? "dissertativa" : "objetiva";
          todas.push({
            tituloAtividade: atv?.titulo || `Desafio ${idxAtv + 1}`,
            comandoAtividade: atv?.conteudoAdaptado || "",
            tipo: tipoInferido,
            pergunta: perguntaStr,
            dicaTDAH: String(q?.dicaTDAH || "Você consegue!"),
            respostaCorreta: respFinal,
            alternativas: altsFinais,
          });
        });
      }
    });
    if (todas.length === 0) {
      todas.push({
        tituloAtividade: "Desafio Final",
        comandoAtividade: "Resuma o que aprendeu:",
        tipo: "dissertativa",
        pergunta: "O que você mais gostou de aprender agora?",
        dicaTDAH: "Escreva algo curto e legal!",
        respostaCorreta: "Muito bom!",
        alternativas: [],
      });
    }
    return todas;
  }, [planoAdaptado]);

  const etapasFluxo = useMemo<EtapaFluxo[]>(() => {
    const etapas: EtapaFluxo[] = [{ tipoEtapa: "explicacao" }];
    if (topicosExemplo.length > 0) {
      etapas.push({ tipoEtapa: "exemplo" });
    }
    listaQuestoes.forEach((q, idx) => {
      etapas.push({ tipoEtapa: "questao", questao: q, numeroQuestao: idx + 1, totalQuestoes: listaQuestoes.length });
    });
    return etapas;
  }, [topicosExemplo, listaQuestoes]);

  const indicePrimeiraQuestao = etapasFluxo.findIndex((e) => e.tipoEtapa === "questao") >= 0 ? etapasFluxo.findIndex((e) => e.tipoEtapa === "questao") : etapasFluxo.length;
  const etapaAtual = etapasFluxo[etapaIndex];
  const atividadeEmAndamento = etapaIndex >= indicePrimeiraQuestao && etapaIndex < etapasFluxo.length;
  const atividadeConcluida = etapasFluxo.length > 0 && etapaIndex >= etapasFluxo.length;

  const ativarBloqueioCincoMinutos = useCallback(async () => {
    const expiraEm = Date.now() + TEMPO_BLOQUEIO_MS;
    await AsyncStorage.setItem(chaveBloqueio, String(expiraEm));
    await AsyncStorage.removeItem(chaveFimAtividade);
    await AsyncStorage.removeItem(chavePaginaSalva);
  }, [chaveBloqueio, chaveFimAtividade, chavePaginaSalva]);

  const limparSessaoAoConcluir = useCallback(async () => {
    await AsyncStorage.removeItem(chaveFimAtividade);
    await AsyncStorage.removeItem(chavePaginaSalva);
  }, [chaveFimAtividade, chavePaginaSalva]);

  const carregarDadosDaAula = useCallback(async (forcarRegeneracao = false) => {
    try {
      setLoading(true);
      if (!forcarRegeneracao) {
        const bloqueioSalvo = await AsyncStorage.getItem(chaveBloqueio);
        if (bloqueioSalvo) {
          const expiraEm = parseInt(bloqueioSalvo, 10);
          const agora = Date.now();
          if (agora < expiraEm) {
            setSegundosBloqueio(Math.max(1, Math.ceil((expiraEm - agora) / 1000)));
            setBloqueado(true);
            setLoading(false);
            return;
          } else {
            await AsyncStorage.removeItem(chaveBloqueio);
          }
        }
      }

      let hiperfoco = "dinossauros";
      let imagensSalvas: string[] = [];

      try {
        const respAluno = await fetch(`${API_BASE_URL}/students/aluno/${userId}`);
        const dataAluno = await respAluno.json();
        hiperfoco = dataAluno.aluno?.hiperfoco?.nome || dataAluno.aluno?.hiperfoco || "dinossauros";
        imagensSalvas = (dataAluno.aluno?.assetsVisuais || []).filter((u: any) => typeof u === "string" && u.startsWith("http"));
      } catch (err) { }
      setHiperfocoAluno(hiperfoco);

      if (imagensSalvas.length < 4 || forcarRegeneracao) {
        setLoadingText(`Criando cenários de ${hiperfoco}...`);
        try {
          const respAssets = await fetch(`${API_BASE_URL}/ai/gerar-assets-visuais`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ alunoId: userId, hiperfoco: hiperfoco, forcarRegeneracao: true }),
          });
          const dataAssets = await respAssets.json();
          if (Array.isArray(dataAssets.assets) && dataAssets.assets.length > 0) {
            imagensSalvas = dataAssets.assets.filter(Boolean);
          }
        } catch (err) { }
      }

      setLoadingText("Gerando as missões...");
      const respIA = await fetch(`${API_BASE_URL}/ai/adaptar-plano`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planoId, turmaId, materiaId, hiperfoco, urlPlanoDeAula, alunoId: userId, forcarRegeneracao: forcarRegeneracao }),
      });
      const dataIA = await respIA.json();
      setPlanoAdaptado(dataIA.plano_adaptado);

      if (imagensSalvas.length < 4) {
        const fallbackUrls = obterAssetsFallback(hiperfoco);
        imagensSalvas = [imagensSalvas[0] || fallbackUrls[0], imagensSalvas[1] || fallbackUrls[1], imagensSalvas[2] || fallbackUrls[2], imagensSalvas[3] || fallbackUrls[3]];
      }
      setAssetsVisuais(imagensSalvas);

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
  }, [userId, chaveBloqueio, planoId, turmaId, materiaId, urlPlanoDeAula, limparSessaoAoConcluir]);

  useEffect(() => {
    if (userId) carregarDadosDaAula(false);
    else setLoading(false);
  }, [userId, carregarDadosDaAula]);

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
      if (restante <= 0) clearInterval(int);
    }, 1000);
    return () => clearInterval(int);
  }, [loading, bloqueado, atividadeEmAndamento, chaveFimAtividade]);

  useEffect(() => {
    if (loading || bloqueado || !atividadeEmAndamento) return;
    if (segundosRestantes === 0 && !tempoEsgotadoAcionado.current) {
      tempoEsgotadoAcionado.current = true;
      const finalizar = async () => {
        await ativarBloqueioCincoMinutos();
        navigation.goBack();
      };
      finalizar();
    }
  }, [segundosRestantes, loading, bloqueado, atividadeEmAndamento, ativarBloqueioCincoMinutos, navigation]);

  const iniciarCronometroEIrParaQuestoes = async () => {
    const novoFim = Date.now() + TEMPO_ATIVIDADE_SEGUNDOS * 1000;
    await AsyncStorage.setItem(chaveFimAtividade, String(novoFim));
    setSegundosRestantes(TEMPO_ATIVIDADE_SEGUNDOS);
    await AsyncStorage.setItem(chavePaginaSalva, String(indicePrimeiraQuestao));
    setOpcaoSelecionada(null);
    setRespostaDissertativa("");
    setFeedbackExibido(false);
    setAcertouQuestao(null);
    setMostrarDica(false);
    setEtapaIndex(indicePrimeiraQuestao);
  };

  const handleVerificarResposta = () => {
    if (etapaAtual?.tipoEtapa !== "questao") return;
    const q = etapaAtual.questao;
    if (q.tipo === "dissertativa") {
      setAcertouQuestao(true);
      setAcertosTotais((p) => p + 1);
      setFeedbackExibido(true);
      return;
    }
    const sl = (opcaoSelecionada || "").trim().toLowerCase();
    const cl = (q.respostaCorreta || "").trim().toLowerCase();
    const acertou = sl === cl || sl.startsWith(`${cl})`) || cl.includes(sl);
    setAcertouQuestao(acertou);
    if (acertou) setAcertosTotais((p) => p + 1);
    setFeedbackExibido(true);
  };

  const handleProximaQuestao = async () => {
    const nx = etapaIndex + 1;
    setOpcaoSelecionada(null);
    setRespostaDissertativa("");
    setFeedbackExibido(false);
    setAcertouQuestao(null);
    setMostrarDica(false);
    setEtapaIndex(nx);
    if (nx < etapasFluxo.length) await AsyncStorage.setItem(chavePaginaSalva, String(nx));
    else await limparSessaoAoConcluir();
  };

  const temaCores = obterCoresDoTema(hiperfocoAluno);
  const isDark = hiperfocoAluno.toLowerCase() === "video game" || hiperfocoAluno.toLowerCase() === "espaço";
  const textColor = isDark ? "#FFFFFF" : "#1A1A1A";

  const fallback = useMemo(() => obterAssetsFallback(hiperfocoAluno), [hiperfocoAluno]);
  const bgImage = assetsVisuais[0] || fallback[0];
  const mascotImage = assetsVisuais[1] || fallback[1];
  const itemImage1 = assetsVisuais[2] || assetsVisuais[1] || fallback[2];
  const itemImage2 = assetsVisuais[3] || assetsVisuais[2] || fallback[3];

  const questaoAtual = etapaAtual?.tipoEtapa === "questao" ? etapaAtual.questao : null;
  const ehDissertativa = questaoAtual?.tipo === "dissertativa";
  const ehContaMatematica = useMemo(() => {
    if (!questaoAtual || ehDissertativa) return false;
    const p = questaoAtual.pergunta.toLowerCase();
    const temSinal = p.includes("+") || p.includes("soma") || p.includes("juntar");
    const nums = p.match(/\d+/g)?.map(Number) || [];
    return temSinal && nums.length >= 2 && nums[0] <= 9 && nums[1] <= 9;
  }, [questaoAtual, ehDissertativa]);
  const numerosConta = useMemo(() => {
    const nums = questaoAtual?.pergunta?.match(/\d+/g)?.map(Number) || [];
    return nums.length >= 2 ? [nums[0], nums[1]] : [2, 1];
  }, [questaoAtual]);

  const podeConfirmar = ehDissertativa ? respostaDissertativa.trim().length >= 2 : Boolean(opcaoSelecionada);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: temaCores.dark }]}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={{ color: "#FFF", marginTop: 10, fontWeight: "bold" }}>{loadingText}</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={{ uri: bgImage }} style={styles.container} resizeMode="cover">
      {/* HUD Superior */}
      <View style={styles.hudHeader}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={18} color="#FFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        <View style={styles.faseContainer}>
          <Text style={styles.faseText}>
            {etapaAtual?.tipoEtapa === "questao"
              ? `FASE ${etapaAtual.numeroQuestao} DE ${etapaAtual.totalQuestoes}`
              : "PREPARAÇÃO"}
          </Text>
          <View style={styles.faseBarBg}>
            <View style={[styles.faseBarFill, { backgroundColor: temaCores.primary, width: etapaAtual?.tipoEtapa === "questao" ? `${(etapaAtual.numeroQuestao / etapaAtual.totalQuestoes) * 100}%` : "10%" }]} />
          </View>
        </View>

        <View style={styles.moedasContainer}>
          <FontAwesome5 name="coins" size={14} color="#FFD700" />
          <Text style={styles.moedasText}>{acertosTotais * 10}</Text>
        </View>
      </View>

      {/* Mascote flutuante com balão */}
      <View style={styles.mascoteArea}>
        <Image source={{ uri: mascotImage }} style={styles.mascoteImg} resizeMode="contain" />
        <View style={styles.balaoFala}>
          <Text style={styles.balaoText}>
            {etapaAtual?.tipoEtapa === "explicacao" ? "Chegou a hora de aprender!" :
              etapaAtual?.tipoEtapa === "exemplo" ? "Veja como é fácil!" :
                feedbackExibido ? (acertouQuestao ? "Você é incrível!" : "Quase! Veja a dica.") :
                  questaoAtual?.dicaTDAH || "Consegue resolver essa?"}
          </Text>
        </View>
      </View>

      {/* Cartão Central Gamificado */}
      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={[styles.cardCentral, { backgroundColor: temaCores.cardBg }]}>

          {etapaAtual?.tipoEtapa === "explicacao" ? (
            <View>
              <Text style={[styles.tituloEtapa, { color: temaCores.dark }]}>{planoAdaptado?.tituloAdaptado || "Nova Missão!"}</Text>
              {topicosExplicacao.map((t: any, i: number) => (
                <View key={i} style={[styles.topicoBox, { backgroundColor: temaCores.light }]}>
                  <Text style={[styles.topicoTitulo, { color: temaCores.dark }]}>{t.subtitulo}</Text>
                  <Text style={[styles.topicoTexto, { color: textColor }]}>{t.textoAdaptado}</Text>
                </View>
              ))}
              <TouchableOpacity style={[styles.btnStart, { backgroundColor: temaCores.primary }]} onPress={() => topicosExemplo.length > 0 ? setEtapaIndex(1) : iniciarCronometroEIrParaQuestoes()}>
                <Text style={styles.btnStartText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          ) : etapaAtual?.tipoEtapa === "exemplo" ? (
            <View>
              <Text style={[styles.tituloEtapa, { color: temaCores.dark }]}>Como funciona?</Text>
              {topicosExemplo.map((e: any, i: number) => (
                <View key={i} style={[styles.topicoBox, { backgroundColor: temaCores.light }]}>
                  <Text style={[styles.topicoTitulo, { color: temaCores.dark }]}>{e.titulo || "Exemplo"}</Text>
                  <Text style={[styles.topicoTexto, { color: textColor }]}>{e.passoAPasso}</Text>
                </View>
              ))}
              <TouchableOpacity style={[styles.btnStart, { backgroundColor: temaCores.primary }]} onPress={iniciarCronometroEIrParaQuestoes}>
                <Text style={styles.btnStartText}>Iniciar Desafios</Text>
              </TouchableOpacity>
            </View>
          ) : atividadeConcluida ? (
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Text style={{ fontSize: 60 }}>🏆</Text>
              <Text style={[styles.tituloEtapa, { color: temaCores.dark }]}>Missão Concluída!</Text>
              <Text style={[styles.topicoTexto, { color: textColor, textAlign: "center", marginBottom: 20 }]}>
                Você arrasou! Acertou {acertosTotais} perguntas e ganhou {acertosTotais * 10} moedas!
              </Text>
              <TouchableOpacity style={[styles.btnStart, { backgroundColor: temaCores.primary, width: "100%" }]} onPress={() => navigation.goBack()}>
                <Text style={styles.btnStartText}>Finalizar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={[styles.perguntaTexto, { color: textColor }]}>{questaoAtual?.pergunta}</Text>

              {ehContaMatematica ? (
                <View style={[styles.gameMathBox, { backgroundColor: temaCores.dark }]}>
                  <View style={styles.mathGrupo}>
                    {Array.from({ length: numerosConta[0] }).map((_, i) => (
                      <View key={`m1-${i}`} style={styles.mathItemCircle}>
                        <Image source={{ uri: itemImage1 }} style={styles.mathItemImg} />
                      </View>
                    ))}
                  </View>
                  <Text style={styles.mathSinal}>+</Text>
                  <View style={styles.mathGrupo}>
                    {Array.from({ length: numerosConta[1] }).map((_, i) => (
                      <View key={`m2-${i}`} style={styles.mathItemCircle}>
                        <Image source={{ uri: itemImage2 }} style={styles.mathItemImg} />
                      </View>
                    ))}
                  </View>

                  <View style={styles.mathResultRow}>
                    <Text style={[styles.mathNumber, { color: "#FFF" }]}>{numerosConta[0]}</Text>
                    <Text style={[styles.mathSinal, { fontSize: 24, marginHorizontal: 8 }]}>+</Text>
                    <Text style={[styles.mathNumber, { color: "#FFF" }]}>{numerosConta[1]}</Text>
                    <Text style={[styles.mathSinal, { fontSize: 24, marginHorizontal: 8 }]}>=</Text>
                    <Text style={[styles.mathNumber, { color: temaCores.secondary }]}>?</Text>
                  </View>
                </View>
              ) : null}

              {ehDissertativa ? (
                <TextInput
                  style={[styles.inputDissertativo, { borderColor: temaCores.primary, color: textColor }]}
                  multiline
                  editable={!feedbackExibido}
                  placeholder="Sua resposta aqui..."
                  placeholderTextColor="#999"
                  value={respostaDissertativa}
                  onChangeText={setRespostaDissertativa}
                />
              ) : (
                <View style={styles.alternativasGrid}>
                  {questaoAtual?.alternativas.map((alt, i) => {
                    const coresAlt = ["#FF5252", "#00E5FF", "#7E57C2", "#FF9800"];
                    const corFundo = coresAlt[i % 4];
                    const isSelected = opcaoSelecionada === alt;
                    const ehCerta = feedbackExibido && alt.trim() === questaoAtual?.respostaCorreta?.trim();

                    let bgFinal = corFundo;
                    if (feedbackExibido) {
                      bgFinal = ehCerta ? "#4CAF50" : (isSelected ? "#9E9E9E" : corFundo);
                    }

                    return (
                      <TouchableOpacity
                        key={i}
                        disabled={feedbackExibido}
                        onPress={() => setOpcaoSelecionada(alt)}
                        style={[
                          styles.btnAlternativa,
                          { backgroundColor: bgFinal },
                          isSelected && !feedbackExibido && styles.btnAlternativaSelecionada
                        ]}
                      >
                        <Text style={styles.textoAlternativa}>{alt}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {feedbackExibido && !acertouQuestao && !ehDissertativa && (
                <Text style={{ color: "#D32F2F", fontWeight: "bold", textAlign: "center", marginVertical: 10 }}>
                  A correta era: {questaoAtual?.respostaCorreta}
                </Text>
              )}

              {!feedbackExibido ? (
                <TouchableOpacity
                  disabled={!podeConfirmar}
                  style={[styles.btnAcao, { backgroundColor: temaCores.primary, opacity: podeConfirmar ? 1 : 0.5 }]}
                  onPress={handleVerificarResposta}
                >
                  <Text style={styles.btnAcaoText}>Confirmar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.btnAcao, { backgroundColor: temaCores.secondary }]}
                  onPress={handleProximaQuestao}
                >
                  <Text style={[styles.btnAcaoText, { color: "#000" }]}>Próximo ➜</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, width: "100%", height: "100%" },

  hudHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  btnVoltar: {
    width: 38, height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center", alignItems: "center"
  },
  faseContainer: { flex: 1, marginHorizontal: 15 },
  faseText: { color: "#FFF", fontSize: 11, fontWeight: "900", letterSpacing: 1, marginBottom: 4 },
  faseBarBg: { height: 8, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 4, overflow: "hidden" },
  faseBarFill: { height: "100%", borderRadius: 4 },
  moedasContainer: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20
  },
  moedasText: { color: "#FFD700", fontWeight: "900", fontSize: 14, marginLeft: 6 },

  mascoteArea: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    marginTop: 15,
    zIndex: 10
  },
  mascoteImg: { width: 80, height: 80 },
  balaoFala: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    marginLeft: 10,
    marginTop: 10,
    elevation: 5,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5
  },
  balaoText: { fontSize: 14, fontWeight: "700", color: "#333" },

  scrollArea: { paddingHorizontal: 15, paddingBottom: 40, paddingTop: 10 },
  cardCentral: {
    borderRadius: 24,
    padding: 20,
    elevation: 8,
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }
  },

  tituloEtapa: { fontSize: 22, fontWeight: "900", marginBottom: 15 },
  topicoBox: { padding: 15, borderRadius: 16, marginBottom: 10 },
  topicoTitulo: { fontSize: 15, fontWeight: "900", marginBottom: 5 },
  topicoTexto: { fontSize: 15, lineHeight: 22, fontWeight: "500" },

  btnStart: { padding: 18, borderRadius: 16, alignItems: "center", marginTop: 10 },
  btnStartText: { color: "#FFF", fontSize: 16, fontWeight: "900", textTransform: "uppercase" },

  perguntaTexto: { fontSize: 17, fontWeight: "bold", textAlign: "center", marginBottom: 20 },

  gameMathBox: {
    borderRadius: 20, padding: 20, marginBottom: 20,
    alignItems: "center"
  },
  mathGrupo: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  mathItemCircle: {
    width: 50, height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12, borderWidth: 2, borderColor: "rgba(255,255,255,0.5)",
    justifyContent: "center", alignItems: "center"
  },
  mathItemImg: { width: 35, height: 35 },
  mathResultRow: { flexDirection: "row", alignItems: "center", marginTop: 15 },
  mathNumber: { fontSize: 32, fontWeight: "900" },
  mathSinal: { fontSize: 32, fontWeight: "900", color: "#FFF", marginVertical: 10 },

  inputDissertativo: {
    borderWidth: 2, borderRadius: 16, padding: 15, fontSize: 16,
    minHeight: 120, textAlignVertical: "top", backgroundColor: "rgba(255,255,255,0.5)",
    marginBottom: 20
  },

  alternativasGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  btnAlternativa: {
    width: "48%", paddingVertical: 25, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
    marginBottom: 15, elevation: 3
  },
  btnAlternativaSelecionada: { borderWidth: 4, borderColor: "#FFF" },
  textoAlternativa: { color: "#FFF", fontSize: 24, fontWeight: "900" },

  btnAcao: { padding: 18, borderRadius: 20, alignItems: "center" },
  btnAcaoText: { color: "#FFF", fontSize: 18, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1 }
});