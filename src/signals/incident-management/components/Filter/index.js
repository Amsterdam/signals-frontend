import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';
import isEqual from 'lodash.isequal';
import styled from 'styled-components';
import { Button, Row, Column } from '@datapunt/asc-ui';

import FieldControlWrapper from '../FieldControlWrapper';
import TextInput from '../TextInput';
import SelectInput from '../SelectInput';
import DatePickerInput from '../DatePickerInput';
import CheckboxInput from '../CheckboxInput';

const FilterForm = styled.form`
  column-count: 2;
  column-gap: 100px;
  width: 100%;
  column-rule: 1px dotted #ddd;
  column-fill: auto @media (max-width: 1020px) {
    column-gap: 60px;
  }

  @media (max-width: 600px) {
    column-count: 1;
  }
`;

const FormFooter = styled.footer`
  border-top: 2px solid #e6e6e6;
  background: white;
  height: 66px;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
`;

const ButtonContainer = styled(Column)`
  justify-content: flex-start;
`;

const ResetButton = styled(Button)`
  margin-right: auto;
`;

const CancelButton = styled(Button).attrs({
  color: 'bright',
})`
  margin-right: 10px;
  background-color: #b4b4b4;
`;

const ControlsWrapper = styled.div`
  break-inside: avoid;
`;

export const defaults = {
  incident_date_start: '',
  location__address_text: '',
  location__stadsdeel: [[]],
  main_slug: [[]],
  name: '',
  priority__priority: '',
  status__state: [[]],
  sub_slug: [[]],
};

class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.filterForm = FormBuilder.group(defaults);

    if (props.filter) {
      this.filterForm.setValue(props.filter);
    }

    this.state = {
      submitBtnLabel: 'Filteren',
    };

    this.onFilter = this.onFilter.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSetName = this.onSetName.bind(this);
    this.onResetName = this.onResetName.bind(this);
  }

  componentDidMount() {
    const { filterForm } = this;
    const { filter = {} } = this.props;

    const filterName = filterForm.get('name').value;

    filterForm.get('main_slug').valueChanges.subscribe((value) => {
      this.dispatchMainCategoryFilterChange(value);
    });

    // listen for changes when editing an already saved filter
    filterForm.valueChanges.subscribe((values) => {
      const { activeFilter = {} } = this.props;
      const isNewFilter = !activeFilter.name;

      if (isNewFilter) {
        return;
      }

      const valuesHaveChanged = !isEqual(values, activeFilter);
      const btnHasSaveLabel = this.state.submitBtnLabel !== 'Filteren';

      if (valuesHaveChanged) {
        if (btnHasSaveLabel) {
          return;
        }

        this.onSetName();
        return;
      }

      if (!btnHasSaveLabel) {
        return;
      }

      this.onResetName();
    });

    // listen for changes in the 'name' field for new filters
    filterForm.get('name').valueChanges.subscribe((value) => {
      const { activeFilter = {} } = this.props;
      const isNewFilter = !activeFilter.name;
      const nameHasChanged = !!value && value.trim() !== filterName;

      if (!isNewFilter) {
        return;
      }

      if (nameHasChanged) {
        this.onSetName();
        return;
      }

      this.onResetName();
    });

    this.dispatchMainCategoryFilterChange(filter.main_slug);
  }

  componentDidUpdate() {
    this.filterForm.updateValueAndValidity();
  }

  componentWillUnmount() {
    this.filterForm.get('main_slug').valueChanges.unsubscribe();
    this.filterForm.get('name').valueChanges.unsubscribe();
    this.filterForm.valueChanges.unsubscribe();
  }

  onSetName() {
    this.setState({ submitBtnLabel: 'Opslaan en filteren' });
  }

  onResetName() {
    this.setState({ submitBtnLabel: 'Filteren' });
  }

  onFilter = (filter) => {
    const newFilter = { ...filter };

    if (isEqual(newFilter.main_slug, defaults.main_slug)) {
      delete newFilter.main_slug;
    }

    if (isEqual(newFilter.sub_slug, defaults.sub_slug)) {
      delete newFilter.sub_slug;
    }

    this.props.onRequestIncidents({ filter: newFilter });
  };

  dispatchMainCategoryFilterChange(mainSlugValues) {
    const { categories, onMainCategoryFilterSelectionChanged } = this.props;

    const selectedOptions =
      (mainSlugValues && mainSlugValues.filter(Boolean)) || undefined;
    const numOptions = (selectedOptions && selectedOptions.length) || 0;

    onMainCategoryFilterSelectionChanged({
      selectedOptions: numOptions > 0 ? selectedOptions : undefined,
      categories,
    });
  }

  handleReset() {
    this.filterForm.reset(defaults, { emitEvent: false });
  }

  handleSubmit(event) {
    const { onApplyFilters, onSubmit } = this.props;

    event.preventDefault();

    this.onFilter(this.filterForm.value);

    debugger;
    if (typeof onApplyFilters === 'function') {
      onApplyFilters(this.filterForm.value);
    }

    if (typeof onSubmit === 'function') {
      onSubmit(event);
    }
  }

  render() {
    const {
      categories,
      filterSubCategoryList,
      onCancel,
      priorityList,
      stadsdeelList,
      statusList,
    } = this.props;

    const { submitBtnLabel } = this.state;

    return (
      <FieldGroup
        control={this.filterForm}
        render={({ invalid }) => (
          <FilterForm onSubmit={this.handleSubmit}>
            <ControlsWrapper>
              <FieldControlWrapper
                render={TextInput}
                name="name"
                display="Filternaam"
                control={this.filterForm.get('name')}
                caption="Geef de filterinstelling een naam op deze op te slaan"
              />
              <FieldControlWrapper
                render={CheckboxInput}
                name="status__state"
                display="Status"
                control={this.filterForm.get('status__state')}
                values={statusList}
              />
              <FieldControlWrapper
                render={CheckboxInput}
                name="location__stadsdeel"
                display="Stadsdeel"
                control={this.filterForm.get('location__stadsdeel')}
                values={stadsdeelList}
              />
              <FieldControlWrapper
                render={CheckboxInput}
                name="priority__priority"
                display="Urgentie"
                control={this.filterForm.get('priority__priority')}
                values={priorityList}
              />
              <FieldControlWrapper
                render={DatePickerInput}
                name="incident_date_start"
                display="Datum"
                control={this.filterForm.get('incident_date_start')}
                placeholder={'JJJJ-MM-DD'}
              />
              <FieldControlWrapper
                render={TextInput}
                name="location__address_text"
                display="Adres"
                control={this.filterForm.get('location__address_text')}
              />
            </ControlsWrapper>

            <ControlsWrapper>
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
            </ControlsWrapper>

            <FormFooter>
              <Row>
                <ButtonContainer span={12}>
                  <ResetButton onClick={this.handleReset} type="reset">
                    Reset filter
                  </ResetButton>

                  <CancelButton
                    data-testid="cancelBtn"
                    type="button"
                    onClick={onCancel}
                  >
                    Annuleren
                  </CancelButton>

                  <Button
                    data-testid="submitBtn"
                    type="submit"
                    color="secondary"
                    disabled={invalid}
                    name="submit_button"
                  >
                    {submitBtnLabel}
                  </Button>
                </ButtonContainer>
              </Row>
            </FormFooter>
          </FilterForm>
        )}
      />
    );
  }
}

