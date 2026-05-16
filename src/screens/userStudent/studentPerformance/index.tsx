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
      borderColor: "#06156f",
    },
    {
      matter: "GEO",
      name: "Geografia",
      porcent: 80,
      time: "11:35",
      color: "#FFD6C7",
      borderColor: "#7c2d12",
    },
    {
      matter: "HIS",
      name: "História",
      porcent: 60,
      time: "20:25",
      color: "#E3845B",
      borderColor: "#7c2d12",
    },
    {
      matter: "CIÊ",
      name: "Ciências",
      porcent: 70,
      time: "09:35",
      color: "#C8F7D2",
      borderColor: "#166534",
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
          source={require("../../../assets/logo mobile-positivo.png")}
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
                    height: item.porcent * 1.8,
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

        <View style={styles.chartLine} />
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Text style={styles.infoTitle}>Matérias</Text>
          <Text style={styles.infoTitle}>Tempo médio</Text>
        </View>

        <View style={styles.infoContent}>
          <View style={styles.leftColumn}>
            {dados.map((item, index) => (
              <View key={index} style={styles.subjectRow}>
                <View
                  style={[
                    styles.subjectColor,
                    { backgroundColor: item.color },
                  ]}
                />

                <Text style={styles.subjectText}>{item.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.rightColumn}>
            {dados.map((item, index) => (
              <Text key={index} style={styles.timeText}>
                {item.time}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}