import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

type Fase = {
  fase: number;
  desafio: string;
  resposta: string;
};

type Props = {
  fases: Fase[];
  titulo?: string;
  subtitulo?: string;
};

export default function FasesMolde({
  fases,
  titulo = "luna",
  subtitulo = "Missão interativa",
}: Props) {
  const [faseAtual, setFaseAtual] = useState(0);
  const [respostaUsuario, setRespostaUsuario] = useState("");
  const [feedback, setFeedback] = useState("");
  const [finalizado, setFinalizado] = useState(false);
  const [acertos, setAcertos] = useState(0);

  const fase = fases[faseAtual];

  const progresso = useMemo(() => {
    if (!fases.length) return 0;
    return Math.round(((faseAtual + 1) / fases.length) * 100);
  }, [faseAtual, fases.length]);

  function normalizarTexto(texto: string) {
    return texto.trim().toLowerCase();
  }

  function verificarResposta() {
    if (!fase || !respostaUsuario.trim()) return;

    const acertou =
      normalizarTexto(respostaUsuario) === normalizarTexto(fase.resposta);

    if (acertou) {
      const novosAcertos = acertos + 1;
      setAcertos(novosAcertos);
      setFeedback("✅ Muito bem! Você acertou.");

      setTimeout(() => {
        const proximaFase = faseAtual + 1;

        if (proximaFase < fases.length) {
          setFaseAtual(proximaFase);
          setRespostaUsuario("");
          setFeedback("");
        } else {
          setFinalizado(true);
          setFeedback("");
        }
      }, 900);
    } else {
      setFeedback(`❌ Ops! Tente novamente.`);
    }
  }

  function reiniciarJogo() {
    setFaseAtual(0);
    setRespostaUsuario("");
    setFeedback("");
    setFinalizado(false);
    setAcertos(0);
  }

  if (!fases.length) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.logo}>{titulo}</Text>
          <Text style={styles.subtitulo}>{subtitulo}</Text>
          <Text style={styles.emptyText}>
            Nenhuma fase foi encontrada para este molde.
          </Text>
        </View>
      </View>
    );
  }

  if (finalizado) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>{titulo}</Text>
          <Text style={styles.subtitulo}>{subtitulo}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.finalEmoji}>🏆</Text>
          <Text style={styles.finalTitle}>Parabéns!</Text>
          <Text style={styles.finalText}>
            Você concluiu todas as fases da atividade.
          </Text>
          <Text style={styles.finalScore}>
            Acertos: {acertos} de {fases.length}
          </Text>

          <TouchableOpacity style={styles.button} onPress={reiniciarJogo}>
            <Text style={styles.buttonText}>Jogar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>{titulo}</Text>
        <Text style={styles.subtitulo}>{subtitulo}</Text>
      </View>

      <View style={styles.progressBox}>
        <Text style={styles.progressText}>
          Fase {fase.fase} de {fases.length}
        </Text>
        <Text style={styles.progressPercent}>{progresso}%</Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progresso}%` }]} />
      </View>

      <View style={styles.challengeCard}>
        <Text style={styles.challengeTitle}>Desafio da vez</Text>
        <Text style={styles.challengeText}>{fase.desafio}</Text>
      </View>

      <View style={styles.answerArea}>
        <Text style={styles.inputLabel}>Digite sua resposta:</Text>

        <TextInput
          style={styles.input}
          value={respostaUsuario}
          onChangeText={setRespostaUsuario}
          placeholder="Escreva aqui"
          placeholderTextColor="#7A869A"
        />

        <TouchableOpacity style={styles.button} onPress={verificarResposta}>
          <Text style={styles.buttonText}>Responder</Text>
        </TouchableOpacity>

        {feedback ? (
          <View
            style={[
              styles.feedbackBox,
              feedback.includes("✅")
                ? styles.feedbackSuccess
                : styles.feedbackError,
            ]}
          >
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 12,
  },

  logo: {
    fontSize: 28,
    fontWeight: "300",
    color: "#69AAB0",
    letterSpacing: 1,
  },

  subtitulo: {
    marginTop: 4,
    fontSize: 13,
    color: "#355C63",
    fontWeight: "600",
  },

  progressBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  progressText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C2B38",
  },

  progressPercent: {
    fontSize: 14,
    fontWeight: "800",
    color: "#005A63",
  },

  progressBarBackground: {
    height: 10,
    backgroundColor: "#D9E7EA",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 16,
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#005A63",
    borderRadius: 999,
  },

  challengeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 12,
  },

  challengeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#005A63",
    marginBottom: 10,
    textAlign: "center",
  },

  challengeText: {
    fontSize: 22,
    lineHeight: 30,
    textAlign: "center",
    color: "#172B4D",
    fontWeight: "800",
  },

  answerArea: {
    backgroundColor: "#F4D52C",
    borderRadius: 20,
    padding: 16,
  },

  inputLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C2B38",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#25313C",
    fontWeight: "600",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },

  button: {
    backgroundColor: "#005A63",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  feedbackBox: {
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
  },

  feedbackSuccess: {
    backgroundColor: "#E6F8EC",
  },

  feedbackError: {
    backgroundColor: "#FDECEC",
  },

  feedbackText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#17212B",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  emptyText: {
    marginTop: 16,
    fontSize: 15,
    color: "#425466",
    textAlign: "center",
  },

  finalEmoji: {
    fontSize: 42,
    marginBottom: 10,
  },

  finalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#172B4D",
    marginBottom: 8,
  },

  finalText: {
    fontSize: 15,
    color: "#425466",
    textAlign: "center",
    marginBottom: 8,
  },

  finalScore: {
    fontSize: 16,
    fontWeight: "800",
    color: "#005A63",
    marginBottom: 16,
  },
});