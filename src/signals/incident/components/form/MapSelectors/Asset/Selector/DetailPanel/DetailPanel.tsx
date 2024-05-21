// SPDX-License-Identifier: MPL-2.0
import type { FC } from 'react'
// Copyright (C) 2021 - 2024 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import { useCallback, useContext, useMemo, useState } from 'react'

import { ChevronLeft } from '@amsterdam/asc-assets'
import { ascDefaultTheme, breakpoint } from '@amsterdam/asc-ui'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'

import { formatAddress } from 'shared/services/format-address'
import type { PdokResponse } from 'shared/services/map-location'
import { selectionIsObject } from 'signals/incident/components/form/MapSelectors/constants'
import { closeMap } from 'signals/incident/containers/IncidentContainer/actions'

import {
  Description,
  PanelContent,
  StyledAssetList,
  StyledBackButton,
  StyledButton,
  StyledButtonWrapper,
  StyledLabelPDOkAutoSuggest,
  StyledParagraphPDOkAutoSuggest,
} from './styled'
import { useResetDrawerState } from './useResetDrawerState'
import {
  DrawerOverlay,
  DrawerState,
} from '../../../../../../../../components/DrawerOverlay'
import AssetSelectContext from '../../context'
import Legend from '../Legend'
import { ScrollWrapper, StyledPDOKAutoSuggest } from '../styled'

export interface DetailPanelProps {
  language?: Record<string, string>
  zoomLevel?: number
}

const DetailPanel: FC<DetailPanelProps> = ({ language, zoomLevel }) => {
  const [drawerState, setDrawerState] = useState<DrawerState>(DrawerState.Open)
  const [legendOpen, setLegendOpen] = useState(false)
  const shouldRenderMobileVersion = useMediaQuery({
    query: breakpoint('max-width', 'tabletM')({ theme: ascDefaultTheme }),
  })

  const dispatch = useDispatch()
  const {
    address,
    selection,
    removeItem,
    setLocation,
    meta,
    selectableFeatures,
    coordinates,
  } = useContext(AssetSelectContext)
  const hasLocation = address || coordinates ? true : false
  const { featureTypes } = meta
  const featureStatusTypes = meta.featureStatusTypes || []
  const addressValue = address ? formatAddress(address) : ''
  const selectionOnMap =
    selection && selectionIsObject(selection[0]) ? selection : undefined

  /* istanbul ignore next */
  const onAddressSelect = useCallback(
    (option: PdokResponse) => {
      const { location, address } = option.data
      setLocation({ coordinates: location, address })
      ;(window as any)?.dataLayer?.push({
        event: 'interaction.generic.component.mapInteraction',
        meta: {
          category: 'interaction.generic.component.mapInteraction',
          action: 'useAutosuggest',
          label: `${address.openbare_ruimte} ${address.huisnummer} ${address.postcode} ${address.woonplaats}`,
        },
      })
    },
    [setLocation]
  )

  useResetDrawerState(drawerState, setDrawerState, zoomLevel)

  const submitButtonText = useMemo(() => {
    return selection
      ? language?.submit || 'Meld dit object'
      : featureTypes.length > 0
      ? 'Ga verder zonder ' + (language?.objectTypeSingular || 'object')
      : language?.submit
  }, [selection, featureTypes, language])

  const topPositionDrawerMobile = useMemo(() => {
    return selection ||
      (zoomLevel &&
        zoomLevel >= 13 &&
        selectableFeatures &&
        selectableFeatures.length > 0) ||
      legendOpen
      ? 60
      : 100
  }, [selection, zoomLevel, selectableFeatures, legendOpen])

  return (
    <DrawerOverlay
      state={drawerState}
      onStateChange={setDrawerState}
      disableDrawerHandleDesktop
      topPositionDrawerMobile={topPositionDrawerMobile}
      address={address}
    >
      <PanelContent data-testid="detail-panel">
        {!shouldRenderMobileVersion && (
          <StyledBackButton
            aria-label="Terug"
            aria-controls="addressPanel"
            icon={<ChevronLeft />}
            iconSize={20}
            onClick={() => dispatch(closeMap())}
            size={24}
            title="Terug"
            variant="blank"
          />
        )}
        <ScrollWrapper
          $hasSubmitButton={hasLocation}
          $isMobile={shouldRenderMobileVersion}
        >
          {!shouldRenderMobileVersion && (
            <>
              <StyledParagraphPDOkAutoSuggest>
                {language?.title || 'Selecteer de locatie'}
                <Description>
                  {language?.description ||
                    'Typ het dichtstbijzijnde adres, klik de locatie aan op de kaart of gebruik "Mijn locatie"'}
                </Description>
              </StyledParagraphPDOkAutoSuggest>
              <StyledLabelPDOkAutoSuggest htmlFor="location">
                {meta?.language?.pdokLabel || 'Zoek op adres of postcode'}
              </StyledLabelPDOkAutoSuggest>
              <StyledPDOKAutoSuggest
                id={'location'}
                onClear={removeItem}
                onSelect={onAddressSelect}
                value={addressValue}
                placeholder={meta?.language?.pdokInput || 'Adres of postcode'}
              />
            </>
          )}
          {((selection && selectionOnMap) ||
            (selectableFeatures && selectableFeatures.length > 0)) && (
            <StyledAssetList
              selection={selection}
              remove={removeItem}
              featureTypes={featureTypes}
              featureStatusTypes={featureStatusTypes}
              selectableFeatures={selectableFeatures}
              objectTypePlural={meta?.language?.objectTypePlural}
              zoomLevel={zoomLevel}
            />
          )}
        </ScrollWrapper>
        {!shouldRenderMobileVersion && hasLocation && (
          <StyledButton
            onClick={() => dispatch(closeMap())}
            variant="primary"
            data-testid="asset-select-submit-button"
            tabIndex={0}
          >
            {submitButtonText}
          </StyledButton>
        )}
      </PanelContent>
      <Legend
        onLegendToggle={() => {
          setDrawerState(DrawerState.Open)
          setLegendOpen(!legendOpen)
        }}
      />
      {shouldRenderMobileVersion && hasLocation && (
        <StyledButtonWrapper>
          <StyledButton
            onClick={() => dispatch(closeMap())}
            variant="primary"
            data-testid="asset-select-submit-button"
            tabIndex={0}
            $isMobile={shouldRenderMobileVersion}
            $hasSubmitButton={hasLocation}
          >
            {submitButtonText}
          </StyledButton>
        </StyledButtonWrapper>
      )}
    </DrawerOverlay>
  )
}

export default DetailPanel
