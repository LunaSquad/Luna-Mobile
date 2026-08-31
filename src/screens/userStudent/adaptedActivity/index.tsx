import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import API_BASE_URL from "../../../services/ip";

type RootStackParamList = {
  AdaptedActivity: {
    planoId: string;
    planoTitulo: string;
    planoDescricao: string;
    userId: string;
    turmaId: string;
    materiaId: string;
    urlPlanoDeAula: string;
  };
};

type Props = {
  route: RouteProp<RootStackParamList, "AdaptedActivity">;
  navigation: any;
};

// 🎨 DICIONÁRIO DE CORES DINÂMICAS POR TEMA
function obterCoresDoTema(hiperfoco: string) {
  const tema = hiperfoco.toLowerCase().trim();
  
  const paletas: Record<string, { bg: string; accent: string; contrast: string }> = {
    dinossauros: { bg: "#4CAF50", accent: "#2E7D32", contrast: "#FFFFFF" }, // Tons de Selva/Verde
    espaço: { bg: "#1A237E", accent: "#3949AB", contrast: "#FFFFFF" },      // Tons de Galáxia/Azul Escuro
    carros: { bg: "#E53935", accent: "#B71C1C", contrast: "#FFFFFF" },      // Tons de Corrida/Vermelho
    princesas: { bg: "#F06292", accent: "#C2185B", contrast: "#FFFFFF" },   // Tons de Realeza/Rosa
    minions: { bg: "#F9D949", accent: "#F57F17", contrast: "#333333" },     // Tons de Minions/Amarelo
    futebol: { bg: "#388E3C", accent: "#1B5E20", contrast: "#FFFFFF" },     // Tons de Gramado
    default: { bg: "#006d77", accent: "#004d55", contrast: "#FFFFFF" },     // Cores Padrão LUNA
  };

  // Retorna a paleta correspondente ou a padrão se não encontrar
  return paletas[tema] || paletas.default;
}