Filter.defaultProps = {
  activeFilter: undefined,
  categories: {
    main: [],
    sub: [],
    mainToSub: {},
  },
  filterSubCategoryList: [],
  filterSubs: [],
  onApplyFilters: () => {},
  onCancel: null,
  onSubmit: () => {},
};

Filter.propTypes = {
  activeFilter: PropTypes.shape({
    name: PropTypes.string,
  }),
  categories: PropTypes.shape({
    main: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ),
    sub: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        value: PropTypes.string,
      }),
    ),
  }),
  filter: PropTypes.shape({
    main_slug: PropTypes.arrayOf(PropTypes.string),
    sub_slug: PropTypes.arrayOf(PropTypes.string),
  }),
  filterSubCategoryList: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }),
  ),
  /**
   * Callback handler that is executed on form submission after the form changes are applied to the form.
   * Will receive an array of form field values
   *
   * @param {Object} values
   * @param {String} values.incident_date_start
   * @param {String} values.location__address_text
   * @param {String[]} values.location__stadsdeel
   * @param {String[]} values.main_slug
   * @param {String} values.name
   * @param {String} values.priority__priority
   * @param {String[]} values.status__state
   * @param {String[]} values.sub_slug
   */
  onApplyFilters: PropTypes.func,
  onCancel: PropTypes.func,
  onMainCategoryFilterSelectionChanged: PropTypes.func.isRequired,
  onRequestIncidents: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  priorityList: PropTypes.array,
  stadsdeelList: PropTypes.array,
  statusList: PropTypes.array,
};

export default Filter;
