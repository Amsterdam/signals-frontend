import React from 'react';
import PropTypes from 'prop-types';

import { FormGenerator } from 'react-reactive-form';
import { defer, isEqual } from 'lodash';

import ktoDefinition from 'signals/incident/definitions/kto';
import formatConditionalForm from '../../../../components/IncidentForm/services/format-conditional-form';

import './style.scss';

const andersOption = { 'Anders, namelijk...': 'Anders, namelijk...' };

class KtoForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.setForm = this.setForm.bind(this);
    this.setValues = this.setValues.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateKto = this.updateKto.bind(this);

    this.ktoForm = ktoDefinition;
  }

  componentWillReceiveProps(props) {
    if (!isEqual(props.ktoContainer.answers, this.props.ktoContainer.answers) && this.ktoForm && this.ktoForm.controls) {
      if (props.ktoContainer.kto.yesNo === 'ja' && this.ktoForm.controls.tevreden && this.ktoForm.controls.tevreden.meta) {
        this.ktoForm.controls.tevreden.meta.values = {
          ...props.ktoContainer.answers,
          ...andersOption
        };
      }

      if (props.ktoContainer.kto.yesNo === 'nee' && this.ktoForm.controls.niet_tevreden && this.ktoForm.controls.niet_tevreden.meta) {
        this.ktoForm.controls.niet_tevreden.meta.values = {
          ...props.ktoContainer.answers,
          ...andersOption
        };
      }
    }

    this.setValues(props.ktoContainer.kto);
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

  setForm = (form) => {
    this.form = form;
    this.form.meta = {
      updateIncident: this.updateKto
    };
  }

  updateKto(value) {
    this.props.onUpdateKto(value);
  }

  handleSubmit(e) {
    console.log('handleSubmit', this.props.ktoContainer.kto);
    e.preventDefault();
    this.props.onStoreKto();

    Object.values(this.form.controls).map((control) => control.onBlur());
  }

  render() {
    const { ktoContainer } = this.props;
    return (
      <div className="kto-form">
        <form onSubmit={this.handleSubmit}>
          <FormGenerator
            onMount={this.setForm}
            fieldConfig={formatConditionalForm(this.ktoForm, ktoContainer.kto)}
          />
        </form>
      </div>
    );
  }
}

KtoForm.propTypes = {
  ktoContainer: PropTypes.object.isRequired,

  onUpdateKto: PropTypes.func.isRequired,
  onStoreKto: PropTypes.func.isRequired
};

export default KtoForm;
