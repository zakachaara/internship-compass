import { useAchievements, useCategories } from '@/hooks/useInternshipData';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Timeline() {
  const { achievements } = useAchievements();
  const { categories } = useCategories();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1));

  const getAchievementsForDay = (day: Date) =>
    achievements.filter(a => isSameDay(parseISO(a.date), day));

  // Pad start of calendar
  const startDay = monthStart.getDay() || 7; // Mon=1
  const padDays = startDay - 1;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Timeline</h1>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
        <span className="text-sm font-semibold text-foreground">{format(currentMonth, 'MMMM yyyy')}</span>
        <Button variant="outline" size="sm" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="text-[10px] text-muted-foreground text-center py-1 font-medium">{d}</div>
        ))}
        {Array.from({ length: padDays }).map((_, i) => <div key={`pad-${i}`} />)}
        {days.map(day => {
          const dayAch = getAchievementsForDay(day);
          const isToday = isSameDay(day, new Date());
          return (
            <div key={day.toISOString()} className={cn(
              "min-h-[80px] rounded-md border border-border/50 p-1.5 text-[10px]",
              isToday && "border-primary/50 bg-primary/5",
              dayAch.length > 0 && "bg-card"
            )}>
              <span className={cn("font-medium", isToday ? "text-primary" : "text-muted-foreground")}>
                {format(day, 'd')}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayAch.slice(0, 3).map(a => {
                  const cat = categories.find(c => c.name === a.category);
                  return (
                    <div key={a.id} className="flex items-center gap-1 truncate">
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: cat?.color ?? 'hsl(var(--muted-foreground))' }} />
                      <span className="truncate text-foreground">{a.title}</span>
                    </div>
                  );
                })}
                {dayAch.length > 3 && (
                  <span className="text-muted-foreground">+{dayAch.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
