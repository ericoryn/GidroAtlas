import { Filter, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/useStore';
import { REGIONS, RESOURCE_TYPE_LABELS, CATEGORY_COLORS, type ConditionCategory, type WaterResourceType } from '@/types';
import { cn } from '@/lib/utils';

const uniqueRegions = [
  'Алматинская область',
  'Акмолинская область',
  'Восточно-Казахстанская область',
  'Карагандинская область',
  'Туркестанская область',
  'Область Жетысу',
  'Северо-Казахстанская область',
  'Костанайская область',
  'Атырауская область',
  'Улытауская область',
  'Западно-Казахстанская область',
  'Кызылординская область',
];

export function FilterPanel() {
  const { filters, setFilters, resetFilters, isFilterPanelOpen, setFilterPanelOpen } = useStore();

  const handleResourceTypeChange = (type: WaterResourceType, checked: boolean) => {
    const newTypes = checked
      ? [...filters.resourceTypes, type]
      : filters.resourceTypes.filter((t) => t !== type);
    setFilters({ resourceTypes: newTypes });
  };

  const handleCategoryChange = (category: ConditionCategory, checked: boolean) => {
    const newCategories = checked
      ? [...filters.conditionCategories, category]
      : filters.conditionCategories.filter((c) => c !== category);
    setFilters({ conditionCategories: newCategories });
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isFilterPanelOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setFilterPanelOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:relative z-40 h-[calc(100vh-4rem)] w-80 bg-card border-r border-border overflow-hidden transition-transform duration-300 ease-in-out",
          isFilterPanelOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Фильтры</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setFilterPanelOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
            {/* Search */}
            <div className="space-y-2">
              <Label>Поиск</Label>
              <Input
                placeholder="Название или регион..."
                value={filters.searchQuery || ''}
                onChange={(e) => setFilters({ searchQuery: e.target.value })}
              />
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label>Регион</Label>
              <Select
                value={filters.region || 'all'}
                onValueChange={(value) => setFilters({ region: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Все регионы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все регионы</SelectItem>
                  {uniqueRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Resource Type */}
            <div className="space-y-3">
              <Label>Тип ресурса</Label>
              <div className="space-y-2">
                {(Object.entries(RESOURCE_TYPE_LABELS) as [WaterResourceType, string][]).map(([type, label]) => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox
                      id={type}
                      checked={filters.resourceTypes.includes(type)}
                      onCheckedChange={(checked) => handleResourceTypeChange(type, !!checked)}
                    />
                    <Label htmlFor={type} className="font-normal cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Water Type */}
            <div className="space-y-3">
              <Label>Тип воды</Label>
              <RadioGroup
                value={filters.waterType || 'all'}
                onValueChange={(value) => setFilters({ waterType: value as any })}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="all" id="water-all" />
                  <Label htmlFor="water-all" className="font-normal cursor-pointer">Все</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="fresh" id="water-fresh" />
                  <Label htmlFor="water-fresh" className="font-normal cursor-pointer">Пресная</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="non-fresh" id="water-non-fresh" />
                  <Label htmlFor="water-non-fresh" className="font-normal cursor-pointer">Соленая</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Fauna */}
            <div className="space-y-3">
              <Label>Наличие фауны</Label>
              <RadioGroup
                value={filters.fauna || 'all'}
                onValueChange={(value) => setFilters({ fauna: value as any })}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="all" id="fauna-all" />
                  <Label htmlFor="fauna-all" className="font-normal cursor-pointer">Все</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="fauna-yes" />
                  <Label htmlFor="fauna-yes" className="font-normal cursor-pointer">Да</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="fauna-no" />
                  <Label htmlFor="fauna-no" className="font-normal cursor-pointer">Нет</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Condition Category */}
            <div className="space-y-3">
              <Label>Категория состояния</Label>
              <div className="space-y-2">
                {([1, 2, 3, 4, 5] as ConditionCategory[]).map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.conditionCategories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[category] }}
                    />
                    <Label htmlFor={`category-${category}`} className="font-normal cursor-pointer">
                      Категория {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-3">
              <Label>Дата паспорта</Label>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">От</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => setFilters({ dateFrom: e.target.value || undefined })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">До</Label>
                  <Input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => setFilters({ dateTo: e.target.value || undefined })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={resetFilters}
            >
              <RotateCcw className="h-4 w-4" />
              Сбросить фильтры
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
