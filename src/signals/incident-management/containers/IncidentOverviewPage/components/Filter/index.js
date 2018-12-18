import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';
import { isEqual, sortBy } from 'lodash';

import './style.scss';
import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import TextInput from '../../../../components/TextInput';
import SelectInput from '../../../../components/SelectInput';
import DatePickerInput from '../../../../components/DatePickerInput';

class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterSubs: (props.categories && props.categories.sub) || props.filterSubs
    };

    this.filterSubcategories = this.filterSubcategories.bind(this);

    if (props.filter) {
      this.filterForm.setValue(props.filter);
    }
  }

  componentDidMount() {
    this.filterForm.get('main_slug').valueChanges.subscribe((value) => {
      if (value && value.length === 0) {
        this.filterForm.get('main_slug').setValue(this.default.main_slug);
      }

      this.setState({
        filterSubs: [...this.filterSubcategories(value)]
      });

      this.filterForm.get('sub_slug').setValue(this.default.sub_slug);
    });
  }

  componentDidUpdate(props) {
    if (!isEqual(props.categories, this.props.categories)) {
      this.filterForm.get('main_slug').setValue((props.filter && props.filter.main_slug) || this.default.main_slug);
      this.filterForm.get('sub_slug').setValue((props.filter && props.filter.sub_slug) || this.default.sub_slug);
    }
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
  }

  filterSubcategories(mainCategoryFilterSelection) {
    if (!mainCategoryFilterSelection || mainCategoryFilterSelection === undefined || isEqual(mainCategoryFilterSelection, this.default.sub_slug)) {
      return this.props.categories.sub;
    }
    if (mainCategoryFilterSelection.length > 1 && mainCategoryFilterSelection.indexOf('') > -1) {
      // Do not select 'Alles' and other categories to prevent duplicates
      mainCategoryFilterSelection.splice(mainCategoryFilterSelection.indexOf(''), 1);
    }

    let filteredSubcategoryList = mainCategoryFilterSelection
      .flatMap((mainCategory) =>
        this.props.categories.mainToSub[mainCategory].flatMap((sub) => this.props.categories.sub.find((item) => item.slug === sub)));
    filteredSubcategoryList = [{ key: '', value: 'Alles', slug: '' }].concat(sortBy(filteredSubcategoryList, 'value'));
    return filteredSubcategoryList;
  }

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
                    values={this.state.filterSubs}
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
    sub: [],
    mainToSub: {}
  },
  filterSubs: []
};

Filter.propTypes = {
  filterSubs: PropTypes.array,
  stadsdeelList: PropTypes.array,
  categories: PropTypes.object,
  priorityList: PropTypes.array,
  statusList: PropTypes.array,
  filter: PropTypes.object,
  onRequestIncidents: PropTypes.func.isRequired
};

export default Filter;
