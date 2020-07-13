/* istanbul ignore file */

import React from 'react';
import PropTypes from 'prop-types';

import { FormGenerator } from 'react-reactive-form';
import isEqual from 'lodash.isequal';

import ktoDefinition from 'signals/incident/definitions/kto';
import formatConditionalForm from '../../../../services/format-conditional-form';

import './style.scss';

export const andersOptionText = 'Anders, namelijk...';
const andersOption = { anders: andersOptionText };

class KtoForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.setForm = this.setForm.bind(this);
    this.setValues = this.setValues.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateKto = this.updateKto.bind(this);

    this.ktoForm = ktoDefinition;
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.ktoContainer.answers, this.props.ktoContainer.answers) && this.ktoForm && this.ktoForm.controls) {
      if (this.props.ktoContainer.form.is_satisfied && this.ktoForm.controls.tevreden && this.ktoForm.controls.tevreden.meta) {
        this.ktoForm.controls.tevreden.meta.values = {
          ...this.props.ktoContainer.answers,
          ...andersOption,
        };
      }

      if (!this.props.ktoContainer.form.is_satisfied && this.ktoForm.controls.niet_tevreden && this.ktoForm.controls.niet_tevreden.meta) {
        this.ktoForm.controls.niet_tevreden.meta.values = {
          ...this.props.ktoContainer.answers,
          ...andersOption,
        };
      }
    }

    this.setValues(this.props.ktoContainer.form);
  }

  setValues(incident) {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.controls[key];
      if (control.meta.isVisible) {
        control.enable();
      } else {
        control.disable();
      }

      if (!isEqual(incident[key], control.value)) {
        control.setValue(incident[key]);
      }
    });

    this.form.updateValueAndValidity();
  }

  setForm = form => {
    this.form = form;
    this.form.meta = {
      updateIncident: this.updateKto,
    };
  }

  updateKto(value) {
    this.props.onUpdateKto(value);
  }

  handleSubmit(e) {
    e.preventDefault();
    const values = this.form.value;
    const text = values[`${values.is_satisfied ? '' : 'niet_'}tevreden`].label || '';
    const textAnders = values[`${values.is_satisfied ? '' : 'niet_'}tevreden_anders`] || '';

    this.props.onStoreKto({
      uuid: this.props.ktoContainer.uuid,
      form: {
        is_satisfied: values.is_satisfied,
        text: text === andersOptionText ? textAnders : text,
        text_extra: values.text_extra || '',
        allows_contact: Boolean(values.allows_contact && values.allows_contact.value),
      },
    });

    Object.values(this.form.controls).map(control => control.onBlur());
  }

  render() {
    const { ktoContainer } = this.props;
    return (
      <div className="kto-form">
        <form onSubmit={this.handleSubmit}>
          <FormGenerator
            onMount={this.setForm}
            fieldConfig={formatConditionalForm(this.ktoForm, ktoContainer.form)}
          />
        </form>
      </div>
    );
  }
}

KtoForm.propTypes = {
  ktoContainer: PropTypes.object.isRequired,

  onUpdateKto: PropTypes.func.isRequired,
  onStoreKto: PropTypes.func.isRequired,
};

export default KtoForm;
