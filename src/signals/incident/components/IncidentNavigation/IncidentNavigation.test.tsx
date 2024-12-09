// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import * as auth from 'shared/services/auth/auth'
import wizardDefinition from 'signals/incident/definitions/wizard'
import { withAppContext } from 'test/utils'

import IncidentNavigation from '.'
import configuration from '../../../../shared/services/configuration/configuration'
import { Step, Steps, Wizard } from '../StepWizard'

jest.mock('shared/services/auth/auth', () => ({
  __esModule: true,
  ...jest.requireActual('shared/services/auth/auth'),
}))

jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

jest.mock('shared/services/configuration/configuration')

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

const navigateSpy = jest.fn()

jest.mock('react-router-dom', () => {
  return {
    __esModule: true,
    ...jest.requireActual('react-router-dom'),
  }
})

jest.spyOn(reactRouterDom, 'useNavigate').mockImplementation(() => navigateSpy)

describe('signals/incident/components/IncidentNavigation', () => {
  beforeEach(() => {
    handleSubmit.mockReset()
  })

  it('redirects to wizard step 1 from step 2 when refresh is hit', async () => {
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
        <Wizard>
          <Steps>
            <Step
              id={steps[1]}
              render={() => <IncidentNavigation {...propsWithoutFormAction} />}
            />
          </Steps>
        </Wizard>
      )
    )

    await waitFor(() => {
      expect(navigateSpy).toBeCalledWith('/incident/beschrijf')
    })
  })

  it('renders a next button for the first step', async () => {
    const { getByTestId, queryByTestId } = render(
      withAppContext(
        <Wizard>
          <Steps>
            <Step
              id={steps[0]}
              key={steps[0]}
              render={() => <IncidentNavigation {...props} />}
            />
          </Steps>
        </Wizard>
      )
    )

    await waitFor(() => {
      expect(getByTestId('next-button')).toBeInTheDocument()
      expect(queryByTestId('previous-button')).not.toBeInTheDocument()
    })
  })

  it('renders previous and next buttons for intermediate steps', async () => {
    const { getByTestId } = render(
      withAppContext(
        <Wizard>
          <Steps>
            <Step
              id={steps[1]}
              render={() => <IncidentNavigation {...props} />}
            />
          </Steps>
        </Wizard>
      )
    )

    await waitFor(() => {
      expect(getByTestId('next-button')).toBeInTheDocument()
      expect(getByTestId('previous-button')).toBeInTheDocument()
    })
  })

  it('renders a previous button for the last step', async () => {
    const lastStep = [...steps].reverse()[0]

    const { getByTestId, queryByTestId } = render(
      withAppContext(
        <Wizard>
          <Steps>
            <Step
              id={lastStep}
              render={() => <IncidentNavigation {...props} />}
            />
          </Steps>
        </Wizard>
      )
    )

    await waitFor(() => {
      expect(queryByTestId('next-button')).not.toBeInTheDocument()
      expect(getByTestId('previous-button')).toBeInTheDocument()
    })
  })

  it('does not render a previous button for the app version', async () => {
    configuration.featureFlags.appMode = true

    const secondStep = [...steps][1]

    const { queryByTestId } = render(
      withAppContext(
        <Wizard>
          <Steps>
            <Step
              id={secondStep}
              render={() => <IncidentNavigation {...props} />}
            />
          </Steps>
        </Wizard>
      )
    )

    await waitFor(() => {
      expect(queryByTestId('next-button')).toBeInTheDocument()
      expect(queryByTestId('previous-button')).not.toBeInTheDocument()
    })
  })

  it('renders previous button for web version', async () => {
    configuration.featureFlags.appMode = false

    const secondStep = [...steps][1]

    const { queryByTestId } = render(
      withAppContext(
        <Wizard>
          <Steps>
            <Step
              id={secondStep}
              render={() => <IncidentNavigation {...props} />}
            />
          </Steps>
        </Wizard>
      )
    )

    await waitFor(() => {
      expect(queryByTestId('next-button')).toBeInTheDocument()
      expect(queryByTestId('previous-button')).toBeInTheDocument()
    })
  })

  it('does not render', async () => {
    const { queryByTestId } = render(
      withAppContext(
        <Wizard>
          <Steps>
            <Step
              id="incident/bedankt"
              render={() => <IncidentNavigation {...props} />}
            />
          </Steps>
        </Wizard>
      )
    )

    await waitFor(() => {
      expect(queryByTestId('incident-navigation')).not.toBeInTheDocument()
    })
  })

  it('should call onSubmit', async () => {
    const { getByTestId } = render(
      withAppContext(
        <Wizard>
          <Steps>
            <Step
              id={steps[1]}
              render={() => <IncidentNavigation {...props} />}
            />
          </Steps>
        </Wizard>
      )
    )

    await waitFor(() => {
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
})
