import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import SelectInput from '../../../../components/SelectInput';
import RadioInput from '../../../../components/RadioInput';
import HiddenInput from '../../../../components/HiddenInput';

import './style.scss';

class SelectForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  form = FormBuilder.group({ // eslint-disable-line react/sort-comp
    category_url: ['https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu'],
    state: ['o'],
    sub_slug: ['asbest-accu'],
    main_slug: ['afval']
  });

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.form.controls.category_url.valueChanges.subscribe((category_url) => {
      const found = this.props.subCategories.find((sub) => sub.key === category_url);
      if (found && found.slug && found.category_slug) {
        this.form.patchValue({
          sub_slug: found.slug,
          main_slug: found.category_slug
        });

        this.handleChange({ category_url });
      }
    });

    this.form.controls.state.valueChanges.subscribe((state) => {
      this.handleChange({ state });
    });

    this.handleChange({});
  }

  componentDidUpdate() {
    this.form.updateValueAndValidity();
  }

  handleChange = (changed) => {
    const newValues = {
      ...this.form.value,
      ...changed
    };

    this.props.onFetchDefaultTexts(newValues);
  }

  render() {
    const { subCategories, statusList } = this.props;
    return (
      <div className="select-form">
        <FieldGroup
          control={this.form}
          render={() => (
            <form className="select-form__form">
              <FieldControlWrapper
                display="Subcategorie"
                render={SelectInput}
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
                values={statusList}
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

      </div>
    );
  }
}

SelectForm.defaultProps = {
  subCategories: [],
  stateList: [],

  onFetchDefaultTexts: () => {}
};

SelectForm.propTypes = {
  subCategories: PropTypes.array,
  statusList: PropTypes.array,

  onFetchDefaultTexts: PropTypes.func
};

export default SelectForm;
