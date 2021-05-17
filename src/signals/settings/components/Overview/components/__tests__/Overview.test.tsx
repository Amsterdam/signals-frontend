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
          }}
        />
      )
    )

    expect(screen.queryByTestId('users')).toBeInTheDocument()
    expect(screen.queryByTestId('groups')).toBeInTheDocument()
    expect(screen.queryByTestId('departments')).toBeInTheDocument()
    expect(screen.queryByTestId('categories')).toBeInTheDocument()
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
          }}
        />
      )
    )

    expect(screen.queryByTestId('users')).not.toBeInTheDocument()
    expect(screen.queryByTestId('groups')).not.toBeInTheDocument()
    expect(screen.queryByTestId('departments')).not.toBeInTheDocument()
    expect(screen.queryByTestId('categories')).not.toBeInTheDocument()

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
          }}
        />
      )
    )

    expect(screen.queryByTestId('users')).not.toBeInTheDocument()
    expect(screen.queryByTestId('groups')).not.toBeInTheDocument()
    expect(screen.queryByTestId('departments')).not.toBeInTheDocument()
    expect(screen.queryByTestId('categories')).not.toBeInTheDocument()

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
          }}
        />
      )
    )

    expect(screen.queryByTestId('users')).not.toBeInTheDocument()
    expect(screen.queryByTestId('groups')).toBeInTheDocument()
    expect(screen.queryByTestId('departments')).toBeInTheDocument()
    expect(screen.queryByTestId('categories')).not.toBeInTheDocument()

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
          }}
        />
      )
    )

    expect(screen.queryByTestId('users')).toBeInTheDocument()
    expect(screen.queryByTestId('groups')).not.toBeInTheDocument()
    expect(screen.queryByTestId('departments')).not.toBeInTheDocument()
    expect(screen.queryByTestId('categories')).toBeInTheDocument()

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
          }}
        />
      )
    )

    expect(screen.queryByTestId('users')).toBeInTheDocument()
    expect(screen.queryByTestId('groups')).toBeInTheDocument()
    expect(screen.queryByTestId('departments')).toBeInTheDocument()
    expect(screen.queryByTestId('categories')).toBeInTheDocument()
  })
})
