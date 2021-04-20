// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, act, screen } from '@testing-library/react'
import React from 'react'
import * as appSelectors from 'containers/App/selectors' // { makeSelectUserCanAccess, makeSelectUserCan }
import { withAppContext, history } from 'test/utils'
import ProtectedRoute, { NO_PAGE_ACCESS_MESSAGE } from '../ProtectedRoute'

describe('ProtectedRoute component', () => {
  const TestComponent = () => <div data-testid="testComponent">component</div>

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should NOT render the component when doesn't have access", () => {
    render(
      withAppContext(
        <ProtectedRoute exact path="/test" component={TestComponent} />
      )
    )

    act(() => {
      history.push('/test')
    })

    expect(history.location.pathname).toEqual('/test')
    expect(screen.queryByTestId('testComponent')).not.toBeInTheDocument()
    expect(screen.getByText(NO_PAGE_ACCESS_MESSAGE)).toBeInTheDocument()
  })

  it('should render the component when has access', () => {
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => true)
    render(
      withAppContext(
        <ProtectedRoute
          exact
          path="/test"
          component={TestComponent}
          role="role"
        />
      )
    )

    act(() => {
      history.push('/test')
    })

    expect(history.location.pathname).toEqual('/test')
    expect(screen.getByTestId('testComponent')).toBeInTheDocument()
    expect(screen.queryByText(NO_PAGE_ACCESS_MESSAGE)).not.toBeInTheDocument()
  })

  it('should render the component when has group access', () => {
    jest
      .spyOn(appSelectors, 'makeSelectUserCanAccess')
      .mockImplementation(() => () => true)
    render(
      withAppContext(
        <ProtectedRoute
          exact
          path="/test"
          component={TestComponent}
          roleGroup="roleGroup"
        />
      )
    )

    act(() => {
      history.push('/test')
    })

    expect(history.location.pathname).toEqual('/test')
    expect(screen.getByTestId('testComponent')).toBeInTheDocument()
    expect(screen.queryByText(NO_PAGE_ACCESS_MESSAGE)).not.toBeInTheDocument()
  })
})
