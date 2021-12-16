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

import type { Incident } from 'types/incident'
import type { LatLngLiteral } from 'leaflet'
import type { EventHandler } from '../types'

import { UNREGISTERED_TYPE } from '../constants'
import { AssetSelectProvider } from './context'
import Intro from './Intro'
import Selector from './Selector'
import Summary from './Summary'

import type { FeatureType, Item, Meta } from './types'

const defaultIconConfig: FeatureType['icon'] = {
  options: {
    className: 'object-marker',
    iconSize: [40, 40],
  },
  iconSvg:
    '<svg width="40px" height="40px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>icon-select</title><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="icon-select"><circle id="Oval-2-Copy-21" stroke="#000000" stroke-width="4" fill="#FFFFFF" cx="20" cy="20" r="18"></circle><circle id="Oval-Copy" fill="#000000" cx="20" cy="20" r="6"></circle></g></g></svg>',
  selectedIconSvg:
    '<svg width="40px" height="40px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>icon-select</title><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="icon-select"><circle id="Oval-2-Copy-21" stroke="#EC0000" stroke-width="4" fill="#FFFFFF" cx="20" cy="20" r="18"></circle><circle id="Oval-Copy" fill="#EC0000" cx="20" cy="20" r="6"></circle></g></g></svg>',
}
const defaultUnregisteredIconConfig: FeatureType['icon'] = {
  options: {
    className: 'object-marker',
    iconSize: [40, 40],
  },
  iconSvg:
    '<svg width="40px" height="40px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>icon-unknown</title><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="icon/onbekend" stroke-width="2"><g id="icon-unknown"><circle id="Oval-2-Copy-23" stroke="#FFFFFF" fill="#B4B4B4" cx="20" cy="20" r="19"></circle><g transform="translate(10.000000, 10.000000)" stroke="#000000"><circle id="Oval" cx="10" cy="10" r="9"></circle><line x1="13" y1="7" x2="7" y2="13" id="Line-3" stroke-linecap="square"></line><line x1="13" y1="13" x2="7" y2="7" id="Line-3-Copy" stroke-linecap="square"></line></g></g></g></g></svg>',
  selectedIconSvg:
    '<svg width="40px" height="40px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>icon-select</title><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="icon-select"><circle id="Oval-2-Copy-21" stroke="#EC0000" stroke-width="4" fill="#FFFFFF" cx="20" cy="20" r="18"></circle><circle id="Oval-Copy" fill="#EC0000" cx="20" cy="20" r="6"></circle></g></g></svg>',
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

  /**
   * Callback handler for map clicks
   */
  const setLocation = useCallback(
    async (latLng: LatLngLiteral) => {
      const payload: Record<string, any> = {}

      // Clicking the map should unset a previous selection and preset it with an item that we know
      // doesn't exist on the map. By setting UNREGISTERED_TYPE, the checkbox in the selection panel
      // will be checked whenever a click on the map is registered
      payload[meta.name as string] = { type: UNREGISTERED_TYPE }

      const location: Item['location'] = {
        coordinates: latLng,
      }

      const response = await reverseGeocoderService(latLng)

      if (response) {
        location.address = response.data.address
      }

      payload.location = location

      parent.meta.updateIncident(payload)
    },
    [meta.name, parent.meta]
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
        selection,
        setLocation,
        setMessage,
        setItem,
        removeItem,
      }}
    >
      {!showMap && <Intro />}

      {showMap && <Selector />}

      {!showMap && selection && <Summary />}
    </AssetSelectProvider>
  )
}

export default AssetSelect
