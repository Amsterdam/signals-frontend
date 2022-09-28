/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */

import type { LatLngLiteral } from 'leaflet'

import GPSButton from '../../../../components/GPSButton'
import configuration from '../../../../shared/services/configuration/configuration'
import type { LocationResult } from '../../../../types/location'
import { StyledViewerContainer } from './styled'

export interface Props {
  setNotification: (mapMessage: JSX.Element | string) => void
  setCoordinates: (coordinates: LatLngLiteral) => void
}

export const GPSLocation = ({ setNotification, setCoordinates }: Props) => {
  return (
    <>
      <StyledViewerContainer
        topLeft={
          <GPSButton
            tabIndex={0}
            onLocationSuccess={async (location: LocationResult) => {
              const coordinates = {
                lat: location.latitude,
                lng: location.longitude,
              }
              setCoordinates(coordinates)
            }}
            onLocationError={() =>
              setNotification(
                <>
                  <strong>
                    {`${configuration.language.siteAddress} heeft geen
                            toestemming om uw locatie te gebruiken.`}
                  </strong>
                  <p>
                    Dit kunt u wijzigen in de voorkeuren of instellingen van uw
                    browser of systeem.
                  </p>
                </>
              )
            }
            onLocationOutOfBounds={() =>
              setNotification(
                'Uw locatie valt buiten de kaart en is daardoor niet te zien'
              )
            }
          />
        }
      />
    </>
  )
}
