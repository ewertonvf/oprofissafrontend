import React, { Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import ServiceDetailsScreen from '../features/services/ServiceDetailsScreen';
import EditProfileScreen from '../features/profile/EditProfileScreen';
import SearchScreen from '../features/search/SearchScreen';
import FavoritesScreen from '../features/favorites/FavoritesScreen';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { RootStackParamList } from '../types';
import AvailableProvidersScreen from '../features/services/AvailableProvidersScreen';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={TabNavigatorWrapper} />
            <Stack.Screen name="ServiceDetails" component={ServiceDetailsWrapper} />
            <Stack.Screen name="AvailableProviders" component={AvailableProvidersWrapper} />
            <Stack.Screen name="EditProfile" component={EditProfileWrapper} />
            <Stack.Screen name="Search" component={SearchWrapper} />
            <Stack.Screen name="Favorites" component={FavoritesWrapper} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigatorWrapper} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AuthNavigatorWrapper = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <AuthNavigator />
  </Suspense>
);

const TabNavigatorWrapper = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <TabNavigator />
  </Suspense>
);

const ServiceDetailsWrapper = ({ route }: { route: any }) => (
  <Suspense fallback={<LoadingSpinner />}>
    <ServiceDetailsScreen route={route} />
  </Suspense>
);

const AvailableProvidersWrapper = ({ route }: { route: any }) => (
  <Suspense fallback={<LoadingSpinner />}>
    <AvailableProvidersScreen route={route} />
  </Suspense>
);

const EditProfileWrapper = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <EditProfileScreen />
  </Suspense>
);

const SearchWrapper = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <SearchScreen />
  </Suspense>
);

const FavoritesWrapper = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <FavoritesScreen />
  </Suspense>
);

export default RootNavigator;