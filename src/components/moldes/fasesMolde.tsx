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
  emojiTema?: string;
  titulo?: string;
  subtitulo?: string;
};

export default function FasesMolde({
  fases,
  emojiTema = "🚀",
}: Props) {
  const [faseAtual, setFaseAtual] = useState(0);
  const [respostaUsuario, setRespostaUsuario] = useState("");
  const [feedback, setFeedback] = useState("");
  const [finalizado, setFinalizado] = useState(false);
  const [acertos, setAcertos] = useState(0);

  const fase = fases[faseAtual];

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
      setFeedback("Incrível! Você conseguiu.");

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
      }, 1200);
    } else {
      setFeedback("Hum... Tente olhar de outro jeito!");
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
        <View style={styles.finalCard}>
          <Text style={styles.finalEmoji}>🧐</Text>
          <Text style={styles.finalTitle}>Nenhuma fase encontrada</Text>
        </View>
      </View>
    );
  }

  if (finalizado) {
    return (
      <View style={styles.container}>
        <View style={styles.finalCard}>
          <Text style={styles.finalEmoji}>🏆</Text>
          <Text style={styles.finalTitle}>Missão Cumprida!</Text>
          <Text style={styles.finalText}>
            Você passou por todas as fases como um verdadeiro campeão.
          </Text>
          <Text style={styles.finalScore}>
            Acertos: {acertos} de {fases.length}
          </Text>
          <TouchableOpacity style={styles.button} onPress={reiniciarJogo}>
            <Text style={styles.buttonText}>Jogar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.challengeCard}>
        <View style={styles.faseBadge}>
          <Text style={styles.faseBadgeText}>FASE {faseAtual + 1}</Text>
        </View>
        <Text style={styles.temaEmoji}>{emojiTema}</Text>
        <Text style={styles.challengeText}>{fase.desafio}</Text>
        <Text style={styles.challengeDescription}>
          Escreva sua resposta abaixo.
        </Text>
      </View>

      <View style={styles.answerBox}>
        <TextInput
          style={styles.input}
          value={respostaUsuario}
          onChangeText={setRespostaUsuario}
          placeholder="Sua resposta aqui..."
          placeholderTextColor="#A5C5C3"
          multiline
          textAlignVertical="top"
        />
        <Text style={styles.pencilIcon}>✍️</Text>
      </View>

      {feedback ? (
        <View
          style={[
            styles.feedbackBox,
            feedback.includes("Incrível")
              ? styles.feedbackSuccess
              : styles.feedbackError,
          ]}
        >
          <Text style={styles.feedbackEmoji}>
            {feedback.includes("Incrível") ? "✨" : "🤔"}
          </Text>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : (
        <View style={styles.spacer} />
      )}

      <TouchableOpacity 
        style={[styles.button, !respostaUsuario.trim() && styles.buttonDisabled]} 
        onPress={verificarResposta}
        disabled={!respostaUsuario.trim()}
      >
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  challengeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 4,
    borderColor: "#E8F0EE",
    paddingHorizontal: 24,
    paddingVertical: 30,
    marginBottom: 20,
    alignItems: "center",
    elevation: 2,
  },
  faseBadge: {
    position: "absolute",
    top: -16,
    backgroundColor: "#006d77",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  faseBadgeText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1,
  },
  temaEmoji: {
    fontSize: 52,
    marginBottom: 16,
  },
  challengeText: {
    fontSize: 24,
    lineHeight: 32,
    color: "#17264A",
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
  },
  challengeDescription: {
    fontSize: 15,
    color: "#6EA2A0",
    fontWeight: "700",
    textAlign: "center",
  },
  answerBox: {
    height: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "#006d77",
    padding: 20,
    marginBottom: 20,
    shadowColor: "#006d77",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#006d77",
    fontWeight: "800",
    padding: 0,
  },
  pencilIcon: {
    position: "absolute",
    right: 20,
    bottom: 20,
    fontSize: 28,
    opacity: 0.8,
  },
  spacer: {
    height: 64,
    marginBottom: 18,
  },
  feedbackBox: {
    minHeight: 64,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 2,
  },
  feedbackSuccess: {
    backgroundColor: "#E6F8EC",
    borderColor: "#1E8E5A",
  },
  feedbackError: {
    backgroundColor: "#FDECEC",
    borderColor: "#C0392B",
  },
  feedbackEmoji: {
    fontSize: 26,
    marginRight: 12,
  },
  feedbackText: {
    flex: 1,
    color: "#17264A",
    fontSize: 15,
    fontWeight: "900",
  },
  button: {
    height: 62,
    borderRadius: 22,
    backgroundColor: "#006d77",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#A5C5C3",
    elevation: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  finalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 30,
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#E8F0EE",
    marginTop: 40,
  },
  finalEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  finalTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#006d77",
    marginBottom: 12,
    textAlign: "center",
  },
  finalText: {
    fontSize: 16,
    color: "#49606A",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "700",
    lineHeight: 24,
  },
  finalScore: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFB83D",
    marginBottom: 24,
  },
});