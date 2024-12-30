import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import ErrorBoundary from '@components/Layout/ErrorBoundary';
import { store } from './store';
import { ThemeProvider } from '@context/ThemeContext';
import RootNavigator from '@navigation/RootNavigator';
import LoadingSpinner from '@components/UI/LoadingSpinner';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const prepareApp = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      console.warn(e);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    prepareApp();
  }, [prepareApp]);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <Provider store={store}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <ThemeProvider>
          {isReady ? (
            <ErrorBoundary>
              <StatusBar style="auto" />
              <RootNavigator />
            </ErrorBoundary>
          ) : (
            <LoadingSpinner />
          )}
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}