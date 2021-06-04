// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import * as reactRouterDom from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import userEvent from '@testing-library/user-event'
import { INCIDENT_URL } from 'signals/incident-management/routes'
import AreaContainer from '..'
import { fetchMock } from '../../../../../../internals/testing/msw-server'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const ID = '123'
const pushSpy = jest.fn()
const useHistorySpy = { push: pushSpy } as any
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => useHistorySpy)
jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
  id: ID,
}))

fetchMock.disableMocks()

describe('<AreaContainer />', () => {
  it('renders a map', async () => {
    render(withAppContext(<AreaContainer />))

    await screen.findByText('Leaflet')
  })

  it('handles navigation to parent incident', async () => {
    render(withAppContext(<AreaContainer />))

    const closeButton = await screen.findByTestId('mapCloseButton')

    userEvent.click(closeButton)

    expect(pushSpy).toHaveBeenCalledWith(`${INCIDENT_URL}/${ID}`)
  })
})
