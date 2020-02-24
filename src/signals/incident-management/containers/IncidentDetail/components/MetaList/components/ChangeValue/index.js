import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import get from 'lodash.get';
import set from 'lodash.set';

import { incidentType, dataListType } from 'shared/types';

import { getListValueByKey } from 'shared/services/list-helper/list-helper';

import FieldControlWrapper from '../../../../../../components/FieldControlWrapper';
import SelectInput from '../../../../../../components/SelectInput';

import './style.scss';

class ChangeValue extends React.Component { // eslint-disable-line react/prefer-stateless-function
  form = FormBuilder.group({ // eslint-disable-line react/sort-comp
    input: ['', Validators.required],
  });

  constructor(props) {
    super(props);

    this.state = {
      formVisible: false,
    };
    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleSubmit = event => {
    event.preventDefault();
    const payload = { ...this.props.patch };
    set(payload, this.props.path, this.form.value.input);
    this.props.onPatchIncident({
      id: this.props.incident.id,
      type: this.props.type,
      patch: { ...payload },
    });

    this.form.reset();
    this.hideForm();
  }

  handleCancel() {
    this.form.reset();
    this.hideForm();
  }

  showForm() {
    this.form.controls.input.setValue(get(this.props.incident, this.props.valuePath || this.props.path));
    this.setState({ formVisible: true });
  }

  hideForm() {
    this.setState({ formVisible: false });
  }

  render() {
    const {
      display, definitionClass, valueClass, list, incident, path, valuePath, sort, disabled,
    } = this.props;
    const { formVisible } = this.state;
    return (
      <dl className="change-value">
        <dt className={definitionClass}>
          {display}
        </dt>

        {formVisible
          ? (
            <FieldGroup
              control={this.form}
              render={() => (
                <form onSubmit={this.handleSubmit} className="change-value__form">
                  <Fragment>
                    <FieldControlWrapper
                      render={SelectInput}
                      name="input"
                      values={list}
                      className="change-value__form-input"
                      control={this.form.get('input')}
                      disabled={disabled}
                      sort={sort}
                    />

                    <button
                      className="change-value__form-submit action primary"
                      type="submit"
                    >
                      Opslaan
                    </button>
                    <button
                      className="change-value__form-cancel action secundary-grey"
                      type="button"
                      onClick={this.handleCancel}
                    >
                      Annuleren
                    </button>
                  </Fragment>
                </form>
              )}
            />
          )
          : (
            <dd className={valueClass}>
              <button
                className="change-value__edit incident-detail__button--edit"
                type="button"
                onClick={this.showForm}
                disabled={disabled}
              />
              <span className="change-value__value">{getListValueByKey(list, get(incident, valuePath || path))}</span>
            </dd>
          )}
      </dl>
    );
  }
}

ChangeValue.defaultProps = {
  valuePath: '',
  patch: {},
  disabled: false,
};

ChangeValue.propTypes = {
  incident: incidentType.isRequired,
  definitionClass: PropTypes.string.isRequired,
  valueClass: PropTypes.string.isRequired,
  list: dataListType.isRequired,
  display: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  valuePath: PropTypes.string,
  patch: PropTypes.object,
  disabled: PropTypes.bool,
  sort: PropTypes.bool,
  type: PropTypes.string.isRequired,

  onPatchIncident: PropTypes.func.isRequired,
};

export default ChangeValue;
