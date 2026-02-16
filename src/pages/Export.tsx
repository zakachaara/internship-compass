import { useAchievements } from '@/hooks/useInternshipData';
import { exportToJSON, exportToCSV } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';

export default function Export() {
  const { achievements } = useAchievements();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Export Data</h1>
      <p className="text-sm text-muted-foreground">Export your internship data for report preparation.</p>

      <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
        <div className="glass-card rounded-lg p-6 text-center space-y-3">
          <FileJson className="h-8 w-8 text-primary mx-auto" />
          <h3 className="text-sm font-semibold text-foreground">JSON Export</h3>
          <p className="text-xs text-muted-foreground">Full data with all fields</p>
          <Button size="sm" onClick={() => exportToJSON(achievements)} disabled={achievements.length === 0}>
            <Download className="h-3.5 w-3.5 mr-1" /> Download
          </Button>
        </div>
        <div className="glass-card rounded-lg p-6 text-center space-y-3">
          <FileSpreadsheet className="h-8 w-8 text-accent mx-auto" />
          <h3 className="text-sm font-semibold text-foreground">CSV Export</h3>
          <p className="text-xs text-muted-foreground">Spreadsheet-compatible</p>
          <Button size="sm" variant="outline" onClick={() => exportToCSV(achievements)} disabled={achievements.length === 0}>
            <Download className="h-3.5 w-3.5 mr-1" /> Download
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-lg p-4 max-w-lg">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">{achievements.length}</strong> achievements ready to export.
        </p>
      </div>
    </div>
  );
}
