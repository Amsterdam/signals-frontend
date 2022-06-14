// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, fireEvent, act, screen } from '@testing-library/react'
import { history, withAppContext } from 'test/utils'

import * as reactRouterDom from 'react-router-dom'
import { mocked } from 'jest-mock'
import configuration from 'shared/services/configuration/configuration'
import { filesUpload } from 'shared/services/files-upload/files-upload'
import * as incidentContainerActions from 'signals/incident/containers/IncidentContainer/actions'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import configureStore from 'configureStore'
import * as reactRedux from 'react-redux'
import KtoForm from '.'

const onSubmit = jest.fn()

const options = [
  { key: 'a', value: 'Foo' },
  { key: 'b', value: 'Bar' },
  { key: 'c', value: 'Baz' },
  { key: 'anders', value: 'Here be dragons' },
]

const value = 'Bar baz foo'
let fileInput, file

const mockedUseParams = mocked(reactRouterDom.useParams)
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}))

jest.mock('shared/services/configuration/configuration')
jest.mock('shared/services/files-upload/files-upload')

jest.spyOn(incidentContainerActions, 'updateIncident')

describe('signals/incident/containers/KtoContainer/components/KtoForm', () => {
  beforeEach(() => {
    onSubmit.mockReset()
  })

  afterEach(() => {
    configuration.__reset()
  })

  it('renders correctly', () => {
    configuration.featureFlags.reporterMailHandledNegativeContactEnabled = true
    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))

    const { container, getByTestId, rerender } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(
      options.length
    )

    expect(getByTestId('ktoTextExtra')).toBeInTheDocument()
    expect(getByTestId('fileInput')).toBeInTheDocument()
    expect(getByTestId('ktoAllowsContact')).toBeInTheDocument()
    expect(getByTestId('ktoSubmit')).toBeInTheDocument()

    expect(screen.queryByTestId('allowsContact')).toHaveTextContent(
      'Nee, bel of e-mail mij niet meer over deze melding of over mijn reactie.'
    )

    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'ja',
    }))

    rerender(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    expect(screen.queryByTestId('allowsContact')).toBeFalsy()

    configuration.featureFlags.reporterMailHandledNegativeContactEnabled = false

    rerender(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    expect(screen.queryByTestId('allowsContact')).toHaveTextContent('Ja')

    mockedUseParams.mockImplementation(() => ({ satisfactionIndication: 'ja' }))

    rerender(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    expect(screen.queryByTestId('allowsContact')).toHaveTextContent('Ja')
  })

  it('renders the correct title', () => {
    mockedUseParams.mockImplementation(() => ({ satisfactionIndication: 'ja' }))

    const { getByText, unmount, rerender } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    expect(getByText('Waarom bent u tevreden?')).toBeInTheDocument()

    unmount()

    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))

    rerender(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied={false}
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    expect(screen.queryByText('Waarom bent u ontevreden?')).toBeInTheDocument()
  })

  it('requires one of the options to be selected', () => {
    const { queryByText, getByText, getByTestId } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    expect(queryByText('Dit veld is verplicht')).not.toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(getByText('Dit veld is verplicht')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('requires text area to contain content when last option is selected', () => {
    const { queryByText, getByText, queryByTestId, getByTestId } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    const lastOption = getByTestId(`kto-${[...options].reverse()[0].key}`)
    expect(queryByTestId('ktoText')).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(lastOption)
    })

    expect(getByTestId('ktoText')).toBeInTheDocument()
    expect(queryByText('Dit veld is verplicht')).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(getByText('Dit veld is verplicht')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should clear error message', () => {
    const { queryByText, getByText, queryByTestId, getByTestId } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    const lastOption = getByTestId(`kto-${[...options].reverse()[0].key}`)
    expect(queryByTestId('ktoText')).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(lastOption)
    })

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(getByText('Dit veld is verplicht')).toBeInTheDocument()

    const value = 'Qux Baz'

    act(() => {
      fireEvent.change(getByTestId('ktoText'), { target: { value } })
    })

    expect(queryByText('Dit veld is verplicht')).not.toBeInTheDocument()
  })

  it('should handle submit for all but last option', () => {
    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'ja',
    }))

    const { getByTestId } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    const firstOption = getByTestId(`kto-${options[0].key}`)

    act(() => {
      fireEvent.click(firstOption)
    })

    expect(onSubmit).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        is_satisfied: true,
        text: options[0].value,
      })
    )
  })

  it('should handle submit for last option', () => {
    const { getByTestId } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          isSatisfied
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    const lastOption = getByTestId(`kto-${[...options].reverse()[0].key}`)

    act(() => {
      fireEvent.click(lastOption)
    })

    const value = 'Qux Baz'

    act(() => {
      fireEvent.change(getByTestId('ktoText'), { target: { value } })
    })

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        text: value,
      })
    )
  })

  it('should contain the correct values in the submit payload', () => {
    configuration.featureFlags.reporterMailHandledNegativeContactEnabled = true
    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))

    const setContactAllowed = jest.fn()

    const { getByTestId } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          onSubmit={onSubmit}
          options={options}
          setContactAllowed={setContactAllowed}
        />
      )
    )

    fillForm()

    fireEvent.click(getByTestId('ktoAllowsContact'))

    expect(setContactAllowed).toHaveBeenCalled()

    fireEvent.click(getByTestId('ktoSubmit'))

    // Be default allowscontact equals true but after clicking
    expect(onSubmit).toHaveBeenCalledWith({
      allows_contact: false,
      is_satisfied: false,
      text_extra: value,
      text: options[1].value,
    })
  })
  it('should have the correct values in the submit payload of the old flow', () => {
    configuration.featureFlags.reporterMailHandledNegativeContactEnabled = false
    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))

    const { getByTestId, rerender } = render(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    fillForm()

    fireEvent.click(getByTestId('ktoSubmit'))

    // By default allow_contact equals false is in the old flow
    expect(onSubmit).toHaveBeenCalledWith({
      allows_contact: false,
      is_satisfied: false,
      text_extra: value,
      text: options[1].value,
    })

    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))

    rerender(
      withAppContext(
        <KtoForm
          dataFeedbackForms={{ signal_id: 123 }}
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    fillForm()

    fireEvent.click(getByTestId('ktoAllowsContact'))

    fireEvent.click(getByTestId('ktoSubmit'))

    // By default allow_contact equals false is in the old flow
    expect(onSubmit).toHaveBeenCalledWith({
      allows_contact: true,
      is_satisfied: false,
      text_extra: value,
      text: options[1].value,
    })
  })
  it('should upload a picture', () => {
    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))

    render(
      withAppContext(
        <Provider store={configureStore({}, history)}>
          <KtoForm
            onSubmit={onSubmit}
            options={options}
            dataFeedbackForms={{ signal_id: 123 }}
          />
        </Provider>
      )
    )

    uploadFile()
    fillForm()

    expect(incidentContainerActions.updateIncident).toBeCalledWith({
      images: [file],
      images_previews: ['https://url-from-data/image.jpg'],
    })
  })
  it('should call filesUpload when submitting', () => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue({
      incident: {
        images: [file],
        images_previews: ['https://url-from-data/image.jpg'],
      },
    })

    render(
      withAppContext(
        <Provider store={configureStore({}, history)}>
          <KtoForm
            onSubmit={onSubmit}
            options={options}
            dataFeedbackForms={{ signal_id: 123 }}
          />
        </Provider>
      )
    )
    fillForm()

    fireEvent.click(screen.getByTestId('ktoSubmit'))

    expect(filesUpload).toBeCalledWith({
      files: [file],
      url: 'http://localhost:8000/signals/v1/public/signals/123/attachments/',
    })
  })
})

function uploadFile() {
  fileInput = screen.getByTestId('fileInputUpload')
  file = new File(['hello'], 'hello.png', { type: 'image/png' })
  Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 }) // 1 MB
  userEvent.upload(fileInput, file)
}

function fillForm() {
  const secondOption = screen.getByTestId(`kto-${options[1].key}`)
  fireEvent.click(secondOption)
  fireEvent.change(screen.getByTestId('ktoTextExtra'), { target: { value } })
}
