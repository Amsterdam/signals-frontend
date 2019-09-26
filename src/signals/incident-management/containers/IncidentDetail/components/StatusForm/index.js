import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import isEqual from 'lodash.isequal';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import RadioInput from '../../../../components/RadioInput';
import TextAreaInput from '../../../../components/TextAreaInput';
import DefaultTexts from './components/DefaultTexts';

import './style.scss';

class StatusForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  form = FormBuilder.group({ // eslint-disable-line react/sort-comp
    status: ['', Validators.required],
    text: ['']
  });

  constructor(props) {
    super(props);

    this.state = {
      warning: props.warning
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUseDefaultText = this.handleUseDefaultText.bind(this);
  }

  componentDidMount() {
    this.form.controls.status.valueChanges.subscribe((status) => {
      const found = this.props.statusList.find((s) => s.key === status);
      this.setState({
        warning: (found && found.warning) || ''
      });
      this.props.onDismissError();

      const textField = this.form.controls.text;
      if (['o', 'ingepland'].includes(status)) {
        textField.setValidators([Validators.required]);
      } else {
        textField.clearValidators();
      }

      textField.updateValueAndValidity();
    });

    this.props.onDismissError();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.patching && prevProps.patching.status, this.props.patching && this.props.patching.status) && this.props.patching.status === false) {
      const hasError = (this.props.error && this.props.error.response && !this.props.error.response.ok) || false;
      if (!hasError) {
        this.form.reset();
        this.props.onClose();
      }
    }
    this.form.updateValueAndValidity();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onPatchIncident({
      id: this.props.incident.id,
      type: 'status',
      patch: { status: { state: this.form.value.status, text: this.form.value.text } }
    });
  }

  handleUseDefaultText(e, text) {
    e.preventDefault();

    this.form.get('text').patchValue(text);
  }

  render() {
    const { incident, patching, error, statusList, changeStatusOptionList, onClose, defaultTexts } = this.props;
    const { warning } = this.state;
    const currentStatus = statusList.find((status) => status.key === incident.status.state);
    return (
      <section className="status-form">
        <FieldGroup
          control={this.form}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit} className="status-form__form">
              <div className="row">
                <div className="col-6">
                  <h4>Status wijzigen</h4>

                  <div className="status-form__current-state">
                    <label htmlFor="currentStatus">Huidige status</label>
                    <div id="currentStatus">{currentStatus.value}</div>
                  </div>

                  <FieldControlWrapper
                    display="Nieuwe status"
                    render={RadioInput}
                    name="status"
                    className="status-form__form-status"
                    control={this.form.get('status')}
                    values={changeStatusOptionList}
                  />
                  <FieldControlWrapper
                    render={TextAreaInput}
                    name="text"
                    className="status-form__form-text"
                    display="Toelichting"
                    control={this.form.get('text')}
                    rows={5}
                  />

                  <div className="status-form__warning notification notification-red" >
                    {warning}
                  </div>
                  <div className="status-form__error notification notification-red" >
                    {error && error.response && error.response.status === 403 ? 'Je bent niet geautoriseerd om dit te doen.' : '' }
                    {error && error.response && error.response.status !== 403 ? 'De gekozen status is niet mogelijk in deze situatie.' : '' }
                  </div>

                  <button className="status-form__form-submit action primary" type="submit" disabled={invalid}>
                    <span className="value">Status opslaan</span>
                    {patching.status ? <span className="working"><div className="status-form__submit--progress progress-indicator progress-white"></div></span> : ''}
                  </button>
                  <button className="status-form__form-cancel action secundary-grey" onClick={onClose}>Annuleren</button>
                </div>
                <div className="col-6">
                  <DefaultTexts
                    defaultTexts={defaultTexts}
                    status={this.form.get('status').value}
                    onHandleUseDefaultText={this.handleUseDefaultText}
                  />
                </div>
              </div>
            </form>
            )}
        />
      </section>
    );
  }
}

StatusForm.defaultProps = {
  warning: ''
};

StatusForm.propTypes = {
  incident: PropTypes.object.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  patching: PropTypes.object.isRequired,
  warning: PropTypes.string,
  changeStatusOptionList: PropTypes.array.isRequired,
  statusList: PropTypes.array.isRequired,
  defaultTexts: PropTypes.array.isRequired,

  onPatchIncident: PropTypes.func.isRequired,
  onDismissError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default StatusForm;
