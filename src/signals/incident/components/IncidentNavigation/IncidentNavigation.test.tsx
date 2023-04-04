// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { act, fireEvent, render } from '@testing-library/react'

import * as auth from 'shared/services/auth/auth'
import wizardDefinition from 'signals/incident/definitions/wizard'
import { history, withAppContext } from 'test/utils'

import IncidentNavigation from '.'
import { Step, Steps, Wizard } from '../StepWizard'

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

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
}))

const pushSpy = jest.spyOn(history, 'push')

describe('signals/incident/components/IncidentNavigation', () => {
  beforeEach(() => {
    handleSubmit.mockReset()
  })
  it('redirects to wizard step 1 from step 2 when refresh is hit', () => {
    const wizardDefinitionWithoutFormAction = { ...wizardDefinition }

    wizardDefinitionWithoutFormAction.vulaan.formAction = undefined

    const propsWithoutFormAction = {
      meta: {
        wizard: wizardDefinitionWithoutFormAction,
        handleSubmit,
      },
    }

    render(
      withAppContext(
        <Wizard history={history}>
          <Steps>
            <Step
              id={steps[1]}
              render={() => <IncidentNavigation {...propsWithoutFormAction} />}
            />
          </Steps>
        </Wizard>
      )
    )

    expect(pushSpy).toBeCalledWith('/incident/beschrijf')
  })

  it('renders a next button for the first step', () => {
    const { getByTestId, queryByTestId } = render(
      withAppContext(
        <Wizard history={history}>
          <Steps>
            <Step
              id={steps[0]}
              render={() => <IncidentNavigation {...props} />}
            />
          </Steps>
        </Wizard>
      )
    )

    expect(getByTestId('next-button')).toBeInTheDocument()
    expect(queryByTestId('previous-button')).not.toBeInTheDocument()
  })

  it('renders previous and next buttons for intermediate steps', () => {
    const { getByTestId } = render(
      withAppContext(
        <Wizard history={history}>
          <Steps>
            <Step
              id={steps[1]}
              render={() => <IncidentNavigation {...props} />}
            />
          </Steps>
        </Wizard>
      )
    )

    expect(getByTestId('next-button')).toBeInTheDocument()
    expect(getByTestId('previous-button')).toBeInTheDocument()
  })

  it('renders a previous button for the last step', () => {
    const lastStep = [...steps].reverse()[0]

    const { getByTestId, queryByTestId } = render(
      withAppContext(
        <Wizard history={history}>
          <Steps>
            <Step
              id={lastStep}
              render={() => <IncidentNavigation {...props} />}
            />
          </Steps>
        </Wizard>
      )
    )

    expect(queryByTestId('next-button')).not.toBeInTheDocument()
    expect(getByTestId('previous-button')).toBeInTheDocument()
  })

  it('does not render', () => {
    const { queryByTestId } = render(
      withAppContext(
        <Wizard history={history}>
          <Steps>
            <Step
              id="incident/bedankt"
              render={() => <IncidentNavigation {...props} />}
            />
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
            <Step
              id={steps[1]}
              render={() => <IncidentNavigation {...props} />}
            />
          </Steps>
        </Wizard>
      )
    )

    expect(handleSubmit).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('next-button'))
    })

    expect(handleSubmit).toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('previous-button'))
    })
  })
})
