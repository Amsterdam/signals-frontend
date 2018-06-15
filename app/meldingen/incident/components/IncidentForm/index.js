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

  componentWillReceiveProps(props) {
    this.setValues(props.incident, true);
  }

  setForm(form, incident) {
    this.form = form;
    this.form.meta = {
      form: this.form,
      handleSubmit: this.handleSubmit,
      getClassification: this.props.getClassification,
      setIncident: this.props.setIncident
    };

    this.setValues(incident);
  }

  setValues(incident, onlyWatchedItems = false) {
    if (this.form && this.form.controls) {
      window.setTimeout(() => {
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
  getClassification: PropTypes.func.isRequired,
  setIncident: PropTypes.func.isRequired
};

export default IncidentForm;
