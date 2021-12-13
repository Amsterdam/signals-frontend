// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { Fragment, useCallback, useMemo } from 'react'
import type { FunctionComponent, KeyboardEvent, ChangeEvent } from 'react'
import styled from 'styled-components'

import { MapPanelContent } from '@amsterdam/arm-core'
import {
  Paragraph,
  Button,
  themeColor,
  themeSpacing,
  Label,
  Input,
  Checkbox,
} from '@amsterdam/asc-ui'

import type { Variant } from '@amsterdam/arm-core/lib/components/MapPanel/MapPanelContext'
import AssetList from '../../AssetList'

import type { FeatureType, Item } from '../../types'
import { UNREGISTERED_TYPE } from '../../../constants'

const StyledAssetList = styled(AssetList)`
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
  language?: Record<string, string>
}

const SelectionPanel: FunctionComponent<SelectionPanelProps> = ({
  onChange,
  onClose,
  variant,
  selection,
  featureTypes,
  language = {},
}) => {
  const selectionOnMap = useMemo(
    () => selection.filter((asset) => asset.type !== UNREGISTERED_TYPE),
    [selection]
  )
  const unregisteredAsset = useMemo(
    () => selection.find((asset) => asset.type === UNREGISTERED_TYPE),
    [selection]
  )
  const hasUnregisteredAsset = useMemo(
    () => Boolean(unregisteredAsset),
    [unregisteredAsset]
  )

  const unregisteredFeature = useMemo(
    () =>
      featureTypes.find((feature) => feature.typeValue === UNREGISTERED_TYPE),
    [featureTypes]
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onClose()
      }
    },
    [onClose]
  )

  const removeAsset = useCallback(
    (itemId: string) => {
      onChange(selection.filter(({ id }) => id !== itemId))
    },
    [selection, onChange]
  )

  const removeAssetUnregistered = useCallback(() => {
    onChange(selectionOnMap)
  }, [selectionOnMap, onChange])

  const updateUnregisteredAsset = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      /* istanbul ignore next */
      if (unregisteredAsset) {
        onChange([
          ...selectionOnMap,
          { ...unregisteredAsset, id: event.currentTarget.value },
        ])
      }
    },
    [unregisteredAsset, onChange, selectionOnMap]
  )

  const addAssetUnregistered = useCallback(() => {
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

  const toggleUnregisteredAsset = useCallback(
    ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
      if (checked) {
        addAssetUnregistered()
      } else {
        removeAssetUnregistered()
      }
    },
    [addAssetUnregistered, removeAssetUnregistered]
  )

  return (
    <MapPanelContent
      variant={variant}
      title={language.title || 'Locatie'}
      data-testid="selectionPanel"
    >
      {selectionOnMap.length ? (
        <StyledAssetList
          selection={selectionOnMap}
          onRemove={removeAsset}
          featureTypes={featureTypes}
        />
      ) : (
        <EmptySelectionWrapper>
          <StyledParagraph>Maak een keuze op de kaart</StyledParagraph>
        </EmptySelectionWrapper>
      )}

      {unregisteredFeature && (
        <div>
          <Checkbox
            id="unregisteredAssetCheckbox"
            checked={hasUnregisteredAsset}
            onChange={toggleUnregisteredAsset}
          />
          <Label
            htmlFor="unregisteredAssetCheckbox"
            label={language.unregistered || 'Het object staat niet op de kaart'}
          />

          {unregisteredAsset && (
            <Fragment>
              <Label
                htmlFor="unregisteredAssetInput"
                label={
                  <Fragment>
                    <strong>
                      {language.unregisteredId ||
                        'Wat is het nummer van het object?'}
                    </strong>{' '}
                    (niet verplicht)
                  </Fragment>
                }
              />
              <Input
                id="unregisteredAssetInput"
                onSubmit={onClose}
                onKeyDown={handleKeyDown}
                onChange={updateUnregisteredAsset}
                value={unregisteredAsset.id}
              />
            </Fragment>
          )}
        </div>
      )}

      <StyledButton onClick={onClose} variant="primary">
        {selection.length > 1
          ? language.submitPlural || 'Meld deze objecten'
          : language.submitSingular || 'Meld dit object'}
      </StyledButton>
    </MapPanelContent>
  )
}

export default SelectionPanel
