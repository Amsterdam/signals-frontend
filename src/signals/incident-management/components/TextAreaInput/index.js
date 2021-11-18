// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import styled from 'styled-components'

import TextArea from 'components/TextArea'
import Label from 'components/Label'

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`

const TextAreaInput = (props) => {
  const { name, display, placeholder, rows, maxLength } = props
  const render = ({ handler, value }) => (
    <Wrapper>
      <Label htmlFor={`form${name}`}>{display}</Label>

      <TextArea
        id={`form${name}`}
        name={name}
        data-testid={name}
        value=""
        {...handler()}
        placeholder={placeholder}
        rows={rows}
        infoText={
          maxLength > 0 && `${value ? value.length : '0'}/${maxLength} tekens`
        }
      />
    </Wrapper>
  )

  render.defaultProps = {
    touched: false,
    placeholder: '',
    rows: 4,
  }

  render.propTypes = {
    handler: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
    touched: PropTypes.bool,
    value: PropTypes.string,
    maxLength: PropTypes.number,
  }
  return render
}

export default TextAreaInput