export default function AdaptedActivityScreen({ route, navigation }: Props) {
  const { userId, planoId, turmaId, materiaId, urlPlanoDeAula } = route.params;

  const [loading, setLoading] = useState(true);
  const [planoAdaptado, setPlanoAdaptado] = useState<any>(null);
  const [assetsVisuais, setAssetsVisuais] = useState<string[]>([]);
  const [hiperfocoAluno, setHiperfocoAluno] = useState("dinossauros");
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(0);

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);

        const respAluno = await fetch(`${API_BASE_URL}/students/aluno/${userId}`);
        const dataAluno = await respAluno.json();

        let hiperfoco = dataAluno.aluno?.hiperfoco?.nome || dataAluno.aluno?.hiperfoco || "dinossauros";
        setHiperfocoAluno(hiperfoco);
        
        if (dataAluno.aluno?.assetsVisuais?.length > 0) {
          setAssetsVisuais(dataAluno.aluno.assetsVisuais);
        }

        const respIA = await fetch(`${API_BASE_URL}/ai/adaptar-plano`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planoId, turmaId, materiaId, hiperfoco, urlPlanoDeAula, alunoId: userId }),
        });

        const dataIA = await respIA.json();
        setPlanoAdaptado(dataIA.plano_adaptado);

      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [userId]);

  const totalAtividades = planoAdaptado?.atividades?.length || 0;
  const indexAtividade = Math.max(0, paginaAtual - 1);
  const atividadeAtual = planoAdaptado?.atividades?.[indexAtividade];
  const questaoAtual = atividadeAtual?.questoes?.[0];

  const numeros = questaoAtual?.pergunta.match(/\d+/g)?.map(Number) || [2, 1];
  const respostaCorreta = questaoAtual?.respostaCorreta || String(numeros.reduce((a: number, b: number) => a + b, 0));
  
  const alternativas = useMemo(() => {
    let alts = questaoAtual?.alternativas || [];
    if (alts.length === 0) {
      const ans = parseInt(respostaCorreta);
      if (!isNaN(ans)) {
        alts = [ans - 1, ans, ans + 1, ans + 2]
          .sort(() => Math.random() - 0.5)
          .map((n) => `${n} ${hiperfocoAluno}.`);
      }
    }
    return alts;
  }, [questaoAtual, respostaCorreta, hiperfocoAluno]);

  const handleEnviar = () => {
    setOpcaoSelecionada(null);
    setPaginaAtual(paginaAtual + 1);
  };

  const ImagemTema = () => {
    if (assetsVisuais.length > 0) {
      return <Image source={{ uri: assetsVisuais[0] }} style={styles.mathImage} resizeMode="contain" />;
    }
    return <Text style={{ fontSize: 35 }}>🦖</Text>;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#006d77" />
        <Text style={styles.loadingText}>Preparando ambiente...</Text>
      </View>
    );
  }

  // Define as cores baseadas no hiperfoco do aluno
  const temaCores = obterCoresDoTema(hiperfocoAluno);

  // TELA 1: EXPLICAÇÃO INICIAL
  if (paginaAtual === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={36} color="#006d77" />
          </TouchableOpacity>
          <Text style={styles.logo}>luna</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={[styles.explanationContainer, { backgroundColor: temaCores.bg }]}>
          <View style={styles.explanationCard}>
            <Text style={[styles.kicker, { backgroundColor: temaCores.bg, color: temaCores.contrast }]}>🧩 EXPLICAÇÃO</Text>
            <Text style={styles.explanationTitle}>{planoAdaptado?.tituloAdaptado}</Text>
            <View style={styles.line} />
            <Text style={styles.explanationBody}>{planoAdaptado?.explicacaoAdaptada}</Text>
            
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: temaCores.accent }]} 
              onPress={() => setPaginaAtual(1)}
            >
              <Text style={styles.submitButtonText}>Começar Atividade</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // TELA 2: SUCESSO FINAL
  if (paginaAtual > totalAtividades) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={36} color="#006d77" />
          </TouchableOpacity>
          <Text style={styles.logo}>luna</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={[styles.explanationContainer, { backgroundColor: temaCores.bg }]}>
          <View style={styles.explanationCard}>
            <Text style={{ fontSize: 60, textAlign: "center", marginBottom: 20 }}>🏆</Text>
            <Text style={styles.explanationTitle}>Parabéns!</Text>
            <View style={styles.line} />
            <Text style={[styles.explanationBody, { textAlign: "center" }]}>Você concluiu todas as fases desta atividade.</Text>
            
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: temaCores.accent }]} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.submitButtonText}>Finalizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // TELA 3: ATIVIDADE E CADERNO
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setPaginaAtual(paginaAtual - 1)}>
          <MaterialIcons name="chevron-left" size={36} color="#006d77" />
        </TouchableOpacity>
        <Text style={styles.logo}>luna</Text>
        <Text style={[styles.timer, { color: temaCores.accent }]}>
          {paginaAtual}/{totalAtividades}
        </Text>
      </View>

      <Text style={styles.materiaTitle}>{atividadeAtual?.titulo}</Text>

      <View style={styles.notebookCard}>
        <Text style={styles.notebookTitle}>{atividadeAtual?.conteudoAdaptado}</Text>
        
        <View style={styles.line} />
        <View style={styles.line} />
        
        <View style={styles.mathContainer}>
          <View style={styles.mathBox}>
            {Array.from({ length: numeros[0] || 2 }).map((_, i) => <ImagemTema key={`l-${i}`} />)}
          </View>
          
          <Text style={styles.plusSign}>+</Text>
          
          <View style={styles.mathBox}>
            {Array.from({ length: numeros[1] || 1 }).map((_, i) => <ImagemTema key={`r-${i}`} />)}
          </View>
        </View>

        <View style={styles.line} />
        <View style={styles.line} />
      </View>

      <View style={[styles.bottomSection, { backgroundColor: temaCores.bg }]}>
        {assetsVisuais[1] && <Image source={{ uri: assetsVisuais[1] }} style={styles.floatingImg1} />}
        {assetsVisuais[2] && <Image source={{ uri: assetsVisuais[2] }} style={styles.floatingImg2} />}

        <View style={styles.quizBox}>
          <Text style={[styles.quizQuestion, { color: temaCores.accent }]}>Qual é o resultado?</Text>
          
          {alternativas.map((alt: string, index: number) => {
            const isSelected = opcaoSelecionada === alt;
            return (
              <TouchableOpacity 
                key={index} 
                style={styles.optionRow}
                onPress={() => setOpcaoSelecionada(alt)}
              >
                <View style={[
                  styles.radioCircle, 
                  isSelected && { backgroundColor: temaCores.accent, borderColor: temaCores.accent }
                ]} />
                <Text style={styles.optionText}>{alt}</Text>
              </TouchableOpacity>
            )
          })}
          
          {assetsVisuais[3] && <Image source={{ uri: assetsVisuais[3] }} style={styles.quizMiniImg} />}
        </View>

        <TouchableOpacity 
          style={[
            styles.submitButton, 
            { backgroundColor: temaCores.accent, opacity: opcaoSelecionada ? 1 : 0.6 }
          ]} 
          onPress={handleEnviar}
          disabled={!opcaoSelecionada}
        >
          <Text style={styles.submitButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" },
  loadingText: { marginTop: 14, fontSize: 16, color: "#006d77", fontWeight: "bold" },
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 15, paddingTop: 40 },
  logo: { fontSize: 32, color: "#8ABFC0", fontWeight: "300" },
  timer: { fontSize: 18, fontWeight: "bold" },
  materiaTitle: { textAlign: "center", fontSize: 20, fontWeight: "900", color: "#06156f", marginTop: 5, marginBottom: 20, paddingHorizontal: 15 },
  
  explanationContainer: { flex: 1, padding: 20, justifyContent: "center" },
  explanationCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 25, elevation: 5 },
  kicker: { alignSelf: "flex-start", fontSize: 11, fontWeight: "900", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18, marginBottom: 15 },
  explanationTitle: { fontSize: 24, fontWeight: "bold", color: "#06156f", marginBottom: 10 },
  explanationBody: { fontSize: 16, color: "#49606A", lineHeight: 26, fontWeight: "600", marginBottom: 20 },

  notebookCard: { backgroundColor: "#FFFFFF", marginHorizontal: 20, borderRadius: 8, elevation: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, zIndex: 10 },
  notebookTitle: { textAlign: "center", fontSize: 16, fontWeight: "bold", color: "#333", padding: 20 },
  line: { height: 1, backgroundColor: "#E0E0E0", width: "100%", marginVertical: 15 },
  
  mathContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 10, flexWrap: "wrap" },
  mathBox: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", backgroundColor: "#FFFFFF", padding: 10, borderRadius: 8, elevation: 3, shadowOpacity: 0.1 },
  mathImage: { width: 45, height: 45, marginHorizontal: 2, marginBottom: 5 },
  plusSign: { fontSize: 32, fontWeight: "300", marginHorizontal: 15, color: "#333" },

  bottomSection: { flex: 1, marginTop: -60, paddingTop: 80, paddingHorizontal: 20, alignItems: "center" },
  quizBox: { backgroundColor: "#FFFFFF", width: "100%", borderRadius: 16, padding: 20, elevation: 5, zIndex: 10 },
  quizQuestion: { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
  optionRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: "#8ABFC0", marginRight: 10 },
  optionText: { fontSize: 15, fontWeight: "bold", color: "#333" },
  
  submitButton: { paddingVertical: 15, paddingHorizontal: 40, borderRadius: 8, marginTop: 20, elevation: 4, width: "100%", alignItems: "center" },
  submitButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  
  floatingImg1: { position: "absolute", left: 10, top: 40, width: 60, height: 60, transform: [{ rotate: "-15deg" }] },
  floatingImg2: { position: "absolute", left: 20, top: 120, width: 55, height: 55, transform: [{ rotate: "10deg" }] },
  quizMiniImg: { position: "absolute", right: 10, bottom: 10, width: 50, height: 50 },
});