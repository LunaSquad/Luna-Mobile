import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../../styles/theme";

const { height, width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    width: width,
    height: height * 0.16,
    paddingTop: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 18,
    top: 48,
    zIndex: 20,
    padding: 4,
  },
  lunaLogo: {
    width: 67,
    height: 51,
  },
  card: {
    width: width,
    height: height * 0.84,
    backgroundColor: theme.colors.primary || "#005A63",
    position: "absolute",
    bottom: 0,
    borderTopRightRadius: 48,
    paddingHorizontal: 46,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts?.bold || "Inter_700Bold",
    fontWeight: "700",
    color: theme.colors.secondary || "#FFDDD2",
    textAlign: "left",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fonts?.light || "Inter_300Light",
    color: "#E0F2F1",
    marginTop: 10,
    marginBottom: 14,
    textAlign: "center",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 6,
    paddingBottom: 28,
    gap: 18,
  },
  input: {
    width: "100%",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 14,
  },
  customButton: {
    width: 175,
  },
  uploadSection: {
    width: "100%",
    marginTop: 8,
  },
  uploadSectionTitle: {
    fontSize: 12,
    fontFamily: theme.fonts?.bold || "Inter_700Bold",
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  actionCard: {
    backgroundColor: theme.colors.secondary || "#FFDDD2",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 90, 99, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionCardTexts: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 13,
    fontFamily: theme.fonts?.bold || "Inter_700Bold",
    fontWeight: "700",
    color: theme.colors.primary || "#005A63",
  },
  actionCardSubtitle: {
    fontSize: 10,
    fontFamily: theme.fonts?.light || "Inter_300Light",
    color: theme.colors.primary || "#005A63",
    opacity: 0.85,
    marginTop: 2,
  },
});