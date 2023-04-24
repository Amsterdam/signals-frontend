// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { useContext } from 'react'

import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext, history } from 'test/utils'

import { Wizard, Steps, WizardContext } from './'
import type { WizardApi } from './context/WizardContext'

const steps = [{ id: 'beschrijf' }, { id: 'vul aan' }, { id: 'contact' }]

describe('<Wizard>', () => {
  beforeAll(() => {
    // use fake timers to prevent act warnings
    jest.useFakeTimers()
    jest.resetAllMocks()
  })

  beforeEach(() => {
    history.replace('/beschrijf')
  })

  it('should render 3 steps', async () => {
    render(renderWizard())

    userEvent.click(screen.getByRole('button', { name: 'Volgende' }))

    await waitFor(
      () => {
        expect(screen.getByText('vul aan')).toBeTruthy()
      },
      { timeout: 1000 }
    )

    userEvent.click(screen.getByRole('button', { name: 'Volgende' }))

    await waitFor(() => {
      expect(screen.getByText('contact')).toBeTruthy()
    })

    userEvent.click(screen.getByRole('button', { name: 'Vorige' }))

    await waitFor(() => {
      expect(screen.getByText('vul aan')).toBeTruthy()
    })
  })

  it('should go to a page directly', async function () {
    render(renderWizardWithoutOnNext())

    await waitFor(() => {
      expect(screen.getByText('beschrijf')).toBeTruthy()
    })

    userEvent.click(screen.getByRole('button', { name: 'Volgende' }))

    await waitFor(() => {
      expect(screen.getByText('vul aan')).toBeTruthy()
    })

    act(() => {
      history.replace('/contact')
    })

    expect(screen.getByText('contact')).toBeTruthy()
  })
})

function renderWizard() {
  return withAppContext(
    <Wizard
      onNext={(wizard: WizardApi) => {
        getNextStep(wizard)
      }}
    >
      <RenderSteps />
    </Wizard>
  )
}

function renderWizardWithoutOnNext() {
  return withAppContext(
    <Wizard>
      <RenderSteps />
    </Wizard>
  )
}

const RenderSteps = () => (
  <>
    <Steps>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*@ts-ignore*/}
      {steps.map((step) => (
        <p key={step.id} id={step.id}>
          {step.id}
        </p>
      ))}
    </Steps>
    <Nav />
  </>
)

function Nav() {
  const wizard = useContext(WizardContext)

  return (
    <>
      <button onClick={wizard.previous}>Vorige</button>
      <button onClick={wizard.next}>Volgende</button>
    </>
  )
}

function getNextStep(wizard: WizardApi) {
  const stepIndexFound = steps.findIndex((step) => step.id === wizard.step.id)
  const stepIndex = stepIndexFound > -1 ? stepIndexFound : 0
  const nextStep = steps[stepIndex + 1]?.id
  wizard.push(nextStep)
}
