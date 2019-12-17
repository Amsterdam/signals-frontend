import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Row, Input } from '@datapunt/asc-ui';
import isEqual from 'lodash.isequal';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { parseOutputFormData } from 'signals/shared/filter/parse';
import * as types from 'shared/types';
import RefreshIcon from '../../../../shared/images/icon-refresh.svg';

import CheckboxList from '../CheckboxList';
import RadioButtonList from '../RadioButtonList';
import CalendarInput from '../CalendarInput';
import Label from '../Label';
import {
  ButtonContainer,
  CancelButton,
  ControlsWrapper,
  DatesWrapper,
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
  dataLists,
  categories,
}) => {
  const { feedback, priority, stadsdeel, status, source } = dataLists;
  const [submitBtnLabel, setSubmitBtnLabel] = useState(defaultSubmitBtnLabel);
  const [filterData, setFilterData] = useState(filter);
  const filterSlugs = useMemo(
    () =>
      (filterData.options.maincategory_slug || []).concat(
        filterData.options.category_slug || []
      ),
    [filterData.options.maincategory_slug, filterData.options.category_slug]
  );

  const onSubmitForm = useCallback(
    event => {
      const formData = parseOutputFormData(event.target.form);
      const isNewFilter = !filterData.name;
      const hasName = formData.name.trim() !== '';
      const valuesHaveChanged = !isEqual(formData, filterData);

      /* istanbul ignore else */
      if (typeof onSaveFilter === 'function' && isNewFilter && hasName) {
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
    },
    [filterData, onSaveFilter, onSubmit, onUpdateFilter]
  );

  /**
   * Form reset handler
   *
   * Clears filterData state by setting values for controlled fields
   */
  const onResetForm = useCallback(() => {
    setFilterData({
      name: '',
      refresh: false,
      options: {},
    });

    /* istanbul ignore else */
    if (typeof onClearFilter === 'function') {
      onClearFilter();
    }
  }, [onClearFilter]);

  const onChangeForm = useCallback(
    event => {
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
    },
    [filterData, submitBtnLabel]
  );

  const onNameChange = useCallback(
    event => {
      const { value } = event.target;
      const nameHasChanged =
        typeof value === 'string' && value.trim() !== filterData.name;

      if (nameHasChanged) {
        setSubmitBtnLabel(saveSubmitBtnLabel);
      } else {
        setSubmitBtnLabel(defaultSubmitBtnLabel);
      }
    },
    [filterData.name]
  );

  const onRefreshChange = useCallback(
    event => {
      event.persist();
      const {
        currentTarget: { checked },
      } = event;

      setFilterData({
        ...filterData,
        refresh: checked,
      });
    },
    [filterData]
  );

  const updateFilterDate = (prop, dateValue) => {
    const formattedDate = dateValue
      ? moment(dateValue).format('YYYY-MM-DD')
      : '';

    setFilterData(state => {
      const updatedFilterData = { ...state };
      updatedFilterData.options[prop] = formattedDate;

      return updatedFilterData;
    });
  };

  const dateFrom =
    filterData.options &&
    filterData.options.incident_date_after &&
    moment(filterData.options.incident_date_after);

  const dateBefore =
    filterData.options &&
    filterData.options.incident_date_before &&
    moment(filterData.options.incident_date_before);

  return (
    <Form action="" novalidate onChange={onChangeForm}>
      <ControlsWrapper>
        {filterData.id && (
          <input type="hidden" name="id" value={filterData.id} />
        )}
        <Fieldset isSection>
          <legend className="hiddenvisually">Naam van het filter</legend>

          <Label htmlFor="filter_name" isGroupHeader>
            Filternaam
          </Label>
          <Input
            defaultValue={filterData.name}
            id="filter_name"
            name="name"
            onChange={onNameChange}
            placeholder="Geef deze filterinstelling een naam om deze op te slaan"
            type="text"
          />
          <div className="invoer" />

          <Label htmlFor="filter_refresh" isGroupHeader>
            Automatisch verversen
          </Label>
          <div className="antwoord">
            <input
              id="filter_refresh"
              name="refresh"
              onClick={onRefreshChange}
              defaultChecked={filterData.refresh}
              type="checkbox"
            />
            <label htmlFor="filter_refresh">
              <RefreshIcon width={16} height={18} /> Automatisch verversen
            </label>
          </div>
        </Fieldset>

        <Fieldset>
          <legend>Filter parameters</legend>

          {Array.isArray(status) && status.length > 0 && (
            <FilterGroup data-testid="statusFilterGroup">
              <Label htmlFor={`status_${status[0].key}`} isGroupHeader>
                Status
              </Label>
              <CheckboxList
                defaultValue={filterData.options && filterData.options.status}
                groupName="status"
                groupId="status"
                options={status}
              />
            </FilterGroup>
          )}

          {Array.isArray(stadsdeel) && stadsdeel.length > 0 && (
            <FilterGroup data-testid="stadsdeelFilterGroup">
              <Label htmlFor={`status_${stadsdeel[0].key}`} isGroupHeader>
                Stadsdeel
              </Label>
              <CheckboxList
                defaultValue={
                  filterData.options && filterData.options.stadsdeel
                }
                groupName="stadsdeel"
                groupId="stadsdeel"
                options={stadsdeel}
              />
            </FilterGroup>
          )}

          {Array.isArray(priority) && priority.length > 0 && (
            <FilterGroup data-testid="priorityFilterGroup">
              <Label htmlFor={`status_${priority[0].key}`} isGroupHeader>
                Urgentie
              </Label>
              <RadioButtonList
                defaultValue={filterData.options && filterData.options.priority}
                groupName="priority"
                options={priority}
              />
            </FilterGroup>
          )}

          {Array.isArray(feedback) && feedback.length > 0 && (
            <FilterGroup data-testid="feedbackFilterGroup">
              <Label htmlFor={`feedback_${feedback[0].key}`} isGroupHeader>
                Feedback
              </Label>
              <RadioButtonList
                defaultValue={filterData.options && filterData.options.feedback}
                groupName="feedback"
                options={feedback}
              />
            </FilterGroup>
          )}

          <FilterGroup>
            <Label as="span" isGroupHeader>
              Datum
            </Label>

            <DatesWrapper>
              <CalendarInput
                id="filter_incident_date_after"
                onChange={dateValue => {
                  // const oneDayBefore = moment(dateValue).subtract(1, 'days').format('YYYY-MM-DD');
                  updateFilterDate('incident_date_after', dateValue);
                }}
                selectedDate={dateFrom}
                defaultValue={dateFrom && dateFrom.format('YYYY-MM-DD')}
                label="Na"
                name="incident_date_after"
              />

              <CalendarInput
                id="filter_incident_date_before"
                onChange={dateValue => {
                  // const oneDayAfter = moment(dateValue).add(1, 'days').format('YYYY-MM-DD');
                  updateFilterDate('incident_date_before', dateValue);
                }}
                selectedDate={dateBefore}
                defaultValue={dateBefore && dateBefore.format('YYYY-MM-DD')}
                label="Tot"
                name="incident_date_before"
              />
            </DatesWrapper>
          </FilterGroup>

          <FilterGroup>
            <Label htmlFor="filter_address" isGroupHeader>
              Adres
            </Label>
            <div className="invoer">
              <input
                type="text"
                name="address_text"
                id="filter_address"
                defaultValue={filterData.options.address_text || ''}
              />
            </div>
          </FilterGroup>

          {Array.isArray(source) && source.length > 0 && (
            <FilterGroup data-testid="sourceFilterGroup">
              <Label htmlFor={`source_${source[0].key}`} isGroupHeader>
                Bron
              </Label>
              <CheckboxList
                defaultValue={filterData.options && filterData.options.source}
                groupName="source"
                groupId="source"
                options={source}
              />
            </FilterGroup>
          )}
        </Fieldset>
      </ControlsWrapper>

      <ControlsWrapper>
        <Fieldset>
          <legend>Filter categorieën</legend>

          <Label $as="span" htmlFor="not_used" isGroupHeader>
            Categorie
          </Label>

          {Object.keys(categories.mainToSub)
            .filter(key => !!key) // remove elements without 'key' prop
            .sort()
            .map(mainCategory => {
              const mainCatObj = categories.main.find(
                ({ slug }) => slug === mainCategory
              );
              const options = categories.mainToSub[mainCategory];

              return (
                <CheckboxList
                  clusterName="category_slug"
                  defaultValue={filterSlugs}
                  groupName={mainCategory}
                  groupId={mainCatObj.key}
                  hasToggle
                  key={mainCategory}
                  options={options}
                  title={mainCatObj.value}
                  toggleFieldName="maincategory_slug"
                />
              );
            })}
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
              Nieuw filter
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
    options: {},
  },
};

FilterForm.propTypes = {
  filter: types.filterType,
  categories: types.categoriesType.isRequired,
  dataLists: types.dataListsType.isRequired,
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
};

export default FilterForm;
