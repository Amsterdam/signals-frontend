import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import './style.scss';
import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import TextInput from '../../../../components/TextInput';
import SelectInput from '../../../../components/SelectInput';
import DatePickerInput from '../../../../components/DatePickerInput';

class Filter extends React.Component {
  constructor(props) {
    super(props);

    if (props.filter) {
      this.filterForm.setValue(props.filter);
    }
  }

  componentWillMount() {
    this.filterForm.get('category__main').valueChanges.subscribe((value) => {
      this.props.onMainCategoryFilterSelectionChanged(value);
      this.filterForm.get('category__sub').reset(['']);
      this.filterForm.get('category__sub').updateValueAndValidity();
    });
  }

  onFilter = (filter) => {
    this.props.onRequestIncidents({ filter });
  }

  filterForm = FormBuilder.group({
    id: [''],
    incident_date_start: [''],
    location__stadsdeel: [['']],
    priority__priority: '',
    category__main: [['']],
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
    const { categories, statusList, stadsdeelList, priorityList } = this.props;
    return (
      <div className="filter-component">
        <div className="filter-component__title">Filters</div>
        <div className="filter-component__body">
          <FieldGroup
            control={this.filterForm}
            render={({ invalid }) => (
              <form onSubmit={this.handleSubmit}>
                <div>
                  <FieldControlWrapper
                    render={TextInput}
                    name="id"
                    display="Id"
                    control={this.filterForm.get('id')}
                  />
                  <FieldControlWrapper
                    render={DatePickerInput}
                    name="incident_date_start"
                    display="Datum"
                    control={this.filterForm.get('incident_date_start')}
                    placeholder={'JJJJ-MM-DD'}
                  />
                  <FieldControlWrapper
                    render={SelectInput}
                    name="priority__priority"
                    display="Urgentie"
                    control={this.filterForm.get('priority__priority')}
                    values={priorityList}
                    emptyOptionText="Alles"
                  />
                  <FieldControlWrapper
                    render={SelectInput}
                    name="location__stadsdeel"
                    display="Stadsdeel"
                    control={this.filterForm.get('location__stadsdeel')}
                    values={stadsdeelList}
                    emptyOptionText="Alle stadsdelen"
                    multiple
                  />
                  <FieldControlWrapper
                    render={SelectInput}
                    name="category__main"
                    display="Hoofdcategorie"
                    control={this.filterForm.get('category__main')}
                    values={categories.main}
                    emptyOptionText="Alles"
                    multiple
                    size={10}
                  />
                  <FieldControlWrapper
                    render={SelectInput}
                    name="category__sub"
                    display="Subcategorie"
                    control={this.filterForm.get('category__sub')}
                    values={categories.sub}
                    emptyOptionText="Alles"
                    multiple
                    size={10}
                  />
                  <FieldControlWrapper
                    render={SelectInput}
                    name="status__state"
                    display="Status"
                    control={this.filterForm.get('status__state')}
                    values={statusList}
                    emptyOptionText="Alle statussen"
                    multiple
                  />
                  <FieldControlWrapper
                    render={TextInput}
                    name="location__address_text"
                    display="Adres"
                    control={this.filterForm.get('location__address_text')}
                  />

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

Filter.defaulProps = {
  categories: {
    main: [],
    sub: []
  }
};

Filter.propTypes = {
  stadsdeelList: PropTypes.array,
  categories: PropTypes.object,
  priorityList: PropTypes.array,
  statusList: PropTypes.array,
  filter: PropTypes.object,
  onRequestIncidents: PropTypes.func.isRequired,
  // onMainCategoryFilterSelectionChanged: PropTypes.func.isRequired
};

export default Filter;
