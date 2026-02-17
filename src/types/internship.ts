export interface Achievement {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  notes: string;
  timeSpent?: number; // in minutes
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface WeeklyReflection {
  id: string;
  weekStart: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { _id: 'backend', name: 'Backend', color: 'hsl(220, 70%, 55%)' },
  { _id: 'frontend', name: 'Frontend', color: 'hsl(172, 60%, 45%)' },
  { _id: 'devops', name: 'DevOps', color: 'hsl(280, 55%, 60%)' },
  { _id: 'research', name: 'Research', color: 'hsl(35, 85%, 60%)' },
  { _id: 'meetings', name: 'Meetings', color: 'hsl(340, 60%, 60%)' },
  { _id: 'learning', name: 'Learning', color: 'hsl(152, 55%, 45%)' },
];

export const CATEGORY_COLORS: Record<string, string> = {
  'hsl(220, 70%, 55%)': 'bg-chart-1',
  'hsl(172, 60%, 45%)': 'bg-chart-2',
  'hsl(280, 55%, 60%)': 'bg-chart-3',
  'hsl(35, 85%, 60%)': 'bg-chart-4',
  'hsl(340, 60%, 60%)': 'bg-chart-5',
  'hsl(152, 55%, 45%)': 'bg-success',
};
