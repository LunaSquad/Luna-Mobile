import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 24 },
    textoPermissao: { fontSize: 16, textAlign: "center", marginBottom: 24, color: "#333", fontWeight: "bold" },
    btnPermissao: { backgroundColor: "#0F766E", padding: 16, borderRadius: 8, width: "100%", alignItems: "center", marginBottom: 12 },
    btnVoltar: { padding: 16, borderRadius: 8, width: "100%", alignItems: "center", borderWidth: 1.5, borderColor: "#0F766E" },
    btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    btnTextVoltar: { color: "#0F766E", fontWeight: "bold", fontSize: 16 },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "center", alignItems: "center" },
    header: { position: "absolute", top: 50, left: 20, zIndex: 10 },
    backButton: { padding: 10 },
    scanFrame: { width: 250, height: 250, backgroundColor: "transparent", position: "relative" },
    cornerTopLeft: { position: "absolute", top: 0, left: 0, width: 40, height: 40, borderColor: "#0F766E", borderTopWidth: 5, borderLeftWidth: 5 },
    cornerTopRight: { position: "absolute", top: 0, right: 0, width: 40, height: 40, borderColor: "#0F766E", borderTopWidth: 5, borderRightWidth: 5 },
    cornerBottomLeft: { position: "absolute", bottom: 0, left: 0, width: 40, height: 40, borderColor: "#0F766E", borderBottomWidth: 5, borderLeftWidth: 5 },
    cornerBottomRight: { position: "absolute", bottom: 0, right: 0, width: 40, height: 40, borderColor: "#0F766E", borderBottomWidth: 5, borderRightWidth: 5 },
    instructionText: { color: "#fff", fontSize: 16, fontWeight: "bold", position: "absolute", bottom: 80, textAlign: "center", paddingHorizontal: 40 },
    loadingBox: { backgroundColor: "#fff", padding: 30, borderRadius: 16, alignItems: "center" },
    loadingText: { marginTop: 15, fontSize: 16, fontWeight: "900", color: "#0F766E" }
});