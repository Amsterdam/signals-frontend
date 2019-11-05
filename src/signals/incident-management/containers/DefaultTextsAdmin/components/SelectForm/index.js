import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import { dataListType } from 'shared/types';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import SelectInput from '../../../../components/SelectInput';
import RadioInput from '../../../../components/RadioInput';
import HiddenInput from '../../../../components/HiddenInput';

class SelectForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.form.controls.category_url.valueChanges.subscribe(category_url => {
      const found = this.props.subCategories.find(
        sub => sub.key === category_url,
      );
      /* istanbul ignore else */
      if (found && found.slug && found.category_slug) {
        this.form.patchValue({
          sub_slug: found.slug,
          main_slug: found.category_slug,
        });

        this.handleChange({ category_url });
      }
    });

    this.form.controls.state.valueChanges.subscribe(state => {
      this.handleChange({ state });
    });

    this.handleChange({});
  }

  /* istanbul ignore next */
  componentDidUpdate() {
    this.form.updateValueAndValidity();
  }

  form = FormBuilder.group({
    category_url: [
      'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
    ],
    state: ['o'],
    sub_slug: ['asbest-accu'],
    main_slug: ['afval'],
  });

  handleChange = changed => {
    const newValues = {
      ...this.form.value,
      ...changed,
    };

    this.props.onFetchDefaultTexts(newValues);
  };

  render() {
    const { subCategories, defaultTextsOptionList } = this.props;
    return (
      <Fragment>
        <FieldGroup
          control={this.form}
          render={() => (
            <form
              data-testid="selectFormForm"
              className="select-form__form"
            >
              <FieldControlWrapper
                render={SelectInput}
                display="Subcategorie"
                name="category_url"
                values={subCategories}
                control={this.form.get('category_url')}
                emptyOptionText="Kies"
                sort
              />
              <FieldControlWrapper
                display="Status"
                render={RadioInput}
                name="state"
                values={defaultTextsOptionList}
                control={this.form.get('state')}
              />

              <FieldControlWrapper
                render={HiddenInput}
                name="sub_slug"
                control={this.form.get('sub_slug')}
              />
              <FieldControlWrapper
                render={HiddenInput}
                name="main_slug"
                control={this.form.get('main_slug')}
              />
            </form>
          )}
        />
      </Fragment>
    );
  }
}

SelectForm.propTypes = {
  subCategories: dataListType.isRequired,
  defaultTextsOptionList: dataListType.isRequired,

  onFetchDefaultTexts: PropTypes.func.isRequired,
};

export default SelectForm;
