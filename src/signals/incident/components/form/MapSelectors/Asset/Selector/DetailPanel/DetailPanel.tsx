// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import { useCallback, useState, useContext, useEffect } from 'react'
import { useFetch } from 'hooks'
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
  selectionIsNearby,
  UNKNOWN_TYPE,
  NEARBY_TYPE,
  UNREGISTERED_TYPE,
} from 'signals/incident/components/form/MapSelectors/constants'

import type { PdokResponse } from 'shared/services/map-location'
import type { FeatureCollection } from 'geojson'
import { formatAddress } from 'shared/services/format-address'
import { ChevronLeft } from '@amsterdam/asc-assets'
import configuration from 'shared/services/configuration/configuration'
import { useSelector } from 'react-redux'
import { makeSelectCategory } from 'signals/incident/containers/IncidentContainer/selectors'
import type { LatLngTuple } from 'leaflet'
import { formattedDate } from '../utils'
import AssetSelectContext from '../../context'
import { ScrollWrapper, Title } from '../styled'
import {
  AddressPanel,
  Description,
  LegendToggleButton,
  OptionsList,
  PanelContent,
  SelectionNearby,
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

type Point = {
  type: 'Point'
  coordinates: LatLngTuple
}

type Properties = {
  category: {
    name: string
  }
  created_at: string
}

type SelectionIncident = {
  categoryName?: string
  createdAt?: string
}

const DetailPanel: FC<DetailPanelProps> = ({ language = {} }) => {
  const shouldRenderAddressPanel = useMediaQuery({
    query: breakpoint('max-width', 'tabletM')({ theme: ascDefaultTheme }),
  })
  const [showLegendPanel, setShowLegendPanel] = useState(false)
  const [optionsList, setOptionsList] = useState(null)
  const [selectionIncident, setSelectionIncident] = useState<SelectionIncident>(
    {}
  )
  const [showAddressPanel, setShowAddressPanel] = useState(false)
  const { address, selection, removeItem, setItem, setLocation, close, meta } =
    useContext(AssetSelectContext)
  const { featureTypes } = meta
  const featureStatusTypes = meta.featureStatusTypes || []
  const { category, subcategory } = useSelector(makeSelectCategory)
  const { get, data } = useFetch<FeatureCollection<Point, Properties>>()

  const addressValue = address ? formatAddress(address) : ''

  const selectionOnMap =
    selection && selectionIsObject(selection) ? selection : undefined

  const unregisteredAsset =
    selection && selectionIsUndetermined(selection) ? selection : undefined

  const selectionNearby =
    selection && selectionIsNearby(selection) ? selection : undefined

  const [showObjectIdInput, setShowObjectIdInput] = useState(
    selection?.type === UNKNOWN_TYPE
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

  useEffect(() => {
    if (!selectionOnMap || !selection?.coordinates || !category || !subcategory)
      return

    const searchParams = new URLSearchParams({
      maincategory_slug: category,
      category_slug: subcategory,
      lat: selection.coordinates.lat.toString(),
      lon: selection.coordinates.lng.toString(),
      group_by: 'category',
    })

    get(`${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`)
  }, [get, selectionOnMap, selection, category, subcategory])

  useEffect(() => {
    setSelectionIncident({})

    if (selectionNearby) {
      setSelectionIncident({
        categoryName: selection?.label,
        createdAt: selection?.description,
      })
    }

    if (selectionOnMap && data?.features) {
      setSelectionIncident({
        categoryName: data?.features[0].properties.category.name,
        createdAt: formattedDate(data?.features[0].properties.created_at),
      })
    }
  }, [data?.features, selectionOnMap, selectionNearby, selection])

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

        {selectionIncident?.categoryName && selectionIncident?.createdAt && (
          <SelectionNearby>
            <Paragraph strong>Deze melding is al bij ons bekend:</Paragraph>
            <strong>{selectionIncident.categoryName}</strong>
            <span>{selectionIncident.createdAt}</span>
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

        <StyledButton onClick={close} variant="primary" tabIndex={2}>
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
