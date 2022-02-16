// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useCallback, useState, useContext } from 'react'
import { Paragraph, Label, Input, Checkbox } from '@amsterdam/asc-ui'

import type { KeyboardEvent, ChangeEvent, FC } from 'react'
import type { FeatureType } from 'signals/incident/components/form/MapSelectors/types'
import {
  selectionIsObject,
  selectionIsUndetermined,
  UNKNOWN_TYPE,
} from 'signals/incident/components/form/MapSelectors/constants'

import { UNREGISTERED_TYPE } from 'signals/incident/components/form/MapSelectors/constants'

import { formatAddress } from 'shared/services/format-address'
import type { PdokResponse } from 'shared/services/map-location'
import AssetSelectContext from '../../context'
import { ScrollWrapper, Title } from '../styled'
import {
  PanelContent,
  Description,
  StyledAssetList,
  StyledButton,
  StyledLegendPanel,
  LegendToggleButton,
  StyledPDOKAutoSuggest,
} from './styled'

export interface DetailPanelProps {
  featureTypes: FeatureType[]
  language?: Record<string, string>
}

const DetailPanel: FC<DetailPanelProps> = ({ featureTypes, language = {} }) => {
  const [showLegendPanel, setShowLegendPanel] = useState(false)
  const { address, selection, removeItem, setItem, setLocation, close } =
    useContext(AssetSelectContext)

  const addressValue = address ? formatAddress(address) : ''

  const selectionOnMap =
    selection && selectionIsObject(selection) ? selection : undefined

  const unregisteredAsset =
    selection && selectionIsUndetermined(selection) ? selection : undefined

  const [showObjectIdInput, setShowObjectIdInput] = useState(
    selection?.type === UNKNOWN_TYPE
  )
  const [unregisteredAssetValue, setUnregisteredAssetValue] = useState(
    unregisteredAsset?.id || ''
  )

  const unregisteredLabel =
    language.unregistered || 'Het object staat niet op de kaart'

  const legendItems = featureTypes
    .filter(({ typeValue }) => typeValue !== UNREGISTERED_TYPE) // Filter the unknown icon from the legend
    .map((featureType) => ({
      label: featureType.label,
      iconUrl: featureType.icon.iconUrl,
      id: featureType.typeValue,
    }))

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUnregisteredAssetValue(event.currentTarget.value.trim())
  }

  const onSetItem = useCallback(() => {
    setItem({
      id: unregisteredAssetValue,
      type: UNKNOWN_TYPE,
      label: [unregisteredLabel, unregisteredAssetValue]
        .filter(Boolean)
        .join(' - '),
    })
  }, [unregisteredLabel, setItem, unregisteredAssetValue])

  const onCheck = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setShowObjectIdInput(event.target.checked)

      if (event.target.checked) {
        onSetItem()
      } else {
        setItem({
          type: UNKNOWN_TYPE,
        })
      }
    },
    [onSetItem, setItem]
  )

  const onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onSetItem()
        close()
      }
    },
    [close, onSetItem]
  )

  const toggleLegend = useCallback(() => {
    setShowLegendPanel(!showLegendPanel)
  }, [showLegendPanel])

  const onAddressSelect = useCallback(
    (option: PdokResponse) => {
      const { location, address } = option.data

      setLocation({ coordinates: location, address })
    },
    [setLocation]
  )

  return (
    <PanelContent data-testid="detailPanel">
      <Title>{language.title || 'Locatie'}</Title>

      <ScrollWrapper>
        <Paragraph strong gutterBottom={16}>
          {language.subTitle || 'U kunt maar een object kiezen'}
          <Description>
            {language.description ||
              'Typ het dichtstbijzijnde adres of klik de locatie aan op de kaart'}
          </Description>
        </Paragraph>

        <StyledPDOKAutoSuggest
          onSelect={onAddressSelect}
          placeholder="Zoek adres"
          value={addressValue}
        />

        {selection && selectionOnMap && (
          <StyledAssetList
            selection={selection}
            onRemove={removeItem}
            featureTypes={featureTypes}
          />
        )}

        {featureTypes.length > 0 && (!selection || unregisteredAsset) && (
          <div data-testid="unregisteredObjectPanel">
            <Checkbox
              id="unregisteredAssetCheckbox"
              checked={showObjectIdInput}
              onChange={onCheck}
            />
            <Label
              htmlFor="unregisteredAssetCheckbox"
              label={unregisteredLabel}
            />

            {showObjectIdInput && language.unregisteredId && (
              <>
                <Label
                  htmlFor="unregisteredAssetInput"
                  label={
                    <>
                      <strong>{language.unregisteredId}</strong> (niet
                      verplicht)
                    </>
                  }
                />
                <Input
                  data-testid="unregisteredAssetInput"
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
          {language.submit || 'Meld dit object'}
        </StyledButton>
      </ScrollWrapper>

      {legendItems.length > 0 && (
        <>
          <StyledLegendPanel
            onClose={toggleLegend}
            slide={showLegendPanel ? 'in' : 'out'}
            items={legendItems}
          />

          <LegendToggleButton onClick={toggleLegend} />
        </>
      )}
    </PanelContent>
  )
}

export default DetailPanel
