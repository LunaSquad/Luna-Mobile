import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
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
  const paletas: Record<string, { accent: string; lightAccent: string; fallbackBg: string }> = {
    dinossauros: { accent: "#2E7D32", lightAccent: "#E8F5E9", fallbackBg: "#A5D6A7" },
    espaço: { accent: "#283593", lightAccent: "#E8EAF6", fallbackBg: "#9FA8DA" },
    carros: { accent: "#C62828", lightAccent: "#FFEBEE", fallbackBg: "#EF9A9A" },
    princesas: { accent: "#AD1457", lightAccent: "#FCE4EC", fallbackBg: "#F48FB1" },
    minions: { accent: "#F57F17", lightAccent: "#FFFDE7", fallbackBg: "#FFF59D" },
    "video game": { accent: "#4527A0", lightAccent: "#EDE7F6", fallbackBg: "#B39DDB" },
    default: { accent: "#006d77", lightAccent: "#E0F2F1", fallbackBg: "#80CBC4" },
  };
  return paletas[tema] || paletas.default;
}

export default function AdaptedActivityScreen({ route, navigation }: Props) {
  const { userId, planoId, turmaId, materiaId, urlPlanoDeAula } = route.params;

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Preparando ambiente...");
  const [planoAdaptado, setPlanoAdaptado] = useState<any>(null);
  const [assetsVisuais, setAssetsVisuais] = useState<string[]>([]);
  const [hiperfocoAluno, setHiperfocoAluno] = useState("dinossauros");
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(0);

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);

        // 1. Busca os dados do Aluno
        setLoadingText("Conhecendo o aluno...");
        const respAluno = await fetch(`${API_BASE_URL}/students/aluno/${userId}`);
        const dataAluno = await respAluno.json();

        let hiperfoco = dataAluno.aluno?.hiperfoco?.nome || dataAluno.aluno?.hiperfoco || "dinossauros";
        setHiperfocoAluno(hiperfoco);
        
        let imagensSalvas = dataAluno.aluno?.assetsVisuais || [];

        // 🔥 O PULO DO GATO: Se o aluno NÃO tem imagens salvas no Cloudinary/MongoDB, força a geração AGORA!
        if (imagensSalvas.length === 0) {
          setLoadingText(`Criando universo de ${hiperfoco} com IA...`);
          console.log("Forçando geração de imagens no backend...");
          
          const respAssets = await fetch(`${API_BASE_URL}/ai/gerar-assets-visuais`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ alunoId: userId, hiperfoco: hiperfoco }),
          });
          
          const dataAssets = await respAssets.json();
          if (dataAssets.ok && dataAssets.assets) {
            imagensSalvas = dataAssets.assets;
          }
        }
        setAssetsVisuais(imagensSalvas);

        // 2. Adapta o Texto do Plano de Aula
        setLoadingText("Ajustando a aula...");
        const respIA = await fetch(`${API_BASE_URL}/ai/adaptar-plano`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planoId, turmaId, materiaId, hiperfoco, urlPlanoDeAula, alunoId: userId }),
        });

        const dataIA = await respIA.json();
        setPlanoAdaptado(dataIA.plano_adaptado);

      } catch (e) {
        console.log("Erro no carregamento:", e);
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
          .map((n) => `${n} ${hiperfocoAluno}`);
      }
    }
    return alts;
  }, [questaoAtual, respostaCorreta, hiperfocoAluno]);

  const handleEnviar = () => {
    setOpcaoSelecionada(null);
    setPaginaAtual(paginaAtual + 1);
  };

  const temaCores = obterCoresDoTema(hiperfocoAluno);

  // Agora, pegamos DIRETAMENTE as imagens oficiais salvas no Cloudinary!
  const bgImage = assetsVisuais[0];
  const mascotImage = assetsVisuais[1];
  const itemImage1 = assetsVisuais[2];
  const itemImage2 = assetsVisuais[3] || assetsVisuais[2];

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: temaCores.fallbackBg }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={[styles.loadingText, { color: "#FFFFFF" }]}>{loadingText}</Text>
      </View>
    );
  }

  const ScreenWrapper = ({ children }: { children: React.ReactNode }) => (
    <ImageBackground
      source={bgImage ? { uri: bgImage } : undefined}
      style={[styles.container, !bgImage && { backgroundColor: temaCores.fallbackBg }]}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={temaCores.accent} />
        </TouchableOpacity>
        
        <View style={styles.headerTitles}>
          <Text style={[styles.headerLuna, { color: temaCores.accent }]}>Luna • Matemática</Text>
          <Text style={[styles.headerHiperfoco, { color: temaCores.accent }]}>Trilha de {hiperfocoAluno}</Text>
        </View>
        
        <View style={styles.timerBadge}>
          <MaterialIcons name="schedule" size={14} color={temaCores.accent} />
          <Text style={[styles.timerText, { color: temaCores.accent }]}>05:30</Text>
        </View>
      </View>

      {children}
    </ImageBackground>
  );

  // TELA 1: EXPLICAÇÃO INICIAL
  if (paginaAtual === 0) {
    return (
      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {mascotImage ? (
            <Image source={{ uri: mascotImage }} style={styles.mascotImg} />
          ) : (
            <Text style={{ fontSize: 110, textAlign: "center", marginTop: 20 }}>🚀</Text>
          )}

          <View style={styles.whiteCard}>
            <Text style={[styles.cardTitle, { color: temaCores.accent }]}>
              {planoAdaptado?.tituloAdaptado || "Sua Aventura"}
            </Text>
            
            <Text style={styles.explanationBody}>
              {planoAdaptado?.explicacaoAdaptada}
            </Text>

            <View style={[styles.missionBox, { backgroundColor: temaCores.lightAccent }]}>
              <FontAwesome5 name="star" size={20} color={temaCores.accent} style={{ marginRight: 15 }} />
              <Text style={[styles.missionText, { color: temaCores.accent }]}>
                Missão: Complete os desafios para avançar de nível!
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: temaCores.accent }]} 
              onPress={() => setPaginaAtual(1)}
            >
              <Text style={styles.primaryButtonText}>Começar Expedição</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  // TELA 2: SUCESSO FINAL
  if (paginaAtual > totalAtividades) {
    return (
      <ScreenWrapper>
        <View style={[styles.scrollContent, { justifyContent: "center" }]}>
          <View style={styles.whiteCard}>
            <Text style={{ fontSize: 80, textAlign: "center", marginBottom: 20 }}>🏆</Text>
            <Text style={[styles.cardTitle, { color: temaCores.accent, textAlign: "center" }]}>Vitória!</Text>
            <Text style={[styles.explanationBody, { textAlign: "center" }]}>Você completou toda a missão com sucesso.</Text>
            
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: temaCores.accent }]} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.primaryButtonText}>Voltar ao Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  // TELA 3: ATIVIDADE (O Desafio)
  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.progressBarContainer}>
          {Array.from({ length: totalAtividades }).map((_, i) => (
            <View 
              key={i} 
              style={[styles.progressSegment, { backgroundColor: i < paginaAtual ? temaCores.accent : 'rgba(255,255,255,0.6)' }]} 
            />
          ))}
        </View>

        <View style={styles.whiteCard}>
          <Text style={[styles.perguntaIndicator, { color: temaCores.accent }]}>PERGUNTA {paginaAtual} DE {totalAtividades}</Text>
          <Text style={styles.questionText}>{atividadeAtual?.conteudoAdaptado}</Text>
          
          <View style={[styles.mathBox, { backgroundColor: temaCores.lightAccent }]}>
            <View style={styles.mathSide}>
              {Array.from({ length: numeros[0] || 2 }).map((_, i) => (
                itemImage1 ? <Image key={`l-${i}`} source={{ uri: itemImage1 }} style={styles.stickerImg} /> : <Text key={`le-${i}`} style={{fontSize:35}}>👾</Text>
              ))}
            </View>
            
            <Text style={[styles.plusSign, { color: temaCores.accent }]}>+</Text>
            
            <View style={styles.mathSide}>
              {Array.from({ length: numeros[1] || 1 }).map((_, i) => (
                itemImage2 ? <Image key={`r-${i}`} source={{ uri: itemImage2 }} style={styles.stickerImg} /> : <Text key={`re-${i}`} style={{fontSize:35}}>👾</Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {alternativas.map((alt: string, index: number) => {
            const isSelected = opcaoSelecionada === alt;
            return (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.optionButton, 
                  isSelected && { borderColor: temaCores.accent, backgroundColor: 'rgba(255,255,255,0.95)' }
                ]}
                onPress={() => setOpcaoSelecionada(alt)}
              >
                <View style={[
                  styles.radioCircle, 
                  isSelected && { backgroundColor: temaCores.accent, borderColor: temaCores.accent }
                ]}>
                  {isSelected && <MaterialIcons name="check" size={14} color="#FFF" />}
                </View>
                <Text style={[styles.optionText, isSelected && { color: temaCores.accent, fontWeight: "bold" }]}>
                  {alt}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <TouchableOpacity 
          style={[
            styles.primaryButton, 
            { backgroundColor: temaCores.accent, opacity: opcaoSelecionada ? 1 : 0.5, marginTop: 10 }
          ]} 
          onPress={handleEnviar}
          disabled={!opcaoSelecionada}
        >
          <Text style={styles.primaryButtonText}>Enviar resposta</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 14, fontSize: 16, fontWeight: "bold" },
  
  container: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 255, 255, 0.45)' },
  
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 15, paddingTop: 50, paddingBottom: 15, zIndex: 10 },
  backButton: { backgroundColor: "rgba(255,255,255,0.9)", padding: 8, borderRadius: 20, elevation: 2 },
  headerTitles: { alignItems: "center" },
  headerLuna: { fontSize: 15, fontWeight: "900" },
  headerHiperfoco: { fontSize: 12, fontWeight: "700", opacity: 0.9, marginTop: 2 },
  timerBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.9)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 15, elevation: 2 },
  timerText: { fontSize: 13, fontWeight: "bold", marginLeft: 4 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, flexGrow: 1 },

  mascotImg: { width: 170, height: 170, alignSelf: "center", zIndex: 10, marginTop: 10 },
  whiteCard: { backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: 24, padding: 25, elevation: 5, marginTop: -30, zIndex: 5 },
  cardTitle: { fontSize: 24, fontWeight: "900", marginBottom: 15 },
  explanationBody: { fontSize: 16, color: "#333", lineHeight: 25, fontWeight: "600", marginBottom: 20 },
  missionBox: { flexDirection: "row", alignItems: "center", padding: 15, borderRadius: 16, marginBottom: 25 },
  missionText: { flex: 1, fontSize: 13, fontWeight: "bold", lineHeight: 20 },
  
  progressBarContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, marginTop: 10 },
  progressSegment: { flex: 1, height: 6, borderRadius: 3, marginHorizontal: 2 },
  perguntaIndicator: { fontSize: 12, fontWeight: "900", letterSpacing: 1, marginBottom: 10 },
  questionText: { fontSize: 18, fontWeight: "bold", color: "#222", lineHeight: 26, marginBottom: 20 },
  
  mathBox: { flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 20, borderRadius: 16 },
  mathSide: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", maxWidth: "40%" },
  stickerImg: { width: 50, height: 50, margin: 3 },
  plusSign: { fontSize: 40, fontWeight: "bold", marginHorizontal: 15 },

  optionsContainer: { marginTop: 20 },
  optionButton: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.85)", padding: 18, borderRadius: 16, marginBottom: 10, borderWidth: 2, borderColor: "transparent" },
  radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#999", marginRight: 15, justifyContent: "center", alignItems: "center" },
  optionText: { fontSize: 15, fontWeight: "700", color: "#444" },
  
  primaryButton: { paddingVertical: 18, borderRadius: 16, elevation: 4, alignItems: "center" },
  primaryButtonText: { color: "#FFF", fontSize: 16, fontWeight: "900", textTransform: "uppercase" },
});