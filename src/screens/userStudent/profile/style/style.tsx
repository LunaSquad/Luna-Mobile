import { StyleSheet } from "react-native";
import { theme } from "../../../../styles/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 28,
  },

  header: {
    height: 120,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },

  topSection: {
    backgroundColor: '#006d77',
    width: 415,
    marginLeft: -28,
    paddingHorizontal: 28,
    height: 300,
    borderBottomEndRadius: 50
  },

  profileSummary: {
    justifyContent: "flex-end",
    paddingBottom: 5,
  },

  userName: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    color: '#ffffff',
    marginTop: 30,
    marginLeft: 20
  },

  logo: {
    width: 65,
    height: 32,
  },

  logoBorboleta: {
    position: "absolute",
    right: 0,
    top: 52,
    width: 24,
    height: 24,
  },

  profilePhoto: {
      width: 80,
      height: 80,
      borderRadius: theme.radius.full,
      marginLeft: 260,
      marginTop: -55,
      borderColor: "#FFDDD2",
      borderWidth: 1
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 36,
    marginTop: -70,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },

  titleInfo: {
    fontFamily: theme.fonts.bold,
  },

  infoItem: {
    fontFamily: theme.fonts.light,
  },

  infoContainer: {
    gap: 15
  },

  divider: {
    height: 1,
    backgroundColor: "#D9D9D9",
    width: "100%",
    marginVertical: 20,
  },

  actionText: {
    fontFamily: theme.fonts.light,
    marginLeft: 14,
    flex: 1,
  },

  actionItem: {
    flexDirection: "row",
    height: 25,
  },

  infoItemContainer: {
  backgroundColor: '#e0f2f3', 
  borderRadius: 8,
  width: 100,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 6,
  paddingHorizontal: 4,
  gap: 4,
  },

  infoItemLaudo: {
    fontFamily: theme.fonts.bold,
    color: '#006d77',
    fontSize: 13,
  },

  editButtons: {
    marginTop: 20
  }

});

export default styles;