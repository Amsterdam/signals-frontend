// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { useCallback } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Label } from '@amsterdam/asc-ui'

import Radio from 'components/RadioButton'

import {
  resetExtraState,
  updateIncident,
} from 'signals/incident/containers/IncidentContainer/actions'

const StyledLabel = styled(Label)`
  width: 100%;
  align-self: baseline;

  & > * {
    font-weight: 400 !important;
  }
`

const RadioInput = ({
  checked,
  id,
  idAttr,
  label,
  info,
  name,
  resetsStateOnChange,
}) => {
  const dispatch = useDispatch()

  const onChange = useCallback(() => {
    if (resetsStateOnChange) {
      dispatch(resetExtraState())
    }

    dispatch(
      updateIncident({
        [name]: {
          id,
          label,
          info,
        },
      })
    )
  }, [dispatch, id, info, label, name, resetsStateOnChange])

  return (
    <StyledLabel inline htmlFor={idAttr} label={label}>
      <Radio
        checked={checked}
        data-testid="inputUsingDispatch"
        id={idAttr}
        onChange={onChange}
        type="radio"
      />
    </StyledLabel>
  )
}

RadioInput.defaultProps = {
  checked: false,
  info: '',
  resetsStateOnChange: false,
}

RadioInput.propTypes = {
  checked: PropTypes.bool,
  id: PropTypes.string.isRequired,
  idAttr: PropTypes.string.isRequired,
  info: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  resetsStateOnChange: PropTypes.bool,
}

export default RadioInput
