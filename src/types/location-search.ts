export interface LocationSearch {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: Address;
  namedetails: Namedetails;
  boundingbox: string[];
}

interface Namedetails {
  name: string;
}

interface Address {
  amenity: string;
  road: string;
  industrial: string;
  suburb: string;
  city: string;
  municipality: string;
  county: string;
  state: string;
  'ISO3166-2-lvl4': string;
  postcode: string;
  country: string;
  country_code: string;
}
