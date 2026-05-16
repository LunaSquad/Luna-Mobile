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
  titulo?: string;
  subtitulo?: string;
};

export default function QuizMolde({
  pergunta,
  opcoes,
  respostaCorreta,
  imagens = [],
  titulo = "luna",
  subtitulo = "Atividade interativa",
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
      <View style={styles.questionArea}>
        <Text style={styles.dinoEmoji}>🦕</Text>
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
              <View style={styles.letterCircle}>
                <Text style={styles.letterText}>{letras[index]}</Text>
              </View>

              <Text style={styles.opcaoTexto}>{opcao}</Text>
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

      <View style={styles.bottomBar}>
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
              ? "Acertou!"
              : "Resposta enviada"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 650,
    marginTop: 10,
  },

  questionArea: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 34,
  },

  dinoEmoji: {
    fontSize: 52,
    marginBottom: 12,
  },

  pergunta: {
    fontSize: 23,
    lineHeight: 31,
    textAlign: "center",
    color: "#287572",
    fontWeight: "900",
  },

  imagesRow: {
    gap: 12,
    paddingVertical: 10,
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
    gap: 14,
  },

  opcao: {
    height: 78,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 4,
    borderColor: "#E8F0EE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
  },

  opcaoSelecionada: {
    borderColor: "#287572",
    backgroundColor: "#F2FAF8",
  },

  opcaoCorreta: {
    backgroundColor: "#DDF7E7",
    borderColor: "#1E8E5A",
  },

  opcaoErrada: {
    backgroundColor: "#FDECEC",
    borderColor: "#C0392B",
  },

  letterCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FAF8EF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },

  letterText: {
    color: "#287572",
    fontSize: 17,
    fontWeight: "900",
  },

  opcaoTexto: {
    flex: 1,
    fontSize: 18,
    color: "#287572",
    fontWeight: "900",
  },

  feedbackBox: {
    marginTop: 18,
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  feedbackSucesso: {
    backgroundColor: "#E6F8EC",
  },

  feedbackErro: {
    backgroundColor: "#FDECEC",
  },

  feedbackEmoji: {
    fontSize: 30,
    marginRight: 14,
  },

  feedbackTitulo: {
    fontSize: 17,
    fontWeight: "900",
    color: "#17264A",
  },

  feedbackTexto: {
    fontSize: 14,
    color: "#425466",
    marginTop: 3,
    fontWeight: "600",
  },

  bottomBar: {
    marginTop: 28,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },

  // botao: {
  //   height: 68,
  //   borderRadius: 24,
  //   backgroundColor: "#A0AD57",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },


botao: {
  height: 62,
  borderRadius: 22,
  backgroundColor: "#006d77",
  justifyContent: "center",
  alignItems: "center",

  shadowColor: "#000",
  shadowOpacity: 0.16,
  shadowRadius: 5,
  shadowOffset: {
    width: 0,
    height: 4,
  },
  elevation: 5,
},

botaoDesabilitado: {
  backgroundColor: "#97BBB5",
  opacity: 1,
},

botaoCorreto: {
  backgroundColor: "#1E8E5A",
},

botaoErrado: {
  backgroundColor: "#C0392B",
},

botaoTexto: {
  color: "#FFFFFF",
  fontSize: 17,
  fontWeight: "900",
},
});