import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../../styles/theme";

const { height, width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  luna: {
    position: "absolute",
    alignSelf: "center",
  },
  logo: {
    position: "absolute",
    alignSelf: "center",
  },
  login: {
    width: width,
    height: "70%",
    backgroundColor: theme.colors.primary,
    position: "absolute",
    bottom: 0,
    borderTopEndRadius: theme.radius.lg,
    padding: 72,
    alignSelf: "center",
  },
  titleModal: {
    fontSize: theme.fontSize.title,
    fontFamily: "Inter_700Bold",
    color: theme.colors.secondary,
    marginBottom: theme.spacing.lg,
  },
  // AJUSTADO: removeu o margin excessivo entre eles
  inputEmail: {
    marginBottom: theme.spacing.sm || 12,
  },
  inputSenha: {
    marginTop: 0,
  },
  CustomButton: {
    marginTop: theme.spacing.sm,
    alignSelf: "center",
    marginBottom: theme.spacing.sm,
  },
  // NOVO: estilos do link de cadastro
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.sm || 10,
  },
  signUpText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: theme.fonts.light || "Inter_300Light",
  },
  signUpLink: {
    color: theme.colors.secondary,
    fontSize: 14,
    fontFamily: theme.fonts.bold || "Inter_700Bold",
    marginLeft: 4,
  },
  row: {
    width: 262,
    height: 1,
    backgroundColor: theme.colors.secondary,
    alignSelf: "center",
    marginTop: theme.spacing.xx,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 200,
    alignSelf: "center",
    marginTop: theme.spacing.sm,
  },
});