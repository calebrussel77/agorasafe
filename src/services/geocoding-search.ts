import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import { type LocationSearch } from '@/types/location-search';

import { QS } from '@/lib/qs';

// const getMapboxLocationUrl = (query: string) =>
//   `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?types=place,locality,poi,postcode&language=fr&limit=8&country=CM&access_token=${accessToken}`;

const baseUrl = `https://nominatim.openstreetmap.org/search`;

export const useGeocodingSearch = (defaultSearch = 'logbaba') => {
  const [locationSearch, setLocationSearch] = useState(defaultSearch);

  const url = QS.stringifyUrl(baseUrl, {
    street: locationSearch,
    'accept-language': 'fr',
    countrycodes: 'cm',
    addressdetails: 1,
    // viewBox: '-180,90,180,-90',
    // bounded: 1,
    dedupe: 0,
    format: 'jsonv2',
    namedetails: 1,
  });

  const { data: queryData, ...rest } = useQuery(
    ['get-location', locationSearch],
    async () => {
      const data = await axios.get<LocationSearch[]>(url);
      return data;
    },
    { enabled: locationSearch.length >= 3 }
  );

  const data = queryData?.data?.map(el => ({
    format: {
      lat: el?.lat,
      long: el?.lon,
      label: [el?.name, el?.address?.city].join(', '),
    },
    raw: el,
  }));

  return { locationSearch, setLocationSearch, data, ...rest };
};
