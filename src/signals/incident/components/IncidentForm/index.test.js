// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, screen, fireEvent, createEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Wizard, Step, Steps } from 'react-albus'
import { Validators } from 'react-reactive-form'
import { withAppContext } from 'test/utils'

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
        validators: [Validators.required],
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
            <IncidentForm {...props} />
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
      createIncident: jest.fn(),
      removeQuestionData: jest.fn(),
      wizard: { mock: mockForm },
      fieldConfig: mockForm.form,
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

      expect(defaultProps.removeQuestionData).toHaveBeenCalledWith([
        EXTRA_REMOVED_QUESTION,
      ])
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

    describe('sync submit', () => {
      it('submit should trigger next when form is valid and no action defined', () => {
        renderIncidentForm(defaultProps)

        // next is triggered once during the first render
        expect(nextSpy).toHaveBeenCalledTimes(1)
        userEvent.click(screen.getByText(mockForm.nextButtonLabel))
        expect(nextSpy).toHaveBeenCalledTimes(2)
      })

      it('submit should trigger next when form is valid and UPDATE_INCIDENT defined', () => {
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
        expect(nextSpy).toHaveBeenCalledTimes(2)

        expect(props.updateIncident).toHaveBeenCalled()
      })

      it('submit should trigger next when form is valid and CREATE_INCIDENT defined', () => {
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
        expect(nextSpy).toHaveBeenCalledTimes(2)

        expect(props.createIncident).toHaveBeenCalledWith(
          expect.objectContaining({ incident: {} })
        )
      })

      it('submit should not be triggered next when form is not valid', () => {
        const props = {
          ...defaultProps,
          fieldConfig: requiredFieldConfig,
        }

        renderIncidentForm(props)

        // next is triggered once during the first render
        expect(nextSpy).toHaveBeenCalledTimes(1)
        userEvent.click(screen.getByText(mockForm.nextButtonLabel))
        expect(nextSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('async submit', () => {
      it('should postpone submit when loading data (classification or questions)', () => {
        const props = {
          ...defaultProps,
          incidentContainer: { incident: {}, loadingData: false },
        }

        const { rerender } = renderIncidentForm({
          ...props,
          incidentContainer: { incident: {}, loadingData: true },
        })

        expect(nextSpy).toHaveBeenCalledTimes(1)
        userEvent.click(screen.getByText(mockForm.nextButtonLabel))
        expect(nextSpy).toHaveBeenCalledTimes(1)

        renderIncidentForm(props, rerender)

        expect(nextSpy).toHaveBeenCalledTimes(2)
      })
    })

    it('should not submit async when form is not valid after service call', () => {
      const props = {
        ...defaultProps,
        fieldConfig: requiredFieldConfig,
        incidentContainer: { incident: {}, loadingData: true },
      }

      const { rerender } = renderIncidentForm(props)

      userEvent.type(screen.getByLabelText(PHONE_LABEL_REQUIRED), 'Valid input')
      expect(nextSpy).toHaveBeenCalledTimes(1)
      userEvent.click(screen.getByText(mockForm.nextButtonLabel))
      expect(nextSpy).toHaveBeenCalledTimes(1)

      const propsAfterLoading = {
        ...props,
        loadingClassification: false,
        incidentContainer: {
          incident: {
            phone: '',
          },
          loadingData: false,
        },
      }

      renderIncidentForm(propsAfterLoading, rerender)

      expect(nextSpy).toHaveBeenCalledTimes(1)
    })

    it('submits form with status DISABLED', () => {
      const emptyControlsSet = {
        controls: {
          // no controls to verify; status of the form is set to 'DISABLED' by `react-reactive-form`
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

      expect(nextSpy).toHaveBeenCalledTimes(2)
    })
  })
})
