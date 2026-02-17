import { useState, useEffect, useCallback } from "react";
import { Achievement, Category } from "@/types/internship";

const API = "/api";

//
// ACHIEVEMENTS
//
export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Fetch on load
  useEffect(() => {
    fetch(`${API}/achievements`)
      .then(res => res.json())
      .then(setAchievements)
      .catch(console.error);
  }, []);

  const addAchievement = useCallback(async (
    data: {
      title: string;
      description: string;
      date: string;
      category: string;
      tags: string[];
      notes: string;
      timeSpent: number;
      skills: string[];
    }
  ) => {
    const res = await fetch(`${API}/achievements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const created = await res.json();
    setAchievements(prev => [created, ...prev]);
    return created;
  }, []);

  const updateAchievement = useCallback(async (
    id: string,
    data: Partial<Achievement>
  ) => {
    const res = await fetch(`${API}/achievements/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const updated = await res.json();
    setAchievements(prev =>
      prev.map(a => (a._id === id ? updated : a))
    );
  }, []);

  const deleteAchievement = useCallback(async (id: string) => {
    await fetch(`${API}/achievements/${id}`, {
      method: "DELETE",
    });

    setAchievements(prev =>
      prev.filter(a => a._id !== id)
    );
  }, []);

  return { achievements, addAchievement, updateAchievement, deleteAchievement };
}

//
// CATEGORIES
//
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch(`${API}/categories`)
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const addCategory = useCallback(async (
    data: Omit<Category, "id">
  ) => {
    const res = await fetch(`${API}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const created = await res.json();
    setCategories(prev => [...prev, created]);
    return created;
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await fetch(`${API}/categories/${id}`, {
      method: "DELETE",
    });

    setCategories(prev =>
      prev.filter(c => c._id !== id)
    );
  }, []);

  return { categories, addCategory, deleteCategory };
}
