import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import Home from "../screens/userStudent/home";
import StudentPerformance from "../screens/userStudent/studentPerformance";
import ActivitiesProgress from "../screens/userStudent/activitiesProgress";
import Profile from "../screens/userStudent/profile";
import { RootStackParamList } from "./index";

export type StudentTabsParamList = {
  Início: { userId?: string; tipoUser?: string; turmaId?: string };
  Desempenho: { userId?: string; tipoUser?: string; turmaId?: string };
  "Em andamento": {
    userId?: string;
    tipoUser?: string;
    turmaId?: string;
    materiaId?: string;
    materiaNome?: string;
  };
  Perfil: { userId?: string; tipoUser?: string; turmaId?: string };
};

const Tab = createBottomTabNavigator<StudentTabsParamList>();

const GREEN = "#005A63";
const PINK = "#FFDDD2";

function iconByRoute(routeName: string): keyof typeof Ionicons.glyphMap {
  switch (routeName) {
    case "Início":
      return "home";
    case "Desempenho":
      return "bar-chart";
    case "Em andamento":
      return "play-circle";
    case "Perfil":
      return "person";
    default:
      return "ellipse";
  }
}

type Props = StackScreenProps<RootStackParamList, "StudentTabs">;

export default function StudentTabs({ route }: Props) {
  const { userId, tipoUser } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => {
          const iconName = iconByRoute(route.name);

          if (!focused) {
            return (
              <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={24} color={GREEN} />
              </View>
            );
          }

          return (
            <View style={styles.iconContainerActive}>
              <Ionicons name={iconName} size={24} color={PINK} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Início"
        component={Home}
        initialParams={{ userId, tipoUser }}
      />

      <Tab.Screen
        name="Desempenho"
        component={StudentPerformance}
        initialParams={{ userId, tipoUser }}
      />

      <Tab.Screen
        name="Em andamento"
        component={ActivitiesProgress}
        initialParams={{ userId, tipoUser, materiaNome: "Matemática" }}
      />

      <Tab.Screen
        name="Perfil"
        component={Profile}
        initialParams={{ userId, tipoUser }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom: 25, // Afasta os ícones do fundo da tela
    paddingTop: 13,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerActive: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});