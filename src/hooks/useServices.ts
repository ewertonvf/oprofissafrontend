import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchServicesAsync } from '../features/services/servicesSlice';
import { Service } from '../types';
import Fuse from 'fuse.js';

export const useServices = () => {
  const dispatch: AppDispatch = useDispatch();
  const { services, status, error } = useSelector((state: RootState) => state.services);
  const [searchResults, setSearchResults] = useState<Service[]>([]);

  const loadServices = useCallback(() => {
    dispatch(fetchServicesAsync());
  }, [dispatch]);

  const searchServices = useCallback((query: string) => {
    const fuse = new Fuse(services, {
      keys: ['name', 'description', 'category'],
      threshold: 0.3,
    });
    const results = fuse.search(query);
    setSearchResults(results.map(result => result.item));
  }, [services]);

  return {
    services,
    searchResults,
    status,
    error,
    loadServices,
    searchServices,
  };
};