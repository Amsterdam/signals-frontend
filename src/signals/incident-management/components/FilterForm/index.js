import React, { Fragment, useLayoutEffect, useMemo, useCallback, useReducer } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import moment from 'moment';
import cloneDeep from 'lodash.clonedeep';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';
import { Label as AscLabel } from '@datapunt/asc-ui';

import { makeSelectStructuredCategories } from 'models/categories/selectors';
import dataLists from 'signals/incident-management/definitions';
import { parseOutputFormData } from 'signals/shared/filter/parse';
import * as types from 'shared/types';
import Label from 'components/Label';
import Input from 'components/Input';
import Checkbox from 'components/Checkbox';
import RefreshIcon from '../../../../shared/images/icon-refresh.svg';

import { ControlsWrapper, DatesWrapper, Fieldset, FilterGroup, Form, FormFooterWrapper } from './styled';
import CalendarInput from '../CalendarInput';
import CategoryGroups from './components/CategoryGroups';
import CheckboxGroup from './components/CheckboxGroup';
import RadioGroup from './components/RadioGroup';

import {
  reset,
  setAddress,
  setSaveButtonLabel,
  setCategories,
  setDate,
  setGroupOptions,
  setMainCategory,
  setName,
  setNoteKeyword,
  setRefresh,
} from './actions';

import reducer, { init } from './reducer';

/**
 * Component that renders the incident filter form
 */
