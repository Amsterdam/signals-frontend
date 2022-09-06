// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { themeColor } from '@amsterdam/asc-ui'
import configuration from 'shared/services/configuration/configuration'

import type { FC } from 'react'
import type { LatLngLiteral } from 'leaflet'

import useFetch from 'hooks/useFetch'
import { wgs84ToRd } from 'shared/services/crs-converter/crs-converter'

const ImgWrapper = styled.div<{ maxWidth: number; markerSize: number }>`
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
`

const Image = styled.img`
  max-width: 100%;
  height: auto;
`

const LoadingMessage = styled.small`
  position: absolute;
  top: calc(50% - 20px);
  text-align: center;
  width: 100%;
`

const Placeholder = styled.img`
  border: 1px dashed ${themeColor('tint', 'level3')};
  background-color: ${themeColor('tint', 'level2')};
  max-width: 100%;
`

const Error = styled(LoadingMessage)`
  color: ${themeColor('secondary')};
`

export interface MapStaticProps {
  /* The bigger the number, the higher the zoom level */
  boundsScaleFactor?: number
  className?: string
  coordinates: LatLngLiteral
  /** Supported image formats */
  format?: 'png' | 'jpeg' | 'gif'
  /** Height in pixels of the image tile that should be generated */
  height?: number
  iconSrc?: string
  /** Indicator of the map style */
  layers?: 'basiskaart' | 'basiskaart-light' | 'basiskaart-zwartwit'
  /** Size in pixels of the marker */
  markerSize?: number
  /** When false, will not show the loading message */
  showLoadingMessage?: boolean
  /** When false, will not render marker at given latitude and longitude */
  showMarker?: boolean
  /** Width in pixels of the image tile that should be generated */
  width?: number
}

/**
 * Component that renders a map tile of a given width and height around a center point
 */
const MapStatic: FC<MapStaticProps> = ({
  boundsScaleFactor = 2,
  className = '',
  coordinates,
  format = 'jpeg',
  height = 300,
  iconSrc = '/assets/images/icon-select-marker.svg',
  layers = 'basiskaart',
  markerSize = 40,
  showLoadingMessage = true,
  showMarker = true,
  width = 460,
}) => {
  const { lat, lng } = coordinates
  const { data, error, get, isLoading } = useFetch()
  const [src, setSrc] = useState<string>()
  const { x, y } = useMemo(() => wgs84ToRd({ lat, lng }), [lat, lng])
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
  )

  useEffect(() => {
    get(configuration.map.staticUrl, params, { responseType: 'blob' })
  }, [get, params])

  useEffect(() => {
    if (!data) return

    setSrc(global.URL.createObjectURL(data as Blob))
  }, [data])

  return (
    <ImgWrapper
      className={className}
      data-testid="mapStatic"
      markerSize={markerSize}
      maxWidth={width}
    >
      {!src ? (
        <>
          {showLoadingMessage && isLoading && (
            <LoadingMessage data-testid="mapStaticLoadingMessage">
              Preview laden...
            </LoadingMessage>
          )}
          {error && (
            <Error data-testid="mapStaticError">
              Preview kon niet geladen worden
            </Error>
          )}
          <Placeholder
            alt=""
            data-testid="mapStaticPlaceholder"
            height={height}
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            width={width}
          />
        </>
      ) : (
        <>
          <Image
            alt=""
            className="map"
            data-testid="mapStaticImage"
            height={height}
            src={src}
            width={width}
          />
          {showMarker && (
            <img
              alt=""
              aria-hidden="true"
              data-testid="mapStaticMarker"
              height={markerSize}
              src={iconSrc}
              tabIndex={-1}
              width={markerSize}
            />
          )}
        </>
      )}
    </ImgWrapper>
  )
}

export default MapStatic
