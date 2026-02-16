import { Achievement } from '@/types/internship';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO, format, eachWeekOfInterval, subWeeks } from 'date-fns';

export function getAchievementsByDateRange(achievements: Achievement[], start: Date, end: Date) {
  return achievements.filter(a => {
    const date = parseISO(a.date);
    return isWithinInterval(date, { start, end });
  });
}

export function getThisWeekAchievements(achievements: Achievement[]) {
  const now = new Date();
  return getAchievementsByDateRange(achievements, startOfWeek(now, { weekStartsOn: 1 }), endOfWeek(now, { weekStartsOn: 1 }));
}

export function getThisMonthAchievements(achievements: Achievement[]) {
  const now = new Date();
  return getAchievementsByDateRange(achievements, startOfMonth(now), endOfMonth(now));
}

export function getCategoryStats(achievements: Achievement[]) {
  const stats: Record<string, { count: number; timeSpent: number }> = {};
  achievements.forEach(a => {
    if (!stats[a.category]) stats[a.category] = { count: 0, timeSpent: 0 };
    stats[a.category].count++;
    stats[a.category].timeSpent += a.timeSpent || 0;
  });
  return stats;
}

export function getWeeklyTrend(achievements: Achievement[], weeks = 8) {
  const now = new Date();
  const start = subWeeks(startOfWeek(now, { weekStartsOn: 1 }), weeks - 1);
  const weekStarts = eachWeekOfInterval({ start, end: now }, { weekStartsOn: 1 });

  return weekStarts.map(weekStart => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const weekAchievements = getAchievementsByDateRange(achievements, weekStart, weekEnd);
    const totalTime = weekAchievements.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
    return {
      week: format(weekStart, 'MMM d'),
      count: weekAchievements.length,
      hours: Math.round(totalTime / 60 * 10) / 10,
    };
  });
}

export function getSkillFrequency(achievements: Achievement[]) {
  const freq: Record<string, number> = {};
  achievements.forEach(a => {
    a.skills.forEach(s => {
      freq[s] = (freq[s] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
}

export function getTotalTimeSpent(achievements: Achievement[]) {
  return achievements.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
}

export function exportToJSON(achievements: Achievement[]) {
  const blob = new Blob([JSON.stringify(achievements, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'internship-data.json');
}

export function exportToCSV(achievements: Achievement[]) {
  const headers = ['Title', 'Description', 'Date', 'Category', 'Tags', 'Time Spent (min)', 'Skills', 'Notes'];
  const rows = achievements.map(a => [
    a.title, a.description, a.date, a.category,
    a.tags.join('; '), String(a.timeSpent || ''), a.skills.join('; '), a.notes,
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, 'internship-data.csv');
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
