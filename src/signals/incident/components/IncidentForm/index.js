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
    this.form.meta.incident = props.incident;
    this.setValues(props.incident, true);
  }

  setForm(form, incident) {
    this.form = form;
    this.form.meta = {
      incident,
      form: this.form,
      wizard: this.props.wizard,
      handleSubmit: this.handleSubmit,
      getClassification: this.props.getClassification,
      setIncident: this.props.setIncident,
      createIncident: this.props.createIncident
    };

    this.setValues(incident);
  }

  setValues(incident, onlyWatchedItems = false) {
    if (this.form && this.form.controls) {
      defer(() => {
        Object.keys(this.form.controls).map((key) => {
          const control = this.form.controls[key];
          if (!onlyWatchedItems || (onlyWatchedItems && control.meta.watch)) {
            control.setValue(incident[key]);
          }
          return true;
        });
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    Object.values(this.form.controls).map((control) => control.onBlur());
  }

  render() {
    return (
      <div className="incident-form">
        <form onSubmit={this.handleSubmit}>
          <FormGenerator
            onMount={(form) => this.setForm(form, this.props.incident)}
            fieldConfig={formatConditionalForm(this.props.fieldConfig, this.props.incident, this.props.isAuthenticated)}
          />
        </form>
      </div>
    );
  }
}

IncidentForm.propTypes = {
  fieldConfig: PropTypes.object.isRequired,
  incident: PropTypes.object.isRequired,
  wizard: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  setIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

export default IncidentForm;
