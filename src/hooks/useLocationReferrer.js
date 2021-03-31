// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useLocationReferrer hook
 *
 * Custom hook that returns the current page location. If the location, from which the navigation action originated,
 * is different than its referrer, the referring URL is appended as a prop to the location object.
 *
 * @returns {Object} location object with a possible referrer prop
 */
const useLocationReferrer = () => {
  const moduleLocation = useLocation();
  const [location, setLocation] = useState(moduleLocation);

  useEffect(() => {
    if (location.pathname !== moduleLocation.pathname) {
      const locWithReferrer = {
        ...moduleLocation,
        referrer: location.pathname,
      };

      setLocation(locWithReferrer);
    }
  }, [location.pathname, moduleLocation, setLocation]);

  return location;
};

export default useLocationReferrer;
