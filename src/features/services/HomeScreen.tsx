import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from "@react-navigation/stack";
import SearchBar from '../../components/UI/SearchBar';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServicesAsync } from '../../features/services/servicesSlice';
import { RootState, AppDispatch } from '../../store';
import { Service, RootStackParamList, MainTabParamList } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTransition } from '../../hooks/useTransition';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { services, status, error, hasMore } = useSelector(
    (state: RootState) => state.services
  );
  const { theme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isPending, startTransition } = useTransition();

  const loadServices = useCallback(async () => {
    if (status === "idle") {
      startTransition(() => {
        dispatch(fetchServicesAsync());
      });
    }
  }, [dispatch, status, startTransition]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(fetchServicesAsync());
    setIsRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (hasMore && status !== "loading" && !isPending) {
      startTransition(() => {
        dispatch(fetchServicesAsync());
      });
    }
  };

  const handleSearch = (query: string) => {
    navigation.navigate('Search', { query } as never);
  };

  const renderServiceItem = useCallback(({ item }: { item: Service }) => (
    <TouchableOpacity
      style={[styles.serviceItem, { backgroundColor: theme.colors.surface }]}
      onPress={() =>
        navigation.navigate("ServiceDetails", { serviceId: item._id })
      }
    >
      <Text style={[styles.serviceName, { color: theme.colors.text }]}>{item.name}</Text>
      <Text style={[styles.servicePrice, { color: theme.colors.secondaryText }]}>R$ {item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  ), [navigation, theme]);

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  };

  if (status === "failed") {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.colors.primary }]} onPress={loadServices}>
          <Text style={[styles.retryButtonText, { color: theme.colors.white }]}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SearchBar onSearch={handleSearch} />
      <Text style={[styles.title, { color: theme.colors.text }]}>Serviços Disponíveis</Text>
      {services.length > 0 ? (
        <FlatList
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <Text style={[styles.noServicesText, { color: theme.colors.secondaryText }]}>
          Nenhum serviço disponível no momento.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  serviceItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  servicePrice: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    },
    noServicesText: {
      fontSize: 16,
      textAlign: "center",
    },
    retryButton: {
      padding: 10,
      borderRadius: 5,
    },
    retryButtonText: {
      fontSize: 16,
    },
    footer: {
      paddingVertical: 20,
      alignItems: "center",
    },
  });
  
  export default HomeScreen;