// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import { Suspense } from 'react'

import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

import * as appSelectors from 'containers/App/selectors'
import { getIsAuthenticated } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import { withAppContext, history } from 'test/utils'

import IncidentManagementModule from '..'
import * as actions from '../actions'

jest.mock('shared/services/configuration/configuration')
jest.mock('shared/services/auth/auth')
jest.mock('containers/App/selectors')
jest.mock('../actions')

const withSuspense = () =>
  withAppContext(
    <Suspense fallback={<div>Loading...</div>}>
      <IncidentManagementModule />
    </Suspense>
  )

describe('signals/incident-management', () => {
  beforeEach(() => {
    jest
      .spyOn(actions, 'getDistricts')
      .mockImplementation((payload) => ({ type: 'FOO', payload }))
    jest
      .spyOn(actions, 'getFilters')
      .mockImplementation((payload) => ({ type: 'BAR', payload }))
    jest
      .spyOn(actions, 'searchIncidents')
      .mockImplementation((payload) => ({ type: 'BAZ', payload }))
    jest
      .spyOn(actions, 'requestIncidents')
      .mockImplementation((payload) => ({ type: 'QUX', payload }))
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => true)
    fetch.mockResponses([JSON.stringify({}), { status: 200 }])
  })

  afterEach(() => {
    jest.resetAllMocks()
    configuration.__reset()
    fetch.resetMocks()
  })

  describe('not authenticated', () => {
    it('should redirect to the login page', async () => {
      getIsAuthenticated.mockImplementation(() => false)
      render(withSuspense())
      const loginPage = await screen.findByTestId('login-page')

      expect(loginPage).toBeInTheDocument()
    })

    it('should not fetch anything', async () => {
      getIsAuthenticated.mockImplementation(() => false)
      render(withSuspense())
      await screen.findByTestId('login-page')

      expect(actions.getDistricts).not.toHaveBeenCalled()
      expect(actions.getFilters).not.toHaveBeenCalled()
      expect(actions.requestIncidents).not.toHaveBeenCalled()
      expect(actions.searchIncidents).not.toHaveBeenCalled()
      expect(fetch).not.toHaveBeenCalled()
    })
  })

  describe('login page', () => {
    it('should redirect when not authenticated', async () => {
      getIsAuthenticated.mockImplementation(() => false)
      render(withSuspense())
      const loginPage = await screen.findByTestId('login-page')

      expect(loginPage).toBeInTheDocument()
    })

    it('should not redirect when authenticated', async () => {
      history.push('/incidents')

      getIsAuthenticated.mockImplementation(() => true)
      render(withSuspense())

      const incidentManagementOverviewPage = await screen.findByTestId(
        'incident-management-overview-page'
      )

      expect(incidentManagementOverviewPage).toBeInTheDocument()
    })
  })

  describe('fetching', () => {
    describe('districts', () => {
      describe('with fetchDistrictsFromBackend disabled', () => {
        it('should not fetch when not authenticated', async () => {
          getIsAuthenticated.mockImplementation(() => false)
          render(withSuspense())
          await screen.findByTestId('login-page')

          expect(actions.getDistricts).not.toHaveBeenCalled()
        })

        it('should not fetch when authenticated', async () => {
          act(() => {
            history.push('/incidents')
          })
          getIsAuthenticated.mockImplementation(() => true)
          render(withSuspense())
          await screen.findByTestId('incident-management-overview-page')

          expect(actions.getDistricts).not.toHaveBeenCalled()
        })
      })
      describe('with fetchDistrictsFromBackend enabled', () => {
        it('should not fetch when not authenticated', async () => {
          configuration.featureFlags.fetchDistrictsFromBackend = true
          getIsAuthenticated.mockImplementation(() => false)
          render(withSuspense())
          await screen.findByTestId('login-page')

          expect(actions.getDistricts).not.toHaveBeenCalled()
        })

        it('should fetch when authenticated', async () => {
          configuration.featureFlags.fetchDistrictsFromBackend = true
          getIsAuthenticated.mockImplementation(() => true)
          render(withSuspense())
          await screen.findByTestId('incident-management-overview-page')

          expect(actions.getDistricts).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('filters', () => {
      it('should not fetch when not authenticated', async () => {
        getIsAuthenticated.mockImplementation(() => false)
        render(withSuspense())
        await screen.findByTestId('login-page')

        expect(actions.getFilters).not.toHaveBeenCalled()
      })

      it('should fetch when authenticated', async () => {
        getIsAuthenticated.mockImplementation(() => true)
        render(withSuspense())
        await screen.findByTestId('incident-management-overview-page')

        expect(actions.getFilters).toHaveBeenCalledTimes(1)
      })
    })

    describe('incidents', () => {
      it('should not fetch when not authenticated', async () => {
        getIsAuthenticated.mockImplementation(() => false)
        render(withSuspense())
        await screen.findByTestId('login-page')

        expect(actions.requestIncidents).not.toHaveBeenCalled()
      })

      it('should fetch when authenticated', async () => {
        getIsAuthenticated.mockImplementation(() => true)
        render(withSuspense())
        await screen.findByTestId('incident-management-overview-page')

        expect(actions.requestIncidents).toHaveBeenCalledTimes(1)
      })

      it('should not search when not authenticated', async () => {
        getIsAuthenticated.mockImplementation(() => false)
        render(withSuspense())
        await screen.findByTestId('login-page')

        expect(actions.searchIncidents).not.toHaveBeenCalled()
      })

      it('should not search without search query', async () => {
        getIsAuthenticated.mockImplementation(() => true)
        render(withSuspense())
        await screen.findByTestId('incident-management-overview-page')

        expect(actions.searchIncidents).not.toHaveBeenCalled()
      })

      it('should search with search query when authenticated', async () => {
        getIsAuthenticated.mockImplementation(() => true)
        const searchQuery = 'stoeptegels'
        jest
          .spyOn(appSelectors, 'makeSelectSearchQuery')
          .mockImplementation(() => searchQuery)
        render(withSuspense())
        await screen.findByTestId('incident-management-overview-page')

        expect(actions.searchIncidents).toHaveBeenCalledWith(searchQuery)
      })
    })
  })

  describe('routing', () => {
    const loginText = 'Om deze pagina te zien dient u ingelogd te zijn.'

    describe('incident list', () => {
      it('should show warning when not authenticated', async () => {
        history.push('/incidents')
        getIsAuthenticated.mockImplementation(() => false)
        render(withSuspense())
        await screen.findByTestId('login-page')

        expect(screen.queryByText(loginText)).not.toBeNull()
      })

      it('should not show warning when authenticated', async () => {
        history.push('/incidents')
        getIsAuthenticated.mockImplementation(() => true)
        render(withSuspense())
        await screen.findByTestId('incident-management-overview-page')

        expect(screen.queryByText(loginText)).toBeNull()
      })
    })

    describe('incident detail', () => {
      it('should show warning when not authenticated', async () => {
        history.push('/incident/1101')
        getIsAuthenticated.mockImplementation(() => false)
        render(withSuspense())
        await screen.findByTestId('login-page')

        expect(screen.queryByText(loginText)).not.toBeNull()
      })

      it('should not show warning when authenticated', async () => {
        history.push('/incident/1101')
        getIsAuthenticated.mockImplementation(() => true)
        render(withSuspense())
        await screen.findByTestId('loading-indicator')

        expect(screen.queryByText(loginText)).toBeNull()
      })
    })

    describe('incident split', () => {
      beforeEach(() => {
        fetchMock.mockRestore()
      })

      it('should show warning when not authenticated', async () => {
        history.push('/incident/1102/split')
        getIsAuthenticated.mockImplementation(() => false)
        render(withSuspense())
        await screen.findByTestId('login-page')

        expect(screen.queryByText(loginText)).not.toBeNull()
      })

      it('should not show warning when authenticated', async () => {
        history.push('/incident/1102/split')
        getIsAuthenticated.mockImplementation(() => true)
        render(withSuspense())
        await screen.findByTestId('loading-indicator')

        expect(screen.queryByText(loginText)).toBeNull()
      })
    })

    describe('incident reporter', () => {
      beforeEach(() => {
        fetchMock.mockRestore()
        configuration.featureFlags.enableReporter = true
      })

      it('should show warning when not authenticated', async () => {
        act(() => {
          history.push('/incident/1101/melder')
        })
        getIsAuthenticated.mockImplementation(() => false)
        render(withSuspense())

        await screen.findByTestId('login-page')
        expect(screen.queryByText(loginText)).not.toBeNull()
      })

      it('should not show warning when authenticated', async () => {
        act(() => {
          history.push('/incident/1101/melder')
        })
        getIsAuthenticated.mockImplementation(() => true)
        render(withSuspense())

        await screen.findByTestId('loading-indicator')

        expect(screen.queryByText(loginText)).not.toBeInTheDocument()
      })
    })

    it('will use overview page as routing fallback', async () => {
      getIsAuthenticated.mockImplementation(() => true)
      render(withSuspense())
      await screen.findByTestId('incident-management-overview-page')

      act(() => {
        history.push('/this-url-definitely-does-not-exist')
      })

      expect(
        await screen.findByTestId('incident-management-overview-page')
      ).toBeInTheDocument()
    })
  })
})
