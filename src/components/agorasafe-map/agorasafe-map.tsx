import React, { type FC } from 'react';

import { Map } from './map';

interface GoogleMapProps {
  className?: string;
}

const AgorasafeMap: FC<GoogleMapProps> = ({}) => {
  return <Map />;
};

export { AgorasafeMap };
