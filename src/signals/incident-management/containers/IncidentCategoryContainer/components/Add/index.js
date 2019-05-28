import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import SelectInput from '../../../../components/SelectInput';
import './style.scss';


class Add extends React.Component { // eslint-disable-line react/prefer-stateless-function
  categoryForm = FormBuilder.group({ // eslint-disable-line react/sort-comp
    id: [''],
    sub_category: ['', Validators.required],
    loading: false
  });

  handleSubmit = (event) => {
    event.preventDefault();
    const patch = {
      id: this.props.id,
      patch: {
        category: {
          sub_category: this.categoryForm.value.sub_category
        },
        status: {
          state: 'm'
        }
      }
    };
    this.props.onRequestCategoryUpdate(patch);
  }

  componentWillUpdate(props) {
    if (props.loading !== this.props.loading) {
      this.categoryForm.controls.loading.setValue(props.loading);
    }
  }

  render() {
    const { subcategoryList, status, loading } = this.props;
    const canChangeCategory = ['m', 'i', 'b', 'ingepland', 'send failed', 'closure requested'].includes(status.state);
    return (
      <div className="incident-category-add">
        <div className="incident-category-add__body">
          <FieldGroup
            control={this.categoryForm}
            render={({ invalid }) => (
              <form onSubmit={this.handleSubmit}>
                <div>
                  <FieldControlWrapper
                    render={SelectInput}
                    name="sub_category"
                    display="Subcategorie"
                    control={this.categoryForm.get('sub_category')}
                    values={subcategoryList}
                    sort
                    multiple={false}
                    emptyOptionText="Selecteer..."
                  />

                  <button className="action primary" type="submit" disabled={invalid || loading || !canChangeCategory}>
                    <span className="value">Subcategorie wijzigen</span>
                    {loading ?
                      <span className="working">
                        <div className="progress-indicator progress-white"></div>
                      </span>
                    : ''}
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

Add.defaultProps = {
  loading: false
};

Add.propTypes = {
  id: PropTypes.string,
  subcategoryList: PropTypes.array,
  status: PropTypes.object,
  loading: PropTypes.bool,

  onRequestCategoryUpdate: PropTypes.func.isRequired
};

export default Add;
