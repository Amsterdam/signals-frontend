// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { getIsAuthenticated } from 'shared/services/auth/auth'
import { statusList } from 'signals/incident-management/definitions'
import { withAppContext } from 'test/utils'

import DetailPanel from '..'

jest.mock('shared/services/auth/auth')

const mockIsAuthenticated = getIsAuthenticated as jest.MockedFunction<
  typeof getIsAuthenticated
>

describe('signals/incident-management/containes/IncidentOverviewPage/components/DetailPanel', () => {
  it('should render UI element', () => {
    const incident = { id: 1234 }
    render(
      withAppContext(<DetailPanel incident={incident} onClose={() => {}} />)
    )

    expect(screen.getByText(/1234/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /1234/i })
    ).not.toBeInTheDocument()
  })

  it('should render link when authenticated', () => {
    mockIsAuthenticated.mockImplementation(() => true)
    const incident = { id: 1234 }
    render(
      withAppContext(<DetailPanel incident={incident} onClose={() => {}} />)
    )
    expect(screen.getByRole('link', { name: /1234/i })).toBeInTheDocument()
  })

  it('should not show extra properties', () => {
    const incident = {
      id: 1234,
    }
    render(
      withAppContext(<DetailPanel incident={incident} onClose={() => {}} />)
    )
    expect(screen.queryByText(/gemeld op/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/status/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/hoofdcategorie/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/subcategorie/i)).not.toBeInTheDocument()
  })

  it('should show extra properties', () => {
    const incident = {
      id: 1234,
      created_at: '2020-03-04T05:06:07',
      status: statusList[1].key,
      category: {
        main: 'Main Category',
        sub: 'Sub Category',
      },
    }
    render(
      withAppContext(<DetailPanel incident={incident} onClose={() => {}} />)
    )
    expect(screen.getByText(/gemeld op/i)).toBeInTheDocument()
    expect(screen.getByText(/04-03-2020 05.06/i)).toBeInTheDocument()
    expect(screen.getByText(/status/i)).toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(statusList[1].value, 'i'))
    ).toBeInTheDocument()
    expect(screen.getByText(/hoofdcategorie/i)).toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(incident.category.main, 'i'))
    ).toBeInTheDocument()
    expect(screen.getByText(/subcategorie/i)).toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(incident.category.sub, 'i'))
    ).toBeInTheDocument()
  })

  it('should not show categories', () => {
    const incident = {
      id: 1234,
      created_at: '2020-03-04T05:06:07',
      status: statusList[1].key,
    }
    render(
      withAppContext(<DetailPanel incident={incident} onClose={() => {}} />)
    )
    expect(screen.getByText(/gemeld op/i)).toBeInTheDocument()
    expect(screen.getByText(/04-03-2020 05.06/i)).toBeInTheDocument()
    expect(screen.getByText(/status/i)).toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(statusList[1].value, 'i'))
    ).toBeInTheDocument()
    expect(screen.queryByText(/hoofdcategorie/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/subcategorie/i)).not.toBeInTheDocument()
  })

  it('should call onClose', () => {
    const onClose = jest.fn()
    const incident = { id: 1234 }
    render(
      withAppContext(<DetailPanel incident={incident} onClose={onClose} />)
    )

    expect(onClose).not.toHaveBeenCalled()

    userEvent.click(screen.getByRole('button'))

    expect(onClose).toHaveBeenCalled()
  })
})
