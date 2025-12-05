import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockWaterObjects, getFilteredObjects } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import { CATEGORY_COLORS, RESOURCE_TYPE_LABELS, type ConditionCategory } from '@/types';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom colored markers
const createColoredMarker = (category: ConditionCategory) => {
  const color = CATEGORY_COLORS[category];
  return L.divIcon({
    className: 'custom-marker-wrapper',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          opacity: 0.8;
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

// Kazakhstan center coordinates
const KAZAKHSTAN_CENTER: [number, number] = [48.0, 67.0];
const DEFAULT_ZOOM = 5;

function MapController() {
  const map = useMap();
  
  useEffect(() => {
    map.setView(KAZAKHSTAN_CENTER, DEFAULT_ZOOM);
  }, [map]);

  return null;
}

export function WaterMap() {
  const { filters, setSelectedObjectId, setDetailsPanelOpen } = useStore();

  const filteredObjects = useMemo(() => {
    return getFilteredObjects(mockWaterObjects, filters);
  }, [filters]);

  const handleMarkerClick = (id: string) => {
    setSelectedObjectId(id);
    setDetailsPanelOpen(true);
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={KAZAKHSTAN_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full z-0"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <MapController />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {filteredObjects.map((obj) => (
          <Marker
            key={obj.id}
            position={[obj.latitude, obj.longitude]}
            icon={createColoredMarker(obj.conditionCategory)}
            eventHandlers={{
              click: () => handleMarkerClick(obj.id),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-foreground">{obj.name}</h3>
                <p className="text-sm text-muted-foreground">{RESOURCE_TYPE_LABELS[obj.resourceType]}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[obj.conditionCategory] }}
                  />
                  <span className="text-xs">Категория {obj.conditionCategory}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border z-[1000]">
        <h4 className="text-xs font-semibold mb-2 text-foreground">Категории</h4>
        <div className="space-y-1.5">
          {([1, 2, 3, 4, 5] as ConditionCategory[]).map((category) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: CATEGORY_COLORS[category] }}
              />
              <span className="text-xs text-muted-foreground">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Object count */}
      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-border z-[1000]">
        <span className="text-sm font-medium text-foreground">
          Объектов: <span className="text-primary">{filteredObjects.length}</span>
        </span>
      </div>
    </div>
  );
}
