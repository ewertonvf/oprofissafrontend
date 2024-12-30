import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { loginUser } from '../../features/auth/authSlice';
import { isValidEmail } from '../../utils/validation';
import CustomButton from '../../components/UI/CustomButton';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList, AuthStackParamList } from '../../types/navigationTypes';
import { Ionicons } from '@expo/vector-icons';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'> & 
                                 StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const authState = useAppSelector(state => state.auth);
  const { theme } = useTheme();

  useEffect(() => {
    console.log('Auth state atualizado:', authState);
  }, [authState]);

  const handleLogin = async () => {
    console.log('Tentando fazer login...');
    if (!isValidEmail(email) || password.length < 6) {
      Alert.alert('Erro', 'Por favor, insira um email válido e uma senha com pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      console.log('Login result:', result);
      console.log('Auth state após login:', authState);
      if (result && result.token) {
        console.log('Login bem-sucedido, navegando para Main');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        throw new Error('Login falhou');
      }
    } catch (error) {
      console.error('Erro de login:', error);
      Alert.alert('Erro de Login', 'Email ou senha incorretos. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.projectName, { color: theme.colors.primary }]}>OProfissa</Text>
      <Text style={[styles.tagline, { color: theme.colors.secondary }]}>todos os serviços que você busca em um só lugar</Text>
      <Text style={[styles.title, { color: theme.colors.primary }]}>Login</Text>
      <TextInput
        style={[styles.input, { 
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          color: theme.colors.text
        }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={theme.colors.secondaryText}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { 
            flex: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            color: theme.colors.text
          }]}
          placeholder="Senha"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={theme.colors.secondaryText}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={24}
            color={theme.colors.secondaryText}
          />
        </TouchableOpacity>
      </View>
      <CustomButton
        title="Entrar"
        onPress={handleLogin}
        isLoading={isLoading}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.registerLink, { color: theme.colors.secondary }]}>Não tem uma conta? Registre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  projectName: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  registerLink: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;