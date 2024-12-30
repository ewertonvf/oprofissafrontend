import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash/debounce';
import SearchFilters from '../../components/search/SearchFilters';
import {
  searchServicesAsync,
  searchMoreServicesAsync,
} from '../../features/search/searchSlice';
import { RootState, AppDispatch } from '../../store';
import { Service, RootStackParamList, SearchFilters as SearchFiltersType } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTransition } from '../../hooks/useTransition';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [showFilters, setShowFilters] = useState(false);
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { searchResults, status, error, hasMore } = useSelector(
    (state: RootState) => state.search
  );
  const { theme } = useTheme();
  const { isPending, startTransition } = useTransition();

  const debouncedSearch = useCallback(
    debounce((query: string, searchFilters: SearchFiltersType) => {
      startTransition(() => {
        dispatch(searchServicesAsync({ query, filters: searchFilters }));
      });
    }, 300),
    [dispatch, startTransition]
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery, filters);
    }
  }, [debouncedSearch, searchQuery, filters]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      startTransition(() => {
        dispatch(searchServicesAsync({ query: searchQuery, filters }));
      });
    }
  }, [dispatch, searchQuery, filters, startTransition]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && status !== 'loading' && !isPending) {
      startTransition(() => {
        dispatch(searchMoreServicesAsync({ query: searchQuery, filters }));
      });
    }
  }, [dispatch, hasMore, status, searchQuery, filters, isPending, startTransition]);

  const renderSearchItem = useCallback(({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.searchItem}
      onPress={() => navigation.navigate('ServiceDetails', { serviceId: item._id })}
    >
      <Text style={[styles.itemTitle, { color: theme.colors.text }]}>{item.name}</Text>
      <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>
        R$ {item.price.toFixed(2)}
      </Text>
    </TouchableOpacity>
  ), [theme.colors, navigation]);

  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }, [hasMore, theme.colors.primary]);

  const handleApplyFilters = useCallback((newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    setShowFilters(false);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        style={[styles.searchInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
        placeholder="Buscar serviços..."
        placeholderTextColor={theme.colors.secondaryText}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity
        style={[styles.filterButton, { backgroundColor: theme.colors.surface }]}
        onPress={() => setShowFilters(true)}
      >
        <Text style={{ color: theme.colors.text }}>Filtros</Text>
      </TouchableOpacity>
      {status === 'failed' && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      )}
      <FlatList
        data={searchResults}
        renderItem={renderSearchItem}
        keyExtractor={(item) => item._id}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      <SearchFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  searchItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
  },
  loadingFooter: {
    paddingVertical: 20,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default SearchScreen;