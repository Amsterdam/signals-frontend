import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import TextInput from '../../../../components/TextInput';
import TextAreaInput from '../../../../components/TextAreaInput';


import './style.scss';

class DefaultTextsForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  form = FormBuilder.group({ // eslint-disable-line react/sort-comp
    title1: [''],
    text1: [''],
    title2: [''],
    text2: ['']
  });

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // componentDidMount() {
    // this.form.controls.subcategory.valueChanges.subscribe((subcategory) => {
      // this.handleChange({ subcategory });
    // });
    // this.form.controls.state.valueChanges.subscribe((state) => {
      // this.handleChange({ state });
    // });
  // }
//
  componentDidUpdate() {
    this.form.updateValueAndValidity();
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('handleSubmit', this.form.value);
    // this.props.onSubmitTexts();
  }

  render() {
    const { defaultTexts } = this.props;
    console.log('render', defaultTexts);
    return (
      <div className="default-texts-form">
        DefaultTextsForm
        <FieldGroup
          control={this.form}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit} className="default-texts-form__form">
              <FieldControlWrapper
                render={TextInput}
                name="title1"
                control={this.form.get('title1')}
              />

              <FieldControlWrapper
                render={TextAreaInput}
                name="text1"
                control={this.form.get('text1')}
              />

              <FieldControlWrapper
                render={TextInput}
                name="title2"
                control={this.form.get('title2')}
              />

              <FieldControlWrapper
                render={TextAreaInput}
                name="text2"
                control={this.form.get('text2')}
              />

              <button className="status-form__form-submit action primary" type="submit" disabled={invalid}>Opslaan</button>
            </form>
              )}
        />


      </div>
    );
  }
}

DefaultTextsForm.defaultProps = {
  defaultTexts: [],

  onSubmitTexts: () => {}
};

DefaultTextsForm.propTypes = {
  defaultTexts: PropTypes.array,

  // onSubmitTexts: PropTypes.func
};

export default DefaultTextsForm;
