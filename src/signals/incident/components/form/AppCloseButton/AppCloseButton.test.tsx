// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import * as reactRedux from 'react-redux'
import userEvent from '@testing-library/user-event'

import { postMessage } from 'containers/App/actions'
import { withAppContext } from 'test/utils'

import AppCloseButton from './AppCloseButton'

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

describe('AppCloseButton', () => {
  it('should render a close button', () => {
    render(withAppContext(<AppCloseButton meta={{ label: 'foo' }} />))

    expect(screen.getByRole('button', { name: 'foo' })).toBeInTheDocument()
  })

  it('should dispatch postMessage action', () => {
    render(withAppContext(<AppCloseButton meta={{ label: 'foo' }} />))

    userEvent.click(screen.getByRole('button', { name: 'foo' }))

    expect(dispatch).toHaveBeenCalledWith(postMessage('close'))
  })
})
