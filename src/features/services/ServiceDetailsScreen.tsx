import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchServiceDetailsAsync } from './servicesSlice';
import { useTheme } from '../../context/ThemeContext';
import { useTransition } from '../../hooks/useTransition';
import { RootStackParamList } from '../../types';

type ServiceDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ServiceDetails'>;

interface ServiceDetailsScreenProps {
  route: ServiceDetailsScreenRouteProp;
}

const ServiceDetailsScreen: React.FC<ServiceDetailsScreenProps> = ({ route }) => {
  const { serviceId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const { isPending, startTransition } = useTransition();
  const service = useSelector((state: RootState) => state.services.serviceDetails?.[serviceId]);
  const status = useSelector((state: RootState) => state.services.status);

  useEffect(() => {
    if (!service) {
      startTransition(() => {
        dispatch(fetchServiceDetailsAsync(serviceId));
      });
    }
  }, [dispatch, serviceId, service, startTransition]);

  if (status === 'loading' || isPending) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!service) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Não foi possível carregar os detalhes do serviço.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{service.name}</Text>
      <Text style={[styles.description, { color: theme.colors.secondaryText }]}>
        {service.description}
      </Text>
      <Text style={[styles.price, { color: theme.colors.primary }]}>
        R$ {service.price.toFixed(2)}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ServiceDetailsScreen;