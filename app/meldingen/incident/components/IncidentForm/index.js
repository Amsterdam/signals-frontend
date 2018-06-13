/**
*
* IncidentForm
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormGenerator } from 'react-reactive-form';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

import './style.scss';

class IncidentForm extends React.Component {
  constructor(props) {
    super(props);

    this.setForm = this.setForm.bind(this);
    this.setValues = this.setValues.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setForm(form, incident) {
    console.log('setForm', form, incident);
    // const filterForm = FormBuilder.group(incident);
    // console.log('formState', form, incident.incident);
    this.form = form;
    this.form.meta = {
      form: this.form,
      handleSubmit: this.handleSubmit,
      setIncident: this.props.setIncident
    };

    // this.setValues(incident.incident);
    // this.form.controls.description.setValue('yooooo');
  }

  setValues(incident) {
    console.log('setValues', incident);
    if (this.form && this.form.controls) {
      console.log('setValues', this.form.controls);
      // this.form.controls.description.setValue('yooooo');
    }
  }

  handleReset() {
    this.form.reset();
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div className="incident-form">
        <form onSubmit={this.handleSubmit}>
          <FormGenerator
            onMount={(form) => this.setForm(form, this.props.incident)}
            fieldConfig={this.props.fieldConfig}
          />
        </form>
      </div>
    );
  }
}

IncidentForm.propTypes = {
  fieldConfig: PropTypes.object.isRequired,
  incident: PropTypes.object.isRequired,
  setIncident: PropTypes.func.isRequired
};

export default IncidentForm;
