// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'
import { mount } from 'enzyme'
import { withAppContext } from 'test/utils'
import PageHeaderComponent from 'components/PageHeader'
import PageHeaderContainer, { PageHeaderContainerComponent } from '..'

describe('containers/PageHeader', () => {
  const filter = { name: '' }

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<PageHeaderContainer />))

    const props = tree.find(PageHeaderContainerComponent).props()

    expect(props.filter).toBeDefined()
    expect(props.incidentsCount).toBeUndefined()
    expect(props.query).toBeDefined()
  })

  it('renders a PageHeader component', () => {
    const tree = mount(withAppContext(<PageHeaderContainer />))

    expect(tree.find(PageHeaderComponent)).toBeDefined()
  })

  it('should provide the PageHeader component with a title', () => {
    const { container, rerender } = render(
      withAppContext(
        <PageHeaderContainerComponent filter={filter} incidentsCount={null} />
      )
    )

    expect(container.firstChild.querySelector('h1').textContent).toEqual(
      'Meldingen'
    )

    rerender(
      withAppContext(
        <PageHeaderContainerComponent filter={filter} incidentsCount={0} />
      )
    )

    expect(container.firstChild.querySelector('h1').textContent).toEqual(
      'Meldingen (0)'
    )

    rerender(
      withAppContext(
        <PageHeaderContainerComponent filter={filter} incidentsCount={10} />
      )
    )

    expect(container.firstChild.querySelector('h1').textContent).toEqual(
      'Meldingen (10)'
    )

    rerender(
      withAppContext(
        <PageHeaderContainerComponent
          filter={{ name: 'Foo bar !!1!' }}
          incidentsCount={null}
        />
      )
    )

    expect(container.firstChild.querySelector('h1').textContent).toEqual(
      'Foo bar !!1!'
    )

    rerender(
      withAppContext(
        <PageHeaderContainerComponent
          filter={{ name: 'Foo bar !!1!' }}
          incidentsCount={99}
        />
      )
    )

    expect(container.firstChild.querySelector('h1').textContent).toEqual(
      'Foo bar !!1! (99)'
    )

    rerender(
      withAppContext(
        <PageHeaderContainerComponent
          filter={{ name: 'Foo bar !!1!', refresh: true }}
          incidentsCount={99}
        />
      )
    )

    expect(container.firstChild.querySelector('svg')).toBeTruthy()
  })

  it('should provide the PageHeader component with a subtitle', () => {
    const query = 'Foo bar'

    const { container } = render(
      withAppContext(
        <PageHeaderContainerComponent
          filter={filter}
          incidentsCount={null}
          query={query}
        />
      )
    )

    expect(container.textContent).toEqual(expect.stringMatching(/Foo bar/))
  })
})
