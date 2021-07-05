// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useCallback, ChangeEvent } from 'react'
import type { FunctionComponent } from 'react'
import styled from 'styled-components'

import { MapPanelContent } from '@amsterdam/arm-core'
import {
  Paragraph,
  Button,
  themeColor,
  themeSpacing,
  Label,
  Checkbox,
} from '@amsterdam/asc-ui'

import type { Variant } from '@amsterdam/arm-core/lib/components/MapPanel/MapPanelContext'
import SelectionList from '../../SelectionList'

import type { Item } from '../../types'
import { UNREGISTERED_TYPE } from '../../../constants'
import { FeatureType, Icon } from '../../types'

const StyledSelectionList = styled(SelectionList)`
  margin: ${themeSpacing(2)} 0 ${themeSpacing(4)} 0;
`

const StyledParagraph = styled(Paragraph)`
  margin-bottom: 0;
  font-size: 16px;
  opacity: 0.6;
`

const EmptySelectionWrapper = styled.div`
  background-color: ${themeColor('tint', 'level2')};
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${themeSpacing(4)} 0;
`

const StyledButton = styled(Button)`
  margin-top: ${themeSpacing(6)};
`

export interface SelectionPanelProps {
  onChange: (items: Item[]) => void
  onClose: () => void
  variant: Variant
  selection: Item[]
  featureTypes: FeatureType[]
  icons: Icon[]
}

const SelectionPanel: FunctionComponent<SelectionPanelProps> = ({
  onChange,
  onClose,
  variant,
  selection,
  featureTypes,
  icons,
}) => {
  const selectionOnMap = selection.filter(
    (item) => item.type !== UNREGISTERED_TYPE
  )
  const hasSelectedUnregisteredTree =
    selection.findIndex((item) => item.type === UNREGISTERED_TYPE) !== -1

  const unregisteredFeature = featureTypes.find(
    (feature) => feature.typeValue === UNREGISTERED_TYPE
  )

  const removeCaterpillar = useCallback(
    (itemId: string) => {
      onChange(selection.filter(({ id }) => id !== itemId))
    },
    [selection, onChange]
  )

  const removeCaterpillarUnregistered = useCallback(() => {
    onChange(selectionOnMap)
  }, [selectionOnMap, onChange])

  const addCaterpillarUnregistered = useCallback(() => {
    /* istanbul ignore next */
    if (unregisteredFeature) {
      onChange([
        ...selectionOnMap,
        {
          id: '',
          type: unregisteredFeature.typeValue,
          description: unregisteredFeature.description,
        },
      ])
    }
  }, [unregisteredFeature, onChange, selectionOnMap])

  const toggleUnregisteredCaterpillar = useCallback(
    ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
      if (checked) {
        addCaterpillarUnregistered()
      } else {
        removeCaterpillarUnregistered()
      }
    },
    [addCaterpillarUnregistered, removeCaterpillarUnregistered]
  )

  const selectedItems = selectionOnMap.length ? (
    <StyledSelectionList
      selection={selectionOnMap}
      onRemove={removeCaterpillar}
      showReportedInfo
      featureTypes={featureTypes}
      icons={icons}
    />
  ) : (
    <EmptySelectionWrapper>
      <StyledParagraph>Maak een keuze op de kaart</StyledParagraph>
    </EmptySelectionWrapper>
  )

  return (
    <MapPanelContent
      variant={variant}
      title="Kies de boom"
      data-testid="selectionPanel"
    >
      <Paragraph>U kunt meer dan 1 keuze maken</Paragraph>

      {selectedItems}

      {unregisteredFeature && (
        <div>
          <Checkbox
            id="unregisteredCaterpillarCheckbox"
            checked={hasSelectedUnregisteredTree}
            onChange={toggleUnregisteredCaterpillar}
          />
          <Label
            htmlFor="unregisteredCaterpillarCheckbox"
            label="De boom staat niet op de kaart"
          />
        </div>
      )}

      <StyledButton onClick={onClose} variant="primary">
        Meld deze boom
      </StyledButton>
    </MapPanelContent>
  )
}

export default SelectionPanel
