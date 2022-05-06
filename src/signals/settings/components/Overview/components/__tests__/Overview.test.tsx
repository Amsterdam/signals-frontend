import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import Overview from '../Overview'

describe('Overview component', () => {
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
    expect(screen.queryByTestId('export')).not.toBeInTheDocument()

    unmount()

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
    expect(screen.getByTestId('export')).toBeInTheDocument()
  })
})
