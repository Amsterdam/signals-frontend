// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import get from 'lodash/get'
import { useSelector } from 'react-redux'

import Markdown from 'components/Markdown'
import { getIsAuthenticated } from 'shared/services/auth/auth'
import mapDynamicFields from 'signals/incident/services/map-dynamic-fields'

import { Wrapper, Label } from './styled'
import { makeSelectIncidentContainer } from '../../../containers/IncidentContainer/selectors'
import type { Parent } from '../types/FileInput'
import type { PlainTextMeta } from '../types/PlainText'

const injectParent = (value: PlainTextMeta['label'], parent: Parent) =>
  mapDynamicFields(value, {
    incident: get(parent, 'meta.incidentContainer.incident'),
  })

export interface Props {
  className: string
  meta: PlainTextMeta
  parent: Parent
}

const PlainText = ({ className = '', meta, parent }: Props) => {
  const { mapActive } = useSelector(makeSelectIncidentContainer)
  const valueAuthenticated = getIsAuthenticated() && meta.valueAuthenticated
  const value = !valueAuthenticated && meta.value

  return meta.isVisible ? (
    <Wrapper className={className} type={meta.type} data-testid="plain-text">
      {meta.label && (
        <Label>
          <Markdown hideTabindexLink={mapActive}>
            {injectParent(meta.label, parent)}
          </Markdown>
        </Label>
      )}
      {valueAuthenticated && (
        <Markdown>{injectParent(valueAuthenticated, parent)}</Markdown>
      )}
      {value && (
        <Markdown linkTarget="_blank">{injectParent(value, parent)}</Markdown>
      )}
    </Wrapper>
  ) : null
}

export default PlainText
