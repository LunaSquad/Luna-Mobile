import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "./style/style";

type PerformanceItem = {
  matter: string;
  name: string;
  porcent: number;
  time: string;
  color: string;
  borderColor: string;
};

const CHART_USABLE_HEIGHT = 180;

export default function StudentPerformanceScreen() {
  const dados: PerformanceItem[] = [
    {
      matter: "LP",
      name: "Língua portuguesa",
      porcent: 100,
      time: "15:30",
      color: "#E9F7F6",
      borderColor: "#006d77",
    },
    {
      matter: "MAT",
      name: "Matemática",
      porcent: 20,
      time: "10:40",
      color: "#DCE5FF",
      borderColor: "#3d4fa8",
    },
    {
      matter: "GEO",
      name: "Geografia",
      porcent: 80,
      time: "11:35",
      color: "#FFD6C7",
      borderColor: "#c2653f",
    },
    {
      matter: "HIS",
      name: "História",
      porcent: 60,
      time: "20:25",
      color: "#F5C4AE",
      borderColor: "#a8542f",
    },
    {
      matter: "CIÊ",
      name: "Ciências",
      porcent: 70,
      time: "09:35",
      color: "#C8F7D2",
      borderColor: "#2f7a45",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../../assets/luna.png")}
          style={styles.luna}
          resizeMode="contain"
        />

        <Image
          source={require("../../../assets/logo mobile.png")}
          style={styles.logoBorboleta}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.titleScreen}>Gráfico de desempenho geral</Text>

      <View style={styles.chartCard}>
        <View style={styles.chartContent}>
          {dados.map((item, index) => (
            <View key={index} style={styles.barItem}>
              <Text style={styles.barText}>{item.porcent}%</Text>

              <View
                style={[
                  styles.bar,
                  {
                    height: (item.porcent / 100) * CHART_USABLE_HEIGHT,
                    backgroundColor: item.color,
                    borderColor: item.borderColor,
                  },
                ]}
              />

              <Text style={[styles.barLabel, { color: item.borderColor }]}>
                {item.matter}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoHeaderLabel}>Tempo médio por matéria</Text>

        {dados.map((item, index) => (
          <View key={index} style={styles.subjectRow}>
            <View style={styles.subjectLeft}>
              <View
                style={[
                  styles.subjectDot,
                  {
                    backgroundColor: item.color,
                    borderColor: item.borderColor,
                  },
                ]}
              />
              <Text style={styles.subjectText}>{item.name}</Text>
            </View>

            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}