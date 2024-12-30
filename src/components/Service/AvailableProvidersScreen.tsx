// src/features/services/AvailableProvidersScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { fetchProvidersForServiceAsync } from './servicesSlice';
import { useTheme } from '../../context/ThemeContext';
import { Provider } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigationTypes';

type AvailableProvidersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AvailableProviders'>;

const AvailableProvidersScreen: React.FC<{ route: { params: { serviceId: string } } }> = ({ route }) => {
  const { serviceId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<AvailableProvidersScreenNavigationProp>();
  const { theme } = useTheme();
  const providers = useSelector((state: RootState) => state.services.providers[serviceId] || []);

  useEffect(() => {
    dispatch(fetchProvidersForServiceAsync(serviceId));
  }, [dispatch, serviceId]);

  const renderProviderItem = ({ item }: { item: Provider }) => (
    <TouchableOpacity
      style={[styles.providerItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('ProviderDetails', { providerId: item._id })}
    >
      <Text style={[styles.providerName, { color: theme.colors.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={providers}
        renderItem={renderProviderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  providerItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AvailableProvidersScreen;