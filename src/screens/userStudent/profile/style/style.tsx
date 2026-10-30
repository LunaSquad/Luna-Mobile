import { StyleSheet } from "react-native";
import { theme } from "../../../../styles/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F8",
  },

  topSection: {
    backgroundColor: "#006d77",
    width: "100%",
    height: 280,
    borderBottomEndRadius: 40,
    borderBottomStartRadius: 0,
    paddingHorizontal: 24,
  },

  header: {
    height: 100,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 10,
  },

  logo: {
    width: 70,
    height: 35,
  },

  logoBorboleta: {
    position: "absolute",
    right: 24,
    top: 50,
    width: 24,
    height: 24,
  },

  profileSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },

  userName: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: "#ffffff",
    flex: 1,
  },

  profilePhoto: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderColor: "#FFDDD2",
    borderWidth: 2,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginHorizontal: 49,
    paddingHorizontal: 24,
    paddingVertical: 30,
    marginTop: -40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },

  infoContainer: {
    gap: 16,
  },

  titleInfo: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: "#333",
    marginBottom: 4,
  },

  infoItem: {
    fontFamily: theme.fonts.light,
    fontSize: 14,
    color: "#555",
  },

  infoItemContainer: {
    backgroundColor: "#e0f2f3",
    borderRadius: 8,
    width: 110,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    gap: 6,
    marginTop: 4,
  },

  infoItemLaudo: {
    fontFamily: theme.fonts.bold,
    color: "#006d77",
    fontSize: 13,
  },

  editButtons: {
    marginTop: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    width: "100%",
    marginVertical: 14,
  },

  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },

  actionText: {
    fontFamily: theme.fonts.light,
    fontSize: 15,
    marginLeft: 14,
    color: "#333",
    flex: 1,
  },
});

export default styles;