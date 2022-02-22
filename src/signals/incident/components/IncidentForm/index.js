// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { createRef, Component } from 'react'
import PropTypes from 'prop-types'
import { FormGenerator } from 'react-reactive-form'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'

import formatConditionalForm from '../../services/format-conditional-form'
import { Form, Fieldset, ProgressContainer } from './styled'

class IncidentForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      submitting: false,
      formAction: '',
      next: null,
    }
    this.formRef = createRef()

    this.setForm = this.setForm.bind(this)
    this.setValues = this.setValues.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setIncident = this.setIncident.bind(this)
  }

  static getDerivedStateFromProps(props, prevState) {
    if (!props.postponeSubmitWhenLoading) {
      return null
    }

    const loading = Array.isArray(props.postponeSubmitWhenLoading)
      ? props.postponeSubmitWhenLoading.some((prop) => get(props, prop))
      : get(props, props.postponeSubmitWhenLoading)
    if (loading !== prevState.loading) {
      return {
        loading,
        submitting: !loading ? false : prevState.submitting,
      }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.form) return
    this.setValues(this.props.incidentContainer.incident)
    this.form.meta.incident = this.props.incidentContainer.incident
    this.form.meta.submitting = this.state.submitting
    if (
      this.state.loading !== prevState.loading &&
      !this.state.loading &&
      this.state.next
    ) {
      if (this.form.valid) {
        this.setIncident(this.state.formAction)
        this.state.next()
      }
    }
  }

  componentDidMount() {
    this.setState({
      loading: false,
      submitting: false,
      formAction: '',
      next: null,
    })
  }

  setForm(form) {
    this.form = form
    this.form.meta = {
      wizard: this.props.wizard,
      incidentContainer: this.props.incidentContainer,
      handleSubmit: this.handleSubmit,
      getClassification: this.props.getClassification,
      updateIncident: this.props.updateIncident,
    }

    this.setValues(this.props.incidentContainer.incident)
  }

  setValues(incident) {
    const controlKeys = Object.keys(this.form.controls)

    controlKeys.forEach((key) => {
      const control = this.form.controls[key]
      if (
        (control.disabled && control.meta.isVisible) ||
        (control.enabled && !control.meta.isVisible)
      ) {
        if (control.meta.isVisible) {
          control.enable()
        } else {
          control.disable()
        }
      }

      if (!isEqual(incident[key], control.value)) {
        control.setValue(incident[key])
      }
    })

    // Some extra questions can prevent other controls from being rendered
    // When this happens, question data from that control should be removed from the incident data
    const keysToRemoveFromIncident = controlKeys.filter(
      (key) =>
        key.startsWith('extra_') &&
        typeof incident[key] !== 'undefined' &&
        !this.form.controls[key].meta.isVisible
    )

    if (keysToRemoveFromIncident.length) {
      this.props.removeQuestionData(keysToRemoveFromIncident)
    }

    this.form.updateValueAndValidity()
  }

  setIncident(formAction) {
    switch (
      formAction // eslint-disable-line default-case
    ) {
      case 'UPDATE_INCIDENT':
        this.props.updateIncident(this.form.value)
        break

      case 'CREATE_INCIDENT':
        this.props.createIncident({
          incident: this.props.incidentContainer.incident,
          wizard: this.props.wizard,
        })
        break

      default:
    }
  }

  handleSubmit(e, next, formAction) {
    e.preventDefault()

    if (next) {
      if (this.props.postponeSubmitWhenLoading) {
        if (this.state.loading) {
          this.setState({
            submitting: true,
            formAction,
            next,
          })

          return
        }
      }

      if (this.form.valid || this.form.status === 'DISABLED') {
        this.setIncident(formAction)
        next()
      } else {
        const invalidControl = Object.values(this.form.controls).find(
          (c) => c.invalid
        )
        const { name, values } = invalidControl.meta
        const valueSelector =
          !Array.isArray(values) && isObject(values)
            ? `-${Object.keys(values)[0]}`
            : ''

        const invalidElement = this.formRef.current.querySelector(
          `#${name}${valueSelector}`
        )

        if (invalidElement) {
          invalidElement.focus()
        }
      }
    }

    Object.values(this.form.controls).map((control) => control.onBlur())
  }

  render() {
    const fields = this?.form?.value || {}
    const isSummary = Object.keys(fields).includes('page_summary')

    return (
      <div data-testid="incidentForm">
        <ProgressContainer />
        <Form onSubmit={this.handleSubmit} ref={this.formRef}>
          <Fieldset isSummary={isSummary}>
            <FormGenerator
              onMount={this.setForm}
              fieldConfig={formatConditionalForm(
                this.props.fieldConfig,
                this.props.incidentContainer.incident
              )}
            />
          </Fieldset>
        </Form>
      </div>
    )
  }
}

IncidentForm.defaultProps = {
  fieldConfig: {
    controls: {},
  },
  postponeSubmitWhenLoading: '',
}

IncidentForm.propTypes = {
  fieldConfig: PropTypes.object,
  incidentContainer: PropTypes.object.isRequired,
  wizard: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  removeQuestionData: PropTypes.func.isRequired,
  updateIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
  postponeSubmitWhenLoading: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
}

export default IncidentForm
