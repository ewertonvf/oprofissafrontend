import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch } from 'react-redux';
import { searchServicesAsync } from '../../features/search/searchSlice';
import { AppDispatch } from '../../store';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, MainTabParamList } from '../../types';
import { useTransition } from '../../hooks/useTransition';

type SearchScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Search'>,
  StackNavigationProp<RootStackParamList>
>;

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { isPending, startTransition } = useTransition();

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      startTransition(() => {
        dispatch(searchServicesAsync({ query: searchQuery.trim(), filters: {} }));
        
        if (onSearch) {
          onSearch(searchQuery.trim());
        } else {
          navigation.navigate('Main', { screen: 'Search', params: { query: searchQuery } } as never);
        }
      });
    }
  }, [searchQuery, dispatch, onSearch, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <TextInput
        style={[styles.input, { color: theme.colors.text }]}
        placeholder="Buscar serviços..."
        placeholderTextColor={theme.colors.secondaryText}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        editable={!isPending}
      />
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton} disabled={isPending}>
        <Ionicons name="search" size={24} color={isPending ? theme.colors.secondaryText : theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
  },
  searchButton: {
    padding: 10,
  },
});

export default SearchBar;