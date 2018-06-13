/**
*
* IncidentForm
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { WithWizard } from 'react-albus';
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
    console.log('setForm', form);
    // const filterForm = FormBuilder.group(incident);
    // console.log('formState', form, incident.incident);
    this.form = form;
    this.form.meta = {
      handleReset: this.handleReset
    };

    this.setValues(incident.incident);
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

  handleSubmit(e, next, setIncident) {
    e.preventDefault();
    if (this.form.valid) {
      console.log('Send form values to state', this.form.value);
      setIncident(this.form.value);
      next();
    }
  }

  render() {
    const fieldConfig = { ...this.props.fieldConfig };
    console.log('render');
    // fieldConfig.beschrijf.form.controls.description.formState = '666';// this.props.incident.incident.description;
    return (
      <WithWizard
        render={({ next }) => (
          <div className="incident-form">
            <form onSubmit={(e) => this.handleSubmit(e, next, this.props.setIncident)}>
              <FormGenerator
                onMount={(form) => this.setForm(form, this.props.incident)}
                fieldConfig={fieldConfig}
              />
            </form>
          </div>
        )}
      />
    );
  }
}

// IncidentForm.defaultProps = {
  // fieldConfig: {}
// };

IncidentForm.propTypes = {
  fieldConfig: PropTypes.object.isRequired,
  incident: PropTypes.object.isRequired,
  setIncident: PropTypes.func.isRequired
};

export default IncidentForm;
