import { Achievement, Category } from '@/types/internship';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  achievement: Achievement;
  categories: Category[];
  onEdit: (a: Achievement) => void;
  onDelete: (id: string) => void;
}

export default function AchievementCard({ achievement, categories, onEdit, onDelete }: Props) {
  const cat = categories.find(c => c.name === achievement.category);

  return (
    <div className="group glass-card rounded-lg p-4 hover:border-primary/30 transition-all animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {cat && (
              <span
                className="inline-block h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
            )}
            <h3 className="text-sm font-semibold text-foreground truncate">{achievement.title}</h3>
          </div>
          {achievement.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{achievement.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span>{format(parseISO(achievement.date), 'MMM d, yyyy')}</span>
            <span className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">{achievement.category}</span>
            {achievement.timeSpent && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {achievement.timeSpent}m
              </span>
            )}
          </div>
          {achievement.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {achievement.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">
                  <Tag className="h-2.5 w-2.5" />{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={() => onEdit(achievement)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onDelete(achievement.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
