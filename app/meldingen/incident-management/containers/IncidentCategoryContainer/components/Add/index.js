import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';

import { SelectInput } from '../../../../components/SelectInput';
import './style.scss';


class Add extends React.Component { // eslint-disable-line react/prefer-stateless-function
  categoryForm = FormBuilder.group({
    _signal: [''],
    sub: ['', Validators.required]
  });

  handleSubmit = (event) => {
    event.preventDefault();
    const status = { ...this.categoryForm.value, _signal: this.props.id };
    this.props.onRequestCategoryUpdate(status);
  }

  render() {
    const { subcategoryList } = this.props;
    return (
      <div className="incident-category-add">
        <div className="incident-category-add__title">Rubriek aanpassen</div>
        <div className="incident-category-add__body">
          <FieldGroup
            control={this.categoryForm}
            render={({ invalid }) => (
              <form onSubmit={this.handleSubmit}>
                <div>
                  <SelectInput name="sub" display="Rubriek" control={this.categoryForm.get('sub')} values={subcategoryList} multiple={false} emptyOptionText="Selecteer..." />

                  <button className="action primary" type="submit" disabled={invalid}>
                    <span className="value">Categorie wijzigen</span>
                  </button>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    );
  }
}

Add.propTypes = {
  id: PropTypes.string,
  subcategoryList: PropTypes.array,

  onRequestCategoryUpdate: PropTypes.func.isRequired
};

export default Add;
