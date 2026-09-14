import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../../styles/theme";

const { height, width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  header: {
    paddingTop: theme.spacing.xx,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: theme.spacing.lg,
    top: 32, // acompanha o header
    zIndex: 10,
  },
  lunaLogo: {
    width: 65,
    height: 32,
  },
  card: {
    width: width,
    height: height * 0.85, 
    backgroundColor: theme.colors.background,
    position: "absolute",
    bottom: 0,
    borderTopEndRadius: theme.radius.lg,
    paddingHorizontal: 72,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 17, 
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: "left",
    flex: 1,
    flexShrink: 1,
  },
  titleImage: {
    width: 90,
    height: 90,
    top: 8,
    marginLeft: 10
  },
  inputsContainer: {
    gap: 4,  
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
  contentContainer: {
    flex: 1
  },

  // Estilos dos Cards de Upload (Etapa 3)
  uploadSection: {
    width: "100%",
    gap: 8,
    marginTop: theme.spacing.sm,
  },
  uploadSectionTitle: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  actionCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    marginTop: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.full,
    backgroundColor: "rgba(255, 221, 210, 0.26)",
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
    color: theme.colors.secondary,
  },
  actionCardSubtitle: {
    fontSize: 10,
    fontFamily: theme.fonts.light,
    color: theme.colors.secondary,
    opacity: 0.8,
    marginTop: 1,
  },
  passwordStepWrapper: {
    flex: 1,
    justifyContent: "center",
    gap: 25,
  },
});