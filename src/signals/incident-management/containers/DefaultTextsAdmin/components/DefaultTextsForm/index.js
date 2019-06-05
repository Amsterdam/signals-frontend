import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import isEqual from 'lodash.isequal';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
// import TextInput from '../../../../components/TextInput';
import TextAreaInput from '../../../../components/TextAreaInput';
import HiddenInput from '../../../../components/HiddenInput';


import './style.scss';

class DefaultTextsForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  form = FormBuilder.group({ // eslint-disable-line react/sort-comp
    pk1: [''],
    order1: [''],
    title1: [''],
    text1: [''],
    pk2: [''],
    order2: [''],
    title2: [''],
    text2: [''],
    pk3: [''],
    order3: [''],
    title3: [''],
    text3: [''],
    pk4: [''],
    order4: [''],
    title4: [''],
    text4: [''],
    pk5: [''],
    order5: [''],
    title5: [''],
    text5: [''],
    categoryUrl: ['', Validators.required],
    state: ['', Validators.required]
  });

  texts = [10, 20, 30, 40, 50];

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeOrdering = this.changeOrdering.bind(this);
  }

  componentDidMount() {
    this.form.updateValueAndValidity();
  }

  componentDidUpdate(prevProps) {
    const newValue = {};

    if (!isEqual(prevProps.defaultTexts, this.props.defaultTexts)) {
      this.texts.forEach((key, index) => {
        const item = this.props.defaultTexts[index];
        newValue[`text${index + 1}`] = (item && item.text) || '';
        newValue[`pk${index + 1}`] = (item && item.pk) || '';
        newValue[`order${index + 1}`] = (item && item.order) || '';
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
    let maxOrder = 10;
    this.texts.forEach((key, index) => {
      const pk = this.form.controls[`pk${index + 1}`].value;
      const text = this.form.controls[`text${index + 1}`].value;
      const order = this.form.controls[`order${index + 1}`].value;
      maxOrder = order > maxOrder ? order : maxOrder;
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
          maxOrder += 10;
          payload.post.push({
            text,
            order: maxOrder,
            category,
            state
          });
        }
      }
    });

    this.props.onSubmitTexts(payload);
    this.form.updateValueAndValidity();
  }

  changeOrdering(e, order, type) {
    e.preventDefault();
    this.props.onOrderDefaultTexts({ order, type });
    this.form.updateValueAndValidity();
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

              {this.texts.map((key, index) => (
                <div key={key}>
                  <button onClick={(e) => this.changeOrdering(e, this.form.get(`order${index + 1}`).value, 'up')}>up</button>
                  <button onClick={(e) => this.changeOrdering(e, this.form.get(`order${index + 1}`).value, 'down')}>down</button>

                  <FieldControlWrapper
                    placeholder="Tekstl"
                    render={TextAreaInput}
                    name={`text${key}`}
                    control={this.form.get(`text${index + 1}`)}
                  />

                  <FieldControlWrapper
                    render={HiddenInput}
                    name={`pk${key}`}
                    control={this.form.get(`pk${index + 1}`)}
                  />

                  <FieldControlWrapper
                    render={HiddenInput}
                    name={`order${key}`}
                    control={this.form.get(`order${index + 1}`)}
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

  onSubmitTexts: () => {},
  onOrderDefaultTexts: () => {}
};

DefaultTextsForm.propTypes = {
  defaultTexts: PropTypes.array,
  categoryUrl: PropTypes.string,
  state: PropTypes.string,

  onSubmitTexts: PropTypes.func,
  onOrderDefaultTexts: PropTypes.func
};

export default DefaultTextsForm;
