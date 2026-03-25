import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
    paddingTop: 50,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    marginTop: 10,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: "#0F172A",
    lineHeight: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 26,
  },
  block: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
  },
  question: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  option: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 4,
  },
  answer: {
    fontSize: 14,
    color: "#166534",
    marginTop: 6,
    fontWeight: "600",
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#005A63",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  errorText: {
    color: "#991B1B",
    fontWeight: "600",
  },
});