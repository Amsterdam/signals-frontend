import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import { get, set } from 'lodash';

import { getListValueByKey } from 'shared/services/list-helper/list-helper';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import SelectInput from '../../../../components/SelectInput';

import './style.scss';

class ChangeValue extends React.Component { // eslint-disable-line react/prefer-stateless-function
  form = FormBuilder.group({ // eslint-disable-line react/sort-comp
    input: ['', Validators.required]
  });

  constructor(props) {
    super(props);

    this.state = {
      formVisible: false
    };
    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const payload = {};
    set(payload, this.props.path, this.form.value.input);
    this.props.onPatchIncident({
      id: this.props.incident.id,
      type: this.props.type,
      patch: { ...payload }
    });

    this.form.reset();
    this.hideForm();
  }

  handleCancel() {
    this.form.reset();
    this.hideForm();
  }

  showForm() {
    this.form.controls.input.setValue(get(this.props.incident, this.props.path));
    this.setState({ formVisible: true });
  }

  hideForm() {
    this.setState({ formVisible: false });
  }

  render() {
    const { display, definitionClass, valueClass, list, incident, path } = this.props;
    const { formVisible } = this.state;
    return (
      <dl className="change-value">
        <dt className={definitionClass}>
          {display}
        </dt>

        {formVisible ?
          <FieldGroup
            control={this.form}
            render={({ invalid }) => (
              <form onSubmit={this.handleSubmit} className="change-value__form">
                <div>
                  <FieldControlWrapper
                    render={SelectInput}
                    name="input"
                    values={list}
                    className="change-value__form-input"
                    control={this.form.get('input')}
                  />

                  <button className="change-value__form-submit action primary" type="submit" disabled={invalid}>Opslaan</button>
                  <button className="change-value__form-cancel action secundary-grey" onClick={this.handleCancel}>Annuleren</button>
                </div>
              </form>
              )}
          />
        :
          <dd className={valueClass}>
            <button className="change-value__edit incident-detail__button--edit" onClick={this.showForm} />
            {getListValueByKey(list, get(incident, path))}
          </dd>
        }
      </dl>
    );
  }
}

ChangeValue.propTypes = {
  incident: PropTypes.object.isRequired,
  definitionClass: PropTypes.string.isRequired,
  valueClass: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  display: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,

  onPatchIncident: PropTypes.func.isRequired
};

export default ChangeValue;
