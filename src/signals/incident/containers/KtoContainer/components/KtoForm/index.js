import React from 'react';
import PropTypes from 'prop-types';

import { FormGenerator } from 'react-reactive-form';
import { defer, isEqual } from 'lodash';

import ktoDefinition from 'signals/incident/definitions/kto';
import formatConditionalForm from '../../../../services/format-conditional-form';

import './style.scss';

const andersOptionText = 'Anders, namelijk...';
const andersOption = { andersOptionText };

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
      if (props.ktoContainer.form.yesNo === 'ja' && this.ktoForm.controls.tevreden && this.ktoForm.controls.tevreden.meta) {
        this.ktoForm.controls.tevreden.meta.values = {
          ...props.ktoContainer.answers,
          ...andersOption
        };
      }

      if (props.ktoContainer.form.yesNo === 'nee' && this.ktoForm.controls.niet_tevreden && this.ktoForm.controls.niet_tevreden.meta) {
        this.ktoForm.controls.niet_tevreden.meta.values = {
          ...props.ktoContainer.answers,
          ...andersOption
        };
      }
    }

    this.setValues(props.ktoContainer.form);
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
    e.preventDefault();
    const form = this.props.ktoContainer.form;
    const text = form[`${form.yesNo === 'nee' && 'niet_'}tevreden`] || '';
    const textAnders = form[`${form.yesNo === 'nee' && 'niet_'}tevreden_anders`] || '';

    this.props.onStoreKto({
      uuid: this.props.ktoContainer.uuid,
      form: {
        is_satisfied: form.yesNo === 'ja',
        text: text === andersOptionText ? textAnders : text,
        text_extra: form.text_extra || '',
        allows_contact: !!(form.allows_contact)
      }
    });

    Object.values(this.form.controls).map((control) => control.onBlur());
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
  onStoreKto: PropTypes.func.isRequired
};

export default KtoForm;
