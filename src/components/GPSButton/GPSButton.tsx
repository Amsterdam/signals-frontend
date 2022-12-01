// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { useCallback, useState } from 'react'
import type { FunctionComponent, HTMLProps } from 'react'

import { Button, themeSpacing } from '@amsterdam/asc-ui'
import { themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import LoadingIndicator from 'components/LoadingIndicator'
import { pointWithinBounds } from 'shared/services/map-location'
import type { LocationResult } from 'types/location'

import GPS from '../../images/icon-gps.svg'

const StyledButton = styled(Button)`
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  width: ${themeSpacing(36)};
  height: ${themeSpacing(11)};
  color: ${themeColor('tint', 'level7')};
  font-family: inherit;
`

const GPSIcon = styled(GPS)`
  display: inline-block;
`

export interface GPSButtonProps {
  className?: string
  onLocationSuccess: (result: LocationResult) => void
  onLocationError: (error: GeolocationPositionError) => void
  onLocationOutOfBounds: () => void
}

const GPSButton: FunctionComponent<GPSButtonProps & HTMLProps<HTMLElement>> = ({
  className,
  onLocationSuccess,
  onLocationError,
  onLocationOutOfBounds,
  tabIndex,
}) => {
  const [loading, setLoading] = useState(false)

  const onSuccess: PositionCallback = useCallback(
    ({ coords }) => {
      const { accuracy, latitude, longitude } = coords

      if (pointWithinBounds([latitude, longitude])) {
        onLocationSuccess({
          accuracy,
          latitude,
          longitude,
        })
      } else {
        onLocationOutOfBounds()
      }

      setLoading(false)
    },
    [onLocationOutOfBounds, onLocationSuccess]
  )

  const onError: PositionErrorCallback = useCallback(
    (error) => {
      onLocationError(error)
      setLoading(false)
    },
    [onLocationError]
  )

  const onClick = useCallback(
    (event) => {
      event.preventDefault()

      if (loading) return

      setLoading(true)

      global.navigator.geolocation.getCurrentPosition(onSuccess, onError)
    },
    [loading, onError, onSuccess]
  )

  return (
    <StyledButton
      className={className}
      data-testid="gpsButton"
      iconLeft={loading ? <LoadingIndicator color="black" /> : <GPSIcon />}
      aria-label="Huidige locatie"
      iconSize={20}
      onClick={onClick}
      size={144}
      variant="blank"
      type="button"
      tabIndex={tabIndex}
    >
      Mijn locatie
    </StyledButton>
  )
}

export default GPSButton
