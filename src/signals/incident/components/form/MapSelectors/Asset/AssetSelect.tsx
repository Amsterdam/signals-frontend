// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FC } from 'react'
import { useEffect } from 'react'
import { useCallback, useState } from 'react'

import reverseGeocoderService from 'shared/services/reverse-geocoder'

import type { Incident, Location } from 'types/incident'
import type { LatLngLiteral } from 'leaflet'
import type { EventHandler, FeatureType, Item, Meta } from '../types'

import { UNKNOWN_TYPE, UNREGISTERED_TYPE } from '../constants'
import { AssetSelectProvider } from './context'
import Intro from './Intro'
import Selector from './Selector'
import Summary from './Summary'

const defaultIconConfig: FeatureType['icon'] = {
  options: {
    className: 'object-marker',
    iconSize: [40, 40],
  },
  iconUrl: '/assets/images/featureDefaultMarker.svg',
}
const defaultUnregisteredIconConfig: FeatureType['icon'] = {
  options: {
    className: 'object-marker',
    iconSize: [40, 40],
  },
  iconUrl: '/assets/images/featureUnknownMarker.svg',
}

export interface AssetSelectProps {
  value?: {
    selection?: Item
    location?: Location
  }
  layer?: FC
  meta: Meta
  parent: {
    meta: {
      incidentContainer: { incident: Pick<Incident, 'location'> }
      updateIncident: (data: { [key: string]: any }) => void
    }
  }
}

const AssetSelect: FC<AssetSelectProps> = ({ value, layer, meta, parent }) => {
  const { selection, location } = value || {}
  const [showMap, setShowMap] = useState(false)
  const [message, setMessage] = useState<string>()
  const [featureTypes, setFeatureTypes] = useState<FeatureType[]>([])
  const { coordinates, address } = location || {}
  const hasSelection = selection || coordinates

  /**
   * Selecting an object on the map
   */
  const setItem = useCallback(
    (selectedItem: Item, itemLocation?: Location) => {
      const payload = { selection: selectedItem, location }

      if (itemLocation) {
        payload.location = itemLocation
      }

      parent.meta.updateIncident({
        [meta.name as string]: payload,
      })
    },
    [location, meta.name, parent.meta]
  )

  const removeItem = useCallback(() => {
    parent.meta.updateIncident({
      [meta.name as string]: {},
    })
  }, [meta.name, parent.meta])

  const getUpdatePayload = useCallback(
    (location: Item['location']) => {
      const payload: Record<string, any> = {}

      // Clicking the map should unset a previous selection and preset it with an item that we know
      // doesn't exist on the map.
      payload[meta.name as string] = {
        location,
      }

      if (selection?.type === UNKNOWN_TYPE) {
        payload[meta.name as string].selection = selection
      } else {
        payload[meta.name as string].selection = undefined
      }

      return payload
    },
    [meta.name, selection]
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

      payload[meta.name as string].location.address = response?.data?.address

      parent.meta.updateIncident(payload)
    },
    [address, getUpdatePayload, meta.name, parent.meta]
  )

  /**
   * Address auto complete selection
   */
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
      {!showMap && !hasSelection && <Intro />}

      {showMap && <Selector />}

      {!showMap && hasSelection && <Summary />}
    </AssetSelectProvider>
  )
}

export default AssetSelect
