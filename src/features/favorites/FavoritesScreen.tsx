import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../types/storeTypes'; // Ajuste o caminho conforme necessário
import { fetchFavorites, removeFavorite } from './favoritesSlice';
import { Service } from '../../types/serviceTypes'; // Ajuste o caminho conforme necessário
import { useTheme } from '../../context/ThemeContext'; // Atualização do caminho de importação
import { useTransition } from '../../hooks/useTransition'; // Ajuste o caminho conforme necessário
import { RootStackParamList } from '../../types/navigationTypes'; // Ajuste o caminho conforme necessário


type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ServiceDetails'>;

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
  const { theme } = useTheme();
  const { isPending, startTransition } = useTransition();

  useEffect(() => {
    if (userId) {
      startTransition(() => {
        dispatch(fetchFavorites(userId));
      });
    }
  }, [dispatch, userId, startTransition]);

  const renderFavoriteItem = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={[styles.favoriteItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('ServiceDetails', { serviceId: item._id })}
    >
      <View>
        <Text style={[styles.serviceName, { color: theme.colors.text }]}>{item.name}</Text>
        <Text style={[styles.servicePrice, { color: theme.colors.secondaryText }]}>R$ {item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={[styles.removeButton, { backgroundColor: theme.colors.error }]}
        onPress={() => {
          if (userId) {
            startTransition(() => {
              dispatch(removeFavorite({ userId, serviceId: item._id }));
            });
          }
        }}
        disabled={isPending}
      >
        <Text style={[styles.removeButtonText, { color: theme.colors.white }]}>Remover</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Meus Favoritos</Text>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={[styles.emptyText, { color: theme.colors.secondaryText }]}>Você ainda não tem favoritos.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    flexGrow: 1,
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  servicePrice: {
    fontSize: 16,
  },
  removeButton: {
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FavoritesScreen;