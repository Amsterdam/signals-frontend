// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

import { pointWithinBounds } from 'shared/services/map-location'
import LoadingIndicator from 'components/LoadingIndicator'

import { Button } from '@amsterdam/asc-ui'
import GPS from '../../images/icon-gps.svg'

const StyledButton = styled(Button)`
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
`

const GPSIcon = styled(GPS)`
  display: inline-block;
`

export interface LocationResult
  extends Partial<
    Pick<GeolocationCoordinates, 'accuracy' | 'latitude' | 'longitude'>
  > {
  toggled: boolean
}

export interface GPSButtonProps {
  className?: string
  onLocationChange?: (result: LocationResult) => void
  onLocationSuccess?: (result: LocationResult) => void
  onLocationError?: (error: GeolocationPositionError) => void
  onLocationOutOfBounds?: () => void
}

const GPSButton: FunctionComponent<GPSButtonProps> = ({
  className,
  onLocationChange,
  onLocationSuccess,
  onLocationError,
  onLocationOutOfBounds,
}) => {
  const [loading, setLoading] = useState(false)
  const [toggled, setToggled] = useState(false)
  const shouldWatch = typeof onLocationChange === 'function'
  const successCallbackFunc = shouldWatch ? onLocationChange : onLocationSuccess

  if (!shouldWatch && typeof onLocationSuccess !== 'function') {
    throw new Error(
      'Either one of onLocationChange or onLocationSuccess is required'
    )
  }

  const onClick = useCallback(
    (event) => {
      event.preventDefault()

      if (loading) return

      if (toggled) {
        successCallbackFunc?.({ toggled: false })
        setToggled(false)
        return
      }

      const onSuccess: PositionCallback = ({ coords }) => {
        const { accuracy, latitude, longitude } = coords

        if (pointWithinBounds([latitude, longitude])) {
          successCallbackFunc?.({
            accuracy,
            latitude,
            longitude,
            toggled: !toggled,
          })
          setToggled(!toggled)
        } else {
          if (typeof onLocationOutOfBounds === 'function') {
            onLocationOutOfBounds()
          }

          setToggled(false)
        }

        setLoading(false)
      }

      const onError: PositionErrorCallback = (error) => {
        onLocationError?.(error)
        setToggled(false)
        setLoading(false)
      }

      setLoading(true)

      if (shouldWatch) {
        global.navigator.geolocation.watchPosition(onSuccess, onError)
      } else {
        global.navigator.geolocation.getCurrentPosition(onSuccess, onError)
      }
    },
    [
      onLocationError,
      onLocationOutOfBounds,
      successCallbackFunc,
      shouldWatch,
      toggled,
      loading,
    ]
  )

  return (
    <StyledButton
      className={className}
      data-testid="gpsButton"
      icon={
        loading ? (
          <LoadingIndicator color="black" />
        ) : (
          <GPSIcon fill={toggled ? '#009de6' : 'black'} />
        )
      }
      aria-label="Huidige locatie"
      iconSize={20}
      onClick={onClick}
      size={44}
      variant="blank"
      type="button"
    />
  )
}

export default GPSButton
