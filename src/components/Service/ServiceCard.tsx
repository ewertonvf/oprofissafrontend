import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import StarRating from '../UI/StarRating';
import { useTheme } from '../../context/ThemeContext';
import { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
  onPress: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.colors.card, padding: theme.spacing.md }]} 
      onPress={() => onPress(service)}
    >
      <Image source={{ uri: service.images[0] }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{service.name}</Text>
        <Text style={[styles.price, { color: theme.colors.secondaryText }]}>
          R$ {service.price.toFixed(2)}
        </Text>
        <StarRating rating={service.rating || 0} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default React.memo(ServiceCard);