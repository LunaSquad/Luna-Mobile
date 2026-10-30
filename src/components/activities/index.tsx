import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type ProgressCardProps = {
  materiaSigla: string;
  title: string;
  description: string;
  corTema?: string;
  concluida?: boolean;
};

export function ProgressCard({
  materiaSigla,
  title,
  description,
  corTema = "#006d77",
  concluida = false,
}: ProgressCardProps) {
  const corLateral = concluida ? "#229A2E" : corTema;

  return (
    <View style={[styles.cardContainer, concluida && styles.cardConcluida]}>
      <View style={[styles.sideIndicator, { backgroundColor: corLateral }]} />

      <View style={styles.innerContent}>
        <View
          style={[
            styles.siglaBadge,
            { backgroundColor: concluida ? "#FFFFFF" : `${corTema}18` },
          ]}
        >
          <Text style={[styles.siglaText, { color: corTema }]}>
            {materiaSigla}
          </Text>
        </View>

        <View style={styles.textSection}>
          <Text
            style={[
              styles.titleText,
              { color: concluida ? "#555555" : corTema },
            ]}
            numberOfLines={2}
          >
            {title}
          </Text>

          {!concluida && Boolean(description) && (
            <Text style={styles.descText} numberOfLines={2}>
              {description}
            </Text>
          )}
        </View>

        {concluida ? (
          <View style={styles.checkCircle}>
            <MaterialIcons name="check" size={18} color="#FFFFFF" />
          </View>
        ) : (
          <MaterialIcons name="chevron-right" size={26} color={corTema} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 28,
    marginBottom: 14,
    borderRadius: 14,
    flexDirection: "row",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#EFEFEF",
    overflow: "hidden",
  },
  cardConcluida: {
    backgroundColor: "#F2F4F5",
    borderColor: "#E5E7EB",
    elevation: 1,
  },
  sideIndicator: {
    width: 6,
    height: "100%",
  },
  innerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  siglaBadge: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  siglaText: {
    fontSize: 15,
    fontWeight: "800",
  },
  textSection: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 8,
  },
  titleText: {
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
  },
  descText: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
    marginTop: 4,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#229A2E",
    alignItems: "center",
    justifyContent: "center",
  },
});