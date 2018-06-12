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
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setForm(form) {
    this.form = form;
    this.form.meta = {
      handleReset: this.handleReset
    };
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
    return (
      <WithWizard
        render={({ next }) => (
          <div className="incident-form">
            <form onSubmit={(e) => this.handleSubmit(e, next, this.props.setIncident)}>
              <FormGenerator
                onMount={this.setForm}
                fieldConfig={this.props.fieldConfig}
              />
            </form>
          </div>
        )}
      />
    );
  }
}

IncidentForm.defaultProps = {
  fieldConfig: {}
};

IncidentForm.propTypes = {
  fieldConfig: PropTypes.object,
  setIncident: PropTypes.func.isRequired
};

export default IncidentForm;
