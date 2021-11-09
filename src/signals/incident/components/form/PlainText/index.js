// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import get from 'lodash/get'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'

import { getIsAuthenticated } from 'shared/services/auth/auth'
import mapDynamicFields from 'signals/incident/services/map-dynamic-fields'
import Markdown from 'components/Markdown'

const injectParent = (value, parent) =>
  mapDynamicFields(value, {
    incident: get(parent, 'meta.incidentContainer.incident'),
  })

const Label = styled.div`
  font-family: Avenir Next LT W01 Demi;
`

const getStyle = (type) => {
  switch (type) {
    case 'alert':
      return css`
        color: ${themeColor('secondary')};
        border: 2px solid ${themeColor('secondary')};
        padding: ${themeSpacing(2, 5)};
        font-family: Avenir Next LT W01 Demi;
      `
    case 'info':
      return css`
        background-color: ${themeColor('primary')};
        padding: ${themeSpacing(5)};

        * {
          // Make sure links contrast with blue background
          color: ${themeColor('tint', 'level1')};
        }
      `
    case 'citation':
    case 'disclaimer':
      return css`
        background-color: ${themeColor('tint', 'level3')};
        padding: ${themeSpacing(5)};
      `
    case 'caution':
      return css`
        border-left: 3px solid ${themeColor('secondary')};
        padding-left: ${themeSpacing(3)};
      `
    case 'alert-inverted':
      return css`
        background-color: ${themeColor('secondary')};
        color: ${themeColor('tint', 'level1')};
        padding: ${themeSpacing(4)};
      `
    default:
      return null
  }
}

const Wrapper = styled.div`
  ul {
    padding: ${themeSpacing(0, 0, 0, 6)};
    margin: 0;

    li {
      list-style-type: square;
    }
  }

  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }

  ${({ type }) => getStyle(type)}
`

const PlainText = ({ className, meta, parent }) => {
  const valueAuthenticated = getIsAuthenticated() && meta?.valueAuthenticated
  const value = !valueAuthenticated && meta?.value

  return meta?.isVisible ? (
    <Wrapper className={className} type={meta.type} data-testid="plainText">
      {meta.label && <Label>{meta.label}</Label>}
      {valueAuthenticated && (
        <Markdown>{injectParent(valueAuthenticated, parent)}</Markdown>
      )}
      {value && (
        <Markdown linkTarget="_blank">{injectParent(value, parent)}</Markdown>
      )}
    </Wrapper>
  ) : null
}

PlainText.defaultProps = {
  className: '',
}

PlainText.propTypes = {
  className: PropTypes.string,
  meta: PropTypes.object,
  parent: PropTypes.object,
}

export default PlainText
