import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import isEqual from 'lodash.isequal';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import TextInput from '../../../../components/TextInput';
import TextAreaInput from '../../../../components/TextAreaInput';
import HiddenInput from '../../../../components/HiddenInput';


import './style.scss';

class DefaultTextsForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  form = FormBuilder.group({ // eslint-disable-line react/sort-comp
    item1: FormBuilder.group({
      pk: [''],
      order: [''],
      title: [''],
      text: [''],
    }),
    item2: FormBuilder.group({
      pk: [''],
      order: [''],
      title: [''],
      text: [''],
    }),
    item3: FormBuilder.group({
      pk: [''],
      order: [''],
      title: [''],
      text: [''],
    }),
    item4: FormBuilder.group({
      pk: [''],
      order: [''],
      title: [''],
      text: [''],
    }),
    item5: FormBuilder.group({
      pk: [''],
      order: [''],
      title: [''],
      text: [''],
    }),
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
    this.texts.forEach((key, index) => {
      this.form.get(`item${index + 1}`).valueChanges.subscribe(() => {
        this.props.onSaveDefaultTexts(this.form.get(`item${index + 1}`).value);
        this.form.updateValueAndValidity();
      });
    });

    this.form.updateValueAndValidity();
  }

  componentDidUpdate(prevProps) {
    const newValue = {};
    if (!isEqual(prevProps.defaultTexts, this.props.defaultTexts)) {
      this.texts.forEach((key, index) => {
        const empty = { title: '', text: '', order: '' };
        const data = this.props.defaultTexts[index] || {};
        this.form.get(`item${index + 1}`).patchValue({ ...empty, ...data });
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
    this.props.defaultTexts.forEach((data) => {
      if (data.text) {
        if (data.pk) {
          payload.patch.push({
            ...data,
            category,
            state,
          });
        } else {
          payload.post.push({
            ...data,
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

  render() {
    return (
      <div className="default-texts-form">
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
                <div key={key} className="row default-texts-form__row">
                  <div className="col-10">
                    <FieldControlWrapper
                      placeholder="Titel"
                      render={TextInput}
                      name={`title${key}`}
                      control={this.form.get(`item${index + 1}.title`)}
                    />

                    <FieldControlWrapper
                      placeholder="Tekst"
                      render={TextAreaInput}
                      name={`text${key}`}
                      control={this.form.get(`item${index + 1}.text`)}
                    />

                    <FieldControlWrapper
                      render={HiddenInput}
                      name={`pk${key}`}
                      control={this.form.get(`item${index + 1}.pk`)}
                    />

                    <FieldControlWrapper
                      render={HiddenInput}
                      name={`order${key}`}
                      control={this.form.get(`item${index + 1}.order`)}
                    />
                  </div>
                  <div className="col-2 default-texts-form__actions">
                    <button
                      disabled={index === 0 || !this.form.get(`item${index + 1}.text`).value}
                      className="default-texts-form__order-button default-texts-form__order-button--up"
                      onClick={(e) => this.changeOrdering(e, this.form.get(`item${index + 1}.order`).value, 'up')}
                    />
                    <button
                      disabled={index === this.texts.length - 1 || !this.form.get(`item${index + 2}.text`).value}
                      className="default-texts-form__order-button default-texts-form__order-button--down"
                      onClick={(e) => this.changeOrdering(e, this.form.get(`item${index + 1}.order`).value, 'down')}
                    />
                  </div>
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
  onOrderDefaultTexts: () => {},
  onSaveDefaultTexts: () => {}
};

DefaultTextsForm.propTypes = {
  defaultTexts: PropTypes.array,
  categoryUrl: PropTypes.string,
  state: PropTypes.string,

  onSubmitTexts: PropTypes.func,
  onOrderDefaultTexts: PropTypes.func,
  onSaveDefaultTexts: PropTypes.func
};

export default DefaultTextsForm;
