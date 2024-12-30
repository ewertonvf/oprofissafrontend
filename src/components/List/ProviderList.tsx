import React from "react";
import { FlatList, Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { useTheme } from '../../context/ThemeContext';

interface Provider {
  _id: string;
  name: string;
  rating: number;
}

interface ProviderListProps {
  providers: Provider[];
  onSelectProvider: (provider: Provider) => void;
}

const ProviderList: React.FC<ProviderListProps> = ({
  providers,
  onSelectProvider,
}) => {
  const { theme } = useTheme();

  const renderProviderItem = ({ item }: { item: Provider }) => (
    <TouchableOpacity
      style={[styles.providerItem, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}
      onPress={() => onSelectProvider(item)}
      activeOpacity={0.7}
    >
      <View>
        <Text style={[styles.providerName, { color: theme.colors.text }]}>{item.name}</Text>
        <Text style={[styles.providerRating, { color: theme.colors.secondaryText }]}>
          Avaliação: {item.rating.toFixed(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={providers}
      keyExtractor={(item) => item._id}
      renderItem={renderProviderItem}
      contentContainerStyle={{ paddingHorizontal: theme.spacing.md }}
    />
  );
};

const styles = StyleSheet.create({
  providerItem: {
    padding: 15,
    borderBottomWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  providerRating: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default ProviderList;