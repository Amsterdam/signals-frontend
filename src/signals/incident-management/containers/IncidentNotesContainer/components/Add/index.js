import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import TextAreaInput from '../../../../components/TextAreaInput';
import './style.scss';


class Add extends React.Component { // eslint-disable-line react/prefer-stateless-function
  noteForm = FormBuilder.group({ // eslint-disable-line react/sort-comp
    _signal: [''],
    text: [null, Validators.required],
    loading: false
  });

  componentWillUpdate(props) {
    if (props.loading !== this.props.loading) {
      this.noteForm.controls.loading.setValue(props.loading);
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const note = { ...this.noteForm.value, _signal: this.props.id };
    this.props.onRequestNoteCreate(note);
    this.noteForm.reset();
  }

  render() {
    const { error, loading } = this.props;
    return (
      <div className="incident-notes-add">
        <div className="incident-notes-add__body">
          <FieldGroup
            control={this.noteForm}
            render={({ invalid }) => (
              <form onSubmit={this.handleSubmit}>
                <div>
                  <FieldControlWrapper render={TextAreaInput} name="text" display="Notitie" control={this.noteForm.get('text')} rows={5} />

                  {error ? <div className="notification notification-red" >De gekozen notitie is niet mogelijk in deze situatie.</div> : ''}

                  <button className="incident-notes-add__submit action primary" type="submit" disabled={invalid || loading}>
                    <span className="value">Notitie toevoegen</span>
                    {loading ?
                      <span className="working">
                        <div className="progress-indicator progress-white"></div>
                      </span>
                    : ''}
                  </button>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    );
  }
}

Add.defaultProps = {
  loading: false,
  loadingExternal: false,
  error: false
};

Add.propTypes = {
  id: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),

  onRequestNoteCreate: PropTypes.func.isRequired
};

export default Add;
