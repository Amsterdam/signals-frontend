// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
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
  selectionIsObject,
  selectionIsUndetermined,
  UNKNOWN_TYPE,
  NEARBY_TYPE,
  UNREGISTERED_TYPE,
} from 'signals/incident/components/form/MapSelectors/constants'

import type { PdokResponse } from 'shared/services/map-location'
import { formatAddress } from 'shared/services/format-address'
import { ChevronLeft } from '@amsterdam/asc-assets'
import { useDispatch } from 'react-redux'
import { closeMap } from 'signals/incident/containers/IncidentContainer/actions'

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
} from './styled'

export interface DetailPanelProps {
  language?: Record<string, string>
}

const nearbyLegendItem = {
  label: 'Bestaande melding',
  icon: {
    iconUrl: '/assets/images/area-map/icon-pin.svg',
    iconSize: [40, 40],
  },
  typeValue: NEARBY_TYPE,
}

const DetailPanel: FC<DetailPanelProps> = ({ language = {} }) => {
  const shouldRenderAddressPanel = useMediaQuery({
    query: breakpoint('max-width', 'tabletM')({ theme: ascDefaultTheme }),
  })
  const [showLegendPanel, setShowLegendPanel] = useState(false)
  const [optionsList, setOptionsList] = useState(null)

  const [showAddressPanel, setShowAddressPanel] = useState(false)
  const dispatch = useDispatch()
  const { address, selection, removeItem, setItem, setLocation, meta } =
    useContext(AssetSelectContext)
  const { featureTypes } = meta
  const featureStatusTypes = meta.featureStatusTypes || []

  const addressValue = address ? formatAddress(address) : ''

  const unregisteredAsset =
    selection && selectionIsUndetermined(selection[0])
      ? selection[0]
      : undefined

  const selectionOnMap =
    selection && selectionIsObject(selection[0]) ? selection : undefined

  const [showObjectIdInput, setShowObjectIdInput] = useState(
    selection && selection[0].type === UNKNOWN_TYPE
  )
  const [unregisteredAssetValue, setUnregisteredAssetValue] = useState(
    unregisteredAsset?.id || ''
  )

  const unregisteredLabel =
    language.unregistered || 'Het object staat niet op de kaart'

  const legendItems = [...featureTypes, ...featureStatusTypes, nearbyLegendItem]
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
        dispatch(closeMap())
      }
    },
    [onSetItem, dispatch]
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
              'Typ het dichtstbijzijnde adres, klik de locatie aan op de kaart of gebruik "Mijn locatie"'}
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
            placeholder="Zoek adres of postcode"
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

        {featureTypes.length > 0 && (!selection || unregisteredAsset) && (
          <div data-testid="unregisteredObjectPanel">
            <Checkbox
              id="unregisteredAssetCheckbox"
              data-testid="unregisteredAssetCheckbox"
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
                  onSubmit={() => dispatch(closeMap())}
                  value={unregisteredAssetValue}
                />
              </>
            )}
          </div>
        )}

        <StyledButton
          onClick={() => dispatch(closeMap())}
          variant="primary"
          data-testid="assetSelectSubmitButton"
          tabIndex={0}
        >
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
              aria-label="Terug"
              icon={<ChevronLeft />}
              iconSize={16}
              onClick={closeAddressPanel}
              size={24}
              title="Terug"
              variant="blank"
            />
            <StyledPDOKAutoSuggest
              onClear={clearInput}
              onData={setOptionsList}
              onSelect={onAddressSelect}
              showInlineList={false}
              value={addressValue}
              placeholder="Zoek adres of postcode"
            />
          </header>

          {optionsList && (
            <OptionsList data-testid="optionsList">{optionsList}</OptionsList>
          )}
        </AddressPanel>
      )}
    </PanelContent>
  )
}

export default DetailPanel
