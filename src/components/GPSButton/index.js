import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { pointWithinBounds } from 'shared/services/map-location';
import Button from 'components/Button';
import Spinner from 'components/Spinner';

import GPS from '../../shared/images/icon-gps.svg';

const StyledButton = styled(Button)`
  outline: 2px solid rgb(0, 0, 0, 0.1);
`;

const GPSIcon = styled(GPS)`
  display: inline-block;
`;

const GPSButton = ({ onLocationChange, onLocationSuccess, onLocationError, onLocationOutOfBounds }) => {
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

      if (toggled) {
        successCallbackFunc({ toggled: false });
        setToggled(false);
        return;
      }

      const onSuccess = ({ coords }) => {
        const { accuracy, latitude, longitude } = coords;

        if (pointWithinBounds([latitude, longitude])) {
          successCallbackFunc({ accuracy, latitude, longitude, toggled: !toggled });
          setToggled(!toggled);
        } else {
          if (typeof onLocationOutOfBounds === 'function') {
            onLocationOutOfBounds();
          }

          setToggled(false);
        }

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
    [onLocationError, onLocationOutOfBounds, successCallbackFunc, shouldWatch, toggled]
  );

  return (
    <StyledButton
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
  onLocationOutOfBounds: PropTypes.func,
  onLocationSuccess: PropTypes.func,
};

export default GPSButton;
