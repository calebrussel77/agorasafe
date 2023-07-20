import { env } from '@/env.mjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import { type MapboxLocation } from '@/types/mapbox-location';

const accessToken = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const getMapboxLocationUrl = (query: string) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?types=country,place&language=fr&country=CM&access_token=${accessToken}`;

export const useLocationSearch = (defaultSearch = 'douala') => {
  const [locationSearch, setLocationSearch] = useState(defaultSearch);

  const { data: queryData, ...rest } = useQuery(
    ['get-location', locationSearch],
    async () => {
      const data = await axios.get<MapboxLocation>(
        getMapboxLocationUrl(locationSearch)
      );
      return data;
    }
  );

  const data = queryData?.data?.features;

  return { locationSearch, setLocationSearch, data, ...rest };
};
