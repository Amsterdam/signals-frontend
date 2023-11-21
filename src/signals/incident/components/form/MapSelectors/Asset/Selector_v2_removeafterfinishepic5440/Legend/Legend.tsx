// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { NEARBY_TYPE, UNREGISTERED_TYPE } from '../../../constants'
import AssetSelectContext from '../../context'
import { LegendToggleButton, StyledLegendPanel } from '../DetailPanel/styled'

type Props = {
  onLegendOpen: () => void
}

const Legend = ({ onLegendOpen }: Props) => {
  const [showLegendPanel, setShowLegendPanel] = useState(false)
  const closeLegendRef = useRef<HTMLButtonElement>(null)
  const legendButtonRef = useRef<HTMLButtonElement>(null)

  const { meta } = useContext(AssetSelectContext)

  /* istanbul ignore next */
  const toggleLegend = useCallback(() => {
    if (showLegendPanel && legendButtonRef.current) {
      legendButtonRef.current.focus()
    }
    setShowLegendPanel(!showLegendPanel)

    onLegendOpen()
  }, [onLegendOpen, showLegendPanel])
  const featureStatusTypes = meta.featureStatusTypes || []

  const nearbyLegendItem = {
    label: 'Bestaande melding',
    icon: {
      iconUrl: '/assets/images/area-map/icon-pin.svg',
      iconSize: [40, 40],
    },
    typeValue: NEARBY_TYPE,
  }
  const { featureTypes } = meta

  useEffect(() => {
    if (closeLegendRef?.current && showLegendPanel) {
      closeLegendRef.current.focus()
    }
  }, [closeLegendRef, showLegendPanel])

  const legendItems = [...featureTypes, ...featureStatusTypes, nearbyLegendItem]
    .filter(({ typeValue }) => typeValue !== UNREGISTERED_TYPE) // Filter the unknown icon from the legend
    .map((featureType) => ({
      label: featureType.label,
      iconUrl: featureType.icon.iconUrl,
      id: featureType.typeValue,
    }))
  return (
    <>
      {legendItems.length > 0 && (
        <>
          <StyledLegendPanel
            onClose={toggleLegend}
            slide={showLegendPanel ? 'in' : 'out'}
            items={legendItems}
            buttonRef={closeLegendRef}
          />

          <LegendToggleButton
            onClick={toggleLegend}
            isOpen={showLegendPanel}
            legendButtonRef={legendButtonRef}
          />
        </>
      )}
    </>
  )
}

export default Legend
