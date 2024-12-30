import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Review } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { fetchServiceReviewsAsync } from '../../features/services/servicesSlice';
import { AppDispatch } from '../../store';

interface ReviewListProps {
  serviceId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ serviceId }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector((state: RootState) => state.services.currentService?.reviews || []);

  useEffect(() => {
    if (serviceId) {
      dispatch(fetchServiceReviewsAsync(serviceId));
    }
  }, [dispatch, serviceId]);

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={[styles.reviewItem, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.reviewAuthor, { color: theme.colors.text }]}>{item.userId}</Text>
      <Text style={[styles.reviewRating, { color: theme.colors.text }]}>Rating: {item.rating}</Text>
      <Text style={[styles.reviewComment, { color: theme.colors.text }]}>{item.comment}</Text>
    </View>
  );

  return (
    <FlatList
      data={reviews}
      renderItem={renderReviewItem}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>No reviews yet.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  reviewItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reviewRating: {
    marginBottom: 5,
  },
  reviewComment: {},
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ReviewList;