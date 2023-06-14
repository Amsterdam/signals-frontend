// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2022 Gemeente Amsterdam
// eslint-disable-next-line no-restricted-imports
import React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import form from 'react-hook-form'

import { StepByStepNavClickable } from './StepByStepNavClickable'
import WizardContext from '../StepWizard/context/WizardContext'

const navigateSpy = jest.fn()
const mockSetStepsCompletedCount = jest.fn()

const defaultContextProps = {
  navigate: navigateSpy,
  stepsCompletedCount: 1,
  setStepsCompletedCount: mockSetStepsCompletedCount,
  push: jest.fn(),
  next: jest.fn(),
  previous: jest.fn(),
  step: { id: 'someid' },
  steps: [{ id: 'someid' }],
}

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
}))

const watch = (cb: any) => {
  cb('data', {
    name: 'someField',
    type: 'change',
  })
  return { unsubscribe: jest.fn() }
}

const watchWithDescriptionChange = (cb: any) => {
  cb('data', {
    name: 'description',
    type: 'change',
  })
  return { unsubscribe: jest.fn() }
}

describe('StepByStepNavClickable when form is valid', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render properly', function () {
    const mockTrigger = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true))

    jest.spyOn(form, 'useFormContext').mockImplementationOnce(() => ({
      ...jest.requireActual('react-hook-form').useFormContext,
      trigger: mockTrigger,
      watch: jest.fn().mockImplementation(watch),
    }))

    render(
      <WizardContext.Provider value={{ ...defaultContextProps }}>
        <StepByStepNavClickable
          activeItem={0}
          wizardRoutes={['step1', 'step2']}
          steps={[{ label: 'step1' }, { label: 'step2' }]}
        />
      </WizardContext.Provider>
    )

    expect(screen.getByText('step1')).toBeInTheDocument()
    expect(screen.getByText('step2')).toBeInTheDocument()
  })

  it('should go to the next step with a valid current step and call setStepsCompletedCount', async function () {
    const mockTrigger = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true))

    jest.spyOn(form, 'useFormContext').mockImplementationOnce(() => ({
      ...jest.requireActual('react-hook-form').useFormContext,
      trigger: mockTrigger,
      watch: jest.fn().mockImplementation(watch),
    }))

    render(
      <WizardContext.Provider value={{ ...defaultContextProps }}>
        <StepByStepNavClickable
          activeItem={1}
          wizardRoutes={['step1', 'step2']}
          steps={[{ label: 'step1' }, { label: 'step2' }]}
        />
      </WizardContext.Provider>
    )

    await waitFor(() => {
      userEvent.click(screen.getByText('step1'))
    })
    expect(mockTrigger).toBeCalled()
    expect(navigateSpy).toBeCalledWith('incident/step1')
    expect(mockSetStepsCompletedCount).not.toHaveBeenCalled()
  })

  it("should go to the next step with a valid current step, and don't call setStepsCompletedCount", async function () {
    const mockTrigger = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true))

    jest.spyOn(form, 'useFormContext').mockImplementationOnce(() => ({
      ...jest.requireActual('react-hook-form').useFormContext,
      trigger: mockTrigger,
      watch: jest.fn().mockImplementation(watch),
    }))

    render(
      <WizardContext.Provider value={{ ...defaultContextProps }}>
        <StepByStepNavClickable
          activeItem={0}
          wizardRoutes={['step1', 'step2']}
          steps={[{ label: 'step1' }, { label: 'step2' }]}
        />
      </WizardContext.Provider>
    )

    await waitFor(() => {
      userEvent.click(screen.getByText('step2'))
    })
    expect(mockTrigger).toBeCalled()
    expect(navigateSpy).toBeCalledWith('incident/step2')
    expect(mockSetStepsCompletedCount).not.toHaveBeenCalled()
  })

  it('should go to the next step with a invalid current step', async function () {
    const mockTrigger = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false))

    jest.spyOn(form, 'useFormContext').mockImplementationOnce(() => ({
      ...jest.requireActual('react-hook-form').useFormContext,
      trigger: mockTrigger,
      watch: jest.fn().mockImplementation(watch),
    }))

    render(
      <WizardContext.Provider value={{ ...defaultContextProps }}>
        <StepByStepNavClickable
          activeItem={1}
          wizardRoutes={['step1', 'step2']}
          steps={[{ label: 'step1' }, { label: 'step2' }]}
        />
      </WizardContext.Provider>
    )

    await waitFor(() => {
      userEvent.click(screen.getByText('step1'))
    })
    expect(mockTrigger).toBeCalled()
    expect(navigateSpy).toBeCalledWith('incident/step1')
    expect(mockSetStepsCompletedCount).toBeCalledWith(1)
  })

  it('should not go the next step with an invalid current step', async function () {
    const mockTrigger = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false))

    jest.spyOn(form, 'useFormContext').mockImplementationOnce(() => ({
      ...jest.requireActual('react-hook-form').useFormContext,
      trigger: mockTrigger,
      watch: jest.fn().mockImplementation(watch),
    }))

    render(
      <WizardContext.Provider value={{ ...defaultContextProps }}>
        <StepByStepNavClickable
          activeItem={0}
          wizardRoutes={['step1', 'step2']}
          steps={[{ label: 'step1' }, { label: 'step2' }]}
        />
      </WizardContext.Provider>
    )

    await waitFor(() => {
      userEvent.click(screen.getByText('step2'))
    })
    expect(mockTrigger).toBeCalled()
    expect(navigateSpy).not.toBeCalled()
    expect(mockSetStepsCompletedCount).toBeCalledWith(0)
  })

  it('it should trigger setCountStep when description is changing', async function () {
    const mockTrigger = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false))

    jest.spyOn(form, 'useFormContext').mockImplementationOnce(() => ({
      ...jest.requireActual('react-hook-form').useFormContext,
      trigger: mockTrigger,
      watch: jest.fn().mockImplementation(watchWithDescriptionChange),
    }))

    render(
      <WizardContext.Provider value={{ ...defaultContextProps }}>
        <StepByStepNavClickable
          activeItem={0}
          wizardRoutes={['step1', 'step2']}
          steps={[{ label: 'step1' }, { label: 'step2' }]}
        />
      </WizardContext.Provider>
    )

    expect(mockTrigger).not.toBeCalled()
    expect(navigateSpy).not.toBeCalled()
    expect(mockSetStepsCompletedCount).toBeCalledTimes(1)
  })

  it('it should trigger setCountStep when there is an error in the formState', async function () {
    const mockTrigger = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false))
    jest
      .spyOn(React, 'useRef')
      .mockReturnValueOnce({ current: 'someErrorField' })

    jest.spyOn(form, 'useFormContext').mockImplementationOnce(() => ({
      ...jest.requireActual('react-hook-form').useFormContext,
      trigger: mockTrigger,
      watch: jest.fn().mockImplementation(watch),
      formState: { errors: { someErrorField: 'error' } },
    }))

    render(
      <WizardContext.Provider value={{ ...defaultContextProps }}>
        <StepByStepNavClickable
          activeItem={0}
          wizardRoutes={['step1', 'step2']}
          steps={[{ label: 'step1' }, { label: 'step2' }]}
        />
      </WizardContext.Provider>
    )

    expect(mockTrigger).not.toBeCalled()
    expect(navigateSpy).not.toBeCalled()
    expect(mockSetStepsCompletedCount).toBeCalledTimes(1)
  })
})
