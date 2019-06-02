import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
// import TextInput from '../../../../components/TextInput';
import TextAreaInput from '../../../../components/TextAreaInput';


import './style.scss';

class DefaultTextsForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  form = FormBuilder.group({ // eslint-disable-line react/sort-comp
    title1: [''],
    text1: [''],
    title2: [''],
    text2: [''],
    title3: [''],
    text3: [''],
    title4: [''],
    text4: [''],
    title5: [''],
    text5: ['']
  });

  texts = [1, 2, 3, 4, 5];

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

    const payload = [];

    this.texts.forEach((key) => {
      payload.push({
        text: this.form.controls[`text${key}`].value,
        order: key,
        category_url: this.props.categoryUrl,
        state: this.props.state
      });
    });

    this.props.onSubmitTexts(payload);
  }

  /*
                    <FieldControlWrapper
                    placeholder="Titel"
                    render={TextInput}
                    name={`title${key}`}
                    control={this.form.get(`title${key}`)}
                  />
*/
  render() {
    const { defaultTexts, categoryUrl } = this.props;
    console.log('render', defaultTexts, categoryUrl);
    return (
      <div className="default-texts-form">
        DefaultTextsForm
        <FieldGroup
          control={this.form}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit} className="default-texts-form__form">
              {this.texts.map((key) => (
                <div key={key}>

                  <FieldControlWrapper
                    placeholder="Tekstl"
                    render={TextAreaInput}
                    name={`text${key}`}
                    control={this.form.get(`text${key}`)}
                  />
                </div>
              ))}

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
  categoryUrl: '',
  state: '',

  onSubmitTexts: () => {}
};

DefaultTextsForm.propTypes = {
  defaultTexts: PropTypes.array,
  categoryUrl: PropTypes.string,
  state: PropTypes.string,

  onSubmitTexts: PropTypes.func
};

export default DefaultTextsForm;
