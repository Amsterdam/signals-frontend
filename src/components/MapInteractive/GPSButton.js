import React, { Fragment } from 'react';
import { Button } from '@datapunt/asc-ui';
import { useMapInstance } from '@datapunt/react-maps';

const GPSButton = () => {
  const { mapInstance } = useMapInstance();
  const geoLocationSupported = navigator.geolocation;

  const setUserLocation = async e => {
    e.preventDefault();

    await mapInstance.locate();
  };

  return (
    <Fragment>
      <Button disabled={!geoLocationSupported} onClick={setUserLocation}>
        User location
      </Button>
    </Fragment>
  );
};

export default GPSButton;
