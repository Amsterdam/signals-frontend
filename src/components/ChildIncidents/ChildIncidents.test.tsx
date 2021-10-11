// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import 'jest-styled-components'

import { withAppContext } from 'test/utils'

import { INCIDENT_URL } from 'signals/incident-management/routes'
import childIncidentsFixture from 'utils/__tests__/fixtures/childIncidents.json'

import ChildIncidents, {
  STATUS_RESPONSE_REQUIRED,
  STATUS_NONE,
} from './ChildIncidents'

import type { ChildIncident } from './ChildIncidents'

const parentUpdatedAt = childIncidentsFixture.results[2].updated_at

const getChildren = (opts = {}): Array<ChildIncident> => {
  const options = {
    ...{ numValues: 4, withHref: true, withStatus: true, withChanged: false },
    ...opts,
  }

  return childIncidentsFixture.results.map(
    ({ status, category, id, can_view_signal }) => {
      const values = {
        id,
        status: status.state_display,
        category: `${category.sub} (${category.departments})`,
        handlingTime: '3 werkdagen',
      }

      return {
        href: options.withHref ? `${INCIDENT_URL}/${id}` : undefined,
        canView: can_view_signal,
        status: options.withStatus ? STATUS_RESPONSE_REQUIRED : STATUS_NONE,
        values,
        changed: options.withChanged,
      }
    }
  )
}

describe('components/ChildIncidents', () => {
  it('should render a list', () => {
    const children = getChildren()
    render(
      withAppContext(
        <ChildIncidents
          incidents={children}
          parentUpdatedAt={parentUpdatedAt}
        />
      )
    )

    const list = screen.getByTestId('childIncidents')

    expect(list).toBeInTheDocument()
    expect(list.nodeName).toEqual('UL')
    expect(document.querySelectorAll('li')).toHaveLength(children.length)
  })

  it('should render links', () => {
    const children = getChildren({ withHref: true })
    const { rerender } = render(
      withAppContext(
        <ChildIncidents
          incidents={children}
          parentUpdatedAt={parentUpdatedAt}
        />
      )
    )

    expect(screen.getAllByRole('link').length).toBeGreaterThan(0)

    rerender(
      withAppContext(
        <ChildIncidents
          incidents={getChildren({ withHref: false })}
          parentUpdatedAt={parentUpdatedAt}
        />
      )
    )

    expect(screen.queryAllByRole('link').length).toEqual(0)
  })

  it('should show a status incidator', () => {
    const children = getChildren()
    const { rerender } = render(
      withAppContext(
        <ChildIncidents
          incidents={children}
          parentUpdatedAt={parentUpdatedAt}
        />
      )
    )

    screen.getAllByRole('listitem').forEach((element) => {
      expect(element).toHaveStyleRule('border-right', '2px solid white', {
        modifier: '::before',
      })
    })

    rerender(
      withAppContext(
        <ChildIncidents
          incidents={getChildren({ withStatus: false })}
          parentUpdatedAt={parentUpdatedAt}
        />
      )
    )

    screen.getAllByRole('listitem').forEach((element) => {
      expect(element).not.toHaveStyleRule('border-right', '2px solid white', {
        modifier: '::before',
      })
    })
  })

  it('sets the correct class name', () => {
    const children = getChildren()

    render(
      withAppContext(
        <ChildIncidents
          incidents={children}
          parentUpdatedAt={parentUpdatedAt}
        />
      )
    )

    expect(document.querySelector('.status.handled')).toBeInTheDocument()
    expect(document.querySelector('.status.alert')).toBeInTheDocument()
  })

  it('should mark the changed children', () => {
    const children = getChildren()
    const { rerender } = render(
      withAppContext(
        <ChildIncidents
          incidents={children}
          parentUpdatedAt={parentUpdatedAt}
        />
      )
    )

    screen.getAllByRole('listitem').forEach((element) => {
      expect(element).not.toHaveStyleRule('border-left')
    })

    rerender(
      withAppContext(
        <ChildIncidents
          incidents={getChildren({ withChanged: true })}
          parentUpdatedAt={parentUpdatedAt}
        />
      )
    )

    screen.getAllByRole('listitem').forEach((element) => {
      expect(element).toHaveStyleRule('border-left', '4px solid #FEC813')
    })
  })
})
