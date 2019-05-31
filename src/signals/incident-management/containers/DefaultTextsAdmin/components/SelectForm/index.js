import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import SelectInput from '../../../../components/SelectInput';
import RadioInput from '../../../../components/RadioInput';

import './style.scss';

class SelectForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  form = FormBuilder.group({ // eslint-disable-line react/sort-comp
    subcategory: [''],
    state: ['']
  });

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.form.controls.subcategory.valueChanges.subscribe((subcategory) => {
      this.handleChange({ subcategory });
    });
    this.form.controls.state.valueChanges.subscribe((state) => {
      this.handleChange({ state });
    });
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
    console.log('newValues ', newValues);
  }

  render() {
    const { subcategories, statusList } = this.props;
    return (
      <div className="select-form">
        SelectForm {subcategories.length} {statusList.length}
        <FieldGroup
          control={this.form}
          render={() => (
            <form className="select-form__form">
              <FieldControlWrapper
                display="Subcategorie"
                render={SelectInput}
                name="subcategory"
                values={subcategories}
                control={this.form.get('subcategory')}
                useSlug
                emptyOptionText="Kies"
              />

              <FieldControlWrapper
                display="Status"
                render={RadioInput}
                name="state"
                values={statusList}
                control={this.form.get('state')}
              />
            </form>
              )}
        />

      </div>
    );
  }
}

SelectForm.defaultProps = {
  subcategories: [],
  stateList: [],

  onFetchDefaultTexts: () => {}
};

SelectForm.propTypes = {
  subcategories: PropTypes.array,
  statusList: PropTypes.array,

  onFetchDefaultTexts: PropTypes.func
};

export default SelectForm;
