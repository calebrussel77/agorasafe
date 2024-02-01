import { Circle, GoogleMap, Marker } from '@react-google-maps/api';
import React, { type FC, useCallback, useMemo, useRef, useState } from 'react';

import { Typography } from '../ui/typography';
import {
  type PlaceLocationOption,
  PlacesAutocomplete,
} from './places-autocomplete';

interface MapProps {
  className?: string;
}

type MapOptions = google.maps.MapOptions;
type GoogleMapType = google.maps.Map;

const center = { lat: 4.051056, lng: 9.767869 };

const options = {
  disableDefaultUI: true,
  clickableIcons: false,
  mapId: '96b044f232521aa8',
} as MapOptions;

const Map: FC<MapProps> = ({ className }) => {
  const mapRef = useRef<GoogleMapType | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<PlaceLocationOption | null>(null);

  const onLoad = useCallback((map: GoogleMapType) => {
    mapRef.current = map;
  }, []);

  const selectedLatLng = useMemo(
    () => ({
      lat: Number(selectedPlace?.lat),
      lng: Number(selectedPlace?.long),
    }),
    [selectedPlace?.lat, selectedPlace?.long]
  );

  return (
    <div className="flex min-h-screen">
      <div className="w-1/3 border-r border-gray-300 bg-white px-3 py-8">
        <Typography as="h1" variant="h2" className="text-center">
          Commute ?
        </Typography>
        <PlacesAutocomplete
          className="mt-3 w-full"
          onSelectPlace={place => {
            setSelectedPlace(place);
            mapRef.current?.panTo({
              lat: Number(place?.lat),
              lng: Number(place?.long),
            });
          }}
          selectedPlace={selectedPlace}
        />
      </div>
      <div className="h-screen w-2/3 flex-1">
        <GoogleMap
          center={center}
          zoom={15}
          options={options}
          onLoad={onLoad}
          mapContainerClassName="h-screen w-full"
        >
          {selectedPlace ? (
            <>
              <Marker position={selectedLatLng} />
              <Circle
                center={selectedLatLng}
                radius={1000}
                options={closeOptions}
              />
            </>
          ) : null}
        </GoogleMap>
      </div>
    </div>
  );
};

export { Map };

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};

const closeOptions = {
  ...defaultOptions,
  zIndex: 6,
  fillOpacity: 0.09,
  strokeColor: '#354cd0',
  fillColor: '#a0b9f0',
};
