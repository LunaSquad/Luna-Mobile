import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../../styles/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    position: "absolute",
    top: 48,
    left: 18,
    zIndex: 30,
    padding: 4,
  },
  luna: {
    position: "absolute",
    alignSelf: "center",
    width: 67,
    height: 51,
  },
  logo: {
    position: "absolute",
    alignSelf: "center",
    width: 185,
    height: 185,
  },
  login: {
    width: width,
    height: "66%",
    backgroundColor: theme.colors.primary || "#005A63",
    position: "absolute",
    bottom: 0,
    borderTopRightRadius: 48,
    paddingHorizontal: 46,
    paddingTop: 42,
    paddingBottom: 30,
    alignSelf: "center",
  },
  titleModal: {
    fontSize: 26,
    fontFamily: theme.fonts?.bold || "Inter_700Bold",
    fontWeight: "700",
    color: theme.colors.secondary || "#FFDDD2",
    marginBottom: 28,
  },
  inputEmail: {
    marginBottom: 22,
  },
  inputSenha: {
    marginBottom: 28,
  },
  CustomButton: {
    marginTop: 8,
    alignSelf: "center",
    marginBottom: 14,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  signUpText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: theme.fonts?.light || "Inter_300Light",
  },
  signUpLink: {
    color: theme.colors.secondary || "#FFDDD2",
    fontSize: 14,
    fontFamily: theme.fonts?.bold || "Inter_700Bold",
    fontWeight: "700",
  },
  row: {
    width: "100%",
    height: 1,
    backgroundColor: theme.colors.secondary || "#FFDDD2",
    alignSelf: "center",
    marginTop: 18,
    opacity: 0.7,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    alignSelf: "center",
    marginTop: 18,
  },
});