import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeColor } from '@datapunt/asc-ui';

import useFetch from 'hooks/useFetch';
import { wgs84ToRd } from 'shared/services/crs-converter/crs-converter';

const ImgWrapper = styled.div`
  position: relative;
  width: auto;
  max-width: 100%;
  z-index: 0;

  & > img:not(:first-of-type):last-of-type {
    position: absolute;
    left: calc(50% - 20px);
    top: calc(50% - 20px);
    pointer-events: none;
  }
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
`;

const LoadingMessage = styled.small`
  position: absolute;
  top: calc(50% - 20px);
  text-align: center;
  width: 100%;
`;

const Placeholder = styled.img`
  border: 1px dashed ${themeColor('tint', 'level3')};
  background-color: ${themeColor('tint', 'level2')};
`;

const Error = styled(LoadingMessage)`
  color: ${themeColor('secondary')};
`;

/**
 * Component that renders a map tile of a given width and height around a center point
 */
const MapStatic = ({
  boundsScaleFactor,
  className,
  format,
  height,
  latitude,
  layers,
  longitude,
  showLoadingMessage,
  showMarker,
  width,
}) => {
  const { data, error, get, isLoading } = useFetch();
  const [src, setSrc] = useState();
  const { x, y } = wgs84ToRd({ latitude, longitude });
  const bbox = [
    x - width / boundsScaleFactor,
    y - height / boundsScaleFactor,
    x + width / boundsScaleFactor,
    y + height / boundsScaleFactor,
  ].join(',');

  useEffect(() => {
    const params = {
      bbox,
      format,
      height,
      layers,
      request: 'getmap',
      srs: 'EPSG:28992',
      version: '1.1.1',
      width,
    };

    get('https://map.data.amsterdam.nl/maps/topografie', params, { responseType: 'blob' });
    // only execute on mount; disabling linter
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!data) return;

    setSrc(global.URL.createObjectURL(data));
  }, [data]);

  return (
    <ImgWrapper className={className} data-testid="mapStatic">
      {!src && (
        <Fragment>
          {showLoadingMessage && isLoading && (
            <LoadingMessage data-testid="mapStaticLoadingMessage">Preview laden...</LoadingMessage>
          )}
          {error && <Error data-testid="mapStaticError">Preview kon niet geladen worden</Error>}
          <Placeholder
            data-testid="mapStaticPlaceholder"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            alt=""
            width={width}
            height={height}
          />
        </Fragment>
      )}

      {src && (
        <Fragment>
          <Image className="map" data-testid="mapStaticImage" src={src} alt="" />
          {showMarker && (
            <img
              data-testid="mapStaticMarker"
              src="https://map.data.amsterdam.nl/dist/images/svg/marker.svg"
              alt="Gepinde locatie"
              tabIndex="-1"
            />
          )}
        </Fragment>
      )}
    </ImgWrapper>
  );
};

MapStatic.defaultProps = {
  boundsScaleFactor: 2,
  className: '',
  format: 'jpeg',
  height: 300,
  layers: 'basiskaart',
  showMarker: true,
  showLoadingMessage: true,
  width: 460,
};

MapStatic.propTypes = {
  /* The bigger the number, the higher the zoom level */
  boundsScaleFactor: PropTypes.number,
  /** @ignore */
  className: PropTypes.string,
  /** Supported image formats */
  format: PropTypes.oneOf(['png', 'jpeg', 'gif']),
  /** Height in pixels of the image tile that should be generated */
  height: PropTypes.number,
  latitude: PropTypes.number.isRequired,
  layers: PropTypes.oneOf(['basiskaart', 'basiskaart-light', 'basiskaart-zwartwit']),
  longitude: PropTypes.number.isRequired,
  /** When false, will not show the loading message */
  showLoadingMessage: PropTypes.bool,
  /** When false, will not render marker at given latitude and longitude */
  showMarker: PropTypes.bool,
  /** Width in pixels of the image tile that should be generated */
  width: PropTypes.number,
};

export default MapStatic;
