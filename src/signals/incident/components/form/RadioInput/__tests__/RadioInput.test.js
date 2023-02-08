// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, fireEvent, act } from '@testing-library/react'
import * as reactRedux from 'react-redux'

import {
  resetExtraState,
  updateIncident,
} from 'signals/incident/containers/IncidentContainer/actions'
import { withAppContext } from 'test/utils'

import RadioInput from '..'

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

describe('signals/incident/components/form/RadioInput/InputUsingDispatch', () => {
  beforeEach(() => {
    dispatch.mockReset()
  })

  it('renders an input element', () => {
    const idAttr = 'FooBar'
    render(
      withAppContext(
        <RadioInput id="fooBrrr" idAttr={idAttr} label="Label" name="Zork" />
      )
    )

    expect(document.getElementById(idAttr)).toBeInTheDocument()
  })

  it('dispatches updateIncident', () => {
    const name = 'Zork'
    const id = 'fooBrrr'
    const label = 'Label'
    const info = 'info text'

    render(
      withAppContext(
        <RadioInput
          id={id}
          idAttr="FooBar"
          label={label}
          name={name}
          info={info}
        />
      )
    )

    expect(dispatch).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(document.querySelector('input[type=radio]'))
    })

    expect(dispatch).toHaveBeenCalledWith(
      updateIncident({
        [name]: {
          id,
          label,
          info,
        },
      })
    )
  })

  it('dispatches resetExtraState', () => {
    const { rerender } = render(
      withAppContext(
        <RadioInput id="fooBrrr" idAttr="FooBar" label="Label" name="Zork" />
      )
    )

    expect(dispatch).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(document.querySelector('input[type=radio]'))
    })

    expect(dispatch).not.toHaveBeenCalledWith(resetExtraState())

    rerender(
      withAppContext(
        <RadioInput
          id="fooBrrr"
          idAttr="FooBar"
          label="Label"
          name="Zork"
          resetsStateOnChange
        />
      )
    )

    act(() => {
      fireEvent.click(document.querySelector('input[type=radio]'))
    })

    expect(dispatch).toHaveBeenCalledWith(resetExtraState())
  })
})
