import { Trophy, Clock, TrendingUp, Calendar, Plus } from 'lucide-react';
import { useAchievements, useCategories } from '@/hooks/useInternshipData';
import { getThisWeekAchievements, getThisMonthAchievements, getTotalTimeSpent, getWeeklyTrend, getCategoryStats } from '@/lib/analytics';
import StatCard from '@/components/StatCard';
import AchievementCard from '@/components/AchievementCard';
import AchievementForm from '@/components/AchievementForm';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Achievement } from '@/types/internship';

export default function Dashboard() {
  const { achievements, addAchievement, updateAchievement, deleteAchievement } = useAchievements();
  const { categories } = useCategories();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | undefined>();

  const thisWeek = getThisWeekAchievements(achievements);
  const thisMonth = getThisMonthAchievements(achievements);
  const totalMinutes = getTotalTimeSpent(achievements);
  const weeklyTrend = getWeeklyTrend(achievements);
  const catStats = getCategoryStats(achievements);

  const pieData = Object.entries(catStats).map(([name, s]) => ({ name, value: s.count }));
  const colors = categories.map(c => c.color);

  const handleSave = (data: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editing) {
      updateAchievement(editing.id, data);
      setEditing(undefined);
    } else {
      addAchievement(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your internship progress</p>
        </div>
        <Button onClick={() => { setEditing(undefined); setFormOpen(true); }} size="sm">
          <Plus className="h-4 w-4 mr-1" /> New Achievement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={achievements.length} subtitle="achievements" icon={Trophy} />
        <StatCard label="This Week" value={thisWeek.length} subtitle="achievements" icon={Calendar} />
        <StatCard label="This Month" value={thisMonth.length} subtitle="achievements" icon={TrendingUp} />
        <StatCard label="Total Time" value={`${Math.round(totalMinutes / 60)}h`} subtitle={`${totalMinutes} minutes`} icon={Clock} />
      </div>

      {/* Charts */}
      {achievements.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="glass-card rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyTrend}>
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">By Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {pieData.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                  {d.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Recent Achievements</h3>
        {achievements.length === 0 ? (
          <div className="glass-card rounded-lg p-8 text-center">
            <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No achievements yet. Start tracking your progress!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {achievements.slice(0, 5).map(a => (
              <AchievementCard
                key={a.id}
                achievement={a}
                categories={categories}
                onEdit={a => { setEditing(a); setFormOpen(true); }}
                onDelete={deleteAchievement}
              />
            ))}
          </div>
        )}
      </div>

      <AchievementForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(undefined); }}
        onSave={handleSave}
        categories={categories}
        initial={editing}
      />
    </div>
  );
}
