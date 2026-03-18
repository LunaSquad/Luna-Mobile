import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import {
  useFonts,
  Inter_300Light,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import AppLoading from "expo-app-loading";

import Routes from "./src/routes/index";

export default function App(): React.JSX.Element {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_700Bold,
  });

  if (!fontsLoaded) return <AppLoading />;

  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});