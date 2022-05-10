// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, act, fireEvent } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import configuration from 'shared/services/configuration/configuration'
import ktoFixture from 'utils/__tests__/fixtures/kto.json'
import { withAppContext } from 'test/utils'
import KTOContainer, { renderSections } from '.'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const uuid = 'a7ec1966-1f88-0f9c-d0cb-c64a6f3b05c3'

describe('signals/incident/containers/KtoContainer', () => {
  beforeEach(() => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      satisfactionIndication: 'ja',
      uuid,
    }))
  })

  afterEach(() => {
    fetch.resetMocks()
  })

  it('should render a loading indicator', async () => {
    const { queryByTestId, getByTestId, findByTestId } = render(
      withAppContext(<KTOContainer />)
    )

    expect(queryByTestId('ktoFormContainer')).not.toBeInTheDocument()
    expect(getByTestId('loadingIndicator')).toBeInTheDocument()

    await findByTestId('ktoFormContainer')

    expect(getByTestId('ktoFormContainer')).toBeInTheDocument()
    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument()
  })

  it('should render "already filled out header"', async () => {
    fetch.mockResponses([
      JSON.stringify({ detail: 'filled out' }),
      { status: 410 },
    ])

    const { getByText, findByTestId } = render(withAppContext(<KTOContainer />))

    await findByTestId('ktoFormContainer')

    expect(getByText(renderSections.FILLED_OUT.title)).toBeInTheDocument()
  })

  it('should render "too late"', async () => {
    fetch.mockResponses([
      JSON.stringify({ detail: 'too late' }),
      { status: 410 },
    ])

    const { getByText, findByTestId } = render(withAppContext(<KTOContainer />))

    await findByTestId('ktoFormContainer')

    expect(getByText(renderSections.TOO_LATE.title)).toBeInTheDocument()
  })

  it('should render "not found"', async () => {
    fetch.mockResponses([
      JSON.stringify({ detail: 'not found' }),
      { status: 410 },
    ])

    const { getByText, findByTestId } = render(withAppContext(<KTOContainer />))

    await findByTestId('ktoFormContainer')

    expect(getByText(renderSections.NOT_FOUND.title)).toBeInTheDocument()
  })

  it('should render "not found" through catch', async () => {
    fetch.mockResponses([
      JSON.stringify({ typo: 'not found' }),
      { status: 410 },
    ])

    const { getByText, findByTestId } = render(withAppContext(<KTOContainer />))

    await findByTestId('ktoFormContainer')

    expect(getByText(renderSections.NOT_FOUND.title)).toBeInTheDocument()
  })

  it('should render a correct header', async () => {
    fetch.mockResponses(
      [JSON.stringify({}), { status: 200 }],
      [JSON.stringify(ktoFixture), { status: 200 }]
    )

    const { getByText, findByTestId, rerender } = render(
      withAppContext(<KTOContainer />)
    )

    await findByTestId('ktoFormContainer')

    expect(getByText(/ja, ik ben/i)).toBeInTheDocument()

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      satisfactionIndication: 'nee',
      uuid,
    }))

    rerender(withAppContext(<KTOContainer />))

    await findByTestId('ktoFormContainer')

    expect(getByText(/nee, ik ben niet/i)).toBeInTheDocument()
  })

  it('should PUT form data', async () => {
    fetch.mockResponses(
      [JSON.stringify({}), { status: 200 }], // 'GET'
      [JSON.stringify(ktoFixture), { status: 200 }], // 'GET'
      [JSON.stringify({}), { status: 200 }] // 'PUT'
    )

    const successHeaderText = 'Bedankt voor uw feedback!'
    const { container, findByTestId, queryByText, getByText } = render(
      withAppContext(<KTOContainer />)
    )

    await findByTestId('ktoFormContainer')

    // assuming the form renders a list of radio buttons and that only a checked button in that list is required

    act(() => {
      fireEvent.click(container.querySelector('input[type="radio"]'))
    })

    const ktoSubmit = await findByTestId('ktoSubmit')

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(queryByText(successHeaderText)).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(ktoSubmit)
    })

    await findByTestId('ktoFormContainer')

    expect(fetch).toHaveBeenCalledTimes(3)

    expect(fetch).toHaveBeenLastCalledWith(
      `${configuration.FEEDBACK_FORMS_ENDPOINT}${uuid}`,
      expect.objectContaining({
        method: 'PUT',
        body: expect.objectContaining({}),
      })
    )

    expect(getByText(successHeaderText)).toBeInTheDocument()
  })
})
