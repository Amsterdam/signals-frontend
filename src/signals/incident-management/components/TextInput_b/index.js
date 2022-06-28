// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
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

const TextInput = ({ name, value, display, placeholder, onChange }) => (
    <StyledInput>
      <Label htmlFor={`form${name}`}>{display}</Label>
      <Input
        name={name}
        data-testid={name}
        id={`form${name}`}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </StyledInput>
  )


TextInput.defaultProps = {
  placeholder: '',
}

TextInput.propTypes = {
  placeholder: PropTypes.string,
}

export default TextInput
