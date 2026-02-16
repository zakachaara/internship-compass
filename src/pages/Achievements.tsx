import { useState } from 'react';
import { useAchievements, useCategories } from '@/hooks/useInternshipData';
import AchievementCard from '@/components/AchievementCard';
import AchievementForm from '@/components/AchievementForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { Achievement } from '@/types/internship';

export default function Achievements() {
  const { achievements, addAchievement, updateAchievement, deleteAchievement } = useAchievements();
  const { categories } = useCategories();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | undefined>();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const filtered = achievements.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = filterCat === 'all' || a.category === filterCat;
    return matchSearch && matchCat;
  });

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
        <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
        <Button onClick={() => { setEditing(undefined); setFormOpen(true); }} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9" />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No achievements found</p>
        ) : (
          filtered.map(a => (
            <AchievementCard key={a.id} achievement={a} categories={categories}
              onEdit={a => { setEditing(a); setFormOpen(true); }} onDelete={deleteAchievement} />
          ))
        )}
      </div>

      <AchievementForm open={formOpen} onClose={() => { setFormOpen(false); setEditing(undefined); }}
        onSave={handleSave} categories={categories} initial={editing} />
    </div>
  );
}
