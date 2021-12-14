// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useCallback, useState, useContext, useEffect } from 'react'
import styled from 'styled-components'

import type { KeyboardEvent, ChangeEvent, FC } from 'react'
import type { Variant } from '@amsterdam/arm-core/lib/components/MapPanel/MapPanelContext'

import { MapPanelContent } from '@amsterdam/arm-core'
import {
  Paragraph,
  Button,
  themeSpacing,
  Label,
  Input,
  Checkbox,
} from '@amsterdam/asc-ui'

import AssetList from '../../AssetList'

import type { FeatureType } from '../../types'
import { UNREGISTERED_TYPE } from '../../../constants'
import AssetSelectContext from '../../../Asset/context'

const StyledAssetList = styled(AssetList)`
  margin: ${themeSpacing(2)} 0 ${themeSpacing(4)} 0;
`

const StyledButton = styled(Button)`
  margin-top: ${themeSpacing(6)};
`

export interface SelectionPanelProps {
  featureTypes: FeatureType[]
  language?: Record<string, string>
  variant: Variant
}

const SelectionPanel: FC<SelectionPanelProps> = ({
  variant,
  featureTypes,
  language = {},
}) => {
  const { selection, removeItem, setItem, close } =
    useContext(AssetSelectContext)

  const selectionOnMap =
    selection && selection.type !== UNREGISTERED_TYPE ? selection : undefined

  const unregisteredAsset =
    selection && selection.type === UNREGISTERED_TYPE ? selection : undefined

  const [showObjectIdInput, setShowObjectIdInput] = useState(
    unregisteredAsset !== undefined
  )
  const [unregisteredAssetValue, setUnregisteredAssetValue] = useState(
    unregisteredAsset?.id || ''
  )

  const onCheck = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setShowObjectIdInput(!showObjectIdInput)

      if (!event.target.checked) {
        removeItem()
      }
    },
    [removeItem, showObjectIdInput]
  )

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUnregisteredAssetValue(event.currentTarget.value)
  }, [])

  const onSetItem = useCallback(() => {
    setItem({
      location: {},
      id: unregisteredAssetValue,
      type: UNREGISTERED_TYPE,
    })
  }, [setItem, unregisteredAssetValue])

  const onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onSetItem()
        close()
      }
    },
    [close, onSetItem]
  )

  useEffect(() => {
    if (selectionOnMap) {
      setUnregisteredAssetValue('')
      setShowObjectIdInput(false)
    }
  }, [selectionOnMap])

  return (
    <MapPanelContent
      variant={variant}
      title={language.title || 'Kies het object'}
      data-testid="selectionPanel"
    >
      <Paragraph>
        {language.subTitle || 'U kunt maar een object kiezen'}
      </Paragraph>

      {selection && selectionOnMap && (
        <StyledAssetList
          selection={selection}
          onRemove={removeItem}
          featureTypes={featureTypes}
        />
      )}

      {(!selection || unregisteredAsset) && (
        <div>
          <Checkbox
            id="unregisteredAssetCheckbox"
            checked={showObjectIdInput}
            onChange={onCheck}
          />
          <Label
            htmlFor="unregisteredAssetCheckbox"
            label={language.unregistered || 'Het object staat niet op de kaart'}
          />

          {showObjectIdInput && (
            <>
              <Label
                htmlFor="unregisteredAssetInput"
                label={
                  <>
                    <strong>
                      {language.unregisteredId ||
                        'Wat is het nummer van het object?'}
                    </strong>{' '}
                    (niet verplicht)
                  </>
                }
              />
              <Input
                id="unregisteredAssetInput"
                onBlur={onSetItem}
                onChange={onChange}
                onKeyUp={onKeyUp}
                onSubmit={close}
                value={unregisteredAssetValue}
              />
            </>
          )}
        </div>
      )}

      <StyledButton onClick={close} variant="primary">
        {language.submitSingular || 'Meld dit object'}
      </StyledButton>
    </MapPanelContent>
  )
}

export default SelectionPanel
