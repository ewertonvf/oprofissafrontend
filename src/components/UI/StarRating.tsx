import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface StarRatingProps {
  rating: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 20 }) => {
  const { theme } = useTheme();
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <View style={styles.container}>
      {[...Array(5)].map((_, index) => (
        <Ionicons
          key={index}
          name={
            index < fullStars
              ? 'star'
              : index === fullStars && hasHalfStar
              ? 'star-half'
              : 'star-outline'
          }
          size={size}
          color={theme.colors.warning}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default StarRating;