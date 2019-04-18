import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import RadioInput from '../../../../components/RadioInput';
import TextAreaInput from '../../../../components/TextAreaInput';

import './style.scss';

class StatusForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  form = FormBuilder.group({ // eslint-disable-line react/sort-comp
    status: [this.props.incident.status.state, Validators.required],
    text: ['']
  });

  constructor(props) {
    super(props);

    this.state = {
      formVisible: false
    };
  }

  componentDidMount() {
    this.form.controls.status.valueChanges.subscribe((status) => {
      const textField = this.form.controls.text;
      if (['o', 'reopened'].includes(status)) {
        textField.setValidators([Validators.required]);
      } else {
        textField.clearValidators();
      }
      textField.updateValueAndValidity();
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onPatchIncident({
      id: this.props.incident.id,
      type: 'status',
      patch: { status: { state: this.form.value.status } }
    });

    this.form.reset();
    this.props.onClose();
  }

  /*
                  {error ? <div className="notification notification-red" >
                  {error && error.response && error.response.status === 403 ?
                      'Je bent niet geautoriseerd om dit te doen.' :
                      'De gekozen status is niet mogelijk in deze situatie.'}
                </div> : ''}
  */

  render() {
    const { changeStatusOptionList, onClose } = this.props;
    return (
      <section className="status-form">
        <FieldGroup
          control={this.form}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit} className="status-form__form">
              <div className="row">
                <div className="col-12">
                  <h4>Status wijzigen</h4>
                  <FieldControlWrapper
                    render={RadioInput}
                    name="text"
                    className="status-form__form-input"
                    control={this.form.get('status')}
                    values={changeStatusOptionList}
                  />
                </div>
                <div className="col-6">
                  <FieldControlWrapper
                    render={TextAreaInput}
                    name="text"
                    display="Toeliching"
                    control={this.form.get('text')}
                    rows={5}
                  />
                </div>
                <div className="col-12">
                  <button className="status-form__form-submit action primary" type="submit" disabled={invalid}>Status opslaan</button>
                  <button className="status-form__form-cancel action secundary-grey" onClick={onClose}>Annuleren</button>
                </div>
              </div>
            </form>
            )}
        />
      </section>
    );
  }
}

StatusForm.propTypes = {
  incident: PropTypes.object.isRequired,
  changeStatusOptionList: PropTypes.array.isRequired,

  onPatchIncident: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default StatusForm;
