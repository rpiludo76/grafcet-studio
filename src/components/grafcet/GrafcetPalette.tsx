import { Circle, Square, Zap } from 'lucide-react';

interface PaletteItemProps {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const PaletteItem = ({ type, label, icon, description }: PaletteItemProps) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="flex items-center p-3 rounded-lg bg-card border-2 border-dashed border-border hover:border-primary cursor-grab active:cursor-grabbing transition-colors group"
      draggable
      onDragStart={(event) => onDragStart(event, type)}
    >
      <div className="flex-shrink-0 p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {icon}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export const GrafcetPalette = () => {
  return (
    <div className="w-64 bg-palette-bg border-r border-border p-4 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Square className="w-4 h-4 mr-2" />
            Palette d'objets
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Glissez-déposez les objets sur la zone de création
          </p>
        </div>
        
        <div className="space-y-3">
          <PaletteItem
            type="initialStep"
            label="Étape initiale"
            icon={<Circle className="w-5 h-5" />}
            description="Point de départ du GRAFCET"
          />
          
          <PaletteItem
            type="step"
            label="Étape"
            icon={<Square className="w-5 h-5" />}
            description="Étape normale du processus"
          />
          
          <PaletteItem
            type="action"
            label="Action"
            icon={<Zap className="w-5 h-5" />}
            description="Action associée à une étape"
          />
        </div>
        
        <div className="mt-8 p-3 bg-muted rounded-lg">
          <h3 className="text-xs font-medium text-foreground mb-2">Instructions :</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Survolez les étapes pour voir les points de connexion</li>
            <li>• Reliez les étapes par le haut/bas</li>
            <li>• Reliez les actions par la gauche (vers étapes)</li>
            <li>• Une seule étape initiale par GRAFCET</li>
          </ul>
        </div>
      </div>
    </div>
  );
};