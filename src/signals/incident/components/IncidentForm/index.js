/**
*
* IncidentForm
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormGenerator } from 'react-reactive-form';
import { defer } from 'lodash';

import formatConditionalForm from './services/format-conditional-form/';

import './style.scss';

class IncidentForm extends React.Component {
  constructor(props) {
    super(props);

    this.setForm = this.setForm.bind(this);
    this.setValues = this.setValues.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setValues(props.incidentContainer.incident);
    this.form.meta.incident = props.incidentContainer.incident;
  }

  setForm(form, incidentContainer) {
    this.form = form;
    this.form.meta = {
      incidentContainer,
      form: this.form,
      wizard: this.props.wizard,
      handleSubmit: this.handleSubmit,
      getClassification: this.props.getClassification,
      setIncident: this.props.setIncident,
      createIncident: this.props.createIncident
    };

    this.setValues(incidentContainer.incident);
  }

  setValues(incident) {
    if (this.form && this.form.controls) {
      defer(() => {
        Object.keys(this.form.controls).map((key) => {
          this.form.controls[key].setValue(incident[key]);
          return true;
        });
      });
    }
  }

  handleSubmit(e, step) {
    e.preventDefault();

    if (step === 'incident/samenvatting') {
      this.props.createIncident({
        incident: this.props.incidentContainer.incident,
        wizard: this.props.wizard,
        isAuthenticated: this.props.isAuthenticated
      });
    } else {
      this.props.setIncident(this.form.value);
    }

    Object.values(this.form.controls).map((control) => control.onBlur());
  }

  render() {
    return (
      <div className="incident-form">
        <form onSubmit={this.handleSubmit}>
          <FormGenerator
            onMount={(form) => this.setForm(form, this.props.incidentContainer)}
            fieldConfig={formatConditionalForm(this.props.fieldConfig, this.props.incidentContainer.incident, this.props.isAuthenticated)}
          />
        </form>
      </div>
    );
  }
}

IncidentForm.propTypes = {
  fieldConfig: PropTypes.object.isRequired,
  incidentContainer: PropTypes.object.isRequired,
  wizard: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  setIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

export default IncidentForm;
