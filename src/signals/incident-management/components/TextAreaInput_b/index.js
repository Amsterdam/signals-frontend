// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import styled from 'styled-components'

import TextArea from 'components/TextArea'
import Label from 'components/Label'

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`

const TextAreaInput = (props) => {
  const { name, value, display, placeholder, rows, maxLength, onChange } = props
    return (
    <Wrapper>
      <Label htmlFor={`form${name}`}>{display}</Label>

      <TextArea
        id={`form${name}`}
        name={name}
        data-testid={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        infoText={
          maxLength > 0 && `${value ? value.length : '0'}/${maxLength} tekens`
        }
      />
    </Wrapper>
  )
}

export default TextAreaInput
