export type MapViewport = {
  centerLat: number;
  centerLng: number;
  zoom: number;
};

export function buildMapSearchHint(viewport: MapViewport): string {
  return `Map @ ${viewport.centerLat.toFixed(4)},${viewport.centerLng.toFixed(4)} (z${viewport.zoom})`;
}
