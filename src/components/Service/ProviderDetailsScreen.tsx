import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { useTheme } from '../../context/ThemeContext';

type ProviderDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ProviderDetails'>;

interface ProviderDetailsScreenProps {
  route: ProviderDetailsScreenRouteProp;
}

const ProviderDetailsScreen: React.FC<ProviderDetailsScreenProps> = ({ route }) => {
  const { providerId } = route.params;
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Provider Details</Text>
      <Text style={[styles.details, { color: theme.colors.secondaryText }]}>Provider ID: {providerId}</Text>
      {/* Adicione mais detalhes do provedor aqui */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  details: {
    fontSize: 18,
  },
});

export default ProviderDetailsScreen;