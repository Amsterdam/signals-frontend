// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import { Input } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Label from 'components/Label'

const StyledInput = styled.div`
  .text-input {
    width: 100%;

    &__control {
      margin-bottom: 20px;
    }
  }
`

const TextInput = ({ name, display, placeholder }) => {
  const Render = ({ handler }) => (
    <StyledInput>
      <Label htmlFor={`form${name}`}>{display}</Label>

      <Input
        name={name}
        data-testid={name}
        id={`form${name}`}
        type="text"
        {...handler()}
        placeholder={placeholder}
      />
    </StyledInput>
  )

  Render.defaultProps = {
    touched: false,
  }

  Render.propTypes = {
    handler: PropTypes.func.isRequired,
    touched: PropTypes.bool,
  }

  return Render
}

TextInput.defaultProps = {
  placeholder: '',
}

TextInput.propTypes = {
  placeholder: PropTypes.string,
}

export default TextInput
