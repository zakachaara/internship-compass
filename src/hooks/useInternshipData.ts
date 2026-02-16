import { useState, useEffect, useCallback } from 'react';
import { Achievement, Category, DEFAULT_CATEGORIES } from '@/types/internship';

const STORAGE_KEYS = {
  achievements: 'internship_achievements',
  categories: 'internship_categories',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(() =>
    loadFromStorage(STORAGE_KEYS.achievements, [])
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.achievements, achievements);
  }, [achievements]);

  const addAchievement = useCallback((data: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const achievement: Achievement = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setAchievements(prev => [achievement, ...prev]);
    return achievement;
  }, []);

  const updateAchievement = useCallback((id: string, data: Partial<Achievement>) => {
    setAchievements(prev =>
      prev.map(a => a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a)
    );
  }, []);

  const deleteAchievement = useCallback((id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  }, []);

  return { achievements, addAchievement, updateAchievement, deleteAchievement };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() =>
    loadFromStorage(STORAGE_KEYS.categories, DEFAULT_CATEGORIES)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.categories, categories);
  }, [categories]);

  const addCategory = useCallback((data: Omit<Category, 'id'>) => {
    const category: Category = { ...data, id: crypto.randomUUID() };
    setCategories(prev => [...prev, category]);
    return category;
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  return { categories, addCategory, deleteCategory };
}
