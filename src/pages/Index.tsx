import { Header } from '@/components/layout/Header';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { WaterMap } from '@/components/map/WaterMap';
import { ObjectDetails } from '@/components/details/ObjectDetails';

const Index = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <FilterPanel />
        <main className="flex-1 relative">
          <WaterMap />
        </main>
        <ObjectDetails />
      </div>
    </div>
  );
};

export default Index;
