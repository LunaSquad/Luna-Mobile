import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

type ProgressCardProps = {
  materiaSigla: string;
  title: string;
  description: string;
  corTema?: string; // Adicionamos a nova prop
};

export function ProgressCard({ materiaSigla, title, description, corTema = "#006d77" }: ProgressCardProps) {
  return (
    <View style={styles.cardContainer}>
      {/* Barra lateral colorida usando a corTema */}
      <View style={[styles.sideIndicator, { backgroundColor: corTema }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          {/* Sigla colorida usando a corTema */}
          <Text style={[styles.siglaText, { color: corTema }]}>{materiaSigla}</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#777" />
        </View>

        <Text style={[styles.titleText, { color: corTema }]}>{title}</Text>
        <Text style={styles.descText} numberOfLines={2}>{description}</Text>

        <View style={styles.footerRow}>
          <Text style={styles.actionText}>Visualizar atividade</Text>
          {/* Ícone de visualizar usando a corTema */}
          <MaterialIcons name="assignment" size={16} color={corTema} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 28,
    marginBottom: 16,
    borderRadius: 8,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  sideIndicator: {
    width: 6,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  siglaText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  descText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});