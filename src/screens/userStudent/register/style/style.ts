import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../../styles/theme";

const { height, width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: theme.spacing.xx,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: theme.spacing.lg,
    top: theme.spacing.xx,
    zIndex: 10,
  },
  lunaLogo: {
    width: 90,
    height: 35,
  },
  card: {
    width: width,
    height: height * 0.88,
    backgroundColor: theme.colors.primary,
    position: "absolute",
    bottom: 0,
    borderTopEndRadius: theme.radius.lg,
    paddingHorizontal: 72,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xx,
    justifyContent: "space-between",
  },
  title: {
    fontSize: theme.fontSize.title,
    fontFamily: theme.fonts.bold,
    color: theme.colors.secondary,
    textAlign: "left",
  },
  subtitle: {
    fontSize: theme.fontSize.normal,
    fontFamily: theme.fonts.light,
    color: theme.colors.textInput,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  inputsContainer: {
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xx
  },
  input: {
    width: "100%",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  customButton: {
    width: 180,
  },

  // Estilos dos Cards de Upload (Etapa 3)
  uploadSection: {
    width: "100%",
    gap: 8,
    marginTop: theme.spacing.lg
  },
  uploadSectionTitle: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  actionCard: {
    backgroundColor: theme.colors.thirdMatter,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    marginTop: theme.spacing.lg,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.full,
    backgroundColor: "rgba(0, 90, 99, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  actionCardTexts: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  actionCardSubtitle: {
    fontSize: 10,
    fontFamily: theme.fonts.light,
    color: theme.colors.primary,
    opacity: 0.8,
    marginTop: 1,
  },
});