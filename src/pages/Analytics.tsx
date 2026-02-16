import { useAchievements, useCategories } from '@/hooks/useInternshipData';
import { getWeeklyTrend, getCategoryStats, getSkillFrequency, getTotalTimeSpent } from '@/lib/analytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

export default function Analytics() {
  const { achievements } = useAchievements();
  const { categories } = useCategories();

  const weeklyTrend = getWeeklyTrend(achievements, 12);
  const catStats = getCategoryStats(achievements);
  const topSkills = getSkillFrequency(achievements);
  const totalMinutes = getTotalTimeSpent(achievements);

  const pieData = Object.entries(catStats).map(([name, s]) => ({ name, count: s.count, hours: Math.round(s.timeSpent / 60 * 10) / 10 }));
  const colors = categories.map(c => c.color);

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: '12px',
  };

  if (achievements.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground text-center py-12">Add some achievements to see analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Analytics</h1>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Weekly trend */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Activity Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyTrend}>
              <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="count" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hours per week */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Hours Per Week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyTrend}>
              <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="hours" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category distribution */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {pieData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {pieData.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                {d.name} ({d.count})
              </span>
            ))}
          </div>
        </div>

        {/* Top skills */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Skills</h3>
          {topSkills.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Add skills to achievements to see them here.</p>
          ) : (
            <div className="space-y-2">
              {topSkills.map(([skill, count]) => (
                <div key={skill} className="flex items-center gap-3">
                  <span className="text-xs text-foreground w-24 truncate">{skill}</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(count / topSkills[0][1]) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
