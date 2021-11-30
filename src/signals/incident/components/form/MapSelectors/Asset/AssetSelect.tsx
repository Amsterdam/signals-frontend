// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { FC, useEffect } from 'react'
import { useCallback, useState } from 'react'
import type { Incident } from 'types/incident'
import type { LatLngExpression } from 'leaflet'
import { ClickEventHandler } from '../types'
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
  handler: () => { value: Item[] }
  layer?: FC
  meta: Meta
  parent: {
    meta: {
      incidentContainer: { incident: Pick<Incident, 'location'> }
      updateIncident: (data: { [key: string]: Item[] }) => void
    }
  }
}

const AssetSelect: FC<AssetSelectProps> = ({
  handler,
  layer,
  meta,
  parent,
}) => {
  const value = handler().value
  const [showMap, setShowMap] = useState(false)
  const [message, setMessage] = useState<string>()
  const [featureTypes, setFeatureTypes] = useState<FeatureType[]>([])

  const { coordinates } =
    parent.meta.incidentContainer.incident.location.geometrie
  const location: LatLngExpression = [coordinates[1], coordinates[0]]

  /* istanbul ignore next */
  const update = useCallback(
    (selectedValue: Item[]) => {
      if (meta.name)
        parent.meta.updateIncident({ [meta.name as string]: selectedValue })
    },
    [meta.name, parent.meta]
  )

  const edit = useCallback<ClickEventHandler>(
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
        selection: value,
        layer,
        location,
        meta: {
          ...meta,
          featureTypes,
        },
        message,
        update,
        edit,
        close,
        setMessage,
      }}
    >
      {!showMap && value.length === 0 && <Intro />}

      {showMap && <Selector />}

      {!showMap && value.length > 0 && <Summary />}
    </AssetSelectProvider>
  )
}

export default AssetSelect
