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
      setFeedback("Ótima resposta! Você acertou.");

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
      setFeedback("Boa tentativa! Revise sua resposta e tente novamente.");
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
          <Text style={styles.finalEmoji}>🦖</Text>
          <Text style={styles.finalTitle}>Nenhuma fase encontrada</Text>
          <Text style={styles.finalText}>
            Não encontramos perguntas para esta atividade.
          </Text>
        </View>
      </View>
    );
  }

  if (finalizado) {
    return (
      <View style={styles.container}>
        <View style={styles.finalCard}>
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
      <View style={styles.challengeCard}>
        <Text style={styles.dino}>🦖</Text>

        <Text style={styles.challengeText}>{fase.desafio}</Text>

        <Text style={styles.challengeDescription}>
          Escreva sua resposta com calma e explique do seu jeito.
        </Text>
      </View>

      <View style={styles.answerBox}>
        <TextInput
          style={styles.input}
          value={respostaUsuario}
          onChangeText={setRespostaUsuario}
          placeholder="Comece a escrever aqui..."
          placeholderTextColor="#C9DBD8"
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.pencil}>✍️</Text>
      </View>

      <View style={styles.spacer} />

      {feedback ? (
        <View
          style={[
            styles.feedbackBox,
            feedback.includes("acertou")
              ? styles.feedbackSuccess
              : styles.feedbackError,
          ]}
        >
          <View style={styles.feedbackIcon}>
            <Text style={styles.feedbackEmoji}>🦖</Text>
          </View>

          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : (
        <View style={styles.feedbackBox}>
          <View style={styles.feedbackIcon}>
            <Text style={styles.feedbackEmoji}>🦖</Text>
          </View>

          <Text style={styles.feedbackText}>
            Escreva uma resposta bem caprichada!
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={verificarResposta}>
        <Text style={styles.buttonText}>Enviar Resposta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 620,
    marginTop: 22,
    marginBottom: 24,
  },

  challengeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 4,
    borderColor: "#E8F0EE",
    paddingHorizontal: 24,
    paddingVertical: 26,
    marginBottom: 24,
  },

  dino: {
    fontSize: 38,
    marginBottom: 16,
  },

  challengeText: {
    fontSize: 23,
    lineHeight: 31,
    color: "#287572",
    fontWeight: "900",
    marginBottom: 14,
  },

  challengeDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: "#6EA2A0",
    fontWeight: "600",
  },

  answerBox: {
    height: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 4,
    borderColor: "#E8F0EE",
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 20,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#287572",
    fontWeight: "700",
    padding: 0,
  },

  pencil: {
    position: "absolute",
    right: 24,
    bottom: 18,
    fontSize: 26,
  },

  spacer: {
    flex: 1,
    minHeight: 120,
  },

  feedbackBox: {
    minHeight: 64,
    backgroundColor: "#F1F4EC",
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  feedbackSuccess: {
    backgroundColor: "#E6F8EC",
  },

  feedbackError: {
    backgroundColor: "#FDECEC",
  },

  feedbackIcon: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#287572",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  feedbackEmoji: {
    fontSize: 21,
  },

  feedbackText: {
    flex: 1,
    color: "#006d77",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "900",
  },

  button: {
    height: 66,
    borderRadius: 24,
    backgroundColor: "#006d77",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  finalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#E8F0EE",
  },

  finalEmoji: {
    fontSize: 56,
    marginBottom: 10,
  },

  finalTitle: {
    fontSize: 27,
    fontWeight: "900",
    color: "#006d77",
    marginBottom: 8,
    textAlign: "center",
  },

  finalText: {
    fontSize: 15,
    color: "#425466",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "700",
    lineHeight: 22,
  },

  finalScore: {
    fontSize: 16,
    fontWeight: "900",
    color: "#006d77",
    marginBottom: 18,
  },
});