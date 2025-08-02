import { Square } from 'lucide-react';
import { useRef, type ReactNode } from 'react';

interface PaletteItemProps {
  type: string;
  children: ReactNode;
}

const PaletteItem = ({ type, children }: PaletteItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
	
    const element = ref.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      event.dataTransfer.setData(
        'application/reactflow/width',
        rect.width.toString()
      );
      event.dataTransfer.setData(
        'application/reactflow/height',
        rect.height.toString()
      );	  
	  
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.top = '-1000px';
      clone.style.left = '-1000px';
      clone.style.pointerEvents = 'none';
      document.body.appendChild(clone);
      event.dataTransfer.setDragImage(clone, rect.width / 2, rect.height / 2);
      setTimeout(() => {
        document.body.removeChild(clone);
      }, 0);
    }
  };

  return (
    <div
	  ref={ref}
      className="cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={(event) => onDragStart(event, type)}
    >
      {children}
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
          <PaletteItem type="initialStep">
            <div className="relative">
              <div className="w-12 h-12 bg-grafcet-step-initial text-grafcet-step-initial-foreground border-4 border-grafcet-step-initial rounded-sm flex items-center justify-center font-bold text-sm shadow-lg">
                0
              </div>
              
            </div>
          </PaletteItem>

          <PaletteItem type="step">
            <div className="w-12 h-12 bg-grafcet-step text-grafcet-step-foreground border-2 border-grafcet-step rounded-sm flex items-center justify-center font-bold text-sm shadow-lg">
              1
            </div>
          </PaletteItem>

          <PaletteItem type="action">
                <div className="min-w-24 max-w-48 w-24 h-12  bg-grafcet-action text-grafcet-action-foreground border-2 border-grafcet-action flex items-center justify-center font-medium text-xs rounded-sm shadow-lg">
              Action
            </div>
          </PaletteItem>
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
