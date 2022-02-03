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
  makeSelectExtraProperties,
} from 'signals/incident/containers/IncidentContainer/selectors'

import type { Incident, Location } from 'types/incident'
import type { LatLngLiteral } from 'leaflet'
import type { EventHandler, FeatureType, Item, Meta } from '../types'

import {
  OBJECT_NOT_ON_MAP,
  OBJECT_UNKNOWN,
  selectionIsObject,
} from '../constants'
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
  layer?: FC
  meta: Meta
  parent: {
    meta: {
      incidentContainer: { incident: Pick<Incident, 'location'> }
      updateIncident: (data: { [key: string]: any }) => void
    }
  }
}

interface UpdatePayload extends Record<string, unknown> {
  location?: Item['location']
}

const AssetSelect: FC<AssetSelectProps> = ({ layer, meta, parent }) => {
  const [showMap, setShowMap] = useState(false)
  const [message, setMessage] = useState<string>()
  const [featureTypes, setFeatureTypes] = useState<FeatureType[]>([])
  const coordinates = useSelector(makeSelectCoordinates)
  const address = useSelector(makeSelectAddress)
  const selection = useSelector(
    // ignoring linter till incident selectors are converted to TS
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (state) => makeSelectExtraProperties(state, meta.name)
  )

  const hasSelection = selection || coordinates

  const updateIncident = useCallback(
    (payload: UpdatePayload) => {
      parent.meta.updateIncident(payload)
    },
    [parent.meta]
  )

  /**
   * Indicate that an object is not visible on the map
   */
  const setNotOnMap = useCallback(
    (itemNotPresentOnMap?: boolean) => {
      const payload: Record<string, any> = {}

      if (coordinates) {
        payload.location = {
          coordinates,
          address,
        }
      }

      const type = itemNotPresentOnMap ? OBJECT_NOT_ON_MAP : OBJECT_UNKNOWN

      payload[meta.name as string] = {
        type,
      }

      updateIncident(payload)
    },
    [address, coordinates, meta.name, updateIncident]
  )

  /**
   * Selecting an object on the map
   */
  const setItem = useCallback(
    (item: Item) => {
      const { location, ...restItem } = item
      const { address: addr, coordinates: coords } = location
      const itemCoords = !selectionIsObject(item) ? coordinates : coords
      const itemAddress = !selectionIsObject(item) ? address : addr

      updateIncident({
        location: {
          coordinates: itemCoords,
          address: itemAddress,
        },
        [meta.name as string]: restItem,
      })
    },
    [address, coordinates, meta.name, updateIncident]
  )

  const removeItem = useCallback(() => {
    updateIncident({
      location: {},
      [meta.name as string]: undefined,
    })
  }, [meta.name, updateIncident])

  const getUpdatePayload = useCallback(
    (location: Item['location']) => {
      const payload: Record<string, any> = {}

      payload[meta.name as string] = { type: OBJECT_UNKNOWN }

      // If the checkbox, that indicates that an object is not visible on the map, is checked,
      // this setting should be retained. If not, then a click on the map will not show that
      // the object is not visible on the map (in the summary), even though the box was ticked.
      if (selection?.type === OBJECT_NOT_ON_MAP) {
        const { id, label } = selection

        payload[meta.name as string] = {
          ...payload[meta.name as string],
          ...{ id, label },
          type: OBJECT_NOT_ON_MAP,
        }
      }

      payload.location = location

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

      // Immediately set the location so that the marker is placed on the map; the reverse geocoder response
      // might take some time to resolve, leaving the user wondering if the map click actually did anything.
      // If the geocoder response never comes through, at least we have coordinates.
      updateIncident(payload)

      const response = await reverseGeocoderService(latLng)

      payload.location.address = response?.data?.address

      updateIncident(payload)
    },
    [address, getUpdatePayload, updateIncident]
  )

  /**
   * Address auto complete selection
   */
  const setLocation = useCallback(
    (location: Location) => {
      const payload = getUpdatePayload(location)

      updateIncident(payload)
    },
    [updateIncident, getUpdatePayload]
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
          featureType.typeValue === OBJECT_NOT_ON_MAP
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
        setNotOnMap,
      }}
    >
      {!showMap && !hasSelection && <Intro />}

      {showMap && <Selector />}

      {!showMap && hasSelection && <Summary />}
    </AssetSelectProvider>
  )
}

export default AssetSelect
