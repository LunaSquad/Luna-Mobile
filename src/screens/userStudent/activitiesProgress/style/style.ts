import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#006d77",
  },

  phoneContent: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  header: {
    height: 150,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 30,
  },

  backButton: {
    position: "absolute",
    left: 18,
    top: 32,
    zIndex: 2,
  },

  logo: {
    width: 70,
    height: 20,
    marginTop: 24,
  },

  butterfly: {
    position: "absolute",
    right: 28,
    top: 32,
    color: "#006d77",
    fontSize: 22,
  },

  materiasContainer: {
    marginTop: 6,
  },

  materiasScroll: {
    paddingHorizontal: 28,
    gap: 22,
  },

  materiaButton: {
    width: 55,
    height: 55,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  materiaText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  titleSection: {
    marginTop: 28,
    marginLeft: 28,
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
  },

  activitiesList: {
    paddingTop: 18,
    paddingBottom: 40,
  },

  emptyContainer: {
    marginTop: 40,
    paddingHorizontal: 28,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222222",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },

  logoBorboleta: {
  position: "absolute",
  right: 28,
  top: 55,
  width: 24,
  height: 24,
},
});