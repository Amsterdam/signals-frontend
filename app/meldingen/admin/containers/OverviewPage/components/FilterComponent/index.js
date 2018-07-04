/**
*
* FilterComponent
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import './style.scss';
import { TextInput } from './components/TextInput';

class FilterComponent extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    if (this.props.filter) {
      this.filterForm.setValue(props.filter);
    }
  }

  onFilter = (filter) => {
    this.props.filterIncidents(filter);
  }

  filterForm = FormBuilder.group({
    id: [''],
    date: [''],
    time: [''],
    stadsdeel: [''],
    subcategory: [''],
    status: [''],
    adres: [''],
  });

  handleReset = () => {
    this.filterForm.reset();
    this.onFilter(this.filterForm.value);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.onFilter(this.filterForm.value);
  }

  render() {
    return (
      <div className="filter-component">
        <FieldGroup
          control={this.filterForm}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit}>
              <div>
                <TextInput name="id" display="Id" control={this.filterForm.get('id')} />
                <TextInput name="date" display="Datum" control={this.filterForm.get('date')} />
                <TextInput name="time" display="TIjd" control={this.filterForm.get('time')} />
                <TextInput name="stadsdeel" display="Staadsdeel" control={this.filterForm.get('stadsdeel')} />
                <TextInput name="subcategory" display="Rubriek" control={this.filterForm.get('subcategory')} />
                <TextInput name="status" display="Status" control={this.filterForm.get('status')} />
                <TextInput name="adres" display="Adres" control={this.filterForm.get('adres')} />

                <button className="action" onClick={this.handleReset} type="button">
                  <span className="value">Reset filter</span>
                </button>
                <button className="action primary" type="submit" disabled={invalid}>
                  <span className="value">Zoek</span>
                </button>
              </div>
            </form>
          )}
        />
      </div>
    );
  }
}

FilterComponent.propTypes = {
  filter: PropTypes.object,
  filterIncidents: PropTypes.func.isRequired
};

export default FilterComponent;
