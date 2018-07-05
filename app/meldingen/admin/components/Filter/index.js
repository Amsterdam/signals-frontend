import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import './style.scss';
import { TextInput } from '../TextInput';
import { SelectInput } from '../SelectInput';

class Filter extends React.Component {
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
    incident_date_start: [''],
    location__stadsdeel: [''],
    category__sub: [''],
    status__state: [''],
    location__address_text: [''],
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
    const { statusList } = this.props;
    return (
      <div className="filter-component">
        <FieldGroup
          control={this.filterForm}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit}>
              <div>
                <TextInput name="id" display="Id" control={this.filterForm.get('id')} />
                <TextInput name="incident_date_start" display="Datum" control={this.filterForm.get('incident_date_start')} />
                <TextInput name="location__stadsdeel" display="Staadsdeel" control={this.filterForm.get('location__stadsdeel')} />
                <TextInput name="category__sub" display="Rubriek" control={this.filterForm.get('category__sub')} />
                <SelectInput name="status__state" display="Status" control={this.filterForm.get('status__state')} values={statusList} />
                <TextInput name="location__address_text" display="Adres" control={this.filterForm.get('location__address_text')} />

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

Filter.propTypes = {
  statusList: PropTypes.array,
  filter: PropTypes.object,
  filterIncidents: PropTypes.func.isRequired
};

export default Filter;
