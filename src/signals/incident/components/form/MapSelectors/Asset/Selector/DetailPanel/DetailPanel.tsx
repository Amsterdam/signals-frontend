// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import { useCallback, useState, useContext, useRef, useEffect } from 'react'
import type { KeyboardEvent, ChangeEvent, FC } from 'react'

import { ChevronLeft } from '@amsterdam/asc-assets'
import {
  Label,
  Input,
  Checkbox,
  Button,
  breakpoint,
  ascDefaultTheme,
} from '@amsterdam/asc-ui'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'

import { formatAddress } from 'shared/services/format-address'
import type { PdokResponse } from 'shared/services/map-location'
import {
  selectionIsObject,
  selectionIsUndetermined,
  UNKNOWN_TYPE,
  NEARBY_TYPE,
  UNREGISTERED_TYPE,
} from 'signals/incident/components/form/MapSelectors/constants'
import { closeMap } from 'signals/incident/containers/IncidentContainer/actions'

import {
  AddressPanel,
  Description,
  LegendToggleButton,
  OptionsList,
  PanelContent,
  StyledAssetList,
  StyledButton,
  StyledLabelPDOkAutoSuggest,
  StyledLegendPanel,
  StyledPDOKAutoSuggest,
} from './styled'
import AssetSelectContext from '../../context'
import { ScrollWrapper, Title } from '../styled'

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
    // Set breakpoint to mobile instead of tablet since desktop will get the mobile version when zoom on 200% which is not accesible with keyboard.
    query: breakpoint('max-width', 'mobileL')({ theme: ascDefaultTheme }),
  })
  const [showLegendPanel, setShowLegendPanel] = useState(false)
  const closeLegendRef = useRef<HTMLButtonElement>(null)
  const legendButtonRef = useRef<HTMLButtonElement>(null)
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
    setUnregisteredAssetValue(event.currentTarget.value)
  }

  const onSetUnregisteredItem = useCallback(() => {
    removeItem()
    const trimmedUnregisteredAssetValue = `${unregisteredAssetValue}`.trim()
    setItem({
      id: trimmedUnregisteredAssetValue,
      type: UNKNOWN_TYPE,
      label: [unregisteredLabel, trimmedUnregisteredAssetValue]
        .filter(Boolean)
        .join(' - '),
    })
  }, [removeItem, setItem, unregisteredAssetValue, unregisteredLabel])

  const onCheck = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setShowObjectIdInput(event.target.checked)

      if (event.target.checked) {
        onSetUnregisteredItem()
      } else {
        setItem({
          type: UNKNOWN_TYPE,
        })
      }
    },
    [onSetUnregisteredItem, setItem]
  )

  const onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onSetUnregisteredItem()
        dispatch(closeMap())
      }
    },
    [onSetUnregisteredItem, dispatch]
  )

  const toggleLegend = useCallback(() => {
    if (showLegendPanel && legendButtonRef.current) {
      legendButtonRef.current.focus()
    }
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

  useEffect(() => {
    if (closeLegendRef?.current && showLegendPanel) {
      closeLegendRef.current.focus()
    }
  }, [closeLegendRef, showLegendPanel])

  return (
    <PanelContent
      data-testid="detail-panel"
      smallViewport={showAddressPanel && shouldRenderAddressPanel}
    >
      <Title>{language.title || 'Locatie'}</Title>

      <ScrollWrapper>
        <StyledLabelPDOkAutoSuggest htmlFor={'location'}>
          {language.subTitle || 'U kunt maar een object kiezen'}
          <Description>
            {language.description ||
              'Typ het dichtstbijzijnde adres, klik de locatie aan op de kaart of gebruik "Mijn locatie"'}
          </Description>
        </StyledLabelPDOkAutoSuggest>

        {!(showAddressPanel && shouldRenderAddressPanel) && (
          <StyledPDOKAutoSuggest
            onFocus={() => {
              setShowAddressPanel(true)
            }}
            id={'location'}
            onClear={removeItem}
            onSelect={onAddressSelect}
            value={addressValue}
            placeholder="Zoek naar adres"
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
          <div data-testid="unregistered-object-panel">
            <Checkbox
              id="unregisteredAssetCheckbox"
              data-testid="unregistered-asset-checkbox"
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
                  data-testid="unregistered-asset-input"
                  id="unregisteredAssetInput"
                  onBlur={onSetUnregisteredItem}
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
          data-testid="asset-select-submit-button"
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
            buttonRef={closeLegendRef}
          />

          <LegendToggleButton
            onClick={toggleLegend}
            isOpen={showLegendPanel}
            legendButtonRef={legendButtonRef}
          />
        </>
      )}

      {showAddressPanel && shouldRenderAddressPanel && (
        <AddressPanel data-testid="address-panel" id="addressPanel">
          <header>
            <Button
              aria-label="Terug"
              aria-expanded={showAddressPanel}
              aria-controls="addressPanel"
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
              placeholder="Zoek naar adres"
              autoFocus={true}
            />
          </header>

          {optionsList && (
            <OptionsList data-testid="options-list">{optionsList}</OptionsList>
          )}
        </AddressPanel>
      )}
    </PanelContent>
  )
}

export default DetailPanel
