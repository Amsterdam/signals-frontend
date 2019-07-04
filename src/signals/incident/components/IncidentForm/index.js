/**
*
* IncidentForm
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormGenerator } from 'react-reactive-form';
import defer from 'lodash.defer';
import get from 'lodash.get';

import formatConditionalForm from '../../services/format-conditional-form/';

import './style.scss';

class IncidentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      submitting: false,
      submitCallback: null
    };

    this.setForm = this.setForm.bind(this);
    this.setValues = this.setValues.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static getDerivedStateFromProps(props, prevState) {
    if (!props.postponeSubmitWhenLoading) {
      return null;
    }

    const loading = get(props, props.postponeSubmitWhenLoading);
    if (loading !== prevState.loading) {
      return {
        loading,
        submitting: !loading ? false : prevState.submitting
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    this.setValues(this.props.incidentContainer.incident);
    this.form.meta.incident = this.props.incidentContainer.incident;
    this.form.meta.submitting = this.submitting;

    if (this.state.loading !== prevState.loading && !this.state.loading && this.state.submitCallback) {
      defer(() => {
        if (this.form.valid) {
          this.state.submitCallback();
        }
      });
    }
  }

  setForm(form, incidentContainer) {
    this.form = form;
    this.form.meta = {
      incidentContainer,
      form: this.form,
      wizard: this.props.wizard,
      submitting: this.submitting,
      isAuthenticated: this.props.isAuthenticated,
      handleSubmit: this.handleSubmit,
      getClassification: this.props.getClassification,
      updateIncident: this.props.updateIncident,
      createIncident: this.props.createIncident
    };

    this.setState({
      loading: false,
      submitting: false,
      submitCallback: null
    });

    this.setValues(incidentContainer.incident, true);
  }

  setValues(incident, setAllValues) {
    defer(() => {
      Object.keys(this.form.controls).map((key) => {
        const control = this.form.controls[key];
        if (control.meta.isVisible) {
          control.enable();
        } else {
          control.disable();
        }
        if (!control.meta.doNotUpdateValue || setAllValues) {
          control.setValue(incident[key]);
        }
        return true;
      });
    });
  }

  get submitting() {
    return this.state.submitting;
  }

  handleSubmit(e, submitCallback) {
    e.preventDefault();

    if (this.props.postponeSubmitWhenLoading && submitCallback) {
      if (this.state.loading) {
        this.setState({
          submitting: true,
          submitCallback
        });

        return;
      }
    }
    if (this.form.valid) {
      submitCallback();
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

IncidentForm.defaultProps = {
  fieldConfig: {
    controls: {}
  },
  postponeSubmitWhenLoading: ''
};

IncidentForm.propTypes = {
  fieldConfig: PropTypes.object,
  incidentContainer: PropTypes.object.isRequired,
  wizard: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  updateIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
  postponeSubmitWhenLoading: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired
};

export default IncidentForm;
