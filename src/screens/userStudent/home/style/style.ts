import { StyleSheet } from "react-native";
import { theme } from "../../../../styles/theme";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

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
    marginTop: -25,
  },

  spaceNameUsuario: {
    width: "100%",
    height: 30,
    marginTop: theme.spacing.xl,
    marginBottom: -10,
  },

  nameUsuario: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSize.normal,
    marginLeft: theme.spacing.xl,
  },

spaceHiperfocoAux: {
  width: "100%",
  height: 210,
  paddingTop: theme.spacing.xl,
  overflow: "visible",
},


spaceHiperfoco: {
  width: "100%",
  height: 170,
  backgroundColor: theme.colors.primary,
  borderRadius: theme.radius.md,
  paddingLeft: 34,
  paddingTop: 28,
  position: "relative",
  overflow: "visible",

  elevation: 5,
  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 6,
  shadowOffset: {
    width: 0,
    height: 3,
  },
},

hiperfocoContent: {
  zIndex: 2,
},

textoHiperfoco: {
  fontSize: 16,
  lineHeight: 23,
  fontFamily: theme.fonts.bold,
  color: "#fff",
  width: 210,
},

hiperfocoActionArea: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 4,
},

imageSeta: {
  width: 45,
  height: 58,
  resizeMode: "contain",
  marginLeft: 22,
  marginRight: 10,
},

bottonHiperfoco: {
  width: 82,
  height: 43,
  backgroundColor: theme.colors.secondary,
  borderRadius: theme.radius.sm,
  alignItems: "center",
  justifyContent: "center",
  marginTop: 20,
},

buttonIconHiperfoco: {
  width: 32,
  height: 32,
  resizeMode: "contain",
},

luna3d: {
  width: 125,
  height: 185,
  position: "absolute",
  right: -8,
  bottom: -12,
  resizeMode: "contain",
  zIndex: 5,
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
    width: 105,
    height: 25,
    resizeMode: "contain",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 10,
  },

  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#fff",
    zIndex: 20,
    paddingTop: 70,
    paddingHorizontal: 28,
    paddingBottom: 35,
    justifyContent: "space-between",

    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {
      width: 2,
      height: 0,
    },
  },

  drawerProfile: {
    flexDirection: "row",
    alignItems: "center",
  },

  drawerPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  drawerName: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: theme.colors.primary,
  },

  drawerSchool: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 2,
  },

  drawerLine: {
    height: 1,
    backgroundColor: theme.colors.primary,
    marginTop: 35,
    marginBottom: 25,
  },

  drawerLineBottom: {
    height: 1,
    backgroundColor: theme.colors.primary,
    marginBottom: 18,
  },

  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  drawerIcon: {
    width: 24,
    fontSize: 15,
    color: theme.colors.primary,
  },

  drawerText: {
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    color: theme.colors.primary,
  },
});

export default styles;