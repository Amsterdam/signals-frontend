// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { render, screen, act } from '@testing-library/react'
import * as reactRedux from 'react-redux'

import { withAppContext, history } from 'test/utils'
import * as auth from 'shared/services/auth/auth'
import type configurationType from 'shared/services/configuration/__mocks__/configuration'
import configuration from 'shared/services/configuration/configuration'
import { resetIncident } from 'signals/incident/containers/IncidentContainer/actions'
import { fetchCategories as fetchCategoriesAction } from 'models/categories/actions'
import { fetchDepartments as fetchDepartmentsAction } from 'models/departments/actions'

import type { UnregisterCallback, History } from 'history'
import { getSources } from './actions'
import App, { AppContainer } from '.'

const mockConfiguration = configuration as typeof configurationType
const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)
jest.mock('shared/services/configuration/configuration')
jest.mock('signals/incident/components/IncidentWizard', () => () => <span />)
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('shared/services/auth/auth', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ...jest.requireActual('shared/services/auth/auth')!,
}))

jest.useFakeTimers()

describe('<App />', () => {
  let listenSpy: jest.SpyInstance<
    UnregisterCallback,
    [listener: History.LocationListener<unknown>]
  >
  let spyScrollTo: jest.Mock
  let props: JSX.IntrinsicAttributes & { resetIncidentAction: jest.Mock }

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    dispatch.mockReset()
    spyScrollTo = jest.fn()
    Object.defineProperty(global.window, 'scrollTo', { value: spyScrollTo })
    listenSpy = jest.spyOn(history, 'listen')
    props = {
      resetIncidentAction: jest.fn(),
    }
  })

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    mockConfiguration.__reset()
    listenSpy.mockRestore()
  })

  it('should scroll to top on history change', () => {
    render(withAppContext(<App />))

    expect(spyScrollTo).not.toHaveBeenCalled()

    act(() => {
      history.push('/somewhere/else')
    })

    expect(spyScrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('should reset incident on page unload', () => {
    act(() => {
      history.push('/')
    })

    const { rerender, unmount } = render(
      withAppContext(<AppContainer {...props} />)
    )

    expect(dispatch).not.toHaveBeenCalled()

    act(() => {
      history.push('/incident/bedankt')
    })

    unmount()

    rerender(withAppContext(<AppContainer {...props} />))

    expect(dispatch).not.toHaveBeenCalled()

    act(() => {
      history.push('/')
    })

    unmount()

    rerender(withAppContext(<AppContainer {...props} />))

    expect(dispatch).toHaveBeenCalledWith(resetIncident())
  })

  it('should render correctly', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false)

    const { getByTestId, queryByTestId, rerender, unmount } = render(
      withAppContext(<App />)
    )

    expect(getByTestId('siteFooter')).toBeInTheDocument()
    expect(getByTestId('siteHeader')).toBeInTheDocument()

    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true)

    unmount()

    rerender(withAppContext(<App />))

    expect(queryByTestId('siteFooter')).not.toBeInTheDocument()
  })

  describe('routing', () => {
    it('should redirect from "/" to "/incident/beschrijf"', () => {
      render(withAppContext(<App />))

      act(() => {
        history.push('/')
      })

      expect(history.location.pathname).toEqual('/incident/beschrijf')
    })

    it('should redirect from "/login" to "/manage/incidents"', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false)

      const { rerender, unmount } = render(withAppContext(<App />))

      act(() => {
        history.push('/login')
      })

      expect(history.location.pathname).toEqual('/manage/incidents')

      unmount()

      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true)

      rerender(withAppContext(<App />))

      act(() => {
        history.push('/login')
      })

      expect(history.location.pathname).toEqual('/manage/incidents')
    })

    it('should redirect from "/manage" to "/manage/incidents"', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false)

      const { rerender, unmount } = render(withAppContext(<App />))

      act(() => {
        history.push('/manage')
      })

      expect(history.location.pathname).toEqual('/manage/incidents')

      unmount()

      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true)

      rerender(withAppContext(<App />))

      act(() => {
        history.push('/manage')
      })

      expect(history.location.pathname).toEqual('/manage/incidents')
    })

    it('should not route to public map page', async () => {
      render(withAppContext(<App />))

      act(() => {
        history.push('/kaart')
      })

      expect(
        await screen.findByText(/niet gevonden/i, { exact: false })
      ).toBeInTheDocument()
    })

    it('should route to public map page with enablePublicSignalMap enabled', async () => {
      configuration.featureFlags.enablePublicSignalMap = true
      render(withAppContext(<App />))

      act(() => {
        history.push('/kaart')
      })

      expect(await screen.findByTestId('overviewMap')).toBeInTheDocument()
    })
  })

  describe('fetching', () => {
    it('should request sources on mount', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false)

      render(withAppContext(<AppContainer {...props} />))

      expect(dispatch).not.toHaveBeenCalledWith(getSources())

      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true)

      render(withAppContext(<AppContainer {...props} />))

      expect(dispatch).toHaveBeenCalledWith(getSources())
    })

    it('should request subcategories on mount for authenticated users', () => {
      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false)

      render(withAppContext(<AppContainer {...props} />))

      expect(dispatch).not.toHaveBeenCalledWith(fetchCategoriesAction())
      expect(dispatch).not.toHaveBeenCalledWith(fetchDepartmentsAction())

      jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true)

      render(withAppContext(<AppContainer {...props} />))

      expect(dispatch).toHaveBeenCalledWith(fetchCategoriesAction())
      expect(dispatch).toHaveBeenCalledWith(fetchDepartmentsAction())
    })
  })
})
