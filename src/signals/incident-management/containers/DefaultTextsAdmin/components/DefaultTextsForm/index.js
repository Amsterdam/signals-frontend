import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import isEqual from 'lodash.isequal';
// import orderBy from 'lodash.orderby';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import TextInput from '../../../../components/TextInput';
import TextAreaInput from '../../../../components/TextAreaInput';
import HiddenInput from '../../../../components/HiddenInput';


import './style.scss';

class DefaultTextsForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  form = FormBuilder.group({ // eslint-disable-line react/sort-comp
    pk1: [''],
    order1: [0],
    title1: [''],
    text1: [''],
    pk2: [''],
    order2: [0],
    title2: [''],
    text2: [''],
    pk3: [''],
    order3: [0],
    title3: [''],
    text3: [''],
    pk4: [''],
    order4: [0],
    title4: [''],
    text4: [''],
    pk5: [''],
    order5: [0],
    title5: [''],
    text5: [''],
    categoryUrl: ['', Validators.required],
    state: ['', Validators.required]
  });

  texts = [1, 2, 3, 4, 5];

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOrdering = this.handleOrdering.bind(this);
  }

  componentDidMount() {
    this.form.updateValueAndValidity();
  }

  componentDidUpdate(prevProps) {
    const newValue = {};

    if (!isEqual(prevProps.defaultTexts, this.props.defaultTexts)) {
      this.texts.forEach((key, index) => {
        const item = this.props.defaultTexts[index];
        newValue[`text${key}`] = (item && item.text) || '';
        newValue[`pk${key}`] = (item && item.pk) || '';
        newValue[`order${key}`] = (item && item.order) || '';
      });
    }

    if (!isEqual(prevProps.categoryUrl, this.props.categoryUrl)) {
      newValue.categoryUrl = this.props.categoryUrl;
    }

    if (!isEqual(prevProps.state, this.props.state)) {
      newValue.state = this.props.state;
    }

    this.form.patchValue(newValue);
    this.form.updateValueAndValidity();
  }

  handleSubmit(e) {
    e.preventDefault();

    const payload = { patch: [], post: [] };
    const category = this.props.categoryUrl;
    const state = this.props.state;

    this.texts.forEach((key) => {
      const pk = this.form.controls[`pk${key}`].value;
      const text = this.form.controls[`text${key}`].value;
      const order = this.form.controls[`order${key}`].value;
      if (text) {
        if (pk) {
          payload.patch.push({
            pk,
            text,
            order,
            category,
            state,
          });
        } else {
          payload.post.push({
            text,
            order,
            category,
            state
          });
        }
      }
    });

    this.props.onSubmitTexts(payload);
    this.form.updateValueAndValidity();
  }

  handleOrdering(key, type) {
    console.log('handleOrdering', key, type);
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
    return (
      <div className="default-texts-form">
        DefaultTextsForm
        <FieldGroup
          control={this.form}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit} className="default-texts-form__form">
              <FieldControlWrapper
                render={HiddenInput}
                name="state"
                control={this.form.get('state')}
              />

              <FieldControlWrapper
                render={HiddenInput}
                name="categoryUrl"
                control={this.form.get('categoryUrl')}
              />

              {this.texts.map((key) => (
                <div key={key}>
                  <button onClick={() => this.handleOrdering(key, 'up')}>up</button>
                  <button onClick={() => this.handleOrdering(key, 'down')}>down</button>
                  <FieldControlWrapper
                    render={TextInput}
                    name={`order${key}`}
                    placeholder="order"
                    control={this.form.get(`order${key}`)}
                  />

                  <FieldControlWrapper
                    placeholder="Tekstl"
                    render={TextAreaInput}
                    name={`text${key}`}
                    control={this.form.get(`text${key}`)}
                  />

                  <FieldControlWrapper
                    render={HiddenInput}
                    name={`pk${key}`}
                    control={this.form.get(`pk${key}`)}
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
