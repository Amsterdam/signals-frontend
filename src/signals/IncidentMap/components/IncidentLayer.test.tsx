/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { render, screen } from '@testing-library/react'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import Map from 'components/Map'
import { withAppContext } from 'test/utils'
import IncidentLayer from './IncidentLayer'

const renderWithContext = () =>
  render(
    withAppContext(
      <Map mapOptions={MAP_OPTIONS}>
        <IncidentLayer passBbox={jest.fn()} />
      </Map>
    )
  )

describe('IncidentLayer', () => {
  it('renders the incident layer', () => {
    renderWithContext()

    expect(screen.getByTestId('incidentLayer')).toBeInTheDocument()
  })
})
