// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { render, act, fireEvent, screen } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import configuration from 'shared/services/configuration/configuration'
import ktoFixture from 'utils/__tests__/fixtures/kto.json'
import { withAppContext } from 'test/utils'
import { useParams } from 'react-router-dom'
// eslint-disable-next-line no-restricted-imports
import React from 'react'
import KTOContainer, { renderSections, successSections } from '.'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const uuid = 'a7ec1966-1f88-0f9c-d0cb-c64a6f3b05c3'

jest.mock('shared/services/configuration/configuration')

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

    configuration.featureFlags.reporterMailHandledNegativeContactEnabled = false

    const successHeaderText = 'Bedankt voor uw reactie'
    const { container, findByTestId, queryByText, getByText, rerender } =
      render(withAppContext(<KTOContainer />))

    await findByTestId('ktoFormContainer')

    // assuming the form renders a list of radio buttons and that only a checked button in that list is required

    act(() => {
      fireEvent.click(container.querySelector('input[type="checkbox"]'))
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

    expect(getByText(successSections['ja'].body)).toBeInTheDocument()

    useParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
      uuid,
    }))

    rerender(withAppContext(<KTOContainer />))

    expect(screen.getByTestId('succesSectionBody')).toContainHTML(
      successSections['nee'].body
    )
    expect(
      screen.queryByTestId('succesContactAllowedText')
    ).not.toBeInTheDocument()

    rerender(withAppContext(<KTOContainer />))

    expect(screen.getByTestId('succesSectionBody')).toContainHTML(
      successSections['nee'].body
    )

    useParams.mockImplementation(() => ({
      satisfactionIndication: 'ja',
      uuid,
    }))

    rerender(withAppContext(<KTOContainer />))

    expect(screen.getByTestId('succesSectionBody')).toContainHTML(
      successSections['ja'].body
    )
  })

  it('shows the contact question when contact has been allowed', async () => {
    fetch.mockResponses(
      [JSON.stringify({}), { status: 200 }], // 'GET'
      [JSON.stringify(ktoFixture), { status: 200 }], // 'GET'
      [JSON.stringify({}), { status: 200 }] // 'PUT'
    )

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      satisfactionIndication: 'nee',
      uuid,
    }))

    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => React.useState([true, () => null]))

    configuration.featureFlags.reporterMailHandledNegativeContactEnabled = true

    const { container, findByTestId } = render(withAppContext(<KTOContainer />))

    await findByTestId('ktoFormContainer')

    expect(screen.getByTestId('subtitleAllowsContact')).toBeInTheDocument()

    act(() => {
      fireEvent.click(container.querySelector('input[type="checkbox"]'))
    })

    const ktoSubmit = await findByTestId('ktoSubmit')

    act(() => {
      fireEvent.click(ktoSubmit)
    })

    await findByTestId('ktoFormContainer')

    expect(screen.queryByTestId('succesContactAllowedText')).toBeInTheDocument()
  })
})
