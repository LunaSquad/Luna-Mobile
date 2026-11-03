import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import API_BASE_URL from "../../../services/ip";
import { preAdaptarTudoEmSegundoPlano } from "../../../services/iaBackgroundservice";
import { styles } from "./style/style";

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