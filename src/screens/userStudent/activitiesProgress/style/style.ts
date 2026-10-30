import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#006d77",
  },

  phoneContent: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  header: {
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },

  backButton: {
    position: "absolute",
    left: 20,
    top: 48,
    zIndex: 2,
  },

  logo: {
    width: 75,
    height: 24,
  },

  logoBorboleta: {
    position: "absolute",
    right: 28,
    top: 52,
    width: 24,
    height: 24,
  },

  materiasContainer: {
    marginTop: 6,
    marginBottom: 8,
  },

  materiasScroll: {
    paddingHorizontal: 28,
    gap: 16,
    paddingVertical: 6,
  },

  materiaButton: {
    width: 68,
    height: 68,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  materiaText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 28,
    marginTop: 14,
    marginBottom: 14,
    gap: 10,
  },

  titleSection: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111111",
  },

  badgePending: {
    backgroundColor: "#BCE8EE",
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  badgePendingText: {
    color: "#005A63",
    fontSize: 13,
    fontWeight: "800",
  },

  badgeCompleted: {
    backgroundColor: "#CBEFD0",
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeCompletedText: {
    color: "#1B7A26",
    fontSize: 13,
    fontWeight: "800",
  },

  activitiesList: {
    paddingTop: 6,
    paddingBottom: 40,
  },

  emptySectionBox: {
    marginHorizontal: 28,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },

  emptySectionText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
    textAlign: "center",
  },

  emptyContainer: {
    marginTop: 50,
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
});