// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useFormContext } from 'react-hook-form'
import styled from 'styled-components'

const ErrorItem = styled.p`
  border: ${themeColor('support', 'invalid')} 2px solid;
  color: ${themeColor('support', 'invalid')};
  font-weight: 700;
  line-height: ${themeSpacing(6)};
  margin-bottom: 0;
  margin-top: 0;
  padding: ${themeSpacing(3)};
`

const GlobalError = ({ meta }) => {
  const { formState } = useFormContext()
  const invalid =
    formState.errors?.dateTime?.type === 'custom' ? '(juist) ' : ''

  return !isEmpty(formState?.errors) ? (
    <ErrorItem role="alert">
      {meta?.label ||
        `U hebt niet alle vragen ${invalid}beantwoord. Vul hieronder aan alstublieft.`}
    </ErrorItem>
  ) : null
}

GlobalError.propTypes = {
  meta: PropTypes.shape({
    label: PropTypes.string,
  }),
}

export default GlobalError
