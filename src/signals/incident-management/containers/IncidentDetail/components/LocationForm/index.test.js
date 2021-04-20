// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React from 'react'
import { render, act, fireEvent } from '@testing-library/react'

import { withMapContext } from 'test/utils'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'

import { PATCH_TYPE_LOCATION } from '../../constants'
import IncidentDetailContext from '../../context'
import LocationForm from '.'

const update = jest.fn()
const close = jest.fn()

const renderWithContext = () =>
  withMapContext(
    <IncidentDetailContext.Provider
      value={{ incident: incidentFixture, update, close }}
    >
      <LocationForm />
    </IncidentDetailContext.Provider>
  )

describe('incident-management/containers/IncidentDetail/components/LocationForm', () => {
  beforeEach(() => {
    update.mockReset()
    close.mockReset()
  })

  it('should render a form', () => {
    const { getByTestId } = render(renderWithContext())

    expect(getByTestId('locationForm')).toBeInTheDocument()
    expect(getByTestId('mapInput')).toBeInTheDocument()
  })

  it('should call handlers', () => {
    const { queryByTestId } = render(renderWithContext())

    expect(close).not.toHaveBeenCalled()
    expect(update).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(queryByTestId('submitBtn'))
    })

    expect(update).toHaveBeenCalledWith({
      type: PATCH_TYPE_LOCATION,
      patch: { location: incidentFixture.location },
    })

    expect(close).toHaveBeenCalled()
  })
})
