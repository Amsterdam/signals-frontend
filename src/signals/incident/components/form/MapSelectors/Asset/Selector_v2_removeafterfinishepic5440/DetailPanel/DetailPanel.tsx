// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import { useCallback, useState, useContext } from 'react'
import type { KeyboardEvent, ChangeEvent, FC } from 'react'

import {
  Label,
  Input,
  Checkbox,
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
} from 'signals/incident/components/form/MapSelectors/constants'
import { closeMap } from 'signals/incident/containers/IncidentContainer/actions'

import {
  Description,
  PanelContent,
  StyledAssetList,
  StyledButton,
  StyledLabelPDOkAutoSuggest,
} from './styled'
import AssetSelectContext from '../../context'
import Legend from '../Legend'
import { ScrollWrapper, Title, StyledPDOKAutoSuggest } from '../styled'

export interface DetailPanelProps {
  language?: Record<string, string>
}

const DetailPanel: FC<DetailPanelProps> = ({ language }) => {
  const shouldRenderMobileVersion = useMediaQuery({
    // Set breakpoint to mobile instead of tablet since desktop will get the mobile version when zoom on 200% which is not accesible with keyboard.
    query: breakpoint('max-width', 'mobileL')({ theme: ascDefaultTheme }),
  })

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
    language?.unregistered || 'Het object staat niet op de kaart'

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
        <Title>{language?.title || 'Locatie'}</Title>
      )}
      <ScrollWrapper>
        {!shouldRenderMobileVersion && (
          <StyledLabelPDOkAutoSuggest htmlFor={'location'}>
            {language?.subTitle || 'U kunt maar een object kiezen'}
            <Description>
              {language?.description ||
                'Typ het dichtstbijzijnde adres, klik de locatie aan op de kaart of gebruik "Mijn locatie"'}
            </Description>
          </StyledLabelPDOkAutoSuggest>
        )}
        {!shouldRenderMobileVersion && (
          <StyledPDOKAutoSuggest
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

            {showObjectIdInput && language?.unregisteredId && (
              <>
                <Label
                  htmlFor="unregisteredAssetInput"
                  label={
                    <>
                      <strong>{language?.unregisteredId}</strong> (niet
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
          {language?.submit || 'Meld dit object'}
        </StyledButton>
      </ScrollWrapper>

      <Legend />
    </PanelContent>
  )
}

export default DetailPanel
