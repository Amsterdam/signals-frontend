// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, fireEvent, act } from '@testing-library/react'
import { Wizard, Steps, Step } from 'react-albus'
import * as auth from 'shared/services/auth/auth'
import wizardDefinition from 'signals/incident/definitions/wizard'
import { withAppContext, history } from 'test/utils'

import IncidentNavigation from '.'

jest.mock('shared/services/auth/auth', () => ({
  __esModule: true,
  ...jest.requireActual('shared/services/auth/auth'),
}))

jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

const steps = Object.keys(wizardDefinition)
  .filter((key) => key !== 'opslaan')
  .map((key) => `incident/${key}`)

const handleSubmit = jest.fn()

const props = {
  meta: {
    wizard: wizardDefinition,
    handleSubmit,
  },
}

const mockReset = jest.fn()

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    reset: mockReset,
  }),
}))

describe('signals/incident/components/IncidentNavigation', () => {
  beforeEach(() => {
    handleSubmit.mockReset()
  })

  it('renders a next button for the first step', () => {
    const { getByTestId, queryByTestId } = render(
      withAppContext(
        <Wizard history={history}>
          <Steps>
            <Step id={steps[0]}>
              <IncidentNavigation {...props} />
            </Step>
          </Steps>
        </Wizard>
      )
    )

    expect(getByTestId('nextButton')).toBeInTheDocument()
    expect(queryByTestId('previousButton')).not.toBeInTheDocument()
  })

  it('renders previous and next buttons for intermediate steps', () => {
    const { getByTestId } = render(
      withAppContext(
        <Wizard history={history}>
          <Steps>
            <Step id={steps[1]}>
              <IncidentNavigation {...props} />
            </Step>
          </Steps>
        </Wizard>
      )
    )

    expect(getByTestId('nextButton')).toBeInTheDocument()
    expect(getByTestId('previousButton')).toBeInTheDocument()
  })

  it('renders a previous button for the last step', () => {
    const lastStep = [...steps].reverse()[0]

    const { getByTestId, queryByTestId } = render(
      withAppContext(
        <Wizard history={history}>
          <Steps>
            <Step id={lastStep}>
              <IncidentNavigation {...props} />
            </Step>
          </Steps>
        </Wizard>
      )
    )

    expect(queryByTestId('nextButton')).not.toBeInTheDocument()
    expect(getByTestId('previousButton')).toBeInTheDocument()
  })

  it('does not render', () => {
    const { queryByTestId } = render(
      withAppContext(
        <Wizard history={history}>
          <Steps>
            <Step id="incident/bedankt">
              <IncidentNavigation {...props} />
            </Step>
          </Steps>
        </Wizard>
      )
    )

    expect(queryByTestId('incident-navigation')).not.toBeInTheDocument()
  })

  it('should call onSubmit', () => {
    const { getByTestId } = render(
      withAppContext(
        <Wizard history={history}>
          <Steps>
            <Step id={steps[1]}>
              <IncidentNavigation {...props} />
            </Step>
          </Steps>
        </Wizard>
      )
    )

    expect(handleSubmit).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('nextButton'))
    })

    expect(handleSubmit).toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('previousButton'))
    })

    expect(mockReset).toHaveBeenCalled()
  })
})
