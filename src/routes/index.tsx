import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../screens/userStudent/login/index";
import StudentTabs from "./appTab";
import Activies from "../screens/userStudent/activitiesProgress/index";
import AdaptedActivity from "../screens/userStudent/adaptedActivity/index";
import EditHyperfocus from "../screens/userStudent/hyperfocus/index";
import Feedback from "../screens/userStudent/feedback/index";

export type RootStackParamList = {
  Login: undefined;

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

  AdaptedActivity: {
    planoId?: string;
    planoTitulo: string;
    planoDescricao: string;
    userId: string;
  };

  EditHyperfocus:
    | {
        userId?: string;
        hiperfocoAtual?: string;
      }
    | undefined;

  Feedback: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="StudentTabs" component={StudentTabs} />
      <Stack.Screen name="Atividades" component={Activies} />
      <Stack.Screen name="AdaptedActivity" component={AdaptedActivity} />
      <Stack.Screen name="EditHyperfocus" component={EditHyperfocus} />
      <Stack.Screen name="Feedback" component={Feedback} />
    </Stack.Navigator>
  );
}