import React, { ErrorInfo } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useTheme } from '../../context/ThemeContext';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("Uncaught error:", error, errorInfo);
    // Aqui você pode adicionar uma chamada para um serviço de log de erros
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorView error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface ErrorViewProps {
  error: Error | null;
  resetError: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({ error, resetError }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: theme.colors.error }]}>Oops! Algo deu errado.</Text>
      {error && (
        <Text style={[styles.errorMessage, { color: theme.colors.text }]}>
          {error.toString()}
        </Text>
      )}
      <Button title="Tentar Novamente" onPress={resetError} color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ErrorBoundary;