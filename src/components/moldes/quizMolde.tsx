import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";

type Props = {
  pergunta: string;
  opcoes: string[];
  respostaCorreta: string;
  imagens?: string[];
  emojiTema?: string;
  titulo?: string;
  subtitulo?: string;
};

export default function QuizMolde({
  pergunta,
  opcoes,
  respostaCorreta,
  imagens = [],
  emojiTema = "🤔",
}: Props) {
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [respondeu, setRespondeu] = useState(false);

  const acertou = useMemo(() => {
    if (!respondeu || !selecionada) return false;
    return (
      selecionada.trim().toLowerCase() === respostaCorreta.trim().toLowerCase()
    );
  }, [respondeu, selecionada, respostaCorreta]);

  function verificarResposta() {
    if (!selecionada) return;
    setRespondeu(true);
  }

  function selecionarOpcao(opcao: string) {
    if (respondeu) return;
    setSelecionada(opcao);
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.questionCard}>
        <Text style={styles.temaEmoji}>{emojiTema}</Text>
        <Text style={styles.pergunta}>{pergunta}</Text>
      </View>

      {imagens.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imagesRow}
        >
          {imagens.map((img, index) => (
            <View key={index} style={styles.imageCard}>
              <Image source={{ uri: img }} style={styles.image} />
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.optionsArea}>
        {opcoes.map((opcao, index) => {
          const letras = ["A", "B", "C", "D", "E"];
          const estaSelecionada = selecionada === opcao;
          const mostrarCorreta =
            respondeu &&
            opcao.trim().toLowerCase() === respostaCorreta.trim().toLowerCase();
          const mostrarErrada = respondeu && estaSelecionada && !acertou;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.opcao,
                estaSelecionada && styles.opcaoSelecionada,
                mostrarCorreta && styles.opcaoCorreta,
                mostrarErrada && styles.opcaoErrada,
              ]}
              activeOpacity={0.85}
              onPress={() => selecionarOpcao(opcao)}
            >
              <View
                style={[
                  styles.letterCircle,
                  estaSelecionada && styles.letterCircleSelecionado,
                  mostrarCorreta && styles.letterCircleCorreto,
                  mostrarErrada && styles.letterCircleErrado,
                ]}
              >
                <Text
                  style={[
                    styles.letterText,
                    (estaSelecionada || mostrarCorreta || mostrarErrada) &&
                      styles.letterTextBranco,
                  ]}
                >
                  {letras[index]}
                </Text>
              </View>

              <Text
                style={[
                  styles.opcaoTexto,
                  (mostrarCorreta || mostrarErrada) && styles.opcaoTextoBranco,
                ]}
              >
                {opcao}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {respondeu && (
        <View
          style={[
            styles.feedbackBox,
            acertou ? styles.feedbackSucesso : styles.feedbackErro,
          ]}
        >
          <Text style={styles.feedbackEmoji}>{acertou ? "🏆" : "💡"}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.feedbackTitulo}>
              {acertou ? "Muito bem!" : "Quase lá!"}
            </Text>
            <Text style={styles.feedbackTexto}>
              {acertou
                ? "Você acertou a resposta."
                : `A resposta correta era: ${respostaCorreta}`}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.spacer} />

      <TouchableOpacity
        style={[
          styles.botao,
          !selecionada && styles.botaoDesabilitado,
          respondeu && (acertou ? styles.botaoCorreto : styles.botaoErrado),
        ]}
        activeOpacity={0.9}
        onPress={verificarResposta}
        disabled={!selecionada || respondeu}
      >
        <Text style={styles.botaoTexto}>
          {!respondeu
            ? "Confirmar Resposta"
            : acertou
            ? "Você Acertou!"
            : "Resposta enviada"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingBottom: 20,
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 4,
    borderColor: "#E8F0EE",
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
  },
  temaEmoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  pergunta: {
    fontSize: 22,
    lineHeight: 30,
    textAlign: "center",
    color: "#17264A",
    fontWeight: "900",
  },
  imagesRow: {
    gap: 12,
    paddingBottom: 20,
  },
  imageCard: {
    width: 105,
    height: 105,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#E8F0EE",
    marginRight: 10,
  },
  image: {
    width: 82,
    height: 82,
    resizeMode: "contain",
  },
  optionsArea: {
    gap: 12,
  },
  opcao: {
    minHeight: 74,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#E8F0EE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  opcaoSelecionada: {
    borderColor: "#006d77",
    backgroundColor: "#F2FAF8",
  },
  opcaoCorreta: {
    backgroundColor: "#1E8E5A",
    borderColor: "#1E8E5A",
  },
  opcaoErrada: {
    backgroundColor: "#C0392B",
    borderColor: "#C0392B",
  },
  letterCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F0EE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  letterCircleSelecionado: {
    backgroundColor: "#006d77",
  },
  letterCircleCorreto: {
    backgroundColor: "#146c43",
  },
  letterCircleErrado: {
    backgroundColor: "#9b2c22",
  },
  letterText: {
    color: "#49606A",
    fontSize: 16,
    fontWeight: "900",
  },
  letterTextBranco: {
    color: "#FFFFFF",
  },
  opcaoTexto: {
    flex: 1,
    fontSize: 17,
    color: "#49606A",
    fontWeight: "800",
  },
  opcaoTextoBranco: {
    color: "#FFFFFF",
  },
  feedbackBox: {
    marginTop: 20,
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  feedbackSucesso: {
    backgroundColor: "#E6F8EC",
    borderWidth: 2,
    borderColor: "#1E8E5A",
  },
  feedbackErro: {
    backgroundColor: "#FDECEC",
    borderWidth: 2,
    borderColor: "#C0392B",
  },
  feedbackEmoji: {
    fontSize: 32,
    marginRight: 14,
  },
  feedbackTitulo: {
    fontSize: 18,
    fontWeight: "900",
    color: "#17264A",
  },
  feedbackTexto: {
    fontSize: 14,
    color: "#425466",
    marginTop: 4,
    fontWeight: "700",
  },
  spacer: {
    flex: 1,
    minHeight: 20,
  },
  botao: {
    height: 62,
    borderRadius: 22,
    backgroundColor: "#006d77",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  botaoDesabilitado: {
    backgroundColor: "#A5C5C3",
    elevation: 0,
  },
  botaoCorreto: {
    backgroundColor: "#1E8E5A",
  },
  botaoErrado: {
    backgroundColor: "#C0392B",
  },
  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
});