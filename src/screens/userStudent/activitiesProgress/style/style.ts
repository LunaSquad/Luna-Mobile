import { StyleSheet } from "react-native";
import { theme } from "../../../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  luna: {
    position: "absolute",
    alignSelf: "center",
  },
  logo: {
    width: "9%",
    height: "9%",
    top: 15,
    marginLeft: 415,
  },
  viewBorderRadius: {
    backgroundColor: theme.colors.primary,
    width: 480,
    height: 300,
    borderBottomRightRadius: theme.radius.lg,
    elevation: 6,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  titleActivitie: {
    color: theme.colors.secondary,
    fontFamily: "Inter_700Bold",
    fontSize: theme.fontSize.large,
    top: 100,
    alignSelf: "center",
  },
  titleData: {
    color: theme.colors.textPrimary,
    fontFamily: "Inter_300Light",
    fontSize: theme.fontSize.large,
    top: 150,
    marginLeft: theme.spacing.xl,
  },
  imgProgress: {
    width: "80%",
    height: "60%",
    alignSelf: "center",
    top: 25,
  },
  titleLesson: {
    fontFamily: "Inter_700Bold",
    color: theme.colors.borderFirstMatter,
    bottom: 150,
    marginLeft: 110,
    fontSize: theme.fontSize.normal,
  },
  textLesson: {
    fontFamily: "Inter_300Light",
    fontSize: theme.fontSize.normal,
    bottom: 135,
    marginLeft: 110,
  },
  arrowLesson: {
    color: theme.colors.borderFirstMatter,
    bottom: 135,
    marginLeft: 315,
  },
  textAndamento: {
    fontFamily: theme.fonts.bold,
    marginTop: theme.spacing.xx,
  },
});