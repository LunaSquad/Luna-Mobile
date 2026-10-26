import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ChooseProfileScreen from "../screens/chooseProfile/index";
import Login from "../screens/userStudent/login/index";
import StudentTabs from "./appTab";
import Activies from "../screens/userStudent/activitiesProgress/index";
import AdaptedActivity from "../screens/userStudent/adaptedActivity/index";
import EditHyperfocus from "../screens/userStudent/hyperfocus/index";
import Feedback from "../screens/userStudent/feedback/index";
import Register from "../screens/userStudent/register/index";
import EditProfileScreen from "../screens/userStudent/EditProfileScreen";

export type RootStackParamList = {
  ChooseProfile: undefined; // <-- Nova tela declarada aqui
  Login: { perfil?: "aluno" | "professor" } | undefined; // Agora o Login recebe um parâmetro

  StudentTabs:
  | {
    userId?: string;
    tipoUser?: string;
  }
  | undefined;

  Atividades:
  | {
    userId?: string;
    tipoUser?: string;
    materiaId?: string;
    materiaNome?: string;
  }
  | undefined;

  AdaptedActivity:
  | {
    planoId?: string;
    planoTitulo?: string;
    planoDescricao?: string;
    userId?: string;
    turmaId?: string;
    materiaId?: string;
    urlPlanoDeAula?: string;
  }
  | undefined;

  EditHyperfocus:
  | {
    userId?: string;
    hiperfocoAtual?: string;
  }
  | undefined;

  Feedback: undefined;

  Register: undefined;

  EditProfileScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ChooseProfile" // <-- Aqui mudamos para abrir direto na escolha de perfil
    >
      <Stack.Screen name="ChooseProfile" component={ChooseProfileScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="StudentTabs" component={StudentTabs} />
      <Stack.Screen name="Atividades" component={Activies} />
      <Stack.Screen name="AdaptedActivity" component={AdaptedActivity} />
      <Stack.Screen name="EditHyperfocus" component={EditHyperfocus} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}