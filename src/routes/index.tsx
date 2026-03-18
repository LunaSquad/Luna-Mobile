import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../screens/userStudent/login/index";
import StudentTabs from "./appTab";
import Activies from "../screens/userStudent/activitiesProgress/index";

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
      }
    | undefined;
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
    </Stack.Navigator>
  );
}