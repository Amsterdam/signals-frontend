// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import {
  render,
  screen,
  fireEvent,
  createEvent,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Wizard, Step, Steps } from 'react-albus'
import { IncidentFormWrapper, withAppContext } from 'test/utils'

import FormComponents from '../form'
import IncidentNavigation from '../IncidentNavigation'
import IncidentForm from '.'

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
        validators: ['required'],
      },
    },
  },
}

const nextSpy = jest.fn()

const renderIncidentForm = (props, renderFunction = render) =>
  renderFunction(
    withAppContext(
      <Wizard onNext={nextSpy}>
        <Steps>
          <Step id="incident/mock">
            <IncidentFormWrapper {...props}>
              <IncidentForm {...props} />
            </IncidentFormWrapper>
          </Step>
        </Steps>
      </Wizard>
    )
  )

describe('<IncidentForm />', () => {
  let defaultProps

  beforeAll(() => {
    // disable annoying deprecation warnings from `react-reactive-form`
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

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

    it('renders updated form values', () => {
      const { rerender } = renderIncidentForm(defaultProps)

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

      expect(screen.getByLabelText(PHONE_LABEL)).toHaveValue('061234')
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
    it('clicking submit should preventDefault', () => {
      renderIncidentForm(defaultProps)

      const submitButton = screen.getByText(mockForm.nextButtonLabel)
      const clickEvent = createEvent.click(submitButton)
      jest.spyOn(clickEvent, 'preventDefault')

      fireEvent(submitButton, clickEvent)

      expect(clickEvent.preventDefault).toHaveBeenCalled()
    })

    describe('async submit', () => {
      it('submit should trigger next when form is valid and no action defined', async () => {
        renderIncidentForm(defaultProps)
        // next is triggered once during the first render
        expect(nextSpy).toHaveBeenCalledTimes(1)
        userEvent.click(screen.getByText(mockForm.nextButtonLabel))
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
        userEvent.click(screen.getByText(mockForm.nextButtonLabel))

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
        userEvent.click(screen.getByText(mockForm.nextButtonLabel))

        await waitFor(() => {
          expect(nextSpy).toHaveBeenCalledTimes(2)
        })
        expect(props.createIncident).toHaveBeenCalledWith(
          expect.objectContaining({ incident: {} })
        )
      })

      it('submit should not be triggered next when form is not valid', async () => {
        const props = {
          ...defaultProps,
          fieldConfig: requiredFieldConfig,
        }

        renderIncidentForm(props)

        // next is triggered once during the first render
        expect(nextSpy).toHaveBeenCalledTimes(1)
        userEvent.click(screen.getByText(mockForm.nextButtonLabel))
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

        userEvent.click(screen.getByText(mockForm.nextButtonLabel))

        await waitFor(() => {
          expect(nextSpy).toHaveBeenCalledTimes(2)
        })
      })
    })
  })
})
