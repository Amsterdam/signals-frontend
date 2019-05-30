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
    status: ['']
  });

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.form.controls.subcategory.valueChanges.subscribe((subcategory) => {
      console.log('change subcategory', subcategory);
    });
    this.form.controls.status.valueChanges.subscribe((status) => {
      console.log('change status', status);
    });

    this.form.updateValueAndValidity();
  }


  handleSubmit = () => {
    // event.preventDefault();
    console.log('handleSubmit');
  }

  render() {
    const { subcategories, statusList } = this.props;
    return (
      <div className="select-form">
        SelectForm {subcategories.length} {statusList.length}
        <FieldGroup
          control={this.form}
          render={() => (
            <form className="change-value__form">
              <FieldControlWrapper
                display="Subcategorie"
                render={SelectInput}
                name="subcategory"
                values={subcategories}
                control={this.form.get('subcategory')}
              />

              <FieldControlWrapper
                display="Status"
                render={RadioInput}
                name="status"
                values={statusList}
                control={this.form.get('status')}
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
  statusList: []
};

SelectForm.propTypes = {
  subcategories: PropTypes.array,
  statusList: PropTypes.array
};

export default SelectForm;
