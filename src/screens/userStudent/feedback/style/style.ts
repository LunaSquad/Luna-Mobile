import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../../../styles/theme";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },

    topBackground: {
        backgroundColor: "#ffffff",
        height: height * 0.45,
        paddingHorizontal: 28,
    },

    bottomBackground: {
        backgroundColor: "#005A63",
        height: height * 0.55,
        // borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 40,
    },

    backButton: {
        padding: 8,
        marginLeft: -8,
    },

    logoContainer: {
        flex: 1,
        alignItems: "center",
        marginRight: 24,
    },

    logo: {
        width: 70,
        height: 35,
    },

    logoBorboleta: {
        position: "absolute",
        right: 0,
        width: 24,
        height: 24,
    },

    title: {
        fontSize: 22,
        fontFamily: theme.fonts?.bold || "System",
        color: "#006d77",
        marginTop: 20,
        marginBottom: 16,
        marginHorizontal: 30,
    },

    illustration: {
        width: "100%",
        height: 150,
        alignSelf: "center",
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        paddingHorizontal: 24,
        paddingVertical: 32,
        marginHorizontal: 49,
        marginTop: -80,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        alignItems: "center",
    },

    cardTitle: {
        fontSize: 15,
        fontFamily: theme.fonts?.bold || "System",
        color: "#333333",
        alignSelf: "flex-start",
        marginBottom: 12,
    },

    inputContainer: {
        width: "100%",
        height: 120,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 12,
        padding: 12,
        marginBottom: 24,
        backgroundColor: "#FAFAFA",
        position: "relative",
    },

    input: {
        flex: 1,
        textAlignVertical: "top",
        fontSize: 14,
        fontFamily: theme.fonts?.light || "System",
        color: "#333333",
    },

    inputIcon: {
        position: "absolute",
        bottom: 10,
        right: 10,
    },

    ratingTitle: {
        fontSize: 12,
        fontFamily: theme.fonts?.bold || "System",
        color: "#333333",
        textTransform: "uppercase",
        marginBottom: 16,
    },

    starsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 12,
        marginBottom: 32,
    },

    submitButton: {
        backgroundColor: "#005A63",
        width: "80%",
        height: 48,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
    },

    submitButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontFamily: theme.fonts?.bold || "System",
    },
});