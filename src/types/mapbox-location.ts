export interface MapboxLocation {
  type: string;
  query: string[];
  features: Feature[];
  attribution: string;
}

interface Feature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: Properties;
  text: string;
  place_name: string;
  bbox?: number[];
  center: number[];
  geometry: Geometry;
  context: Context[];
}

interface Context {
  id: string;
  text: string;
  wikidata?: string;
  short_code?: string;
}

interface Geometry {
  type: string;
  coordinates: number[];
}

interface Properties {
  wikidata?: string;
  foursquare?: string;
  landmark?: boolean;
  address?: string;
  category?: string;
}
