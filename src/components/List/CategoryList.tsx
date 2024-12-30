import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

type Category = {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const categories: Category[] = [
  { id: 1, name: 'Limpeza', icon: 'brush' },
  { id: 2, name: 'Elétrica', icon: 'flash' },
  { id: 3, name: 'Encanamento', icon: 'water' },
  { id: 4, name: 'Pintura', icon: 'color-palette' },
  { id: 5, name: 'Jardinagem', icon: 'leaf' },
];

interface CategoryListProps {
  onSelectCategory: (category: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onSelectCategory }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text, marginBottom: theme.spacing.sm }]}>Categorias</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryItem, { backgroundColor: theme.colors.card, marginRight: theme.spacing.sm }]}
            onPress={() => onSelectCategory(category)}
          >
            <Ionicons name={category.icon} size={24} color={theme.colors.primary} />
            <Text style={[styles.categoryName, { color: theme.colors.text, marginTop: theme.spacing.xs }]}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    width: 100,
    height: 100,
  },
  categoryName: {
    textAlign: 'center',
  },
});

export default CategoryList;