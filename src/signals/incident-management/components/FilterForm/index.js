import { fromJS } from 'immutable';
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

import CheckboxList from '../CheckboxList';
import RadioButtonList from '../RadioButtonList';
import {
  ControlsWrapper,
  DatesWrapper,
  Fieldset,
  FilterGroup,
  Form,
} from './styled';
import CalendarInput from '../CalendarInput';
import CheckboxGroup from './CheckboxGroup';

export const defaultSubmitBtnLabel = 'Filteren';
export const saveSubmitBtnLabel = 'Opslaan en filteren';

const RESET = 'RESET';
const SET_NAME = 'SET_NAME';
const SET_REFRESH = 'SET_REFRESH';
const SET_DATE = 'SET_DATE';
const SET_CATEGORIES = 'SET_CATEGORIES';
const SET_BUTTON_LABEL = 'SET_BUTTON_LABEL';

const initialState = {
  submitBtnLabel: defaultSubmitBtnLabel,
  filter: {
    name: '',
    refresh: false,
    id: undefined,
    options: {
      address_text: '',
      category_slug: [],
      feedback: '',
      maincategory_slug: [],
      priority: '',
      source: [],
      stadsdeel: [],
      status: [],
    },
  },
};

const init = filter => ({
  ...initialState,
  filter: {
    ...initialState.filter,
    ...filter,
    options: {
      ...initialState.filter.options,
      ...filter.options,
    },
  },
});

