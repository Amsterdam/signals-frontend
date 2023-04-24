import { render, screen } from '@testing-library/react'

import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'

import Overview from './Overview'
import useFetch from '../../../../../hooks/useFetch'
import { useFetchResponse } from '../../../../IncidentMap/components/__test__'

jest.mock('shared/services/configuration/configuration')
jest.mock('hooks/useFetch')

describe('Overview component', () => {
  const env = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...env }
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
  })

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configuration.__reset()
  })

  afterEach(() => {
    process.env = env
  })

  it('should render', () => {
    withAppContext(
      <Overview
        showItems={{
          settings: false,
          departments: false,
          groups: false,
          users: false,
          categories: false,
          export: false,
        }}
      />
    )
  })

  it('should show all settings when allowed all', () => {
    render(
      withAppContext(
        <Overview
          showItems={{
            settings: true,
            departments: true,
            groups: true,
            users: true,
            categories: true,
            export: true,
          }}
        />
      )
    )

    expect(screen.getByTestId('users')).toBeInTheDocument()
    expect(screen.getByTestId('groups')).toBeInTheDocument()
    expect(screen.getByTestId('departments')).toBeInTheDocument()
    expect(screen.getByTestId('categories')).toBeInTheDocument()
    expect(screen.getByTestId('export')).toBeInTheDocument()
  })

  it('should show specific settings based on props', () => {
    const { rerender, unmount } = render(
      withAppContext(
        <Overview
          showItems={{
            settings: false,
            departments: false,
            groups: true,
            users: true,
            categories: false,
            export: false,
          }}
        />
      )
    )

    expect(screen.queryByTestId('users')).not.toBeInTheDocument()
    expect(screen.queryByTestId('groups')).not.toBeInTheDocument()
    expect(screen.queryByTestId('departments')).not.toBeInTheDocument()
    expect(screen.queryByTestId('categories')).not.toBeInTheDocument()
    expect(screen.queryByTestId('main-categories')).not.toBeInTheDocument()
    expect(screen.queryByTestId('export')).not.toBeInTheDocument()

    unmount()

    rerender(
      withAppContext(
        <Overview
          showItems={{
            settings: true,
            departments: false,
            groups: false,
            users: false,
            categories: false,
            export: false,
          }}
        />
      )
    )

    expect(screen.queryByTestId('users')).not.toBeInTheDocument()
    expect(screen.queryByTestId('groups')).not.toBeInTheDocument()
    expect(screen.queryByTestId('departments')).not.toBeInTheDocument()
    expect(screen.queryByTestId('categories')).not.toBeInTheDocument()
    expect(screen.queryByTestId('main-categories')).not.toBeInTheDocument()
    expect(screen.queryByTestId('export')).not.toBeInTheDocument()

    unmount()

    rerender(
      withAppContext(
        <Overview
          showItems={{
            settings: true,
            departments: true,
            groups: true,
            users: false,
            categories: false,
            export: false,
          }}
        />
      )
    )

    expect(screen.queryByTestId('users')).not.toBeInTheDocument()
    expect(screen.getByTestId('groups')).toBeInTheDocument()
    expect(screen.getByTestId('departments')).toBeInTheDocument()
    expect(screen.queryByTestId('categories')).not.toBeInTheDocument()
    expect(screen.queryByTestId('main-categories')).not.toBeInTheDocument()
    expect(screen.queryByTestId('export')).not.toBeInTheDocument()

    unmount()

    configuration.featureFlags.showMainCategories = true
    rerender(
      withAppContext(
        <Overview
          showItems={{
            settings: true,
            departments: false,
            groups: false,
            users: true,
            categories: true,
            export: false,
          }}
        />
      )
    )

    expect(screen.getByTestId('users')).toBeInTheDocument()
    expect(screen.queryByTestId('groups')).not.toBeInTheDocument()
    expect(screen.queryByTestId('departments')).not.toBeInTheDocument()
    expect(screen.getByTestId('categories')).toBeInTheDocument()
    expect(screen.getByTestId('main-categories')).toBeInTheDocument()
    expect(screen.queryByTestId('export')).not.toBeInTheDocument()

    unmount()

    rerender(
      withAppContext(
        <Overview
          showItems={{
            settings: true,
            departments: true,
            groups: true,
            users: true,
            categories: true,
            export: true,
          }}
        />
      )
    )

    expect(screen.getByTestId('users')).toBeInTheDocument()
    expect(screen.getByTestId('groups')).toBeInTheDocument()
    expect(screen.getByTestId('departments')).toBeInTheDocument()
    expect(screen.getByTestId('categories')).toBeInTheDocument()
    expect(screen.getByTestId('main-categories')).toBeInTheDocument()
    expect(screen.getByTestId('export')).toBeInTheDocument()
  })

  it('should show a version numbers of the fe and be running', () => {
    process.env.FRONTEND_TAG = '123'

    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      get: jest.fn(),
      data: { version: '123' },
    }))

    render(
      withAppContext(
        <Overview
          showItems={{
            settings: true,
            departments: false,
            groups: true,
            users: true,
            categories: false,
            export: false,
          }}
        />
      )
    )

    expect(screen.getByText(/Versienummer backend: 123/)).toBeTruthy()
    expect(screen.getByText(/Versienummer frontend: 123/)).toBeTruthy()
  })
})
