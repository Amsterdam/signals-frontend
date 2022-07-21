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
  reactHookMethods,
  updateIncident,
  createIncident,
  wizard,
  addToSelection,
  removeFromSelection,
  getClassification,
  fieldConfig,
}) => {
  // set state with useState
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formAction, setFormAction] = useState('')
  const [next, setNext] = useState(null)

  const prevState = useRef({})

  useEffect(() => {
    const state = incidentContainer.loadingData === prevState.current.loading
    prevState.current.loading = loading
    prevState.current.submitting = submitting

    if (state) {
      setSubmitting(
        incidentContainer.loadingData ? prevState.current.submitting : false
      )
      setLoading(incidentContainer.loadingData)
    }
  }, [loading, incidentContainer.loadingData, submitting])

  // // useEffect with ...
  useEffect(() => {
    if (!reactHookMethods.getValues()) return

    setValues(incidentContainer.incident)

    // RHF: use after refactor?
    // this.form.meta.incident = this.props.incidentContainer.incident
    // this.form.meta.submitting = this.state.submitting

    // RHF REFACTOR: THIS.FORM.VALID  VERANDEREN IN VALIDATIE REACT HOOK FORM
    if (
      prevState.current.loading &&
      !loading &&
      next
      //&& this.form.valid
    ) {
      // RHF create setIncident method
      setIncident(formAction)
      next()
    }
  }, [
    formAction,
    incidentContainer.incident,
    loading,
    next,
    reactHookMethods,
    setIncident,
    setValues,
  ])

  //
  // // RHF REFACTOR; HIER MOETEN DE ELEMENTEN WEL OF NIET ACTIEF WORDEN GEZET
  const setValues = useCallback(
    (incident) => {
      Object.entries(reactHookMethods.getValues()).map(([key, value]) => {
        if (!isEqual(incident[key], value)) {
          reactHookMethods.setValue(key, incident[key])
        }
      })
      reactHookMethods.trigger()
    },
    [reactHookMethods]
  )

  const setIncident = useCallback(
    (formAction) => {
      switch (
        formAction // eslint-disable-line default-case
      ) {
        case 'UPDATE_INCIDENT':
          updateIncident(reactHookMethods.getValues())
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
      reactHookMethods,
      updateIncident,
      wizard,
    ]
  )

  const handleSubmit = useCallback(
    (e, next, formAction) => {
      e.preventDefault()
      if (next) {
        if (loading) {
          setFormAction(formAction)
          setSubmitting(true)
          setNext(next)

          return
        }

        // RHF REFACTOR: VALIDATE WITH RHF, remove this.form.valid || this.form.status === 'DISABLED'
        // make sure it can be disabled
        const valid = true
        if (valid) {
          setIncident(formAction)
          next()
        } else {
          // RHF REFACTOR: THIS PIECE OF CODE FOCUSES ON THE FIRST INVALID ELEMENT
          // also handle other validation rules here
        }
      }
    },
    [loading, setIncident]
  )

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
      <Form onSubmit={handleSubmit}>
        <Fieldset isSummary={isSummary}>
          {Object.entries(controls).map(([_, value]) => {
            return (
              (value.render && parent && (
                <Controller
                  key={_}
                  name={value.meta?.name || 'hidden'}
                  control={reactHookMethods.control}
                  render={({ field: { value: v } }) => {
                    return (
                      <value.render
                        parent={parent}
                        handler={() => ({
                          onChange: (e) => {
                            value.meta &&
                              reactHookMethods.setValue(
                                value.meta.name,
                                e.target.value
                              )
                          },
                          onBlur: (e) => {
                            value.meta &&
                              reactHookMethods.setValue(
                                value.meta.name,
                                e.target.value
                              )
                          },
                          value: v,
                        })}
                        getError={() => {}}
                        meta={value.meta || parent.meta}
                        hasError={() => {}}
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
