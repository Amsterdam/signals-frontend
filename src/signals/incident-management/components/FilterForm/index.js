import React, { useMemo, useCallback, useReducer } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import moment from 'moment';
import cloneDeep from 'lodash.clonedeep';
import 'react-datepicker/dist/react-datepicker.css';

import { parseOutputFormData } from 'signals/shared/filter/parse';
import * as types from 'shared/types';
import FormFooter from 'components/FormFooter';
import Label from 'components/Label';
import Input from 'components/Input';
import RefreshIcon from '../../../../shared/images/icon-refresh.svg';

import {
  ControlsWrapper,
  DatesWrapper,
  Fieldset,
  FilterGroup,
  Form,
} from './styled';
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
  setRefresh,
} from './actions';
import reducer, { init } from './reducer';

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
  const [state, dispatch] = useReducer(reducer, filter, init);

  const filterSlugs = useMemo(
    () => state.options.maincategory_slug.concat(state.options.category_slug),
    [state.options.category_slug, state.options.maincategory_slug]
  );

  const isNewFilter = useMemo(() => !filter.name, [filter.name]);

  const initialFormState = useMemo(() => cloneDeep(filter), [filter]);

  const dateFrom = useMemo(
    () => state.options.created_after && moment(state.options.created_after),
    [state.options.created_after]
  );

  const dateBefore = useMemo(
    () => state.options.created_before && moment(state.options.created_before),
    [state.options.created_before]
  );

  const onSubmitForm = useCallback(
    event => {
      event.preventDefault();
      const options = parseOutputFormData(state.options);
      const formData = { ...state.filter, options };
      const hasName = formData.name.trim() !== '';
      const valuesHaveChanged = !isEqual(formData, initialFormState);

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
    [
      initialFormState,
      isNewFilter,
      onSaveFilter,
      onSubmit,
      onUpdateFilter,
      state.filter,
      state.options,
    ]
  );

  /**
   * Form reset handler
   */
  const onResetForm = useCallback(() => {
    dispatch(reset());
    onClearFilter();
  }, [onClearFilter]);

  /**
   *
   */
  const onChangeForm = useCallback(() => {
    if (isNewFilter) {
      return;
    }

    const options = parseOutputFormData(state.options);
    const formData = { ...state.filter, options };
    const valuesHaveChanged = !isEqual(formData, initialFormState);

    dispatch(setSaveButtonLabel(valuesHaveChanged));
  }, [initialFormState, isNewFilter, state.filter, state.options]);

  const onChangeCategories = useCallback(
    (main_category_slug, subCategories) => {
      dispatch(setCategories({ main_category_slug, subCategories }));
    },
    [dispatch]
  );

  const onMainCategoryToggle = useCallback(
    (main_category_slug, isToggled) => {
      const category = categories.main.find(
        ({ slug }) => slug === main_category_slug
      );

      dispatch(setMainCategory({ main_category_slug, category, isToggled }));
    },
    [categories.main, dispatch]
  );

  const onNameChange = useCallback(
    event => {
      const { value } = event.target;
      const nameHasChanged = typeof value === 'string' && value !== filter.name;

      dispatch(setSaveButtonLabel(nameHasChanged));
      dispatch(setName(value));
    },
    [filter.name]
  );

  const onRadioChange = useCallback(
    (groupName, option) => {
      dispatch(setGroupOptions({ [groupName]: option.key }));
    },
    [dispatch]
  );

  const onGroupChange = useCallback(
    (groupName, options) => {
      dispatch(setGroupOptions({ [groupName]: options }));
    },
    [dispatch]
  );

  const onGroupToggle = useCallback(
    (groupName, isToggled) => {
      const options = isToggled ? dataLists[groupName] : [];

      dispatch(setGroupOptions({ [groupName]: options }));
    },
    [dispatch, dataLists]
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
    e => {
      dispatch(setAddress(e.target.value));
    },
    [dispatch]
  );

  return (
    <Form action="" novalidate onChange={onChangeForm}>
      <ControlsWrapper>
        {state.filter.id && (
          <input type="hidden" name="id" value={state.filter.id} />
        )}
        <Fieldset isSection>
          <legend className="hiddenvisually">Naam van het filter</legend>

          <Label htmlFor="filter_name" isGroupHeader>
            Filternaam
          </Label>
          <div className="invoer">
            <input
              value={state.filter.name}
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
              defaultChecked={state.filter.refresh}
              id="filter_refresh"
              name="refresh"
              onClick={onRefreshChange}
              type="checkbox"
            />
            <label htmlFor="filter_refresh">
              <RefreshIcon width={16} height={18} /> Automatisch verversen
            </label>
          </div>
        </Fieldset>

        <Fieldset>
          <legend>Filter parameters</legend>

          <CheckboxGroup
            name="status"
            defaultValue={state.options.status}
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            label="Status"
            options={status}
          />

          <CheckboxGroup
            name="stadsdeel"
            defaultValue={state.options.stadsdeel}
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            label="Stadsdeel"
            options={stadsdeel}
          />

          <RadioGroup
            options={priority}
            name="priority"
            defaultValue={state.options.priority}
            onChange={onRadioChange}
            label="Urgentie"
          />

          <RadioGroup
            options={feedback}
            name="feedback"
            defaultValue={state.options.feedback}
            onChange={onRadioChange}
            label="Feedback"
          />

          <FilterGroup>
            <Label htmlFor="filter_date" isGroupHeader>
              Datum
            </Label>

            <DatesWrapper>
              <CalendarInput
                id="filter_created_after"
                onSelect={dateValue => {
                  updateFilterDate(
                    'created_after',
                    dateValue && moment(dateValue).format('YYYY-MM-DD')
                  );
                }}
                selectedDate={dateFrom}
                label="Vanaf"
                name="created_after"
              />

              <CalendarInput
                id="filter_created_before"
                onSelect={dateValue => {
                  updateFilterDate(
                    'created_before',
                    dateValue && dateValue.format('YYYY-MM-DD')
                  );
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
              defaultValue={state.options.address_text}
            />
          </FilterGroup>

          <CheckboxGroup
            name="source"
            defaultValue={state.options.source}
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            label="Bron"
            options={source}
          />
        </Fieldset>
      </ControlsWrapper>

      <ControlsWrapper>
        <Fieldset>
          <legend>Filter categorieën</legend>

          <Label $as="span" htmlFor="not_used" isGroupHeader>
            Categorie
          </Label>

          <CategoryGroups
            categories={categories}
            filterSlugs={filterSlugs}
            onChange={onChangeCategories}
            onToggle={onMainCategoryToggle}
          />
        </Fieldset>
      </ControlsWrapper>

      <FormFooter
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
