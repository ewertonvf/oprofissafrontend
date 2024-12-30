import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface ServiceBarProps {
  onSearch: (query: string) => void;
}

const ServiceBar: React.FC<ServiceBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

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
      />
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Ionicons name="search" size={24} color={theme.colors.primary} />
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

export default ServiceBar;