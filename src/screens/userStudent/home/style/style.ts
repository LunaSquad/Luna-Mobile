import { StyleSheet } from "react-native";
import { theme } from "../../../../styles/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: theme.spacing.lg,
  },
  navbar: {
    width: "100%",
    height: "11%",
    marginTop: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menu: {
    width: 30,
    height: 30,
  },
  profilePhoto: {
    width: 45,
    height: 45,
    borderRadius: theme.radius.full,
  },
  spaceLogo: {
    width: "100%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  spaceNameUsuario: {
    width: "100%",
    height: 30,
    marginTop: theme.spacing.xl,
  },
  nameUsuario: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSize.large,
    marginLeft: theme.spacing.xl,
  },
  spaceHiperfocoAux: {
    width: "100%",
    height: 160,
    padding: theme.spacing.xl,
  },
  spaceHiperfoco: {
    width: "100%",
    height: 160,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingLeft: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    position: "relative",
  },
  textoHiperfoco: {
    fontSize: theme.fontSize.normal,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    width: 200,
  },
  imageSeta: {
    width: 25,
    height: 35,
    marginLeft: theme.spacing.xl,
  },
  bottonHiperfoco: {
    width: 85,
    height: 37,
    backgroundColor: theme.colors.secondary,
    marginTop: "7%",
    marginLeft: "3%",
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  luna3d: {
    width: 80,
    height: 137,
    position: "relative",
    marginLeft: "20%",
    bottom: "40%",
  },
  spaceMaterias: {
    marginTop: theme.spacing.xx,
    height: 650,
  },
  spaceTituloMaterias: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textMaterias: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSize.large,
  },
  textVejamais: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSize.small,
    color: theme.colors.borderFirstMatter,
  },
  body: {
  flex: 1,
},

logo: {
  width: 120,
  height: 40,
  resizeMode: "contain",
},
});

export default styles;