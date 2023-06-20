// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import type { BaseSyntheticEvent, ForwardedRef } from 'react'
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useContext,
} from 'react'

import { isEmpty, isObject } from 'lodash'
import isEqual from 'lodash/isEqual'
import { Controller } from 'react-hook-form'

import { Form, Fieldset, ProgressContainer } from './styled'
import { clearBlockingAlert } from './utils/clear-blocking-alert'
import { scrollToInvalidElement } from './utils/scroll-to-invalid-element'
import formatConditionalForm from '../../services/format-conditional-form'
import constructYupResolver from '../../services/yup-resolver'
import { WizardContext } from '../StepWizard'

const IncidentForm = forwardRef<any, any>(
  (
    {
      incidentContainer,
      reactHookFormProps,
      updateIncident,
      createIncident,
      wizard,
      addToSelection,
      removeFromSelection,
      removeQuestionData,
      getClassification,
      fieldConfig,
      index,
    },
    controlsRef: ForwardedRef<any>
  ) => {
    const [submitting, setSubmitting] = useState(false)

    const { steps, setStepsCompletedCount } = useContext(WizardContext)

    const prevState = useRef<{ isMounted: boolean; loading: boolean }>({
      isMounted: true,
      loading: false,
    })

    const formRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        prevState.current.isMounted = false
      }
    }, [])

    useEffect(() => {
      if (prevState.current.loading !== incidentContainer.loadingData) {
        prevState.current.loading = incidentContainer.loadingData
      }
    }, [
      prevState.current.loading,
      incidentContainer.loadingData,
      reactHookFormProps,
    ])

    /**
      FormatConditionalForm mutates fieldconfig, thereby setting fields visible/inVisible.
      This should be changed in the future.
    */
    const fieldConfigModified = formatConditionalForm(
      fieldConfig,
      incidentContainer.incident
    )

    const controls = Object.fromEntries(
      Object.entries(fieldConfigModified.controls).filter(
        ([key, value]: any) => value.meta?.isVisible || key === '$field_0'
      )
    )

    useEffect(() => {
      if (!incidentContainer.incident) return

      const extraControlKeys = Object.keys(controls).filter((key) =>
        key.startsWith('extra_')
      )
      const extraIncidentKeys = Object.keys(incidentContainer.incident).filter(
        (key) => key.startsWith('extra_')
      )

      const keysToRemove = extraIncidentKeys.filter(
        (key) => extraControlKeys.length > 0 && !extraControlKeys.includes(key)
      )

      if (keysToRemove.length > 0) removeQuestionData(keysToRemove)
    }, [controls, incidentContainer.incident, removeQuestionData])

    /**
     * setValues makes sure values from the incident, like dateTime, are added
     * to react hook form.
     */
    const setValues = useCallback(
      (incident) => {
        Object.entries(reactHookFormProps.getValues()).map(([key, value]) => {
          if (!isEqual(incident[key], value)) {
            /**
             * When a value is set in the incident, by redux, but not yet part of
             * the form validation, add it and trigger the validation for that key.
             */
            reactHookFormProps.setValue(key, incident[key])
            if (incident[key]) {
              reactHookFormProps.trigger(key)
            }
          }
        })
      },
      [reactHookFormProps]
    )

    useEffect(() => {
      if (
        !reactHookFormProps.getValues() ||
        isEmpty(incidentContainer.incident)
      )
        return
      setValues(incidentContainer.incident)
    }, [incidentContainer.incident, reactHookFormProps, setValues])

    useEffect(() => {
      reactHookFormProps.clearErrors()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const setIncident = useCallback(
      (formAction) => {
        switch (
          formAction // eslint-disable-line default-case
        ) {
          case 'UPDATE_INCIDENT':
            updateIncident(reactHookFormProps.getValues())
            break

          case 'CREATE_INCIDENT':
            createIncident({
              incident: incidentContainer.incident,
              wizard,
            })
            break

          default:
        }
      },
      [
        createIncident,
        incidentContainer.incident,
        reactHookFormProps,
        updateIncident,
        wizard,
      ]
    )

    const isSummary =
      fieldConfigModified &&
      Object.keys(fieldConfigModified).includes('page_summary')

    const { formState } = reactHookFormProps
    const { errors } = formState

    const handleSubmit = useCallback(
      async (e, next, formAction) => {
        e.preventDefault()
        if (next) {
          if (
            prevState.current.loading &&
            (await reactHookFormProps.trigger(['description', 'source']))
          ) {
            next()
            setStepsCompletedCount(index + 1)
            return
          }

          if (!submitting) {
            setSubmitting(true)
          }

          const isValid = await reactHookFormProps.trigger()

          /**
            To prevent memory leaks, make sure to call the functions at
            the button only when this component is mounted.
          */
          if (isValid && prevState.current.isMounted) {
            setIncident(formAction)
            setSubmitting(false)
            next()
            if (index < steps.length) {
              setStepsCompletedCount(index + 1)
            }
          } else {
            scrollToInvalidElement(
              controls,
              reactHookFormProps.formState.errors,
              formRef
            )
          }
        }
      },
      [
        controls,
        index,
        reactHookFormProps,
        setIncident,
        setStepsCompletedCount,
        steps.length,
        submitting,
      ]
    )

    const parent = {
      meta: {
        wizard,
        incidentContainer,
        handleSubmit,
        getClassification,
        updateIncident,
        addToSelection,
        removeFromSelection,
      },
    }
    useEffect(() => {
      clearBlockingAlert(controls, reactHookFormProps.clearErrors)
    }, [controls, reactHookFormProps])

    /**
      Set the yupresolver for the current step of the incident wizard
    */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    controlsRef.current = constructYupResolver(controls)

    return (
      <div data-testid="incident-form" ref={formRef}>
        <ProgressContainer />
        <Form>
          <Fieldset isSummary={isSummary}>
            {Object.entries(controls).map(([key, value]: any) => {
              return (
                (value.render && parent && reactHookFormProps?.control && (
                  <Controller
                    key={key}
                    name={value.meta?.name || 'hidden'}
                    control={reactHookFormProps.control}
                    defaultValue={null}
                    render={({ field: { value: v, onChange } }) => {
                      return (
                        <value.render
                          parent={parent}
                          handler={() => ({
                            onChange: (e: BaseSyntheticEvent) => {
                              value.meta && onChange(e.target.value)
                              if (
                                submitting ||
                                value.meta.name == 'description'
                              ) {
                                reactHookFormProps.trigger(value.meta.name)
                              }
                            },
                            onBlur: (e: BaseSyntheticEvent) => {
                              value.meta && onChange(e.target.value)
                              if (submitting) {
                                reactHookFormProps.trigger(value.meta.name)
                              }
                            },
                            value: v || '',
                          })}
                          getError={() => {
                            return (
                              errors[key]?.message ||
                              (isObject(errors[key]) &&
                                JSON.stringify(errors[key]).includes('message'))
                            )
                          }}
                          meta={value.meta || parent.meta}
                          hasError={(errorCode: any) => {
                            return (
                              errorCode === errors[key]?.type ||
                              (isObject(errors[key]) &&
                                JSON.stringify(errors[key]).includes(errorCode))
                            )
                          }}
                          value={v}
                          validatorsOrOpts={value.options}
                        />
                      )
                    }}
                  />
                )) ||
                null
              )
            })}
          </Fieldset>
        </Form>
      </div>
    )
  }
)

export default IncidentForm
