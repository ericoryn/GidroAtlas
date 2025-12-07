import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getFilteredObjects } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import { renderToStaticMarkup } from 'react-dom/server';
import { Droplets, Waves, Box, Lock, Zap, Circle } from 'lucide-react';
import { CATEGORY_COLORS, RESOURCE_TYPE_LABELS, CONDITION_LABELS, type ConditionCategory, type WaterResourceType } from '@/types';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createColoredMarker = (category: ConditionCategory, type: WaterResourceType) => {
  const color = CATEGORY_COLORS[category];

  let IconComponent = Circle;
  switch (type) {
    case 'lake': IconComponent = Droplets; break;
    case 'canal': IconComponent = Waves; break;
    case 'reservoir': IconComponent = Box; break;
    case 'lock': IconComponent = Lock; break;
    case 'hydro-unit': IconComponent = Zap; break;
  }

  const iconHtml = renderToStaticMarkup(
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white' // Icon color
    }}>
      <IconComponent size={16} strokeWidth={2.5} />
    </div>
  );

  return L.divIcon({
    className: 'custom-marker-wrapper',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${iconHtml}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

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
  const {
    selectedObjectId,
    setSelectedObjectId,
    isDetailsPanelOpen,
    setDetailsPanelOpen,
    filters,
    setFilters,
    waterObjects,
    fetchWaterObjects
  } = useStore();

  // Load data on mount
  useEffect(() => {
    fetchWaterObjects();
  }, [fetchWaterObjects]);

  // Filter objects
  const filteredObjects = useMemo(() => {
    return getFilteredObjects(waterObjects, filters);
  }, [waterObjects, filters]);

  const handleMarkerClick = (id: string) => {
    setSelectedObjectId(id);
    setDetailsPanelOpen(true);
  };

  // Auto-select if only one result found via search
  useEffect(() => {
    if (filters.searchQuery && filteredObjects.length === 1) {
      const obj = filteredObjects[0];
      handleMarkerClick(obj.id);
      // Optional: Fly to object is handled by user manually or we could add it here
    }
  }, [filteredObjects, filters.searchQuery]);

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
            icon={createColoredMarker(obj.conditionCategory, obj.resourceType)}
            eventHandlers={{
              click: () => handleMarkerClick(obj.id),
            }}
          >
            <Tooltip sticky>
              <div className="text-xs">
                <p className="font-semibold">{obj.name}</p>
                <p className="text-muted-foreground">{obj.region}</p>
              </div>
            </Tooltip>
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-foreground">{obj.name}</h3>
                <p className="text-xs text-muted-foreground mb-1">{obj.region}</p>
                <p className="text-sm text-foreground mb-1">{RESOURCE_TYPE_LABELS[obj.resourceType]}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[obj.conditionCategory] }}
                  />
                  <span className="text-xs">{CONDITION_LABELS[obj.conditionCategory]}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border z-[1000]">
        <h4 className="text-xs font-semibold mb-2 text-foreground">Категории</h4>
        <div className="space-y-1.5">
          {([1, 2, 3, 4, 5] as ConditionCategory[]).map((category) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: CATEGORY_COLORS[category] }}
              />
              <span className="text-xs text-muted-foreground">
                {category} - {CONDITION_LABELS[category]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-border z-[1000]">
        <span className="text-sm font-medium text-foreground">
          Объектов: <span className="text-primary">{filteredObjects.length}</span>
        </span>
      </div>
    </div>
  );
}
