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
  inputEmail: {
    marginBottom: theme.spacing.xx,
  },
  inputSenha: {
    marginTop: theme.spacing.xx,
  },
  CustomButton: {
    marginTop: theme.spacing.lg,
    alignSelf: "center",
    marginBottom: theme.spacing.sm,
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