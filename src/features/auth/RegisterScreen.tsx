import React, { useState, useCallback } from 'react';
import { Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch } from '../../hooks/useAuth';
import { registerUser } from '../../features/auth/authSlice';
import CustomButton from '../../components/UI/CustomButton';
import { lightTheme as theme } from '../../config/theme';
import { AuthStackParamList } from '../../types';
import { isValidEmail, isValidPhone } from '../../utils/validation';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useAppDispatch();

  const handleRegister = useCallback(async () => {
    if (!name.trim() || !isValidEmail(email) || !isValidPhone(phone) || password.length < 6 || password !== confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(registerUser({ name, email, phone, password })).unwrap();
      console.log('Register result:', result);
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      console.error('Erro de registro:', error);
      Alert.alert('Erro de Cadastro', 'Não foi possível realizar o cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, name, email, phone, password, confirmPassword, navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
           <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <CustomButton
        title="Registrar"
        onPress={handleRegister}
        isLoading={isLoading}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.primary,
  },
  input: {
    height: 50,
    borderColor: theme.colors.border,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.surface,
  },
  loginLink: {
    color: theme.colors.secondary,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RegisterScreen;