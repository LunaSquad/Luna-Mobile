import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import API_BASE_URL from "../../../services/ip";
import { preAdaptarTudoEmSegundoPlano } from "../../../services/iaBackgroundservice";

export default function QrCodeScanner() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { userId } = route.params || {};

    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!permission) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0F766E" />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text style={styles.textoPermissao}>Precisamos da sua permissão para usar a câmera.</Text>
                <TouchableOpacity style={styles.btnPermissao} onPress={requestPermission}>
                    <Text style={styles.btnText}>Conceder Permissão</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
                    <Text style={styles.btnTextVoltar}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        setLoading(true);

        try {
            const queryParams = data.split("?")[1];
            if (!queryParams) throw new Error("QR Code não pertence ao aplicativo Luna.");

            const params = queryParams.split("&");
            let codigo = "";
            let turmaIdExtraida = "";

            params.forEach((param) => {
                const [key, value] = param.split("=");
                if (key === "codigo") codigo = value;
                if (key === "turmaId") turmaIdExtraida = value;
            });

            if (!codigo || !turmaIdExtraida) throw new Error("Faltam dados no QR Code.");

            const response = await fetch(`${API_BASE_URL}/students/aluno/${userId}/vincular-turma`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ turmaId: turmaIdExtraida, codigoAcesso: codigo }),
            });

            const respData = await response.json();

            if (response.ok || respData.ok) {
                if (userId) {
                    preAdaptarTudoEmSegundoPlano(userId);
                }
                Alert.alert("Sucesso!", "Você entrou na turma com sucesso.", [
                    { text: "OK", onPress: () => navigation.goBack() },
                ]);
            } else {
                Alert.alert("Erro", respData.message || "Não foi possível entrar na turma.");
                setScanned(false);
            }
        } catch (error: any) {
            Alert.alert("Erro de Leitura", error.message || "Formato de QR Code inválido.");
            setScanned(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />

            <View style={styles.overlay}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="close" size={32} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color="#0F766E" />
                        <Text style={styles.loadingText}>Entrando na turma...</Text>
                    </View>
                ) : (
                    <View style={styles.scanFrame}>
                        <View style={styles.cornerTopLeft} />
                        <View style={styles.cornerTopRight} />
                        <View style={styles.cornerBottomLeft} />
                        <View style={styles.cornerBottomRight} />
                    </View>
                )}

                <Text style={styles.instructionText}>
                    Aponte a câmera para o QR Code gerado pelo professor
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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