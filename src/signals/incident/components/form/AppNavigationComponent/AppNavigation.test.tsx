// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'

import { postMessage } from 'containers/App/actions'
import { withAppContext } from 'test/utils'

import type { Props } from './AppNavigation'
import AppNavigation from './AppNavigation'

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

const defaultProps: Props = {
  meta: {
    title: 'Wilt u nog een andere melding doen?',
    labelCloseButton: 'Sluit venster',
    labelLinkButton: 'Doe een melding',
    hrefLinkButton: '/',
  },
}

describe('AppNavigation', () => {
  it('should render correctly', () => {
    render(withAppContext(<AppNavigation {...defaultProps} />))

    expect(
      screen.getByRole('button', { name: 'Sluit venster' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Doe een melding' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Wilt u nog een andere melding doen?')
    ).toBeInTheDocument()
  })

  it('should render without title', () => {
    const props: Props = {
      meta: {
        ...defaultProps.meta,
        title: '',
      },
    }
    render(withAppContext(<AppNavigation {...props} />))

    expect(
      screen.getByRole('button', { name: 'Sluit venster' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Doe een melding' })
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Wilt u nog een andere melding doen?')
    ).not.toBeInTheDocument()
  })

  it('should dispatch postMessage action', () => {
    render(withAppContext(<AppNavigation {...defaultProps} />))

    userEvent.click(screen.getByRole('button', { name: 'Sluit venster' }))

    expect(dispatch).toHaveBeenCalledWith(postMessage('close'))
  })
})
