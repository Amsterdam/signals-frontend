import React, {
  useLayoutEffect,
  useMemo,
  useCallback,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import moment from 'moment';
import cloneDeep from 'lodash.clonedeep';
import 'react-datepicker/dist/react-datepicker.css';

import { parseOutputFormData } from 'signals/shared/filter/parse';
import * as types from 'shared/types';
import Label from 'components/Label';
import Input from 'components/Input';
import RefreshIcon from '../../../../shared/images/icon-refresh.svg';

import {
  ControlsWrapper,
  DatesWrapper,
  Fieldset,
  FilterGroup,
  Form,
  FormFooterWrapper,
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
  const { feedback, priority, stadsdeel, status, source, contact_details_present } = dataLists;

  const [state, dispatch] = useReducer(reducer, filter, init);

  const isNewFilter = useMemo(() => !filter.name, [filter.name]);

  const initialFormState = useMemo(() => cloneDeep(init(filter)), [filter]);

  const valuesHaveChanged = useMemo(() => {
    const currentState = {
      ...state.filter,
      options: parseOutputFormData(state.options),
    };
    const initialState = {
      ...initialFormState.filter,
      options: parseOutputFormData(initialFormState.options),
    };
    const statesAreEqual = isEqual(currentState, initialState);

    return (
      (!isNewFilter && !statesAreEqual) || (isNewFilter && state.filter.name)
    );
  }, [state.filter, state.options, initialFormState, isNewFilter]);

  // state update handler; if the form values have changed compared with
  // the initial state, the form's submit button label will change accordingly
  useLayoutEffect(() => {
    dispatch(setSaveButtonLabel(valuesHaveChanged));
  }, [state.filter.name, valuesHaveChanged, isNewFilter]);

  // collection of category objects that is used to set form field values with
  const filterSlugs = useMemo(
    () => state.options.maincategory_slug.concat(state.options.category_slug),
    [state.options.category_slug, state.options.maincategory_slug]
  );

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
      valuesHaveChanged,
      isNewFilter,
      onSaveFilter,
      onSubmit,
      onUpdateFilter,
      state.filter,
      state.options,
    ]
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
    e => {
      dispatch(setAddress(e.target.value));
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
    [dispatch, dataLists]
  );

  return (
    <Form action="" novalidate>
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

          {status && (
            <CheckboxGroup
              defaultValue={state.options.status}
              label="Status"
              name="status"
              onChange={onGroupChange}
              onToggle={onGroupToggle}
              options={status}
            />
          )}

          {stadsdeel && (
            <CheckboxGroup
              defaultValue={state.options.stadsdeel}
              label="Stadsdeel"
              name="stadsdeel"
              onChange={onGroupChange}
              onToggle={onGroupToggle}
              options={stadsdeel}
            />
          )}

          <CheckboxGroup
            defaultValue={state.options.priority}
            hasToggle={false}
            label="Urgentie"
            name="priority"
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            options={priority}
          />

          <CheckboxGroup
            defaultValue={state.options.contact_details_present}
            hasToggle={false}
            label="Contact"
            name="contact_details_present"
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            options={contact_details_present}
          />

          {feedback && (
            <RadioGroup
              defaultValue={state.options.feedback}
              label="Feedback"
              name="feedback"
              onChange={onRadioChange}
              options={feedback}
            />
          )}

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

          {source && (
            <CheckboxGroup
              defaultValue={state.options.source}
              label="Bron"
              name="source"
              onChange={onGroupChange}
              onToggle={onGroupToggle}
              options={source}
            />
          )}
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
