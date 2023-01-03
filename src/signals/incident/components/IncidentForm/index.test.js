// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import {
  render,
  screen,
  fireEvent,
  createEvent,
  waitFor,
  act,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProviderWithResolver, withAppContext } from 'test/utils'

import IncidentForm from '.'
import { validatePhoneNumber } from '../../services/custom-validators'
import FormComponents from '../form'
import IncidentNavigation from '../IncidentNavigation'
import { Wizard, Step, Steps } from '../StepWizard'

const PHONE_LABEL_REQUIRED = 'Wat is uw telefoonnummer?'
const PHONE_LABEL = `${PHONE_LABEL_REQUIRED}(niet verplicht)`
const mockForm = {
  nextButtonLabel: 'Volgende',
  previousButtonLabel: 'Vorige',
  form: {
    controls: {
      phone: {
        meta: {
          label: 'Wat is uw telefoonnummer?',
        },
        render: FormComponents.TextInput,
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
    },
  },
}
const requiredFieldConfig = {
  controls: {
    ...mockForm.form.controls,
    phone: {
      ...mockForm.form.controls.phone,
      options: {
        validators: [validatePhoneNumber, ['maxLength', 5]],
      },
    },
  },
}

let scrollIntoViewMock = jest.fn()
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock
const nextSpy = jest.fn()
const ref = { current: null }

const renderIncidentForm = (props, renderFunction = render) =>
  renderFunction(
    withAppContext(
      <Wizard onNext={nextSpy}>
        <Steps>
          <Step
            id="incident/mock"
            key="incident/mock"
            render={() => (
              <FormProviderWithResolver {...props}>
                <IncidentForm {...props} ref={ref} />
              </FormProviderWithResolver>
            )}
          ></Step>
        </Steps>
      </Wizard>
    )
  )

describe('<IncidentForm />', () => {
  let defaultProps

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    nextSpy.mockReset()
    defaultProps = {
      getClassification: jest.fn(),
      updateIncident: jest.fn(),
      addToSelection: jest.fn(),
      removeFromSelection: jest.fn(),
      createIncident: jest.fn(),
      removeQuestionData: jest.fn(),
      wizard: { mock: mockForm },
      fieldConfig: mockForm.form,
      setControls: jest.fn(),
      incidentContainer: { incident: {} },
    }
  })

  describe('rendering', () => {
    it('expect to render correctly', () => {
      renderIncidentForm(defaultProps)

      expect(screen.getByLabelText(PHONE_LABEL)).toBeInTheDocument()
      expect(screen.getByText(mockForm.nextButtonLabel)).toBeInTheDocument()
      expect(screen.getByText(mockForm.previousButtonLabel)).toBeInTheDocument()
    })

    it('removes extra question data when the question is not visible anymore', () => {
      const EXTRA_REMOVED_QUESTION = 'extra_removed_question'
      const EXTRA_VISIBLE_QUESTION = 'extra_visible_question'
      const VISIBLE_QUESTION = 'visible_question'
      const baseControl = {
        meta: {},
        render: () => <p>baz</p>,
      }
      const props = {
        ...defaultProps,
        fieldConfig: {
          controls: {
            [EXTRA_REMOVED_QUESTION]: {
              meta: { ifAllOf: { foo: 'bar' } }, // ifAllOf condition is false
            },
            [EXTRA_VISIBLE_QUESTION]: baseControl,
            [VISIBLE_QUESTION]: baseControl,
          },
          updateValueAndValidity: jest.fn(),
        },
        incidentContainer: {
          incident: {
            [EXTRA_REMOVED_QUESTION]:
              'Answer to extra question that is not visible anymore',
            [EXTRA_VISIBLE_QUESTION]:
              'Answer to extra question that is visible',
            [VISIBLE_QUESTION]: 'Answer to question that is visible',
          },
        },
      }
      renderIncidentForm(props)
    })

    it('renders updated form values', async () => {
      const { rerender } = renderIncidentForm(defaultProps)

      expect(screen.getByLabelText(PHONE_LABEL)).not.toHaveValue('061234')

      renderIncidentForm(
        {
          ...defaultProps,
          incidentContainer: {
            incident: {
              phone: '061234',
            },
          },
        },
        rerender
      )

      await waitFor(() => {
        expect(screen.getByLabelText(PHONE_LABEL)).toHaveValue('061234')
      })
    })

    it('enables controls that were disabled during a previous render', () => {
      const props = {
        ...defaultProps,
        fieldConfig: {
          controls: {
            phone: {
              ...defaultProps.fieldConfig.controls.phone,
              meta: {
                ...defaultProps.fieldConfig.controls.phone.meta,
                ifAllOf: { foo: 'bar' }, // ifAllOf condition is false
              },
            },
          },
        },
      }

      const { rerender } = renderIncidentForm(props)

      expect(screen.queryByLabelText(PHONE_LABEL)).not.toBeInTheDocument()

      renderIncidentForm(
        {
          ...props,
          incidentContainer: {
            incident: {
              foo: 'bar',
            },
          },
        },
        rerender
      )
      expect(screen.getByLabelText(PHONE_LABEL)).toBeInTheDocument()
    })
  })

  describe('events', () => {
    it('clicking submit should preventDefault', async () => {
      renderIncidentForm(defaultProps)

      const submitButton = screen.getByText(mockForm.nextButtonLabel)
      const clickEvent = createEvent.click(submitButton)
      jest.spyOn(clickEvent, 'preventDefault')

      fireEvent(submitButton, clickEvent)

      await waitFor(() => {
        expect(clickEvent.preventDefault).toHaveBeenCalled()
      })
    })

    describe('async submit', () => {
      it('submit should trigger next when form is valid and no action defined', async () => {
        renderIncidentForm(defaultProps)
        // next is triggered once during the first render
        expect(nextSpy).toHaveBeenCalledTimes(1)
        act(() => {
          userEvent.click(screen.getByText(mockForm.nextButtonLabel))
        })
        await waitFor(() => {
          expect(nextSpy).toHaveBeenCalledTimes(2)
        })
      })

      it('submit should trigger next when form is valid and UPDATE_INCIDENT defined', async () => {
        const props = {
          ...defaultProps,
          wizard: {
            mock: {
              ...defaultProps.wizard.mock,
              formAction: 'UPDATE_INCIDENT',
            },
          },
        }

        renderIncidentForm(props)

        // next is triggered once during the first render
        expect(nextSpy).toHaveBeenCalledTimes(1)

        act(() => {
          userEvent.click(screen.getByText(mockForm.nextButtonLabel))
        })

        await waitFor(() => {
          expect(nextSpy).toHaveBeenCalledTimes(2)
        })

        expect(props.updateIncident).toHaveBeenCalled()
      })

      it('submit should trigger next when form is valid and CREATE_INCIDENT defined', async () => {
        const props = {
          ...defaultProps,
          wizard: {
            mock: {
              ...defaultProps.wizard.mock,
              formAction: 'CREATE_INCIDENT',
            },
          },
        }

        renderIncidentForm(props)

        // next is triggered once during the first render
        expect(nextSpy).toHaveBeenCalledTimes(1)
        act(() => {
          userEvent.click(screen.getByText(mockForm.nextButtonLabel))
        })

        await waitFor(() => {
          expect(nextSpy).toHaveBeenCalledTimes(2)
        })
        expect(props.createIncident).toHaveBeenCalledWith(
          expect.objectContaining({ incident: {} })
        )
      })

      it('submit should not be triggered next when form is not valid', async () => {
        /**
         * formState.errors needs one field. Currently the jest environment
         * wont pickup the latest formState errors in handleSubmit, though
         * within the function components its values are known. For more info
         * see explanation about formstate using a proxy
         * https://react-hook-form.com/api/useform/formstate
         *
         */
        const props = {
          ...defaultProps,
          fieldConfig: { ...requiredFieldConfig },
          reactHookFormProps: {
            formState: {
              errors: {
                phone: {},
              },
            },
          },
        }

        renderIncidentForm(props)

        // next is triggered once during the first render
        expect(nextSpy).toHaveBeenCalledTimes(1)

        act(() => {
          // make sure phone number validation fails
          fireEvent.input(document.getElementById('phone'), {
            target: {
              value: 1234123412341234,
            },
          })
          fireEvent.blur(document.getElementById('phone'))
          userEvent.click(screen.getByText(mockForm.nextButtonLabel))
        })

        await waitFor(() => {
          expect(nextSpy).toHaveBeenCalledTimes(1)
        })
      })

      it('submits form with status DISABLED', async () => {
        const emptyControlsSet = {
          controls: {
            page_summary: {},
            $field_0: {
              isStatic: false,
              render: IncidentNavigation,
            },
          },
        }

        const props = {
          ...defaultProps,
          fieldConfig: emptyControlsSet,
        }

        renderIncidentForm(props)

        expect(nextSpy).toHaveBeenCalledTimes(1)

        act(() => {
          userEvent.click(screen.getByText(mockForm.nextButtonLabel))
        })

        await waitFor(() => {
          expect(nextSpy).toHaveBeenCalledTimes(2)
        })
      })
    })

    describe('form events', () => {
      it('should handle onchange and on blur event', async () => {
        const triggerSpy = jest.fn()
        const props = {
          ...defaultProps,
          fieldConfig: requiredFieldConfig,
          reactHookFormProps: {
            trigger: triggerSpy,
            formState: {
              errors: {
                phone: {},
              },
            },
          },
        }

        renderIncidentForm(props)

        act(() => {
          userEvent.click(screen.getByText(mockForm.nextButtonLabel))
        })

        act(() => {
          fireEvent.change(document.getElementById('phone'), {
            target: {
              value: 12345,
            },
          })
        })

        act(() => {
          fireEvent.blur(document.getElementById('phone'))
        })

        expect(document.getElementById('phone')).toHaveValue('12345')

        expect(props.updateIncident).toHaveBeenCalledWith({ phone: '12345' })

        act(() => {
          fireEvent.change(document.getElementById('phone'), {
            target: {
              value: 'asdfg',
            },
          })
        })

        // Because of meta.autoRemove updateIncident only gets called once
        expect(props.updateIncident).toHaveBeenCalledTimes(1)

        act(() => {
          fireEvent.change(document.getElementById('phone'), {
            target: {
              value: '',
            },
          })
        })

        expect(triggerSpy).toHaveBeenCalledTimes(5)
      })
    })
  })
})
