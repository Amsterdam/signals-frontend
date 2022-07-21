// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { createRef, Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'

import formatConditionalForm from '../../services/format-conditional-form'
import { Form, Fieldset, ProgressContainer } from './styled'
import IndexRhf from './index_rhf'
class IncidentForm extends Component {
  constructor(props) {
    super(props)

    // set state with useState
    this.state = {
      loading: false,
      submitting: false,
      formAction: '',
      next: null,
    }
    this.formRef = createRef()

    this.setValues = this.setValues.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setIncident = this.setIncident.bind(this)
  }

  // save previous values with prevvalue hook
  static getDerivedStateFromProps(
    { incidentContainer: { loadingData } },
    prevState
  ) {
    return loadingData === prevState.loading
      ? null
      : {
          loading: loadingData,
          submitting: loadingData ? prevState.submitting : false,
        }
  }

  // useEffect with ...
  componentDidUpdate(prevProps, prevState) {
    if (!this.props.reactHookMethods.getValues()) return
    this.setValues(this.props.incidentContainer.incident)
    // RHF: use after refactor?
    // this.form.meta.incident = this.props.incidentContainer.incident
    // this.form.meta.submitting = this.state.submitting

    // RHF REFACTOR: THIS.FORM.VALID  VERANDEREN IN VALIDATIE REACT HOOK FORM
    if (
      prevState.loading &&
      !this.state.loading &&
      this.state.next
      //&& this.form.valid
    ) {
      this.setIncident(this.state.formAction)
      this.state.next()
    }
  }

  // useEffect with empty dep
  componentDidMount() {
    this.setState({
      loading: false,
      submitting: false,
      formAction: '',
      next: null,
    })
  }

  // RHF REFACTOR; HIER MOETEN DE ELEMENTEN WEL OF NIET ACTIEF WORDEN GEZET
  setValues(incident) {
    Object.entries(this.props.reactHookMethods.getValues()).map(
      ([key, value]) => {
        if (!isEqual(incident[key], value)) {
          this.props.reactHookMethods.setValue(key, incident[key])
        }
      }
    )
    this.props.reactHookMethods.trigger()
  }

  setIncident(formAction) {
    switch (
      formAction // eslint-disable-line default-case
    ) {
      case 'UPDATE_INCIDENT':
        this.props.updateIncident(this.props.reactHookMethods.getValues())
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
      if (this.state.loading) {
        this.setState({
          submitting: true,
          formAction,
          next,
        })

        return
      }

      // RHF REFACTOR: VALIDATE WITH RHF, remove this.form.valid || this.form.status === 'DISABLED'
      // make sure it can be disabled
      const valid = true
      if (valid) {
        this.setIncident(formAction)
        next()
      } else {
        // RHF REFACTOR: THIS PIECE OF CODE FOCUSES ON THE FIRST INVALID ELEMENT
        // const invalidControl = Object.values(this.form.controls).find(
        //   (c) => c.invalid
        // )
        // const { name, values } = invalidControl.meta
        // const valueSelector =
        //   !Array.isArray(values) && isObject(values)
        //     ? `-${Object.keys(values)[0]}`
        //     : ''
        //
        // const invalidElement = this.formRef.current.querySelector(
        //   `#${name}${valueSelector}`
        // )
        //
        // if (invalidElement) {
        //   invalidElement.focus()
        // }
      }
    }

    // Object.values(this.form.controls).map((control) => control.onBlur())
  }

  render() {
    const fields = this?.form?.value || {}
    const isSummary = Object.keys(fields).includes('page_summary')

    // RHF REFACTOR: HERE THE META'S INVISIBLE PROP GETS SET FOR AN BASED ON THE INCIDENT
    const fc = formatConditionalForm(
      this.props.fieldConfig,
      this.props.incidentContainer.incident
    )

    return (
      <div data-testid="incidentForm">
        <ProgressContainer />
        <Form onSubmit={this.handleSubmit} ref={this.formRef}>
          <Fieldset isSummary={isSummary}>
            <IndexRhf
              fieldConfig={fc}
              parent={{
                meta: {
                  wizard: this.props.wizard,
                  incidentContainer: this.props.incidentContainer,
                  handleSubmit: this.handleSubmit,
                  getClassification: this.props.getClassification,
                  updateIncident: this.props.updateIncident,
                  addToSelection: this.props.addToSelection,
                  removeFromSelection: this.props.removeFromSelection,
                },
              }}
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
