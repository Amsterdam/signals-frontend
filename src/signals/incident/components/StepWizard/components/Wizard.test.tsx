import { useContext } from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withAppContext, history } from 'test/utils'

import type { WizardApi } from '../context/WizardContext'
import { Wizard, Steps, WizardContext } from '../index'

const steps = [{ id: 'beschrijf' }, { id: 'vul aan' }, { id: 'contact' }]

describe('<Wizard>', () => {
  it('should render 3 steps', async () => {
    render(
      withAppContext(
        <>
          <Wizard
            history={history}
            onNext={(wizard: WizardApi) => {
              getNextStep(wizard)
            }}
          >
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
          </Wizard>
        </>
      )
    )

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'Volgende' }))
    })

    expect(screen.getByText('vul aan')).toBeTruthy()

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'Volgende' }))
    })

    expect(screen.getByText('contact')).toBeTruthy()
  })
})

function Nav() {
  const wizard = useContext(WizardContext)
  return (
    <>
      <button onClick={() => wizard.previous()}>Vorige</button>
      <button onClick={() => wizard.next()}>Volgende</button>
    </>
  )
}

function getNextStep(wizard: WizardApi) {
  const wizardValues = steps.map((step) => step.id)
  const currentIndex = wizardValues.indexOf(wizard.step.id)
  const val = wizardValues[currentIndex + 1]
  wizard.push(val)
}
