import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import TextInput from '../../../../components/TextInput';

import './style.scss';

class AddNote extends React.Component { // eslint-disable-line react/prefer-stateless-function
  form = FormBuilder.group({ // eslint-disable-line react/sort-comp
    text: [null, Validators.required]
  });

  constructor(props) {
    super(props);

    this.state = {
      formVisible: false
    };

    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const notes = [{ text: this.form.value.text }];
    this.props.onPatchIncident({
      id: this.props.id,
      type: 'notes',
      patch: { notes }
    });

    this.form.reset();
    this.hideForm();
  }

  showForm() {
    this.form.reset();
    this.setState({ formVisible: true });
  }

  hideForm() {
    this.setState({ formVisible: false });
  }

  render() {
    const { formVisible } = this.state;
    return (
      <section className="add-note">
        <div>
          {formVisible ?
            <FieldGroup
              control={this.form}
              render={({ invalid }) => (
                <form onSubmit={this.handleSubmit} className="add-note__form">
                  <div>
                    <FieldControlWrapper render={TextInput} name="text" className="add-note__form-input" control={this.form.get('text')} />

                    <button className="add-note__form-submit action primary" type="submit" disabled={invalid}>Opslaan</button>
                    <button className="add-note__form-cancel action secundary-grey" onClick={this.hideForm}>Annuleren</button>
                  </div>
                </form>
            )}
            />
          :
            <button className="add-note__show-form action-quad" onClick={this.showForm}>Notitie toevoegen</button>
          }
        </div>
      </section>
    );
  }
}

AddNote.propTypes = {
  id: PropTypes.string.isRequired,

  onPatchIncident: PropTypes.func.isRequired
};

export default AddNote;