const FilterForm = ({ filter, onCancel, onClearFilter, onSaveFilter, onSubmit, onUpdateFilter }) => {
  const categories = useSelector(makeSelectStructuredCategories);

  const [state, dispatch] = useReducer(reducer, filter, init);

  const isNewFilter = !filter.name;

  const initialFormState = useMemo(() => cloneDeep(init(filter)), [filter]);

  const currentState = useMemo(
    () => ({
      ...state.filter,
      options: parseOutputFormData(state.options),
    }),
    [state.filter, state.options]
  );

  const initialState = useMemo(
    () => ({
      ...initialFormState.filter,
      options: parseOutputFormData(initialFormState.options),
    }),
    [initialFormState.filter, initialFormState.options]
  );

  const valuesHaveChanged = useMemo(
    () => (!isNewFilter && !isEqual(currentState, initialState)) || (isNewFilter && state.filter.name),
    [currentState, initialState, state.filter.name, isNewFilter]
  );

  // state update handler; if the form values have changed compared with
  // the initial state, the form's submit button label will change accordingly
  useLayoutEffect(() => {
    dispatch(setSaveButtonLabel(valuesHaveChanged));
  }, [state.filter.name, valuesHaveChanged, isNewFilter]);

  // collection of category objects that is used to set form field values with
  const filterSlugs = useMemo(() => state.options.maincategory_slug.concat(state.options.category_slug), [
    state.options.category_slug,
    state.options.maincategory_slug,
  ]);

  const dateFrom = state.options.created_after && moment(state.options.created_after);
  const dateBefore = state.options.created_before && moment(state.options.created_before);

  const onSubmitForm = useCallback(
    event => {
      event.preventDefault();
      const options = parseOutputFormData(state.options);
      const formData = { ...state.filter, options };
      const hasName = formData.name.trim() !== '';

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
    [valuesHaveChanged, isNewFilter, onSaveFilter, onSubmit, onUpdateFilter, state.filter, state.options]
  );

  const onResetForm = useCallback(() => {
    dispatch(reset());
    onClearFilter();
  }, [onClearFilter]);

  // callback handler that is called whenever a checkbox is (un)checked in the list of
  // category checkbox groups
  const onChangeCategories = useCallback(
    (slug, subCategories) => {
      dispatch(setCategories({ slug, subCategories }));
    },
    [dispatch]
  );

  // callback handler that is called whenever a toggle is (un)checked in the list of
  // category checkbox groups
  const onMainCategoryToggle = useCallback(
    (slug, isToggled) => {
      dispatch(
        setMainCategory({
          category: categories[slug],
          isToggled,
        })
      );
    },
    [categories, dispatch]
  );

  const onNameChange = useCallback(
    event => {
      const { value } = event.target;

      dispatch(setName(value));
    },
    [dispatch]
  );

  const onRefreshChange = useCallback(
    event => {
      event.persist();
      const {
        currentTarget: { checked },
      } = event;

      dispatch(setRefresh(checked));
    },
    [dispatch]
  );

  const updateFilterDate = useCallback(
    (prop, dateValue) => {
      dispatch(setDate({ [prop]: dateValue }));
    },
    [dispatch]
  );

  const onAddressChange = useCallback(
    event => {
      dispatch(setAddress(event.target.value));
    },
    [dispatch]
  );

  const onNotesChange = useCallback(
    event => {
      dispatch(setNoteKeyword(event.target.value));
    },
    [dispatch]
  );

  // callback handler that is called whenever a radio button is (un)checked in a
  // radio button list group
  const onRadioChange = useCallback(
    (groupName, option) => {
      dispatch(setGroupOptions({ [groupName]: option.key }));
    },
    [dispatch]
  );

  // callback handler that is called whenever a checkbox is (un)checked in a checkbox
  // group that is not one of the category checkbox groups
  const onGroupChange = useCallback(
    (groupName, options) => {
      dispatch(setGroupOptions({ [groupName]: options }));
    },
    [dispatch]
  );

  // callback handler that is called whenever a toggle is (un)checked in a checkbox
  // group that is not one of the category checkbox groups
  const onGroupToggle = useCallback(
    (groupName, isToggled) => {
      const options = isToggled ? dataLists[groupName] : [];

      dispatch(setGroupOptions({ [groupName]: options }));
    },
    [dispatch]
  );

  return (
    <Form action="" novalidate>
      <ControlsWrapper>
        {filter.id && <input type="hidden" name="id" value={filter.id} />}
        <Fieldset isSection>
          <legend className="hiddenvisually">Naam van het filter</legend>

          <Label htmlFor="filter_name" isGroupHeader>
            Filternaam
          </Label>
          <div className="invoer">
            <Input
              data-testid="filterName"
              defaultValue={initialFormState.filter.name}
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
          <div>
            <Checkbox
              data-testid="filterRefresh"
              checked={state.filter.refresh}
              id="filter_refresh"
              name="refresh"
              onClick={onRefreshChange}
            />
            <AscLabel
              htmlFor="filter_refresh"
              label={
                <Fragment>
                  <RefreshIcon width={16} height={18} /> Automatisch verversen
                </Fragment>
              }
            />
          </div>
        </Fieldset>

        <Fieldset>
          <FilterGroup>
            <Label htmlFor="filter_notes" isGroupHeader>Zoek in notitie</Label>
            <Input
              name="note_keyword"
              id="filter_notes"
              onBlur={onNotesChange}
              defaultValue={initialFormState.options.note_keyword}
              type="text"
            />
          </FilterGroup>
        </Fieldset>

        <Fieldset>
          <legend>Filter parameters</legend>

          <CheckboxGroup
            defaultValue={initialFormState.options.status}
            label="Status"
            name="status"
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            options={dataLists.status}
          />

          <CheckboxGroup
            defaultValue={initialFormState.options.stadsdeel}
            label="Stadsdeel"
            name="stadsdeel"
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            options={dataLists.stadsdeel}
          />

          <CheckboxGroup
            defaultValue={initialFormState.options.priority}
            hasToggle={false}
            label="Urgentie"
            name="priority"
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            options={dataLists.priority}
          />

          <CheckboxGroup
            defaultValue={initialFormState.options.type}
            hasToggle={false}
            label="Type"
            name="type"
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            options={dataLists.type}
          />

          <CheckboxGroup
            defaultValue={initialFormState.options.contact_details}
            hasToggle={false}
            label="Contact"
            name="contact_details"
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            options={dataLists.contact_details}
          />

          <RadioGroup
            defaultValue={initialFormState.options.feedback}
            label="Feedback"
            name="feedback"
            onChange={onRadioChange}
            options={dataLists.feedback}
          />

          <FilterGroup>
            <Label htmlFor="filter_date" isGroupHeader>
              Datum
            </Label>

            <DatesWrapper>
              <CalendarInput
                id="filter_created_after"
                onSelect={dateValue => {
                  updateFilterDate('created_after', dateValue && moment(dateValue).format('YYYY-MM-DD'));
                }}
                selectedDate={dateFrom}
                label="Vanaf"
                name="created_after"
              />

              <CalendarInput
                id="filter_created_before"
                onSelect={dateValue => {
                  updateFilterDate('created_before', dateValue && dateValue.format('YYYY-MM-DD'));
                }}
                selectedDate={dateBefore}
                label="Tot en met"
                name="created_before"
              />
            </DatesWrapper>
          </FilterGroup>

          <FilterGroup>
            <Label htmlFor="filter_address" isGroupHeader>
              Adres
            </Label>
            <Input
              name="address_text"
              id="filter_address"
              onBlur={onAddressChange}
              defaultValue={initialFormState.options.address_text}
              type="text"
            />
          </FilterGroup>

          <CheckboxGroup
            defaultValue={initialFormState.options.source}
            label="Bron"
            name="source"
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            options={dataLists.source}
          />
        </Fieldset>
      </ControlsWrapper>

      <ControlsWrapper>
        <Fieldset>
          <legend>Filter categorieën</legend>

          <Label forwardedAs="span" htmlFor="not_used" isGroupHeader>
            Categorie
          </Label>

          {categories && (
            <CategoryGroups
              categories={categories}
              filterSlugs={filterSlugs}
              onChange={onChangeCategories}
              onToggle={onMainCategoryToggle}
            />
          )}
        </Fieldset>
      </ControlsWrapper>

      <FormFooterWrapper
        cancelBtnLabel="Annuleren"
        onCancel={onCancel}
        onResetForm={onResetForm}
        onSubmitForm={onSubmitForm}
        resetBtnLabel="Nieuw filter"
        submitBtnLabel={state.submitBtnLabel}
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
