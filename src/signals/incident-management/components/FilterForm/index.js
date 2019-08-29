import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row } from '@datapunt/asc-ui';
import isEqual from 'lodash.isequal';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import CheckboxList from '../CheckboxList';
import Label from '../Label';
import { parseInputFormData, parseOutputFormData } from './parse';
import {
  ButtonContainer,
  CancelButton,
  ControlsWrapper,
  Fieldset,
  FilterGroup,
  Form,
  FormFooter,
  ResetButton,
  SubmitButton,
} from './styled';

export const defaultSubmitBtnLabel = 'Filteren';
export const saveSubmitBtnLabel = 'Opslaan en filteren';

/**
 * Component that renders the incident filter form
 */
const FilterForm = ({
  filter,
  onCancel,
  onClearFilter,
  onSaveFilter,
  onSubmit,
  onUpdateFilter,
  ...dataLists
}) => {
  const {
    categories,
    priorityList: priority__priority,
    stadsdeelList: location__stadsdeel,
    statusList: status__state,
  } = dataLists;

  const parsedfilterData = parseInputFormData(filter, {
    location__stadsdeel,
    main_slug: categories.main,
    priority__priority,
    status__state,
    sub_slug: categories.sub,
  });

  const [submitBtnLabel, setSubmitBtnLabel] = useState(defaultSubmitBtnLabel);
  const [filterData, setFilterData] = useState(parsedfilterData);

  const filterSlugs = (filterData.main_slug || []).concat(
    filterData.sub_slug || [],
  );

  const onSubmitForm = (event) => {
    const formData = parseOutputFormData(event.target.form);
    const isNewFilter = !filterData.name;
    const valuesHaveChanged = !isEqual(formData, filterData);

    /* istanbul ignore else */
    if (typeof onSaveFilter === 'function' && isNewFilter) {
      onSaveFilter(formData);
    }

    /* istanbul ignore else */
    if (
      typeof onUpdateFilter === 'function' &&
      !isNewFilter &&
      valuesHaveChanged
    ) {
      if (formData.name.trim() === '') {
        event.preventDefault();
        global.window.alert('Filter naam mag niet leeg zijn');
        return;
      }
      onUpdateFilter(formData);
    }

    /* istanbul ignore else */
    if (typeof onSubmit === 'function') {
      onSubmit(event, formData);
    }
  };

  /**
   * Form reset handler
   *
   * Clears filterData state by setting values for controlled fields
   */
  const onResetForm = () => {
    setFilterData({
      name: '',
      incident_date_start: null,
      location__address_text: '',
    });

    /* istanbul ignore else */
    if (typeof onClearFilter === 'function') {
      onClearFilter();
    }
  };

  const onChangeForm = (event) => {
    const isNewFilter = !filterData.name;

    /* istanbul ignore else */
    if (isNewFilter) {
      return;
    }

    const formData = parseOutputFormData(event.currentTarget);
    const valuesHaveChanged = !isEqual(formData, filterData);
    const btnHasSaveLabel = submitBtnLabel === saveSubmitBtnLabel;

    /* istanbul ignore else */
    if (valuesHaveChanged) {
      if (!btnHasSaveLabel) {
        setSubmitBtnLabel(saveSubmitBtnLabel);
      }

      return;
    }

    /* istanbul ignore else */
    if (!btnHasSaveLabel) {
      return;
    }

    setSubmitBtnLabel(defaultSubmitBtnLabel);
  };

  const onNameChange = (event) => {
    const { value } = event.target;
    const nameHasChanged =
      typeof value === 'string' && value.trim() !== filterData.name;

    if (nameHasChanged) {
      setSubmitBtnLabel(saveSubmitBtnLabel);
    } else {
      setSubmitBtnLabel(defaultSubmitBtnLabel);
    }
  };

  return (
    <Form action="" novalidate onChange={onChangeForm}>
      <ControlsWrapper>
        <Fieldset>
          <legend className="hiddenvisually">Naam van het filter</legend>

          <Label htmlFor="filter_name">Filternaam</Label>
          <div className="invoer">
            <input
              defaultValue={filterData.name}
              id="filter_name"
              name="name"
              onChange={onNameChange}
              placeholder="Geef deze filterinstelling een naam om deze op te slaan"
              type="text"
            />
          </div>
        </Fieldset>

        <Fieldset>
          <legend>Filter parameters</legend>

          {Array.isArray(status__state) && status__state.length > 0 && (
            <FilterGroup data-testid="statusFilterGroup">
              <Label htmlFor={`status_${status__state[0].key}`}>Status</Label>
              <CheckboxList
                defaultValue={filterData.status__state}
                groupName="status__state"
                options={status__state}
              />
            </FilterGroup>
          )}

          {Array.isArray(location__stadsdeel) &&
            location__stadsdeel.length > 0 && (
              <FilterGroup data-testid="stadsdeelFilterGroup">
                <Label htmlFor={`status_${location__stadsdeel[0].key}`}>
                  Stadsdeel
                </Label>
                <CheckboxList
                  defaultValue={filterData.location__stadsdeel}
                  groupName="location__stadsdeel"
                  options={location__stadsdeel}
                />
              </FilterGroup>
            )}

          {Array.isArray(priority__priority) && priority__priority.length > 0 && (
            <FilterGroup data-testid="priorityFilterGroup">
              <Label htmlFor={`status_${priority__priority[0].key}`}>
                Urgentie
              </Label>
              <CheckboxList
                defaultValue={filterData.priority__priority}
                groupName="priority__priority"
                options={priority__priority}
              />
            </FilterGroup>
          )}

          <FilterGroup>
            <Label htmlFor="filter_date">Datum</Label>
            <div className="invoer">
              <DatePicker
                id="filter_date"
                /**
                 * Ignoring the internals of the `onChange` handler since they cannot be tested
                 * @see https://github.com/Hacker0x01/react-datepicker/issues/1578
                 */
                onChange={
                  /* istanbul ignore next */ (dateValue) => {
                    if (!dateValue) return;

                    const formattedDate = moment(dateValue).format(
                      'YYYY-MM-DD',
                    );

                    setFilterData({
                      ...filterData,
                      incident_date_start: formattedDate,
                    });
                  }
                }
                placeholderText="DD-MM-JJJJ"
                selected={
                  filterData.incident_date_start &&
                  moment(filterData.incident_date_start)
                }
              />

              {filterData.incident_date_start && (
                <input
                  defaultValue={moment(filterData.incident_date_start).format(
                    'YYYY-MM-DD',
                  )}
                  name="incident_date_start"
                  readOnly
                  type="hidden"
                />
              )}
            </div>
          </FilterGroup>

          <FilterGroup>
            <Label htmlFor="filter_address">Adres</Label>
            <div className="invoer">
              <input
                type="text"
                name="location__address_text"
                id="filter_address"
                defaultValue={filterData.location__address_text}
              />
            </div>
          </FilterGroup>
        </Fieldset>
      </ControlsWrapper>

      <ControlsWrapper>
        <Fieldset>
          <legend>Filter categorieën</legend>

          <Label as="span">Categorie</Label>

          {Object.keys(categories.mainToSub)
            .filter((key) => !!key) // remove elements without 'key' prop
            .sort()
            .map((mainCategory) => (
              <CheckboxList
                clusterName="sub_slug"
                defaultValue={filterSlugs}
                groupName={mainCategory}
                hasToggle
                key={mainCategory}
                options={categories.mainToSub[mainCategory]}
                title={
                  categories.main.find(({ slug }) => slug === mainCategory)
                    .value
                }
                toggleFieldName="main_slug"
              />
            ))}
        </Fieldset>
      </ControlsWrapper>

      <FormFooter>
        <Row>
          <ButtonContainer span={12}>
            <ResetButton
              data-testid="resetBtn"
              onClick={onResetForm}
              type="reset"
            >
              Reset filter
            </ResetButton>

            <CancelButton
              data-testid="cancelBtn"
              onClick={onCancel}
              type="button"
            >
              Annuleren
            </CancelButton>

            <SubmitButton
              name="submit_button"
              onClick={onSubmitForm}
              type="submit"
            >
              {submitBtnLabel}
            </SubmitButton>
          </ButtonContainer>
        </Row>
      </FormFooter>
    </Form>
  );
};

FilterForm.defaultProps = {
  filter: {
    name: '',
  },
};

FilterForm.propTypes = {
  categories: PropTypes.shape({
    mainToSub: PropTypes.shape({
      [PropTypes.string]: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }),
      ),
    }),
    main: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ),
    sub: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
  filter: PropTypes.shape({
    incident_date_start: PropTypes.string,
    location__address_text: PropTypes.string,
    location__stadsdeel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    main_slug: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    name: PropTypes.string,
    priority__priority: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    status__state: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    sub_slug: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
  }),
  /** Callback handler for when filter settings should not be applied */
  onCancel: PropTypes.func,
  /** Callback handler to reset filter */
  onClearFilter: PropTypes.func,
  /** Callback handler for new filter settings */
  onSaveFilter: PropTypes.func,
  /**
   * Callback handler called whenever form is submitted
   * @param {Event} event
   * @param {FormData} formData
   */
  onSubmit: PropTypes.func.isRequired,
  /** Callback handler for handling filter settings updates */
  onUpdateFilter: PropTypes.func,
  priorityList: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  stadsdeelList: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  statusList: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
};

export default FilterForm;
