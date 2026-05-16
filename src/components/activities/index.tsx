import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type ProgressCardProps = {
  title: string;
  description: string;
  materiaSigla: string;
};

export function ProgressCard({
  title,
  description,
  materiaSigla,
}: ProgressCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.leftBorder} />

      <View style={styles.content}>
        <View style={styles.topArea}>
          <View style={styles.materiaBox}>
            <Text style={styles.materiaText}>{materiaSigla}</Text>
          </View>

          <View style={styles.iconsArea}>
            <MaterialIcons name="arrow-forward" size={25} color="#006d77" />
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>{description}</Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Visualizar atividade</Text>
          <MaterialIcons name="article" size={18} color="#006d77" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "86%",
    minHeight: 155,
    backgroundColor: "#ffffff",
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 28,
    flexDirection: "row",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },

  leftBorder: {
    width: 5,
    backgroundColor: "#006d77",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 12,
  },

  topArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  materiaBox: {
    width: 43,
    height: 43,
    backgroundColor: "#eefaff",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  materiaText: {
    color: "#006d77",
    fontSize: 17,
    fontWeight: "700",
  },

  iconsArea: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },

  title: {
    marginTop: 20,
    color: "#006d77",
    fontSize: 13,
    fontWeight: "700",
  },

  description: {
    marginTop: 7,
    color: "#333333",
    fontSize: 11,
  },

  footer: {
    marginTop: 18,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  footerText: {
    color: "#006d77",
    fontSize: 11,
    fontWeight: "700",
  },
});