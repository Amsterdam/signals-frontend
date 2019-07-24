import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';
import isEqual from 'lodash.isequal';
import styled from 'styled-components';

import FieldControlWrapper from '../FieldControlWrapper';
import TextInput from '../TextInput';
import SelectInput from '../SelectInput';
import DatePickerInput from '../DatePickerInput';

const FilterForm = styled.form`
  column-count: 2;
  column-gap: 100px;
  width: 100%;
  column-rule: 1px dotted #ddd;
  column-fill: auto

  @media (max-width: 1020px) {
    column-gap: 60px;
  }

  @media (max-width: 600px) {
    column-count: 1;
  }
`;

class Filter extends React.Component {
  constructor(props) {
    super(props);

    if (props.filter) {
      this.filterForm.setValue(props.filter);
    }
  }

  componentDidMount() {
    this.filterForm.get('main_slug').valueChanges.subscribe((value) => {
      this.filterForm.get('sub_slug').setValue(this.default.sub_slug);

      this.props.onMainCategoryFilterSelectionChanged({
        selectedOptions: value,
        categories: this.props.categories,
      });
    });

    this.props.onMainCategoryFilterSelectionChanged({
      selectedOptions:
        (this.props.filter && this.props.filter.main_slug) ||
        this.default.main_slug,
      categories: this.props.categories,
    });
  }

  componentDidUpdate() {
    this.filterForm.updateValueAndValidity();
  }

  componentWillUnmount() {
    this.filterForm.get('main_slug').valueChanges.unsubscribe();
  }

  onFilter = (filter) => {
    const newFilter = { ...filter };
    if (isEqual(newFilter.main_slug, this.default.main_slug)) {
      newFilter.main_slug = null;
    }
    if (isEqual(newFilter.sub_slug, this.default.sub_slug)) {
      newFilter.sub_slug = null;
    }
    this.props.onRequestIncidents({ filter: newFilter });
  };

  default = {
    id: [''],
    incident_date_start: [''],
    location__stadsdeel: [['']],
    priority__priority: '',
    main_slug: [['']],
    sub_slug: [['']],
    status__state: [['']],
    location__address_text: [''],
  };
  filterForm = FormBuilder.group(this.default);

  handleReset = () => {
    this.filterForm.reset();
    this.onFilter(this.filterForm.value);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.onFilter(this.filterForm.value);
  };

  render() {
    const {
      categories,
      filterSubCategoryList,
      statusList,
      stadsdeelList,
      priorityList,
    } = this.props;
    return (
      <FieldGroup
        control={this.filterForm}
        render={({ invalid }) => (
          <FilterForm onSubmit={this.handleSubmit}>
            <Fragment>
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
                name="main_slug"
                display="Hoofdcategorie"
                control={this.filterForm.get('main_slug')}
                values={categories.main}
                emptyOptionText="Alles"
                multiple
                useSlug
                size={10}
              />
              <FieldControlWrapper
                render={SelectInput}
                name="sub_slug"
                display="Subcategorie"
                control={this.filterForm.get('sub_slug')}
                values={filterSubCategoryList}
                emptyOptionText="Alles"
                multiple
                useSlug
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

              <button
                className="action tertiair"
                onClick={this.handleReset}
                type="button"
              >
                <span className="value">Reset filter</span>
              </button>

              <button
                className="action primary"
                type="submit"
                disabled={invalid}
              >
                <span className="value">Zoek</span>
              </button>
            </Fragment>
          </FilterForm>
        )}
      />
    );
  }
}

Filter.defaulProps = {
  categories: {
    main: [],
    sub: [],
    mainToSub: {},
  },
  filterSubCategoryList: [],
  filterSubs: [],
};

Filter.propTypes = {
  categories: PropTypes.object,
  filter: PropTypes.object,
  filterSubCategoryList: PropTypes.array,
  onMainCategoryFilterSelectionChanged: PropTypes.func.isRequired,
  onRequestIncidents: PropTypes.func.isRequired,
  priorityList: PropTypes.array,
  stadsdeelList: PropTypes.array,
  statusList: PropTypes.array,
};

export default Filter;
