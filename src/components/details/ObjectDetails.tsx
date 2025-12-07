import { X, MapPin, Calendar, Fish, Droplet, FileText, AlertTriangle, Map, Ruler, Waves, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore, calculatePriority } from '@/store/useStore';
import {
  CATEGORY_COLORS,
  RESOURCE_TYPE_LABELS,
  WATER_TYPE_LABELS,
  FAUNA_LABELS,
  PRIORITY_LABELS,
  CONDITION_LABELS
} from '@/types';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useMemo } from 'react';

export function ObjectDetails() {
  const { selectedObjectId, setSelectedObjectId, setDetailsPanelOpen, isDetailsPanelOpen, isAuthenticated, user, waterObjects } = useStore();

  const selectedObject = useMemo(() => {
    return waterObjects.find((obj) => obj.id === selectedObjectId);
  }, [selectedObjectId, waterObjects]);

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

      <aside className="fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-full sm:w-96 bg-card border-l border-border shadow-xl animate-slide-in-right overflow-hidden lg:relative lg:z-auto lg:top-0 lg:h-full">
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
            <div className={cn("grid gap-3", isExpert ? "grid-cols-2" : "grid-cols-1")}>
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground mb-1">Состояние</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: CATEGORY_COLORS[selectedObject.conditionCategory] }}
                  />
                  <span className="font-semibold">{CONDITION_LABELS[selectedObject.conditionCategory]}</span>
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

            {/* Passport Details (для объектов с детальными данными) */}
            {selectedObject.passportDetails && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Детальные паспортные данные
                </h3>

                <Accordion type="single" collapsible className="w-full">
                  {/* Географическое расположение */}
                  {selectedObject.passportDetails.geographical_location && (
                    <AccordionItem value="geographical">
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center gap-2">
                          <Map className="h-4 w-4 text-primary" />
                          Географическое расположение
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          {selectedObject.passportDetails.geographical_location.admin_area && (
                            <div>
                              <span className="text-muted-foreground">Область: </span>
                              <span className="font-medium">{selectedObject.passportDetails.geographical_location.admin_area}</span>
                            </div>
                          )}
                          {selectedObject.passportDetails.geographical_location.admin_district && (
                            <div>
                              <span className="text-muted-foreground">Район: </span>
                              <span className="font-medium">{selectedObject.passportDetails.geographical_location.admin_district}</span>
                            </div>
                          )}
                          {selectedObject.passportDetails.geographical_location.location_relative_to_settlement && (
                            <div>
                              <span className="text-muted-foreground">Расположение: </span>
                              <span className="font-medium">{selectedObject.passportDetails.geographical_location.location_relative_to_settlement}</span>
                            </div>
                          )}
                          {selectedObject.passportDetails.geographical_location.boundaries && (
                            <div className="pt-2">
                              <span className="text-muted-foreground text-xs">Границы: </span>
                              <p className="font-mono text-xs mt-1">{selectedObject.passportDetails.geographical_location.boundaries}</p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Физические характеристики */}
                  {selectedObject.passportDetails.physical_characteristics && (
                    <AccordionItem value="physical">
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center gap-2">
                          <Ruler className="h-4 w-4 text-primary" />
                          Физические характеристики
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          {selectedObject.passportDetails.physical_characteristics.length_m && (
                            <div>
                              <span className="text-muted-foreground">Длина: </span>
                              <span className="font-medium">{selectedObject.passportDetails.physical_characteristics.length_m.toLocaleString()} м</span>
                            </div>
                          )}
                          {selectedObject.passportDetails.physical_characteristics.width_m && (
                            <div>
                              <span className="text-muted-foreground">Ширина: </span>
                              <span className="font-medium">{selectedObject.passportDetails.physical_characteristics.width_m.toLocaleString()} м</span>
                            </div>
                          )}
                          {selectedObject.passportDetails.physical_characteristics.area_ha && (
                            <div>
                              <span className="text-muted-foreground">Площадь: </span>
                              <span className="font-medium">{selectedObject.passportDetails.physical_characteristics.area_ha.toLocaleString()} га</span>
                            </div>
                          )}
                          {selectedObject.passportDetails.physical_characteristics.depth_max_m && (
                            <div>
                              <span className="text-muted-foreground">Макс. глубина: </span>
                              <span className="font-medium">
                                {typeof selectedObject.passportDetails.physical_characteristics.depth_max_m === 'number'
                                  ? `${selectedObject.passportDetails.physical_characteristics.depth_max_m} м`
                                  : selectedObject.passportDetails.physical_characteristics.depth_max_m}
                              </span>
                            </div>
                          )}
                          {selectedObject.passportDetails.physical_characteristics.depth_avg_m && (
                            <div>
                              <span className="text-muted-foreground">Средняя глубина: </span>
                              <span className="font-medium">
                                {typeof selectedObject.passportDetails.physical_characteristics.depth_avg_m === 'number'
                                  ? `${selectedObject.passportDetails.physical_characteristics.depth_avg_m} м`
                                  : selectedObject.passportDetails.physical_characteristics.depth_avg_m}
                              </span>
                            </div>
                          )}
                          {selectedObject.passportDetails.physical_characteristics.depth_min_m !== undefined && (
                            <div>
                              <span className="text-muted-foreground">Мин. глубина: </span>
                              <span className="font-medium">{selectedObject.passportDetails.physical_characteristics.depth_min_m} м</span>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Биологические характеристики */}
                  {selectedObject.passportDetails.biological_characteristics && (
                    <AccordionItem value="biological">
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-primary" />
                          Биологические характеристики
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 text-sm">
                          {/* Степень зарастания */}
                          {selectedObject.passportDetails.biological_characteristics.overgrowth_degree && (
                            <div>
                              <p className="font-medium mb-1">Степень зарастания:</p>
                              {selectedObject.passportDetails.biological_characteristics.overgrowth_degree.surface_vegetation && (
                                <div className="text-muted-foreground ml-2">
                                  Поверхностная растительность: {selectedObject.passportDetails.biological_characteristics.overgrowth_degree.surface_vegetation}
                                </div>
                              )}
                              {selectedObject.passportDetails.biological_characteristics.overgrowth_degree.underwater_vegetation && (
                                <div className="text-muted-foreground ml-2">
                                  Подводная растительность: {selectedObject.passportDetails.biological_characteristics.overgrowth_degree.underwater_vegetation}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Развитие фитопланктона */}
                          {selectedObject.passportDetails.biological_characteristics.phytoplankton_development && (
                            <div>
                              <span className="font-medium">Развитие фитопланктона: </span>
                              <span className="text-muted-foreground">{selectedObject.passportDetails.biological_characteristics.phytoplankton_development}</span>
                            </div>
                          )}

                          {/* Состав фауны */}
                          {selectedObject.passportDetails.biological_characteristics.fauna_composition && (
                            <div>
                              <p className="font-medium mb-1">Состав фауны:</p>
                              {selectedObject.passportDetails.biological_characteristics.fauna_composition.ichthyofauna && (
                                <div className="text-muted-foreground ml-2">
                                  <Fish className="h-3 w-3 inline mr-1" />
                                  Ихтиофауна: {selectedObject.passportDetails.biological_characteristics.fauna_composition.ichthyofauna}
                                </div>
                              )}
                              {selectedObject.passportDetails.biological_characteristics.fauna_composition.mammals && (
                                <div className="text-muted-foreground ml-2">
                                  Млекопитающие: {selectedObject.passportDetails.biological_characteristics.fauna_composition.mammals}
                                </div>
                              )}
                              {selectedObject.passportDetails.biological_characteristics.fauna_composition.invertebrates && (
                                <div className="text-muted-foreground ml-2">
                                  Беспозвоночные: {selectedObject.passportDetails.biological_characteristics.fauna_composition.invertebrates}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Рыбопродуктивность */}
                          {selectedObject.passportDetails.biological_characteristics.fish_productivity_kg_ha && (
                            <div>
                              <p className="font-medium mb-1">Рыбопродуктивность:</p>
                              {selectedObject.passportDetails.biological_characteristics.fish_productivity_kg_ha.ichthyofauna && (
                                <div className="text-muted-foreground ml-2">
                                  Ихтиофауна: {selectedObject.passportDetails.biological_characteristics.fish_productivity_kg_ha.ichthyofauna}
                                </div>
                              )}
                              {selectedObject.passportDetails.biological_characteristics.fish_productivity_kg_ha.invertebrates && (
                                <div className="text-muted-foreground ml-2">
                                  Беспозвоночные: {selectedObject.passportDetails.biological_characteristics.fish_productivity_kg_ha.invertebrates}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
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
                    Формула: (6 - {selectedObject.conditionCategory}) × 3 + {ageInYears} = {priority.score}
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
