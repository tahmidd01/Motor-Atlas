import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { cars } from '../../data/catalog';
import { readStoredIds, validIds, writeStoredIds } from './storage';

const allowed = new Set(cars.map((c) => c.id));
const FAVORITES = 'motor-atlas:collection:v1';
const COMPARE = 'motor-atlas:compare:v1';
interface Garage {
  favorites: string[];
  comparison: string[];
  toggleFavorite: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  setComparison: (ids: string[]) => void;
  notice: string;
  notify: (message: string) => void;
}
const GarageContext = createContext<Garage | null>(null);
export function GarageProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState(() => readStoredIds(FAVORITES, allowed));
  const [comparison, setComparisonState] = useState(() => readStoredIds(COMPARE, allowed, 4));
  const [notice, setNotice] = useState('');
  const notify = useCallback((message: string) => setNotice(message), []);
  const setComparison = useCallback(
    (ids: string[]) => setComparisonState(validIds(ids, allowed, 4)),
    [],
  );
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 3600);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    if (!writeStoredIds(FAVORITES, favorites))
      notify('Storage is unavailable. Your collection will last for this session.');
  }, [favorites, notify]);
  useEffect(() => {
    writeStoredIds(COMPARE, comparison);
  }, [comparison]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === FAVORITES) setFavorites(readStoredIds(FAVORITES, allowed));
      if (event.key === COMPARE) setComparisonState(readStoredIds(COMPARE, allowed, 4));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const toggleFavorite = (id: string) => {
    if (!allowed.has(id)) return;
    const exists = favorites.includes(id);
    setFavorites((previous) => (exists ? previous.filter((x) => x !== id) : [...previous, id]));
    notify(exists ? 'Removed from your collection' : 'Saved to your collection');
  };
  const toggleCompare = (id: string) => {
    if (!allowed.has(id)) return;
    if (comparison.includes(id)) {
      setComparisonState((previous) => previous.filter((x) => x !== id));
      return;
    }
    if (comparison.length >= 4) {
      notify('Your comparison holds four cars. Remove one to add another.');
      return;
    }
    setComparisonState((previous) => [...previous, id]);
    notify('Added to comparison');
  };
  return (
    <GarageContext.Provider
      value={{
        favorites,
        comparison,
        toggleFavorite,
        toggleCompare,
        clearCompare: () => setComparisonState([]),
        setComparison,
        notice,
        notify,
      }}
    >
      {children}
    </GarageContext.Provider>
  );
}
export function useGarage() {
  const value = useContext(GarageContext);
  if (!value) throw new Error('Garage provider is missing');
  return value;
}
