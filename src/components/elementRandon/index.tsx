import React, { useMemo } from "react";
import { View, Image, StyleSheet } from "react-native";

interface Props {
  imagens: string[];
}

export default function ElementosVisuaisAleatorios({ imagens }: Props) {
  if (!imagens || imagens.length === 0) return null;

  // useMemo garante que as posições não fiquem piscando ou mudando toda hora
  const imagensPosicionadas = useMemo(() => {
    return imagens.map((url) => {
      // Sorteia altura entre 10% e 80% da tela
      const randomTop = Math.floor(Math.random() * 70) + 10 + "%";
      
      // Joga ou para a extrema esquerda (2% a 15%) ou extrema direita (75% a 85%)
      const isLeft = Math.random() > 0.5;
      const randomLeft = isLeft
        ? Math.floor(Math.random() * 13) + 2 + "%"
        : Math.floor(Math.random() * 10) + 75 + "%";

      const randomRotation = Math.floor(Math.random() * 60) - 30 + "deg"; // Rotação de -30 a 30 graus

      return { url, randomTop, randomLeft, randomRotation };
    });
  }, [imagens]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {imagensPosicionadas.map((item, index) => (
        <Image
          key={index}
          source={{ uri: item.url }}
          style={{
            position: "absolute",
            top: item.randomTop as any,
            left: item.randomLeft as any,
            width: 65,
            height: 65,
            opacity: 0.85, // Leve transparência para não distrair muito
            transform: [{ rotate: item.randomRotation }],
          }}
          resizeMode="contain"
        />
      ))}
    </View>
  );
}