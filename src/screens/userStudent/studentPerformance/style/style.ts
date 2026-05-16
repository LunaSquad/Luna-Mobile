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
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 45,
  },

  chartCard: {
    width: "86%",
    height: 280,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    alignSelf: "center",
    paddingTop: 42,
    paddingHorizontal: 28,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.16,
    shadowRadius: 7,
    elevation: 6,
  },

  chartContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  barItem: {
    alignItems: "center",
    justifyContent: "flex-end",
  },

  barText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 8,
  },

  bar: {
    width: 28,
    borderWidth: 1.5,
    borderBottomWidth: 2,
  },

  barLabel: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 10,
  },

  chartLine: {
    height: 1.5,
    backgroundColor: "#006d77",
    width: "100%",
    marginBottom: 32,
  },

  infoCard: {
    width: "86%",
    backgroundColor: "#006d77",
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 55,
    paddingVertical: 28,
    paddingHorizontal: 26,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 7,
  },

  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 18,
  },

  infoTitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },

  infoContent: {
    flexDirection: "row",
  },

  leftColumn: {
    flex: 1.4,
  },

  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  subjectColor: {
    width: 15,
    height: 15,
    borderRadius: 3,
    marginRight: 10,
  },

  subjectText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },

  divider: {
    width: 1,
    backgroundColor: "#ffffff",
    opacity: 0.9,
    marginHorizontal: 18,
  },

  rightColumn: {
    justifyContent: "space-between",
    paddingVertical: 1,
  },

  timeText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 14,
    textAlign: "right",
  },
});