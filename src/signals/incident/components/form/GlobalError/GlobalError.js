// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { themeSpacing, themeColor } from '@amsterdam/asc-ui'

const ErrorItem = styled.p`
  border: ${themeColor('support', 'invalid')} 2px solid;
  color: ${themeColor('support', 'invalid')};
  font-weight: 700;
  line-height: ${themeSpacing(6)};
  margin-bottom: 0;
  margin-top: 0;
  padding: ${themeSpacing(3)};
`

const GlobalError = ({ meta, parent: { touched, valid } }) =>
  touched && !valid ? (
    <ErrorItem role="alert">
      {meta.label ||
        'U hebt niet alle vragen beantwoord. Vul hieronder aan alstublieft.'}
    </ErrorItem>
  ) : null

GlobalError.propTypes = {
  meta: PropTypes.shape({
    label: PropTypes.string,
  }),
  parent: PropTypes.shape({
    touched: PropTypes.bool,
    valid: PropTypes.bool,
  }),
}

export default GlobalError
