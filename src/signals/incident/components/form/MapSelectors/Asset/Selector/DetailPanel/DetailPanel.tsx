// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useCallback, useState, useContext } from 'react'
import {
  Paragraph,
  Label,
  Input,
  Checkbox,
  Button,
  breakpoint,
  ascDefaultTheme,
} from '@amsterdam/asc-ui'
import { useMediaQuery } from 'react-responsive'

import type { KeyboardEvent, ChangeEvent, FC } from 'react'
import {
  selectionIsNearby,
  selectionIsObject,
  selectionIsUndetermined,
  UNKNOWN_TYPE,
} from 'signals/incident/components/form/MapSelectors/constants'

import { UNREGISTERED_TYPE } from 'signals/incident/components/form/MapSelectors/constants'

import { formatAddress } from 'shared/services/format-address'
import type { PdokResponse } from 'shared/services/map-location'
import { ChevronLeft } from '@amsterdam/asc-assets'
import AssetSelectContext from '../../context'
import { ScrollWrapper, Title } from '../styled'
import {
  AddressPanel,
  Description,
  LegendToggleButton,
  OptionsList,
  PanelContent,
  StyledAssetList,
  StyledButton,
  StyledLegendPanel,
  StyledPDOKAutoSuggest,
  SelectionNearby,
} from './styled'

export interface DetailPanelProps {
  language?: Record<string, string>
}

const DetailPanel: FC<DetailPanelProps> = ({ language = {} }) => {
  const shouldRenderAddressPanel = useMediaQuery({
    query: breakpoint('max-width', 'tabletM')({ theme: ascDefaultTheme }),
  })
  const [showLegendPanel, setShowLegendPanel] = useState(false)
  const [optionsList, setOptionsList] = useState(null)
  const [showAddressPanel, setShowAddressPanel] = useState(false)
  const {
    coordinates,
    address,
    selection,
    removeItem,
    setItem,
    setLocation,
    close,
    meta,
  } = useContext(AssetSelectContext)
  const { featureTypes } = meta
  const featureStatusTypes = meta.featureStatusTypes || []

  let addressValue = address ? formatAddress(address) : ''
  addressValue =
    coordinates && !addressValue
      ? 'Locatie is gepind op de kaart'
      : addressValue

  const selectionOnMap =
    selection && selectionIsObject(selection) ? selection : undefined

  const unregisteredAsset =
    selection && selectionIsUndetermined(selection) ? selection : undefined

  const selectionNearyby =
    selection && selectionIsNearby(selection) ? selection : undefined

  const [showObjectIdInput, setShowObjectIdInput] = useState(
    selection?.type === UNKNOWN_TYPE
  )
  const [unregisteredAssetValue, setUnregisteredAssetValue] = useState(
    unregisteredAsset?.id || ''
  )

  const unregisteredLabel =
    language.unregistered || 'Het object staat niet op de kaart'

  const legendItems = [...featureTypes, ...featureStatusTypes]
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

  const closeAddressPanel = useCallback(() => {
    setShowAddressPanel(false)
    setOptionsList(null)
  }, [])

  const onAddressSelect = useCallback(
    (option: PdokResponse) => {
      const { location, address } = option.data

      setLocation({ coordinates: location, address })
      closeAddressPanel()
    },
    [closeAddressPanel, setLocation]
  )

  const clearInput = useCallback(() => {
    removeItem()
    setOptionsList(null)
  }, [removeItem])

  return (
    <PanelContent
      data-testid="detailPanel"
      smallViewport={showAddressPanel && shouldRenderAddressPanel}
    >
      <Title>{language.title || 'Locatie'}</Title>

      <ScrollWrapper>
        <Paragraph strong gutterBottom={16}>
          {language.subTitle || 'U kunt maar een object kiezen'}
          <Description>
            {language.description ||
              'Typ het dichtstbijzijnde adres of klik de locatie aan op de kaart'}
          </Description>
        </Paragraph>

        {!(showAddressPanel && shouldRenderAddressPanel) && (
          <StyledPDOKAutoSuggest
            onFocus={() => {
              setShowAddressPanel(true)
            }}
            onClear={removeItem}
            onSelect={onAddressSelect}
            value={addressValue}
          />
        )}

        {selection && selectionOnMap && (
          <StyledAssetList
            selection={selection}
            onRemove={removeItem}
            featureTypes={featureTypes}
            featureStatusTypes={featureStatusTypes}
          />
        )}

        {selectionNearyby && (
          <SelectionNearby>
            <Paragraph strong>Deze melding is al bij ons bekend:</Paragraph>
            <strong>{selection?.label}</strong>
            <span>{selection?.description}</span>
          </SelectionNearby>
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

      {showAddressPanel && shouldRenderAddressPanel && (
        <AddressPanel data-testid="addressPanel">
          <header>
            <Button
              icon={<ChevronLeft />}
              iconSize={16}
              onClick={closeAddressPanel}
              size={24}
              variant="blank"
            />
            <StyledPDOKAutoSuggest
              onClear={clearInput}
              onData={setOptionsList}
              onSelect={onAddressSelect}
              showInlineList={false}
              value={addressValue}
            />
          </header>

          {optionsList ? (
            <OptionsList data-testid="optionsList">{optionsList}</OptionsList>
          ) : (
            <Paragraph className="instruction">
              Zoek adres of postcode
            </Paragraph>
          )}
        </AddressPanel>
      )}
    </PanelContent>
  )
}

export default DetailPanel
