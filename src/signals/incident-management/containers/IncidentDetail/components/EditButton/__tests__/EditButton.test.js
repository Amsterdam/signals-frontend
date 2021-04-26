// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, fireEvent, act } from '@testing-library/react'
import 'jest-styled-components'

import { withAppContext } from 'test/utils'

import EditButton from '..'

describe('incident-management/containers/IncidentDetail/components/EditButton', () => {
  it('is positioned absolute', () => {
    const { container } = render(
      withAppContext(<EditButton onClick={() => {}} />)
    )

    expect(container.firstChild).toHaveStyleRule('position', 'absolute')
  })

  it('should execute callback', () => {
    const onClick = jest.fn()
    const { container } = render(
      withAppContext(<EditButton onClick={onClick} />)
    )

    expect(onClick).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(container.firstChild)
    })

    expect(onClick).toHaveBeenCalled()
  })
})
