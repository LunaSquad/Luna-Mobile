import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 28,
  },

  header: {
    height: 120,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 12,
  },

  luna: {
    width: 75,
    height: 38,
  },

  logoBorboleta: {
    position: "absolute",
    right: 0,
    top: 55,
    width: 24,
    height: 24,
  },

  titleScreen: {
    color: "#006d77",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },

  chartCard: {
    width: "88%",
    height: 270,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    alignSelf: "center",
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 18,

    shadowColor: "#006d77",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },

  chartContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-evenly",
  },

  barItem: {
    alignItems: "center",
    justifyContent: "flex-end",
  },

  barText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8a8a8a",
    marginBottom: 8,
  },

  bar: {
    width: 24,
    borderRadius: 12,
    borderWidth: 1.5,
  },

  barLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 10,
    letterSpacing: 0.2,
  },

  infoCard: {
    width: "88%",
    backgroundColor: "#FAFAF8",
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 20,
    paddingVertical: 22,
    paddingHorizontal: 22,

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },

  infoHeaderLabel: {
    color: "#a3a3a3",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
  },

  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  subjectLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  subjectDot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    borderWidth: 1.5,
    marginRight: 12,
  },

  subjectText: {
    color: "#2c2c2c",
    fontSize: 13.5,
    fontWeight: "500",
  },

  timeText: {
    color: "#006d77",
    fontSize: 13.5,
    fontWeight: "600",  
  },
});