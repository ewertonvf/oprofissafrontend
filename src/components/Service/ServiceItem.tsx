import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from '../../context/ThemeContext';
import { Service } from '../../types';

interface ServiceItemProps {
  service: Service;
  onPress: (serviceId: string) => void;
}

const ServiceItem: React.FC<ServiceItemProps> = React.memo(
  ({ service, onPress }) => {
    const { theme } = useTheme();

    return (
      <TouchableOpacity
        style={[styles.container, { borderBottomColor: theme.colors.border }]}
        onPress={() => onPress(service._id)}
      >
        <Image source={{ uri: service.images[0] }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{service.name}</Text>
          <Text style={[styles.description, { color: theme.colors.text }]}>{service.description}</Text>
          <Text style={[styles.price, { color: theme.colors.text }]}>R$ {service.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
});

export default ServiceItem;