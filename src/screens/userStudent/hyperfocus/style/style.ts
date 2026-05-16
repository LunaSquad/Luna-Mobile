import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#006d77",
        paddingHorizontal: 30,
    },

    header: {
        height: 125,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 16,
    },

    backButton: {
        position: "absolute",
        left: -10,
        top: 58,
    },

    logo: {
        width: 55,
        height: 25,
    },

    logoBorboleta: {
        position: "absolute",
        right: 5,
        top: 58,
        width: 24,
        height: 24,
    },

    card: {
        flex: 0,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        minHeight: 500,
        marginTop: 24,
        paddingHorizontal: 28,
        paddingTop: 42,
        paddingBottom: 30,
        alignItems: "center",
    },

    title: {
        width: "100%",
        color: "#006d77",
        fontSize: 17,
        fontWeight: "800",
        lineHeight: 22,
    },

    imageKids: {
        width: 180,
        height: 120,
        marginTop: 18,
        marginBottom: 18,
    },

    formCard: {
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 4,
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 22,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 6,
    },

    label: {
        fontSize: 14,
        fontWeight: "800",
        color: "#111111",
        marginBottom: 10,
    },

    currentText: {
        fontSize: 14,
        color: "#222222",
        marginBottom: 20,
    },

    inputArea: {
        borderBottomWidth: 1,
        borderBottomColor: "#006d77",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    input: {
        flex: 1,
        height: 34,
        fontSize: 13,
        color: "#111111",
        paddingVertical: 0,
    },

    inputIcon: {
        width: 20,
        height: 20,
    },

    photoButton: {
        alignSelf: "center",
        backgroundColor: "#006d77",
        width: 160,
        height: 44,
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },

    photoButtonText: {
        color: "#ffffff",
        fontSize: 8,
        fontWeight: "700",
        marginTop: 2,
    },

    saveButton: {
        backgroundColor: "#006d77",
        width: 135,
        height: 48,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 28,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 6,
    },

    saveButtonText: {
        color: "#ffffff",
        fontSize: 22,
        fontWeight: "800",
    },
    formArea: {
        width: "100%",
        paddingHorizontal: 8,
        marginTop: 8,
    },


});

export default styles;