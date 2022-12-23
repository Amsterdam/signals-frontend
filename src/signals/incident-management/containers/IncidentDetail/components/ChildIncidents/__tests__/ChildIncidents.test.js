// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { fireEvent, render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import childIncidentsFixture from 'utils/__tests__/fixtures/childIncidents.json'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import history from 'utils/__tests__/fixtures/incidentHistory.json'

import ChildIncidents from '..'
import IncidentDetailContext from '../../../context'

const update = jest.fn()

const renderWithContext = (Component) =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ update }}>
      {Component}
    </IncidentDetailContext.Provider>
  )

describe('IncidentDetail/components/ChildIncidents', () => {
  beforeEach(() => {
    update.mockReset()
  })

  it('should not render anything', () => {
    const childIncidents = []
    const parent = { updated_at: null }
    render(
      withAppContext(
        <ChildIncidents
          childrenList={childIncidents}
          parent={parent}
          history={[history]}
        />
      )
    )

    expect(screen.queryByText('Deelmelding')).not.toBeInTheDocument()
    expect(screen.queryByTestId('child-incidents')).not.toBeInTheDocument()
    expect(screen.queryByTestId('no-action-button')).not.toBeInTheDocument()
  })

  it('should render correctly', () => {
    const childrenList = childIncidentsFixture.results
    const parent = { updated_at: childIncidentsFixture.results[0].updated_at }
    const childIncidents = [{ ...incidentFixture, id: childrenList[0].id }]

    const { rerender } = render(
      renderWithContext(
        <ChildIncidents
          childrenList={childrenList}
          parent={parent}
          history={[history]}
          childIncidents={childIncidents}
        />
      )
    )

    expect(screen.queryByText('Deelmelding')).toBeInTheDocument()
    expect(screen.queryByTestId('child-incidents')).toBeInTheDocument()
    expect(screen.queryByTestId('no-action-button')).toBeInTheDocument()

    const updatedParent = { updated_at: new Date().toISOString() }
    rerender(
      renderWithContext(
        <ChildIncidents
          childrenList={childrenList}
          parent={updatedParent}
          history={[history]}
          childIncidents={childIncidents}
        />
      )
    )

    expect(screen.queryByText('Deelmelding')).toBeInTheDocument()
    expect(screen.queryByTestId('child-incidents')).toBeInTheDocument()
    expect(screen.queryByTestId('no-action-button')).not.toBeInTheDocument()
  })

  it('should reset the incident state ', async () => {
    const childrenList = childIncidentsFixture.results
    const parent = { updated_at: childIncidentsFixture.results[0].updated_at }

    render(
      withAppContext(
        renderWithContext(
          <ChildIncidents
            childrenList={childrenList}
            parent={parent}
            history={[history]}
          />
        )
      )
    )

    const button = await screen.findByTestId('no-action-button')
    fireEvent.click(button)
    await screen.findByTestId('no-action-button')
    expect(update).toHaveBeenCalledTimes(1)
  })
})
