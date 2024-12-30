import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector, useAppDispatch } from '../../hooks/useAuth';
import { updateUserProfileThunk } from '../../features/profile/profileSlice';
import { useTheme } from '../../context/ThemeContext';
import { useTransition } from '../../hooks/useTransition';
import { RootStackParamList } from '../../types';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC = () => {
  const user = useAppSelector(state => state.profile.userProfile);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { theme } = useTheme();
  const { isPending, startTransition } = useTransition();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }
    startTransition(async () => {
      try {
        await dispatch(updateUserProfileThunk({ userId: user._id, userData: { name, email, phone } })).unwrap();
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        navigation.goBack();
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
      }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Editar Perfil</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text }]}
        placeholder="Nome"
        placeholderTextColor={theme.colors.secondaryText}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text }]}
        placeholder="Email"
        placeholderTextColor={theme.colors.secondaryText}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text }]}
        placeholder="Telefone"
        placeholderTextColor={theme.colors.secondaryText}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TouchableOpacity 
        style={[styles.saveButton, { backgroundColor: theme.colors.primary }]} 
        onPress={handleSave} 
        disabled={isPending}
      >
        <Text style={[styles.saveButtonText, { color: theme.colors.white }]}>Salvar Alterações</Text>
      </TouchableOpacity>
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
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  saveButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;