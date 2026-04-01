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
      selecionada.trim().toLowerCase() ===
      respostaCorreta.trim().toLowerCase()
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
      <View style={styles.header}>
        <Text style={styles.logo}>{titulo}</Text>
        <Text style={styles.subtitulo}>{subtitulo}</Text>
      </View>

      <View style={styles.mainCard}>
        <Text style={styles.pergunta}>{pergunta}</Text>

        <View style={styles.atividadeArea}>
          {imagens.length > 0 ? (
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
          ) : (
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderEmoji}>🎯</Text>
              <Text style={styles.placeholderText}>
                Observe os elementos e escolha a resposta correta
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.bottomArea}>
        <Text style={styles.instrucao}>Escolha uma opção:</Text>

        {opcoes.map((opcao, index) => {
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
              <Text
                style={[
                  styles.opcaoTexto,
                  (mostrarCorreta || mostrarErrada) && styles.opcaoTextoDestaque,
                ]}
              >
                {opcao}
              </Text>
            </TouchableOpacity>
          );
        })}

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
            {!respondeu ? "Enviar" : acertou ? "Acertou!" : "Tentar novamente"}
          </Text>
        </TouchableOpacity>

        {respondeu ? (
          <View
            style={[
              styles.feedbackBox,
              acertou ? styles.feedbackSucesso : styles.feedbackErro,
            ]}
          >
            <Text style={styles.feedbackEmoji}>{acertou ? "🏆" : "💡"}</Text>
            <Text style={styles.feedbackTitulo}>
              {acertou ? "Muito bem!" : "Quase lá!"}
            </Text>
            <Text style={styles.feedbackTexto}>
              {acertou
                ? "Você acertou a resposta."
                : `A resposta correta era: ${respostaCorreta}`}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
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

  mainCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    zIndex: 2,
  },

  pergunta: {
    fontSize: 24,
    lineHeight: 31,
    textAlign: "center",
    color: "#172B4D",
    fontWeight: "800",
    marginBottom: 18,
  },

  atividadeArea: {
    minHeight: 180,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
  },

  imagesRow: {
    alignItems: "center",
    paddingHorizontal: 6,
    gap: 10,
  },

  imageCard: {
    width: 110,
    height: 110,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9EEF2",
    marginRight: 10,
  },

  image: {
    width: 86,
    height: 86,
    resizeMode: "contain",
  },

  placeholderBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },

  placeholderEmoji: {
    fontSize: 42,
    marginBottom: 10,
  },

  placeholderText: {
    textAlign: "center",
    fontSize: 15,
    color: "#5B6470",
    lineHeight: 22,
    fontWeight: "500",
  },

  bottomArea: {
    backgroundColor: "#F4D52C",
    marginTop: -6,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },

  instrucao: {
    fontSize: 15,
    color: "#1C2B38",
    fontWeight: "700",
    marginBottom: 12,
  },

  opcao: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },

  opcaoSelecionada: {
    borderColor: "#005A63",
    transform: [{ scale: 1.01 }],
  },

  opcaoCorreta: {
    backgroundColor: "#DDF7E7",
    borderColor: "#1E8E5A",
  },

  opcaoErrada: {
    backgroundColor: "#FCE2E2",
    borderColor: "#C0392B",
  },

  opcaoTexto: {
    fontSize: 15,
    color: "#25313C",
    fontWeight: "700",
  },

  opcaoTextoDestaque: {
    color: "#17212B",
  },

  botao: {
    marginTop: 8,
    backgroundColor: "#005A63",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  botaoDesabilitado: {
    opacity: 0.5,
  },

  botaoCorreto: {
    backgroundColor: "#1E8E5A",
  },

  botaoErrado: {
    backgroundColor: "#C0392B",
  },

  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  feedbackBox: {
    marginTop: 14,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  feedbackSucesso: {
    backgroundColor: "#E6F8EC",
  },

  feedbackErro: {
    backgroundColor: "#FDECEC",
  },

  feedbackEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },

  feedbackTitulo: {
    fontSize: 18,
    fontWeight: "800",
    color: "#17212B",
    marginBottom: 4,
  },

  feedbackTexto: {
    fontSize: 14,
    textAlign: "center",
    color: "#425466",
    lineHeight: 20,
  },
});