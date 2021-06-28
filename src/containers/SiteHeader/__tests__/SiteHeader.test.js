// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import * as reactRedux from 'react-redux'
import * as appSelectors from 'containers/App/selectors'
import * as auth from 'shared/services/auth/auth'

import { withAppContext } from 'test/utils'
import userEvent from '@testing-library/user-event'
import SiteHeader from '..'

describe('containers/SiteHeader', () => {
  const dispatch = jest.fn()
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)
    jest
      .spyOn(appSelectors, 'makeSelectUserCanAccess')
      .mockImplementation(() => () => true)
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render', () => {
    render(withAppContext(<SiteHeader />))

    expect(screen.getByText('Instellingen')).toBeInTheDocument()
    expect(screen.getByText('Uitloggen')).toBeInTheDocument()
  })

  it('should logout', () => {
    render(withAppContext(<SiteHeader />))

    expect(dispatch).not.toHaveBeenCalled()
    userEvent.click(screen.getByText('Uitloggen'))
    expect(dispatch).toHaveBeenCalled()
  })
})