const reducer = (state, action) => {
  switch (action.type) {
    case RESET:
      return initialState;

    case SET_NAME:
      return {
        ...state,
        filter: {
          ...state.filter,
          name: action.payload,
        },
      };

    case SET_REFRESH:
      return {
        ...state,
        filter: {
          ...state.filter,
          refresh: action.payload,
        },
      };

    case SET_DATE:
      return {
        ...state,
        filter: {
          ...state.filter,
          options: {
            ...state.filter.options,
            ...action.payload,
          },
        },
      };

    case SET_BUTTON_LABEL:
      return {
        ...state,
        submitBtnLabel: action.payload,
      };

    case SET_CATEGORIES:
      return {
        ...state,
        filter: {
          ...state.filter,
          options: {
            ...state.filter.options,
            category_slug: state.filter.options.category_slug
              .filter(
                ({ category_slug }) =>
                  category_slug !== action.payload.category_slug
              )
              .concat(action.payload.subCategories),
          },
        },
      };

    default:
      throw new Error();
  }
};

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
  const { feedback, priority, stadsdeel, status, source } = dataLists.toJS();
  const [state, dispatch] = useReducer(reducer, filter, init);
  const filterSlugs = fromJS(
    state.filter.options.maincategory_slug.concat(
      state.filter.options.category_slug
    )
  );
  const isNewFilter = useMemo(() => !filter.name, [filter.name]);
  const initialFormState = cloneDeep(state.filter);
  debugger;
  const dateFrom = useMemo(
    () =>
      state.filter.options.created_after &&
      moment(state.filter.options.created_after),
    [state.filter.options.created_after]
  );

  const dateBefore = useMemo(
    () =>
      state.filter.options.created_before &&
      moment(state.filter.options.created_before),
    [state.filter.options.created_before]
  );

  const onSubmitForm = useCallback(
    event => {
      const formData = parseOutputFormData(event.currentTarget.form);
      const hasName = formData.name.trim() !== '';
      const valuesHaveChanged = !isEqual(formData, initialFormState);

      debugger;
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
    [isNewFilter, onSaveFilter, onSubmit, onUpdateFilter, initialFormState]
  );

  /**
   * Form reset handler
   *
   * Clears filterData state by setting values for controlled fields
   */
  const onResetForm = useCallback(() => {
    dispatch({ type: RESET });
    onClearFilter();
  }, [onClearFilter]);

  const onChangeForm = useCallback(
    e => {
      if (isNewFilter) {
        return;
      }

      const formData = parseOutputFormData(e.currentTarget);
      const valuesHaveChanged = !isEqual(formData, initialFormState);
      const btnHasSaveLabel = state.submitBtnLabel === saveSubmitBtnLabel;

      if (valuesHaveChanged && !btnHasSaveLabel) {
        dispatch({ type: SET_BUTTON_LABEL, payload: saveSubmitBtnLabel });
      }
    },
    [isNewFilter, state.submitBtnLabel, initialFormState]
  );

  const onChangeCategories = (category_slug, subCategories) => {
    dispatch({
      type: SET_CATEGORIES,
      payload: { category_slug, subCategories },
    });
  };

  const handleToggle = (groupName, isToggled) => {
    debugger;
  };

  const onNameChange = useCallback(
    event => {
      const { value } = event.target;
      const nameHasChanged = typeof value === 'string' && value !== filter.name;

      if (nameHasChanged) {
        dispatch({ type: SET_BUTTON_LABEL, payload: saveSubmitBtnLabel });
      } else {
        dispatch({ type: SET_BUTTON_LABEL, payload: defaultSubmitBtnLabel });
      }

      dispatch({ type: SET_NAME, name: value });
    },
    [filter.name]
  );

  const onRefreshChange = useCallback(event => {
    event.persist();
    const {
      currentTarget: { checked },
    } = event;

    dispatch({ type: SET_REFRESH, payload: checked });
  }, []);

  const updateFilterDate = useCallback(
    (prop, dateValue) => {
      dispatch({ type: SET_DATE, payload: { [prop]: dateValue } });
      onChangeForm();
    },
    [onChangeForm]
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

          {Array.isArray(status) && status.length > 0 && (
            <FilterGroup data-testid="statusFilterGroup">
              <CheckboxList
                defaultValue={state.filter.options.status}
                hasToggle
                options={status}
                name="status"
                title={
                  <Label as="span" isGroupHeader>
                    Status
                  </Label>
                }
              />
            </FilterGroup>
          )}

          {Array.isArray(stadsdeel) && stadsdeel.length > 0 && (
            <FilterGroup data-testid="stadsdeelFilterGroup">
              <CheckboxList
                defaultValue={state.filter.options.stadsdeel}
                hasToggle
                options={stadsdeel}
                name="stadsdeel"
                title={
                  <Label as="span" isGroupHeader>
                    Stadsdeel
                  </Label>
                }
              />
            </FilterGroup>
          )}

          {Array.isArray(priority) && priority.length > 0 && (
            <FilterGroup data-testid="priorityFilterGroup">
              <Label htmlFor={`status_${priority[0].key}`} isGroupHeader>
                Urgentie
              </Label>
              <RadioButtonList
                defaultValue={state.filter.options.priority}
                options={priority}
                groupName="priority"
              />
            </FilterGroup>
          )}

          {Array.isArray(feedback) && feedback.length > 0 && (
            <FilterGroup data-testid="feedbackFilterGroup">
              <Label htmlFor={`feedback_${feedback[0].key}`} isGroupHeader>
                Feedback
              </Label>
              <RadioButtonList
                defaultValue={state.filter.options.feedback}
                options={feedback}
                groupName="feedback"
              />
            </FilterGroup>
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
              defaultValue={state.filter.options.address_text}
            />
          </FilterGroup>

          {Array.isArray(source) && source.length > 0 && (
            <FilterGroup data-testid="sourceFilterGroup">
              <CheckboxList
                defaultValue={state.filter.options.source}
                options={source}
                name="source"
                title={
                  <Label htmlFor={`source_${source[0].key}`} isGroupHeader>
                    Bron
                  </Label>
                }
              />
            </FilterGroup>
          )}
        </Fieldset>
      </ControlsWrapper>

      <ControlsWrapper>
        <Fieldset className="categoryLists">
          <legend>Filter categorieën</legend>

          <Label $as="span" htmlFor="not_used" isGroupHeader>
            Categorie
          </Label>

          <CheckboxGroup
            categories={categories}
            filterSlugs={filterSlugs}
            onChange={onChangeCategories}
            onToggle={handleToggle}
          />
          {/* {Object.keys(categories.mainToSub)
            .filter(key => !!key) // remove elements without 'key' prop
            .sort()
            .map(mainCategory => {
              const mainCatObj = categories.main.find(
                ({ slug }) => slug === mainCategory
              );
              const options = categories.mainToSub[mainCategory];
              const defaultValue = filterSlugs.filter(({ key }) =>
                new RegExp(`/terms/categories/${mainCatObj.slug}`).test(key)
              );
              debugger;
              return (
                <CheckboxList
                  defaultValue={fromJS(defaultValue)}
                  groupId={mainCatObj.key}
                  groupName="maincategory_slug"
                  groupValue={mainCatObj.slug}
                  hasToggle
                  key={mainCategory}
                  name={`${mainCatObj.slug}_category_slug`}
                  options={options}
                  title={<Label as="span">{mainCatObj.value}</Label>}
                />
              );
            })} */}
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
