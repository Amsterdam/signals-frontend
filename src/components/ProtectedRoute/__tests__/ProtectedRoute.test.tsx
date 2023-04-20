// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021-2022 Gemeente Amsterdam
import { render, act, screen } from '@testing-library/react'
import type { RouteComponentProps } from 'react-router-dom'

import * as appSelectors from 'containers/App/selectors' // { makeSelectUserCanAccess, makeSelectUserCan }
import { withAppContext, history } from 'test/utils'

import ProtectedRoute, {
  NO_PAGE_ACCESS_MESSAGE,
  NO_PAGE_FOUND,
} from '../ProtectedRoute'

describe('ProtectedRoute component', () => {
  const TestComponent = () => <div data-testid="test-component">component</div>

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render not found message when component does not exist', () => {
    const MockComponentUndefined = undefined as unknown as (
      props: RouteComponentProps<any>
    ) => JSX.Element
    render(
      withAppContext(
        <ProtectedRoute exact path="/test" component={MockComponentUndefined} />
      )
    )

    act(() => {
      history.push('/test')
    })

    expect(history.location.pathname).toEqual('/test')
    expect(screen.queryByTestId('test-component')).not.toBeInTheDocument()
    expect(screen.getByText(NO_PAGE_FOUND)).toBeInTheDocument()
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
    expect(screen.queryByTestId('test-component')).not.toBeInTheDocument()
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
    expect(screen.getByTestId('test-component')).toBeInTheDocument()
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
    expect(screen.getByTestId('test-component')).toBeInTheDocument()
    expect(screen.queryByText(NO_PAGE_ACCESS_MESSAGE)).not.toBeInTheDocument()
  })
})
