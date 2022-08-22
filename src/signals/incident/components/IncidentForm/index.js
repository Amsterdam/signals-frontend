// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'

import { Controller } from 'react-hook-form'
import formatConditionalForm from '../../services/format-conditional-form'
import { Form, Fieldset, ProgressContainer } from './styled'

const IncidentForm = ({
  incidentContainer,
  reactHookFormMethods,
  updateIncident,
  createIncident,
  wizard,
  addToSelection,
  removeFromSelection,
  getClassification,
  fieldConfig,
  setControls,
}) => {
  // set state with useState
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formAction, setFormAction] = useState('')
  const [next, setNext] = useState(null)

  const prevState = useRef({})

  useEffect(() => {
    prevState.current.loading = loading
    if (incidentContainer.loadingData) {
      setLoading(incidentContainer.loadingData)
    } else if (loading) {
      setLoading((loading) => !loading)
    }
  }, [loading, incidentContainer.loadingData])

  useEffect(() => {
    if (!reactHookFormMethods.getValues()) return

    setValues(incidentContainer.incident)

    if (
      prevState.current.loading &&
      !loading &&
      next &&
      reactHookFormMethods.formState.isValid
    ) {
      setIncident(formAction)
      next()
    }
  }, [
    formAction,
    incidentContainer.incident,
    loading,
    next,
    reactHookFormMethods,
  ])

  useEffect(() => {
    setControls(controls)
  }, [controls])

  const setValues = useCallback(
    (incident) => {
      Object.entries(reactHookFormMethods.getValues()).map(([key, value]) => {
        if (!isEqual(incident[key], value)) {
          reactHookFormMethods.setValue(key, incident[key])
        }
      })
    },
    [reactHookFormMethods]
  )

  const setIncident = useCallback(
    (formAction) => {
      switch (
        formAction // eslint-disable-line default-case
      ) {
        case 'UPDATE_INCIDENT':
          updateIncident(reactHookFormMethods.getValues())
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
      reactHookFormMethods,
      updateIncident,
      wizard,
    ]
  )

  const handleSubmit = useCallback(
    async (e, next, formAction) => {
      e.preventDefault()
      if (next) {
        if (loading) {
          setFormAction(formAction)
          setNext(next)

          return
        }

        if (!submitting) {
          setSubmitting(true)
        }

        // make sure it can be disabled
        reactHookFormMethods.handleSubmit(() => {
          setIncident(formAction)
          setSubmitting(false)
          next()
        })()
      }
    },
    [loading, setIncident]
  )

  // FormatConditionalForm mutates fieldconfig, thereby setting fields visible/inVisible. This should be changed in the future.
  const fc = formatConditionalForm(fieldConfig, incidentContainer.incident)

  const isSummary = Object.keys(fc).includes('page_summary')
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

  const controls = Object.fromEntries(
    Object.entries(fieldConfig.controls).filter(
      ([key, value]) => value.meta?.isVisible || key === '$field_0'
    )
  )

  return (
    <div data-testid="incidentForm">
      <ProgressContainer />
      <Form>
        <Fieldset isSummary={isSummary}>
          {Object.entries(controls).map(([key, value]) => {
            return (
              (value.render && parent && reactHookFormMethods?.control && (
                <Controller
                  key={key}
                  name={value.meta?.name || 'hidden'}
                  control={reactHookFormMethods.control}
                  render={({ field: { value: v, onChange } }) => {
                    return (
                      <value.render
                        parent={parent}
                        handler={() => ({
                          onChange: (e) => {
                            value.meta && onChange(e.target.value)
                          },
                          onBlur: (e) => {
                            value.meta && onChange(e.target.value)

                            if (submitting) {
                              reactHookFormMethods.trigger()
                            }
                          },
                          value: v,
                        })}
                        getError={() =>
                          reactHookFormMethods.formState?.errors[key]?.message
                        }
                        meta={value.meta || parent.meta}
                        hasError={(errorCode) => {
                          return (
                            errorCode ===
                            reactHookFormMethods.formState?.errors[key]?.type
                          )
                        }}
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

IncidentForm.defaultProps = {
  fieldConfig: {
    controls: {},
  },
}

IncidentForm.propTypes = {
  fieldConfig: PropTypes.object,
  incidentContainer: PropTypes.object.isRequired,
  wizard: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  removeQuestionData: PropTypes.func.isRequired,
  updateIncident: PropTypes.func.isRequired,
  addToSelection: PropTypes.func.isRequired,
  removeFromSelection: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
}

export default IncidentForm
