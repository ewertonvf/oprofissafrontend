// src/components/search/SearchFilters.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import Slider from "@react-native-community/slider";
import { useTheme } from '../../context/ThemeContext';


interface SearchFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: {
    category: string;
    maxPrice: number;
    minRating: number;
  }) => void;
}

const categories = [
  "Eletricista",
  "Encanador",
  "Pintor",
  "Marceneiro",
  "Diarista",
];

const SearchFilters: React.FC<SearchFiltersProps> = ({
  visible,
  onClose,
  onApply,
}) => {
  const { theme } = useTheme();
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);

  const applyFilters = () => {
    onApply({ category, maxPrice, minRating });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={[styles.filterContainer, { backgroundColor: theme.colors.card }]}>
          <ScrollView>
            <Text style={[styles.title, { color: theme.colors.text }]}>Filtros de Busca</Text>

            <Text style={[styles.label, { color: theme.colors.text }]}>Categoria</Text>
            <View style={styles.categoryButtons}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.selectedCategory,
                    { borderColor: theme.colors.border }
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={{ color: category === cat ? theme.colors.background : theme.colors.text }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: theme.colors.text }]}>Preço Máximo: R$ {maxPrice.toFixed(2)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1000}
              value={maxPrice}
              onValueChange={setMaxPrice}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.primary}
            />

            <Text style={[styles.label, { color: theme.colors.text }]}>
              Avaliação Mínima: {minRating.toFixed(1)} estrelas
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={5}
              step={0.5}
              value={minRating}
              onValueChange={setMinRating}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.primary}
            />

            <TouchableOpacity style={[styles.applyButton, { backgroundColor: theme.colors.primary }]} onPress={applyFilters}>
              <Text style={[styles.applyButtonText, { color: theme.colors.background }]}>Aplicar Filtros</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={[styles.closeButtonText, { color: theme.colors.primary }]}>Fechar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  filterContainer: {
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  categoryButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
  },
  selectedCategory: {
    backgroundColor: "#007bff",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  applyButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
  },
});

export default SearchFilters;