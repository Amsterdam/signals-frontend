import { render, screen } from '@testing-library/react'
import Filter from '../'

describe('Filter', () => {
  it('should render', () => {
    render(<Filter subcategory="foo" startDate={new Date().toISOString()} />)
  })

  it('should show the correct period', () => {
    const { rerender, unmount } = render(
      <Filter subcategory="foo" startDate={new Date(0).toISOString()} />
    )

    expect(screen.getByTestId('period').textContent?.trim()).toEqual(
      'Van 01-01-1970 t/m NU'
    )

    unmount()

    rerender(
      <Filter
        subcategory="foo"
        startDate={new Date('07 04 1054').toISOString()}
      />
    )

    expect(screen.getByTestId('period').textContent?.trim()).toEqual(
      'Van 04-07-1054 t/m NU'
    )
  })

  it('should show the correct subcategory', () => {
    const { rerender, unmount } = render(
      <Filter subcategory="foo" startDate={new Date().toISOString()} />
    )

    expect(screen.getByTestId('subcategory').textContent?.trim()).toEqual('foo')

    unmount()

    rerender(<Filter subcategory="bar" startDate={new Date(0).toISOString()} />)

    expect(screen.getByTestId('subcategory').textContent?.trim()).toEqual('bar')
  })

  it('should not show the subcategory if it is not in the props', () => {
    render(<Filter startDate={new Date().toISOString()} />)

    expect(screen.queryByTestId('subcategory')).not.toBeInTheDocument()
  })

  it('should show the responsible department', () => {
    const { rerender, unmount } = render(
      <Filter
        subcategory="sub"
        departments="foo"
        startDate={new Date().toISOString()}
      />
    )

    expect(screen.getByTestId('departments').textContent?.trim()).toEqual(
      '(foo)'
    )

    unmount()

    rerender(
      <Filter
        subcategory="sub"
        departments="bar"
        startDate={new Date(0).toISOString()}
      />
    )

    expect(screen.getByTestId('departments').textContent?.trim()).toEqual(
      '(bar)'
    )
  })

  it('should not show the responsible department if no subcategory is set', () => {
    render(<Filter departments="foo" startDate={new Date().toISOString()} />)

    expect(screen.queryByTestId('departments')).not.toBeInTheDocument()
  })
})
