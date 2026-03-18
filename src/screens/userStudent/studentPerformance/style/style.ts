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
    marginLeft: 330,
    width: "9%",
    height: "3%",
    bottom: 820,
  },

  percentMatter: {
    width: "85%",
    height: "38%",
    backgroundColor: theme.colors.background,
    position: "absolute",
    bottom: 360,
    borderRadius: theme.radius.md,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    padding: 72,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  barWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
  },

  barText: {
    fontFamily: "Inter_700Bold",
    fontSize: theme.fontSize.small,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },

  rowGraphic: {
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  timeMatter: {
    width: "85%",
    height: "29%",
    backgroundColor: theme.colors.primary,
    position: "absolute",
    bottom: 85,
    borderRadius: theme.radius.md,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    padding: 72,
    alignSelf: "center",
  },

  titleScreen: {
    fontSize: theme.fontSize.large,
    fontFamily: "Inter_700Bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    marginTop: 110,
  },

  titleMatter: {
    fontFamily: "Inter_700Bold",
    fontSize: theme.fontSize.normal,
    color: theme.colors.textPrimary,
    bottom: 55,
    marginVertical: -7,
  },

  row: {
    width: 2,
    height: 190,
    backgroundColor: theme.colors.secondary,
    alignSelf: "center",
    marginLeft: 80,
    bottom: 240,
  },

  firstMatter: {
    width: "13%",
    height: "23%",
    backgroundColor: theme.colors.firstMatter,
    borderRadius: theme.radius.sm,
    bottom: 41,
    marginLeft: -45,
  },

  secondMatter: {
    width: "13%",
    height: "23%",
    backgroundColor: theme.colors.secondMatter,
    borderRadius: theme.radius.sm,
    marginLeft: -45,
    bottom: 40,
  },

  thirdMatter: {
    width: "13%",
    height: "23%",
    backgroundColor: theme.colors.thirdMatter,
    borderRadius: theme.radius.sm,
    marginLeft: -45,
    bottom: 39,
  },

  fourthMatter: {
    width: "13%",
    height: "23%",
    backgroundColor: theme.colors.fourthMatter,
    borderRadius: theme.radius.sm,
    marginLeft: -45,
    bottom: 38,
  },

  fifthMatter: {
    width: "13%",
    height: "23%",
    backgroundColor: theme.colors.fifthMatter,
    borderRadius: theme.radius.sm,
    marginLeft: -45,
    bottom: 37,
  },

  matter: {
    fontFamily: "Inter_700Bold",
    fontSize: theme.fontSize.large,
    color: theme.colors.textPrimary,
    bottom: 49,
  },

  averagetime: {
    fontFamily: "Inter_700Bold",
    fontSize: theme.fontSize.large,
    color: theme.colors.textPrimary,
    bottom: 439,
    marginLeft: 197,
  },

  time: {
    fontFamily: "Inter_700Bold",
    fontSize: theme.fontSize.normal,
    color: theme.colors.secondary,
    bottom: 432,
    padding: 4.5,
    marginLeft: 210,
  },

  label: {
    fontFamily: "Inter_700Bold",
    fontSize: theme.fontSize.normal,
    alignSelf: "center",
    marginTop: 20,
  },

  rowDivisor: {
    height: 2,
    width: 256,
    backgroundColor: theme.colors.primary,
    marginLeft: -275,
    bottom: 30,
  },
});