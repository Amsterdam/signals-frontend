// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { useContext } from 'react'

import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withAppContext, history } from 'test/utils'

import { Wizard, Steps, WizardContext } from './'
import type { WizardApi } from './context/WizardContext'

const steps = [{ id: 'beschrijf' }, { id: 'vul aan' }, { id: 'contact' }]

describe('<Wizard>', () => {
  it('should render 3 steps', async () => {
    render(renderWizard())

    userEvent.click(screen.getByRole('button', { name: 'Volgende' }))

    expect(screen.getByText('vul aan')).toBeTruthy()

    userEvent.click(screen.getByRole('button', { name: 'Volgende' }))

    expect(screen.getByText('contact')).toBeTruthy()

    userEvent.click(screen.getByRole('button', { name: 'Vorige' }))

    expect(screen.getByText('vul aan')).toBeTruthy()
  })

  it('should go back by using the history', function () {
    render(renderWizardWithoutOnNext())

    userEvent.click(screen.getByRole('button', { name: 'Volgende' }))

    expect(screen.getByText('vul aan')).toBeTruthy()

    act(() => {
      history.goBack()
    })

    expect(screen.getByText('beschrijf')).toBeTruthy()
  })
})

function renderWizard() {
  return withAppContext(
    <Wizard
      history={history}
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
    <Wizard
      history={history}
      onNext={(wizard: WizardApi) => {
        getNextStep(wizard)
      }}
    >
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
  const wizardValues = steps.map((step) => step.id)
  const currentIndex = wizardValues.indexOf(wizard.step.id)
  const val = wizardValues[currentIndex + 1]
  wizard.push(val)
}
