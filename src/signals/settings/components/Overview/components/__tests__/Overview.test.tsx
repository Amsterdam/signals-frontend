import { render } from '@testing-library/react'
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
    const { queryByTestId } = render(
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

    expect(queryByTestId('users')).toBeInTheDocument()
    expect(queryByTestId('groups')).toBeInTheDocument()
    expect(queryByTestId('departments')).toBeInTheDocument()
    expect(queryByTestId('categories')).toBeInTheDocument()
  })

  it('should show specific settings based on props', () => {
    const { rerender, queryByTestId, unmount } = render(
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

    expect(queryByTestId('users')).not.toBeInTheDocument()
    expect(queryByTestId('groups')).not.toBeInTheDocument()
    expect(queryByTestId('departments')).not.toBeInTheDocument()
    expect(queryByTestId('categories')).not.toBeInTheDocument()

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

    expect(queryByTestId('users')).not.toBeInTheDocument()
    expect(queryByTestId('groups')).not.toBeInTheDocument()
    expect(queryByTestId('departments')).not.toBeInTheDocument()
    expect(queryByTestId('categories')).not.toBeInTheDocument()

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

    expect(queryByTestId('users')).not.toBeInTheDocument()
    expect(queryByTestId('groups')).toBeInTheDocument()
    expect(queryByTestId('departments')).toBeInTheDocument()
    expect(queryByTestId('categories')).not.toBeInTheDocument()

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

    expect(queryByTestId('users')).toBeInTheDocument()
    expect(queryByTestId('groups')).not.toBeInTheDocument()
    expect(queryByTestId('departments')).not.toBeInTheDocument()
    expect(queryByTestId('categories')).toBeInTheDocument()

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

    expect(queryByTestId('users')).toBeInTheDocument()
    expect(queryByTestId('groups')).toBeInTheDocument()
    expect(queryByTestId('departments')).toBeInTheDocument()
    expect(queryByTestId('categories')).toBeInTheDocument()
  })
})
