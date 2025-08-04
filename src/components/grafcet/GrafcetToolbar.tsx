import { Save, FolderOpen, Image, Grid, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface GrafcetToolbarProps {
  onSave: () => void;
  onLoad: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportImage: () => void;
  snapGrid: number;
  onSnapGridChange: (value: number) => void;
  manualTransitionPlacement: boolean;
  onManualTransitionPlacementChange: (value: boolean) => void;
}

export const GrafcetToolbar = ({
  onSave,
  onLoad,
  onExportImage,
  snapGrid,
  onSnapGridChange,
  manualTransitionPlacement,
  onManualTransitionPlacementChange,
}: GrafcetToolbarProps) => {
  return (
    <div className="h-12 bg-toolbar-bg border-b border-border flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-semibold text-foreground">Éditeur GRAFCET</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          className="h-8"
        >
          <Save className="w-4 h-4 mr-1" />
          Enregistrer
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="h-8 relative overflow-hidden"
        >
          <FolderOpen className="w-4 h-4 mr-1" />
          Ouvrir
          <input
            type="file"
            accept=".json"
            onChange={onLoad}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onExportImage}
          className="h-8"
        >
          <Image className="w-4 h-4 mr-1" />
          Exporter PNG
        </Button>
        
        <div className="w-px h-6 bg-border"></div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Settings className="w-4 h-4 mr-1" />
              Grille
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="snap-grid">Pas de la grille (px)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="snap-grid"
                    type="number"
                    min="5"
                    max="50"
                    step="5"
                    value={snapGrid}
                    onChange={(e) => onSnapGridChange(parseInt(e.target.value))}
                    className="h-8"
                  />
                  <span className="text-sm text-muted-foreground">px</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <Grid className="w-3 h-3 inline mr-1" />
                Magnétisme automatique sur la grille
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center space-x-2 pl-2 border-l border-border">
          <Label htmlFor="transition-placement" className="text-sm">
            Placement transitions
          </Label>
          <Switch
            id="transition-placement"
            checked={manualTransitionPlacement}
            onCheckedChange={onManualTransitionPlacementChange}
          />
          <span className="text-sm text-muted-foreground">
            {manualTransitionPlacement ? 'Manuel' : 'Auto'}
          </span>
        </div>
      </div>
    </div>
  );
};
