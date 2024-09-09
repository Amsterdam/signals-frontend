// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { waitFor } from '@babel/core/lib/gensync-utils/async'
import { render, act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import fetchMock from 'jest-fetch-mock'
import * as reactRouterDom from 'react-router-dom'

import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'
import ktoFixture from 'utils/__tests__/fixtures/kto.json'

import { renderSections, successSections } from './constants'
import KTOContainer from './KtoContainer'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const uuid = 'a7ec1966-1f88-0f9c-d0cb-c64a6f3b05c3'

jest.mock('shared/services/configuration/configuration')

// TODO: these tests broke when updating MSW, should be fixed
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('signals/incident/containers/KtoContainer', () => {
  beforeEach(() => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      satisfactionIndication: 'ja',
      uuid,
    }))
  })

  afterEach(() => {
    fetchMock.resetMocks()
  })

  it('should render a loading indicator', async () => {
    const { queryByTestId, getByTestId, findByTestId } = render(
      withAppContext(<KTOContainer />)
    )

    expect(queryByTestId('kto-form-container')).not.toBeInTheDocument()
    expect(getByTestId('loading-indicator')).toBeInTheDocument()

    await findByTestId('kto-form-container')

    expect(getByTestId('kto-form-container')).toBeInTheDocument()
    expect(queryByTestId('loading-indicator')).not.toBeInTheDocument()
  })

  it('should render "already filled out header"', async () => {
    fetchMock.mockResponses([
      JSON.stringify({ detail: 'filled out' }),
      { status: 410 },
    ])

    const { getByText, findByTestId } = render(withAppContext(<KTOContainer />))

    await findByTestId('kto-form-container')

    expect(getByText(renderSections.FILLED_OUT.title)).toBeInTheDocument()
  })

  it('should render "too late"', async () => {
    fetchMock.mockResponses([
      JSON.stringify({ detail: 'too late' }),
      { status: 410 },
    ])

    const { getByText, findByTestId } = render(withAppContext(<KTOContainer />))

    await findByTestId('kto-form-container')

    expect(getByText(renderSections.TOO_LATE.title)).toBeInTheDocument()
  })

  it('should render "not found"', async () => {
    fetchMock.mockResponses([
      JSON.stringify({ detail: 'not found' }),
      { status: 410 },
    ])

    const { getByText, findByTestId } = render(withAppContext(<KTOContainer />))

    await findByTestId('kto-form-container')

    expect(getByText(renderSections.NOT_FOUND.title)).toBeInTheDocument()
  })

  it('should render a correct header', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({}), { status: 200 }],
      [JSON.stringify(ktoFixture), { status: 200 }]
    )

    const { getByText, findByTestId, rerender } = render(
      withAppContext(<KTOContainer />)
    )

    await findByTestId('kto-form-container')

    expect(getByText(/ja, ik ben/i)).toBeInTheDocument()

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      satisfactionIndication: 'nee',
      uuid,
    }))

    rerender(withAppContext(<KTOContainer />))

    await findByTestId('kto-form-container')

    expect(getByText(/nee, ik ben niet/i)).toBeInTheDocument()
  })

  it('should PUT form data via checkbox fields', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({}), { status: 200 }], // 'GET'
      [JSON.stringify(ktoFixture), { status: 200 }], // 'GET'
      [JSON.stringify({}), { status: 200 }] // 'PUT'
    )

    configuration.featureFlags.reporterMailHandledNegativeContactEnabled = false
    configuration.featureFlags.enableMultipleKtoAnswers = true

    const successHeaderText = 'Bedankt voor uw feedback!'
    const { findByTestId, queryByText, getByText, rerender } = render(
      withAppContext(<KTOContainer />)
    )

    await findByTestId('kto-form-container')

    // assuming the form renders a list of checkbox buttons and that only a checked button in that list is required
    const checkbox = screen.getByRole('checkbox', {
      name: 'Ik vond het gemakkelijk om een melding te doen',
    })
    act(() => {
      fireEvent.click(checkbox)
    })

    const ktoSubmit = await findByTestId('kto-submit')

    expect(fetch).toHaveBeenCalledTimes(2)

    expect(queryByText(successHeaderText)).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(ktoSubmit)
    })

    await findByTestId('kto-form-container')

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

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      satisfactionIndication: 'nee',
      uuid,
    }))

    rerender(withAppContext(<KTOContainer />))

    expect(screen.getByTestId('succes-section-body')).toContainHTML(
      successSections['nee'].body
    )
    expect(
      screen.queryByTestId('succes-contact-allowed-text')
    ).not.toBeInTheDocument()

    rerender(withAppContext(<KTOContainer />))

    expect(screen.getByTestId('succes-section-body')).toContainHTML(
      successSections['nee'].body
    )

    rerender(withAppContext(<KTOContainer />))

    expect(screen.getByTestId('succes-section-body')).toContainHTML(
      successSections['ja'].body
    )
  })

  it('should PUT form data via radio input fields', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({}), { status: 200 }], // 'GET'
      [JSON.stringify(ktoFixture), { status: 200 }], // 'GET'
      [JSON.stringify({}), { status: 200 }] // 'PUT'
    )

    configuration.featureFlags.reporterMailHandledNegativeContactEnabled = false
    configuration.featureFlags.enableMultipleKtoAnswers = false

    const { findByTestId } = render(withAppContext(<KTOContainer />))

    await findByTestId('kto-form-container')

    // assuming the form renders a list of radio buttons and that only a checked button in that list is required
    const radioButton = screen.getByRole('radio', {
      name: 'Ik vond het gemakkelijk om een melding te doen',
    })

    act(() => {
      fireEvent.click(radioButton)
    })

    await findByTestId('kto-submit')

    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('shows the contact question when contact has been allowed', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({}), { status: 200 }], // 'GET'
      [JSON.stringify(ktoFixture), { status: 200 }], // 'GET'
      [JSON.stringify({}), { status: 200 }] // 'PUT'
    )

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      satisfactionIndication: 'nee',
      uuid,
    }))

    configuration.featureFlags.reporterMailHandledNegativeContactEnabled = true

    const { findByTestId } = render(withAppContext(<KTOContainer />))

    await findByTestId('kto-form-container')

    expect(screen.getByTestId('subtitle-allows-contact')).toBeInTheDocument()

    act(() => {
      userEvent.click(screen.getByTestId('kto-allows-contact'))
    })

    const ktoSubmit = await findByTestId('kto-submit')

    act(() => {
      fireEvent.click(ktoSubmit)
    })

    await findByTestId('kto-form-container')

    waitFor(() => {
      expect(
        screen.queryByTestId('succes-contact-allowed-text')
      ).toBeInTheDocument()
    })
  })
})
