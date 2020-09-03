import React, { Fragment, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeColor } from '@datapunt/asc-ui';
import configuration from 'shared/services/configuration/configuration';

import useFetch from 'hooks/useFetch';
import { wgs84ToRd } from 'shared/services/crs-converter/crs-converter';
import selectIconSrc from '!!file-loader!../../shared/images/icon-select-marker.svg';

const ImgWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth}px;
  z-index: 0;
  display: block;

  & > img:not(:first-of-type):last-of-type {
    position: absolute;
    left: calc(50% - ${({ markerSize }) => markerSize / 2}px);
    top: calc(50% - ${({ markerSize }) => markerSize}px);
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
  max-width: 100%;
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
  markerSize,
  showLoadingMessage,
  showMarker,
  width,
}) => {
  const { data, error, get, isLoading } = useFetch();
  const [src, setSrc] = useState();
  const { x, y } = useMemo(() => wgs84ToRd({ latitude, longitude }), [latitude, longitude]);
  const params = useMemo(
    () => ({
      bbox: [
        x - width / boundsScaleFactor,
        y - height / boundsScaleFactor,
        x + width / boundsScaleFactor,
        y + height / boundsScaleFactor,
      ].join(','),
      format,
      height,
      layers,
      request: 'getmap',
      srs: 'EPSG:28992',
      version: '1.1.1',
      width,
    }),
    [boundsScaleFactor, format, height, layers, width, x, y]
  );

  useEffect(() => {
    get(configuration.STATIC_MAP_SERVER_URL, params, { responseType: 'blob' });
  }, [get, params]);

  useEffect(() => {
    if (!data) return;

    setSrc(global.URL.createObjectURL(data));
  }, [data]);

  return (
    <ImgWrapper className={className} data-testid="mapStatic" maxWidth={width} markerSize={markerSize}>
      {!src ? (
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
      ) : (
        <Fragment>
          <Image className="map" data-testid="mapStaticImage" src={src} width={width} height={height} alt="" />
          {showMarker && (
            <img
              data-testid="mapStaticMarker"
              src={selectIconSrc}
              alt="Gepinde locatie"
              width={markerSize}
              height={markerSize}
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
  markerSize: 40,
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
  /** Indicator of the map style */
  layers: PropTypes.oneOf(['basiskaart', 'basiskaart-light', 'basiskaart-zwartwit']),
  longitude: PropTypes.number.isRequired,
  /** Size in pixels of the marker */
  markerSize: PropTypes.number,
  /** When false, will not show the loading message */
  showLoadingMessage: PropTypes.bool,
  /** When false, will not render marker at given latitude and longitude */
  showMarker: PropTypes.bool,
  /** Width in pixels of the image tile that should be generated */
  width: PropTypes.number,
};

export default MapStatic;
