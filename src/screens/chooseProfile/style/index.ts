import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../styles/theme";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCF8",
    alignItems: "center",
  },
  header: {
    width: width,
    alignItems: "flex-end",
    paddingTop: 52,
    paddingHorizontal: 28,
  },
  logo: {
    width: 32,
    height: 24,
  },
  luna: {
    width: 67,
    height: 51,
    marginTop: 4,
  },
  boneca: {
    width: width * 0.78,
    height: height * 0.48,
    marginTop: 8,
  },
  buttonsArea: {
    marginTop: 18,
    width: "100%",
    alignItems: "center",
    gap: 18,
  },
  buttonStyle: {
    width: 250,
    height: 54,
    backgroundColor: theme.colors.primary || "#005A63",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textButton: {
    fontSize: 18,
    color: theme.colors.secondary || "#FFDDD2",
    fontFamily: theme.fonts?.bold || "Inter_700Bold",
    fontWeight: "700",
  },
});