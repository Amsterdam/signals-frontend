// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import { useCallback, useContext } from 'react'
import type { FC } from 'react'

import { ChevronLeft } from '@amsterdam/asc-assets'
import { breakpoint, ascDefaultTheme, Button } from '@amsterdam/asc-ui'
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
  StyledButton,
  StyledLabelPDOkAutoSuggest,
  StyledParagraphPDOkAutoSuggest,
} from './styled'
import AssetSelectContext from '../../context'
import Legend from '../Legend'
import { ScrollWrapper, StyledPDOKAutoSuggest } from '../styled'

export interface DetailPanelProps {
  language?: Record<string, string>
}

const DetailPanel: FC<DetailPanelProps> = ({ language }) => {
  const shouldRenderMobileVersion = useMediaQuery({
    query: breakpoint('max-width', 'tabletM')({ theme: ascDefaultTheme }),
  })

  const dispatch = useDispatch()
  const { address, selection, removeItem, setLocation, meta } =
    useContext(AssetSelectContext)
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
    },
    [setLocation]
  )

  return (
    <PanelContent
      data-testid="detail-panel"
      $noFeatureTypes={featureTypes.length === 0}
      $address={!!address}
    >
      {!shouldRenderMobileVersion && (
        <Button
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
      <ScrollWrapper>
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

        {selection && selectionOnMap && (
          <StyledAssetList
            selection={selection}
            onRemove={removeItem}
            featureTypes={featureTypes}
            featureStatusTypes={featureStatusTypes}
          />
        )}

        {address && (
          <StyledButton
            onClick={() => dispatch(closeMap())}
            variant="primary"
            data-testid="asset-select-submit-button"
            tabIndex={0}
          >
            {language?.submit || 'Meld dit object'}
          </StyledButton>
        )}
      </ScrollWrapper>

      <Legend />
    </PanelContent>
  )
}

export default DetailPanel
