import { X, MapPin, Calendar, Fish, Droplet, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore, calculatePriority } from '@/store/useStore';
import { mockWaterObjects } from '@/data/mockData';
import { 
  CATEGORY_COLORS, 
  RESOURCE_TYPE_LABELS, 
  WATER_TYPE_LABELS, 
  FAUNA_LABELS,
  PRIORITY_LABELS 
} from '@/types';
import { cn } from '@/lib/utils';

export function ObjectDetails() {
  const { selectedObjectId, setSelectedObjectId, setDetailsPanelOpen, isDetailsPanelOpen, isAuthenticated, user } = useStore();

  const selectedObject = mockWaterObjects.find((obj) => obj.id === selectedObjectId);

  if (!isDetailsPanelOpen || !selectedObject) {
    return null;
  }

  const priority = calculatePriority(selectedObject);
  const passportDate = new Date(selectedObject.passportDate);
  const ageInYears = Math.floor((new Date().getTime() - passportDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const isExpert = isAuthenticated && user?.role === 'expert';

  const handleClose = () => {
    setSelectedObjectId(null);
    setDetailsPanelOpen(false);
  };

  const handleOpenPassport = () => {
    // Mock passport opening
    window.alert('Открытие паспорта объекта (демо)');
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={handleClose}
      />

      <aside className="fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-full sm:w-96 bg-card border-l border-border shadow-xl animate-slide-in-right overflow-hidden lg:relative lg:z-auto">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between p-4 border-b border-border">
            <div className="flex-1 pr-4">
              <h2 className="text-lg font-bold text-foreground">{selectedObject.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedObject.region}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {/* Condition & Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground mb-1">Состояние</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: CATEGORY_COLORS[selectedObject.conditionCategory] }}
                  />
                  <span className="font-semibold">Категория {selectedObject.conditionCategory}</span>
                </div>
              </div>
              
              {isExpert && (
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Приоритет</p>
                  <Badge
                    className={cn(
                      "font-semibold",
                      priority.level === 'high' && "priority-high",
                      priority.level === 'medium' && "priority-medium",
                      priority.level === 'low' && "priority-low"
                    )}
                  >
                    {PRIORITY_LABELS[priority.level]}
                  </Badge>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Droplet className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Тип ресурса</p>
                  <p className="font-medium">{RESOURCE_TYPE_LABELS[selectedObject.resourceType]}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Droplet className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Тип воды</p>
                  <p className="font-medium">{WATER_TYPE_LABELS[selectedObject.waterType]}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Fish className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Наличие фауны</p>
                  <p className="font-medium">{FAUNA_LABELS[selectedObject.fauna]}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Дата паспорта</p>
                  <p className="font-medium">
                    {passportDate.toLocaleDateString('ru-RU')}
                    <span className="text-sm text-muted-foreground ml-2">({ageInYears} лет назад)</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Координаты</p>
                  <p className="font-medium font-mono text-sm">
                    {selectedObject.latitude.toFixed(4)}°N, {selectedObject.longitude.toFixed(4)}°E
                  </p>
                </div>
              </div>

              {selectedObject.area && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-5 w-5 flex items-center justify-center text-primary font-bold text-xs">S</div>
                  <div>
                    <p className="text-xs text-muted-foreground">Площадь</p>
                    <p className="font-medium">{selectedObject.area.toLocaleString()} км²</p>
                  </div>
                </div>
              )}

              {selectedObject.depth && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-5 w-5 flex items-center justify-center text-primary font-bold text-xs">D</div>
                  <div>
                    <p className="text-xs text-muted-foreground">Глубина</p>
                    <p className="font-medium">{selectedObject.depth} м</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {selectedObject.description && (
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-sm text-foreground">{selectedObject.description}</p>
              </div>
            )}

            {/* Priority Score (Expert only) */}
            {isExpert && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-primary">Расчёт приоритета</p>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Балл: <span className="font-semibold text-foreground">{priority.score}</span></p>
                  <p className="text-xs">
                    Формула: {selectedObject.conditionCategory} × 3 + {ageInYears} = {priority.score}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {isExpert && (
            <div className="p-4 border-t border-border">
              <Button className="w-full gap-2" onClick={handleOpenPassport}>
                <FileText className="h-4 w-4" />
                Открыть паспорт
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
