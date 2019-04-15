import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import TextInput from '../../../../components/TextInput';

import './style.scss';

class Notes extends React.Component { // eslint-disable-line react/prefer-stateless-function
  noteForm = FormBuilder.group({ // eslint-disable-line react/sort-comp
    _signal: [''],
    text: [null, Validators.required],
    loading: false
  });

  // componentWillUpdate(props) {
    // if (props.loading !== this.props.loading) {
      // this.noteForm.controls.loading.setValue(props.loading);
    // }
  // }

  handleSubmit = (event) => {
    event.preventDefault();
    const notes = [{ text: this.noteForm.value.text }];
    this.props.onPatchIncident({
      id: this.props.id,
      patch: { notes }
    });

    this.noteForm.reset();
  }

  render() {
    const { list } = this.props;
    const loading = false;
    const error = false;
    return (
      <section className="notes">
        <div>
          <FieldGroup
            control={this.noteForm}
            render={({ invalid }) => (
              <form onSubmit={this.handleSubmit} className="notes__form">
                <div>
                  <button className="notes__form-submit action-quad" type="submit" disabled={invalid || loading}>
                    <span className="value">Notitie toevoegen</span>
                    {loading ?
                      <span className="working">
                        <div className="progress-indicator progress-white"></div>
                      </span>
                      : ''}
                  </button>
                  <FieldControlWrapper render={TextInput} name="text" className="notes__form-input" control={this.noteForm.get('text')} />

                  {error ? <div className="notification notification-red" >De gekozen notitie is niet mogelijk in deze situatie.</div> : ''}

                </div>
              </form>
              )}
          />
        </div>

        {list.map((item) => (
          <div key={item._links.self.href} className="notes__item">
            <div className="notes__item-header">
              <span className="notes__item-header-when">{string2date(item.created_at)}</span>
              <span className="notes__item-header-when">{string2time(item.created_at)}</span>
              {item.created_by}
            </div>
            <div className="notes__item-body pre-wrap">{item.text}</div>
          </div>
      ))}
      </section>
    );
  }
}

Notes.propTypes = {
  list: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,

  onPatchIncident: PropTypes.func.isRequired
};

export default Notes;
