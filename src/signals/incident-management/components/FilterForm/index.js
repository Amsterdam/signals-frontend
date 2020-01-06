import React, { useState, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseOutputFormData } from 'signals/shared/filter/parse';
import * as types from 'shared/types';
import FormFooter from 'components/FormFooter';
import Label from 'components/Label';
import RefreshIcon from '../../../../shared/images/icon-refresh.svg';

import CheckboxList from '../CheckboxList';
import RadioButtonList from '../RadioButtonList';
import { ControlsWrapper, Fieldset, FilterGroup, Form } from './styled';

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
  const formRef = useRef(null);
  const { feedback, priority, stadsdeel, status, source } = dataLists;
  const [submitBtnLabel, setSubmitBtnLabel] = useState(defaultSubmitBtnLabel);
  const [filterData, setFilterData] = useState(filter);
  const filterSlugs = useMemo(
    () =>
      (filterData.options.maincategory_slug || []).concat(
        filterData.options.category_slug || []
      ),
    [filterData.options.category_slug, filterData.options.maincategory_slug]
  );
  const isNewFilter = useMemo(() => !filter.name, [filter.name]);

  const onSubmitForm = useCallback(
    event => {
      const formData = parseOutputFormData(event.target.form);
      const hasName = formData.name.trim() !== '';
      const valuesHaveChanged = !isEqual(formData, filterData);

      if (isNewFilter && hasName) {
        onSaveFilter(formData);
      }

      if (!isNewFilter && valuesHaveChanged) {
        if (formData.name.trim() === '') {
          event.preventDefault();
          global.window.alert('Filter naam mag niet leeg zijn');
          return;
        }
        onUpdateFilter(formData);
      }

      onSubmit(event, formData);
    },
    [filterData, isNewFilter, onSaveFilter, onSubmit, onUpdateFilter]
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

    onClearFilter();
  }, [onClearFilter]);

  const onChangeForm = useCallback(() => {
    if (isNewFilter) {
      return;
    }

    const formData = parseOutputFormData(formRef.current);
    const valuesHaveChanged = !isEqual(formData, filterData);
    const btnHasSaveLabel = submitBtnLabel === saveSubmitBtnLabel;

    if (valuesHaveChanged && !btnHasSaveLabel) {
      setSubmitBtnLabel(saveSubmitBtnLabel);
    }
  }, [filterData, isNewFilter, submitBtnLabel]);

  const onNameChange = useCallback(
    event => {
      const { value } = event.target;
      const nameHasChanged = typeof value === 'string' && value !== filter.name;

      if (nameHasChanged) {
        setSubmitBtnLabel(saveSubmitBtnLabel);
      } else {
        setSubmitBtnLabel(defaultSubmitBtnLabel);
      }

      setFilterData(state => ({
        ...state,
        name: value,
      }));
    },
    [filter.name]
  );

  const onRefreshChange = useCallback(event => {
    event.persist();
    const {
      currentTarget: { checked },
    } = event;

    setFilterData(state => ({
      ...state,
      refresh: checked,
    }));
  }, []);

  const updateFilterDate = useCallback(
    /* istanbul ignore next */ (prop, dateValue) => {
      setFilterData(state => ({
        ...state,
        options: {
          ...state.options,
          [prop]: dateValue,
        },
      }));

      onChangeForm();
    },
    [setFilterData, onChangeForm]
  );

  return (
    <Form action="" novalidate onChange={onChangeForm} ref={formRef}>
      <ControlsWrapper>
        {filterData.id && (
          <input type="hidden" name="id" value={filterData.id} />
        )}
        <Fieldset isSection>
          <legend className="hiddenvisually">Naam van het filter</legend>

          <Label htmlFor="filter_name" isGroupHeader>
            Filternaam
          </Label>
          <div className="invoer">
            <input
              value={filterData.name}
              id="filter_name"
              name="name"
              onChange={onNameChange}
              placeholder="Geef deze filterinstelling een naam om deze op te slaan"
              type="text"
            />
          </div>

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
                options={status}
                title="Status"
                isGroupHeader
                displayToggle
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
                options={stadsdeel}
                title="Stadsdeel"
                isGroupHeader
                displayToggle
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
            <Label htmlFor="filter_date" isGroupHeader>
              Datum
            </Label>
            <div className="invoer">
              <DatePicker
                autoComplete="off"
                id="filter_date"
                /**
                 * Ignoring the internals of the `onChange` handler since they cannot be tested
                 * @see https://github.com/Hacker0x01/react-datepicker/issues/1578
                 */
                onChange={dateValue => {
                  /* istanbul ignore next */
                  const formattedDate = dateValue
                    ? moment(dateValue).format('YYYY-MM-DD')
                    : '';

                  updateFilterDate('incident_date', formattedDate);
                }}
                placeholderText="DD-MM-JJJJ"
                selected={
                  filterData.options &&
                  filterData.options.incident_date &&
                  moment(filterData.options.incident_date)
                }
              />

              {filterData.options && filterData.options.incident_date && (
                <input
                  defaultValue={moment(filterData.options.incident_date).format(
                    'YYYY-MM-DD'
                  )}
                  name="incident_date"
                  readOnly
                  type="hidden"
                />
              )}
            </div>
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
                  displayToggle
                  key={mainCategory}
                  options={options}
                  title={mainCatObj.value}
                  toggleFieldName="maincategory_slug"
                />
              );
            })}
        </Fieldset>
      </ControlsWrapper>

      <FormFooter
        cancelBtnLabel="Annuleren"
        onCancel={onCancel}
        onResetForm={onResetForm}
        onSubmitForm={onSubmitForm}
        resetBtnLabel="Nieuw filter"
        submitBtnLabel={submitBtnLabel}
      />
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
  onClearFilter: PropTypes.func.isRequired,
  /** Callback handler for new filter settings */
  onSaveFilter: PropTypes.func.isRequired,
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
