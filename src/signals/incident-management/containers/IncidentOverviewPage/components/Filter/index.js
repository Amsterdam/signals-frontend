import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import './style.scss';
import { TextInput } from '../../../../components/TextInput';
import { SelectInput } from '../../../../components/SelectInput';
// import { DatePickerInput } from '../../../../components/DatePickerInput';

class Filter extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.filter) {
      this.filterForm.setValue(props.filter);
    }
  }

  onFilter = (filter) => {
    this.props.filterIncidents({ filter });
  }

  filterForm = FormBuilder.group({
    id: [''],
    incident_date_start: [''],
    location__stadsdeel: [['']],
    category__sub: [['']],
    status__state: [['']],
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
    const { subcategoryList, statusList, stadsdeelList } = this.props;
    return (
      <div className="filter-component">
        <div className="filter-component__title">Filters</div>
        <div className="filter-component__body">
          <FieldGroup
            control={this.filterForm}
            render={({ invalid }) => (
              <form onSubmit={this.handleSubmit}>
                <div>
                  <TextInput name="id" display="Id" control={this.filterForm.get('id')} />
                  <TextInput name="incident_date_start" display="Datum" control={this.filterForm.get('incident_date_start')} placeholder={'JJJJ-MM-DD'} />
                  {/* <DatePickerInput name="incident_date_start" display="Datum" control={this.filterForm.get('incident_date_start')} placeholder={'JJJJ-MM-DD'} /> */}
                  <SelectInput name="location__stadsdeel" display="Stadsdeel" control={this.filterForm.get('location__stadsdeel')} values={stadsdeelList} multiple />
                  <SelectInput name="category__sub" display="Rubriek" control={this.filterForm.get('category__sub')} values={subcategoryList} multiple size={10} />
                  <SelectInput name="status__state" display="Status" control={this.filterForm.get('status__state')} values={statusList} multiple />
                  <TextInput name="location__address_text" display="Adres" control={this.filterForm.get('location__address_text')} />

                  <button className="action tertiair" onClick={this.handleReset} type="button">
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
      </div>
    );
  }
}

Filter.propTypes = {
  stadsdeelList: PropTypes.array,
  subcategoryList: PropTypes.array,
  statusList: PropTypes.array,
  filter: PropTypes.object,
  filterIncidents: PropTypes.func.isRequired
};

export default Filter;
