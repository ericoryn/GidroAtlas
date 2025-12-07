import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Header } from '@/components/layout/Header';

import { calculatePriority, useStore } from '@/store/useStore';
import { CATEGORY_COLORS, RESOURCE_TYPE_LABELS, PRIORITY_LABELS, CONDITION_LABELS } from '@/types';
import { cn } from '@/lib/utils';

type SortField = 'name' | 'region' | 'resourceType' | 'conditionCategory' | 'passportAge' | 'priorityScore' | 'priorityLevel';
type SortOrder = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, waterObjects, fetchWaterObjects } = useStore();

  useEffect(() => {
    fetchWaterObjects();
  }, [fetchWaterObjects]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('priorityScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  if (!isAuthenticated || user?.role !== 'expert') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Доступ запрещён</h2>
          <p className="text-muted-foreground mb-4">Для доступа к этой странице необходимо войти как эксперт</p>
          <Button onClick={() => navigate('/login')}>Войти</Button>
        </div>
      </div>
    );
  }

  const processedObjects = useMemo(() => {
    return waterObjects.map((obj) => {
      const priority = calculatePriority(obj);
      const passportDate = new Date(obj.passportDate);
      const passportAge = Math.floor((new Date().getTime() - passportDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

      return {
        ...obj,
        passportAge,
        priorityScore: priority.score,
        priorityLevel: priority.level,
      };
    });
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = processedObjects;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (obj) =>
          obj.name.toLowerCase().includes(query) ||
          obj.region.toLowerCase().includes(query)
      );
    }
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'region':
          comparison = a.region.localeCompare(b.region);
          break;
        case 'resourceType':
          comparison = a.resourceType.localeCompare(b.resourceType);
          break;
        case 'conditionCategory':
          comparison = a.conditionCategory - b.conditionCategory;
          break;
        case 'passportAge':
          comparison = a.passportAge - b.passportAge;
          break;
        case 'priorityScore':
          comparison = a.priorityScore - b.priorityScore;
          break;
        case 'priorityLevel':
          const levelOrder = { high: 3, medium: 2, low: 1 };
          comparison = levelOrder[a.priorityLevel] - levelOrder[b.priorityLevel];
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [processedObjects, searchQuery, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={cn(
          "h-3 w-3 transition-opacity",
          sortField === field ? "opacity-100" : "opacity-30"
        )} />
      </div>
    </TableHead>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            К карте
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Приоритеты обследования</h1>
              <p className="text-muted-foreground">
                Всего объектов: {filteredAndSorted.length}
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader field="name">Название</SortableHeader>
                  <SortableHeader field="region">Регион</SortableHeader>
                  <SortableHeader field="resourceType">Тип</SortableHeader>
                  <SortableHeader field="conditionCategory">Состояние</SortableHeader>
                  <SortableHeader field="passportAge">Возраст паспорта</SortableHeader>
                  <SortableHeader field="priorityScore">Балл</SortableHeader>
                  <SortableHeader field="priorityLevel">Приоритет</SortableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((obj) => (
                  <TableRow key={obj.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{obj.name}</TableCell>
                    <TableCell className="text-muted-foreground">{obj.region}</TableCell>
                    <TableCell>{RESOURCE_TYPE_LABELS[obj.resourceType]}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[obj.conditionCategory] }}
                        />
                        <span>{CONDITION_LABELS[obj.conditionCategory]}</span>
                      </div>
                    </TableCell>
                    <TableCell>{obj.passportAge} лет</TableCell>
                    <TableCell className="font-semibold">{obj.priorityScore}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          obj.priorityLevel === 'high' && "priority-high",
                          obj.priorityLevel === 'medium' && "priority-medium",
                          obj.priorityLevel === 'low' && "priority-low"
                        )}
                      >
                        {PRIORITY_LABELS[obj.priorityLevel]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Объекты не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Страница {currentPage} из {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
