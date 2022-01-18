// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FC } from 'react'
import { useEffect } from 'react'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import reverseGeocoderService from 'shared/services/reverse-geocoder'
import {
  makeSelectAddress,
  makeSelectCoordinates,
} from 'signals/incident/containers/IncidentContainer/selectors'

import type { Incident, Location } from 'types/incident'
import type { LatLngLiteral } from 'leaflet'
import defaultFeatureMarkerUrl from 'shared/images/featureDefaultMarker.svg?url'
import unknownFeatureMarkerUrl from 'shared/images/featureUnknownMarker.svg?url'
import type { EventHandler, FeatureType, Item, Meta } from '../types'
import { UNREGISTERED_TYPE } from '../constants'
import { AssetSelectProvider } from './context'
import Intro from './Intro'
import Selector from './Selector'
import Summary from './Summary'

const defaultIconConfig: FeatureType['icon'] = {
  options: {
    className: 'object-marker',
    iconSize: [40, 40],
  },
  iconUrl: defaultFeatureMarkerUrl,
}
const defaultUnregisteredIconConfig: FeatureType['icon'] = {
  options: {
    className: 'object-marker',
    iconSize: [40, 40],
  },
  iconUrl: unknownFeatureMarkerUrl,
}

export interface AssetSelectProps {
  handler: () => { value?: Item }
  layer?: FC
  meta: Meta
  parent: {
    meta: {
      incidentContainer: { incident: Pick<Incident, 'location'> }
      updateIncident: (data: { [key: string]: any }) => void
    }
  }
}

const AssetSelect: FC<AssetSelectProps> = ({
  handler,
  layer,
  meta,
  parent,
}) => {
  const selection = handler().value
  const [showMap, setShowMap] = useState(false)
  const [message, setMessage] = useState<string>()
  const [featureTypes, setFeatureTypes] = useState<FeatureType[]>([])
  const coordinates = useSelector(makeSelectCoordinates)
  const address = useSelector(makeSelectAddress)

  const setItem = useCallback(
    (item: Item) => {
      const { location, ...restItem } = item
      const { address: addr, coordinates: coords } = location
      const itemCoords = item?.type === UNREGISTERED_TYPE ? coordinates : coords
      const itemAddress = item?.type === UNREGISTERED_TYPE ? address : addr

      parent.meta.updateIncident({
        location: {
          coordinates: itemCoords,
          address: itemAddress,
        },
        [meta.name as string]: restItem,
      })
    },
    [address, coordinates, meta.name, parent.meta]
  )

  const removeItem = useCallback(() => {
    parent.meta.updateIncident({
      location: {},
      [meta.name as string]: undefined,
    })
  }, [meta.name, parent.meta])

  const getUpdatePayload = useCallback(
    (location: Item['location']) => {
      const payload: Record<string, any> = {}

      // Clicking the map should unset a previous selection and preset it with an item that we know
      // doesn't exist on the map. By setting UNREGISTERED_TYPE, the checkbox in the selection panel
      // will be checked whenever a click on the map is registered
      payload[meta.name as string] = { type: UNREGISTERED_TYPE }

      payload.location = location

      return payload
    },
    [meta.name]
  )

  /**
   * Callback handler for map clicks; will fetch the address and dispatches both coordinates and
   * address to the global state.
   */
  const fetchLocation = useCallback(
    async (latLng: LatLngLiteral) => {
      const location: Item['location'] = {
        coordinates: latLng,
        address,
      }

      const payload = getUpdatePayload(location)

      // immediately set the location so that the marker is placed on the map; the reverse geocoder response
      // might take some time to resolve, leaving the user wondering if the map click actually did anything
      parent.meta.updateIncident(payload)

      const response = await reverseGeocoderService(latLng)

      if (response) {
        payload.location.address = response.data.address

        parent.meta.updateIncident(payload)
      }
    },
    [address, getUpdatePayload, parent.meta]
  )

  const setLocation = useCallback(
    (location: Location) => {
      const payload = getUpdatePayload(location)

      parent.meta.updateIncident(payload)
    },
    [parent.meta, getUpdatePayload]
  )

  const edit = useCallback<EventHandler>(
    (event) => {
      event.preventDefault()
      setShowMap(true)
    },
    [setShowMap]
  )

  const close = useCallback<() => void>(() => {
    setShowMap(false)
  }, [setShowMap])

  useEffect(() => {
    if (!meta.featureTypes.length) return

    setFeatureTypes(
      meta.featureTypes.map((featureType) => {
        const defaultConfig =
          featureType.typeValue === UNREGISTERED_TYPE
            ? defaultUnregisteredIconConfig
            : defaultIconConfig

        return {
          ...featureType,
          icon: {
            ...defaultConfig,
            ...(featureType.icon || {}),
            options: {
              ...defaultConfig.options,
              ...(featureType.icon?.options || {}),
            },
          },
        }
      })
    )
  }, [meta.featureTypes])

  return (
    <AssetSelectProvider
      value={{
        address,
        coordinates,
        close,
        edit,
        layer,
        message,
        meta: {
          ...meta,
          featureTypes,
        },
        removeItem,
        selection,
        setLocation,
        setItem,
        fetchLocation,
        setMessage,
      }}
    >
      {!showMap && !selection && <Intro />}

      {showMap && <Selector />}

      {!showMap && selection && <Summary />}
    </AssetSelectProvider>
  )
}

export default AssetSelect
