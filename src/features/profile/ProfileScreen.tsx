import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector, useAppDispatch } from '../../hooks/useAuth';
import { logoutUser } from '../../features/auth/authSlice';
import { useTheme } from '../../context/ThemeContext';
import { useTransition } from '../../hooks/useTransition';
import { RootStackParamList } from '../../types';
import CustomButton from '../../components/UI/CustomButton';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const user = useAppSelector(state => state.profile.userProfile);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { theme } = useTheme();
  const { isPending } = useTransition();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      navigation.navigate('Auth', { screen: 'Login' });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, navigation]);

  const handleEditProfile = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  const handleViewFavorites = useCallback(() => {
    navigation.navigate('Main', { screen: 'Favorites' });
  }, [navigation]);

  const handleViewBookings = useCallback(() => {
    Alert.alert('Agendamentos', 'Funcionalidade de visualização de agendamentos a ser implementada.');
  }, []);

  if (!user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Perfil</Text>
      <View style={[styles.infoContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Nome:</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>{user.name}</Text>
        <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Email:</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>{user.email}</Text>
        <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Telefone:</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>{user.phone}</Text>
      </View>

      <CustomButton
        title="Editar Perfil"
        onPress={handleEditProfile}
        style={styles.button}
      />

      <CustomButton
        title="Meus Favoritos"
        onPress={handleViewFavorites}
        style={styles.button}
      />

      <CustomButton
        title="Meus Agendamentos"
        onPress={handleViewBookings}
        style={styles.button}
      />

      <CustomButton
        title="Sair"
        onPress={handleLogout}
        style={{ ...styles.logoutButton, backgroundColor: theme.colors.error }}
        isLoading={isLoggingOut || isPending}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 20,
  } as ViewStyle,
});

export default ProfileScreen;