import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from 'components/Button';
import Spinner from 'components/Spinner';

import GPS from '../../shared/images/icon-gps.svg';

const GPSIcon = styled(GPS)`
  display: inline-block;
`;

const GPSButton = ({ onLocationChange, onLocationSuccess, onLocationError }) => {
  const [loading, setLoading] = useState(false);
  const [toggled, setToggled] = useState(false);
  const shouldWatch = typeof onLocationChange === 'function';
  const successCallbackFunc = shouldWatch ? onLocationChange : onLocationSuccess;

  if (!shouldWatch && typeof onLocationSuccess !== 'function') {
    throw new Error('Either one of onLocationChange or onLocationSuccess is required');
  }

  const onClick = useCallback(
    event => {
      event.preventDefault();

      const onSuccess = ({ coords }) => {
        const { accuracy, latitude, longitude } = coords;

        successCallbackFunc({ accuracy, latitude, longitude, toggled: !toggled });

        setToggled(!toggled);
        setLoading(false);
      };

      const onError = ({ code, message }) => {
        onLocationError({ code, message });
        setToggled(false);
        setLoading(false);
      };

      setLoading(true);

      if (shouldWatch) {
        global.navigator.geolocation.watchPosition(onSuccess, onError);
      } else {
        global.navigator.geolocation.getCurrentPosition(onSuccess, onError);
      }
    },
    [onLocationError, successCallbackFunc, shouldWatch, toggled]
  );

  return (
    <Button
      data-testid="gpsButton"
      icon={loading ? <Spinner /> : <GPSIcon fill={toggled ? '#009de6' : 'black'} />}
      iconSize={20}
      onClick={onClick}
      size={44}
      variant="blank"
    />
  );
};

GPSButton.propTypes = {
  onLocationChange: PropTypes.func,
  onLocationError: PropTypes.func,
  onLocationSuccess: PropTypes.func,
};

export default GPSButton;
