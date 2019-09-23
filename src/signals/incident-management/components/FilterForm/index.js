import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row } from '@datapunt/asc-ui';
import isEqual from 'lodash.isequal';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import CheckboxList from '../CheckboxList';
import RadioButtonList from '../RadioButtonList';
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
  activeFilter,
  onCancel,
  onClearFilter,
  onSaveFilter,
  onSubmit,
  onUpdateFilter,
  ...dataLists
}) => {
  const {
    feedbackList: feedback,
    categories,
    priorityList: priority,
    stadsdeelList: stadsdeel,
    statusList: status,
  } = dataLists;

  const parsedfilterData = parseInputFormData(activeFilter, {
    feedback,
    stadsdeel,
    maincategory_slug: categories.main,
    priority,
    status,
    category_slug: categories.sub,
  });

  const [submitBtnLabel, setSubmitBtnLabel] = useState(defaultSubmitBtnLabel);
  const [filterData, setFilterData] = useState(parsedfilterData);
  const filterSlugs = (filterData.maincategory_slug || []).concat(filterData.category_slug || []);

  const onSubmitForm = event => {
    const formData = parseOutputFormData(event.target.form);
    const isNewFilter = !filterData.name;
    const valuesHaveChanged = !isEqual(formData, filterData);

    /* istanbul ignore else */
    if (typeof onSaveFilter === 'function' && isNewFilter) {
      onSaveFilter(formData);
    }

    /* istanbul ignore else */
    if (typeof onUpdateFilter === 'function' && !isNewFilter && valuesHaveChanged) {
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
      incident_date: null,
      address_text: '',
    });

    /* istanbul ignore else */
    if (typeof onClearFilter === 'function') {
      onClearFilter();
    }
  };

  const onChangeForm = event => {
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

  const onNameChange = event => {
    const { value } = event.target;
    const nameHasChanged = typeof value === 'string' && value.trim() !== filterData.name;

    if (nameHasChanged) {
      setSubmitBtnLabel(saveSubmitBtnLabel);
    } else {
      setSubmitBtnLabel(defaultSubmitBtnLabel);
    }
  };

  return (
    <Form action="" novalidate onChange={onChangeForm}>
      <ControlsWrapper>
        {filterData.id && <input type="hidden" name="id" value={filterData.id} />}
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

          {Array.isArray(status) && status.length > 0 && (
            <FilterGroup data-testid="statusFilterGroup">
              <Label htmlFor={`status_${status[0].key}`}>Status</Label>
              <CheckboxList defaultValue={filterData.status} groupName="status" groupId="status" options={status} />
            </FilterGroup>
          )}

          {Array.isArray(stadsdeel) && stadsdeel.length > 0 && (
            <FilterGroup data-testid="stadsdeelFilterGroup">
              <Label htmlFor={`status_${stadsdeel[0].key}`}>Stadsdeel</Label>
              <CheckboxList
                defaultValue={filterData.stadsdeel}
                groupName="stadsdeel"
                groupId="stadsdeel"
                options={stadsdeel}
              />
            </FilterGroup>
          )}

          {Array.isArray(priority) && priority.length > 0 && (
            <FilterGroup data-testid="priorityFilterGroup">
              <Label htmlFor={`status_${priority[0].key}`}>Urgentie</Label>
              <RadioButtonList defaultValue={filterData.priority} groupName="priority" options={priority} />
            </FilterGroup>
          )}

          {Array.isArray(feedback) && feedback.length > 0 && (
            <FilterGroup data-testid="feedbackFilterGroup">
              <Label htmlFor={`feedback_${feedback[0].key}`}>Feedback</Label>
              <RadioButtonList defaultValue={filterData.feedback} groupName="feedback" options={feedback} />
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
                  /* istanbul ignore next */ dateValue => {
                    const formattedDate = dateValue ? moment(dateValue).format('YYYY-MM-DD') : '';

                    setFilterData({
                      ...filterData,
                      incident_date: formattedDate,
                    });
                  }
                }
                placeholderText="DD-MM-JJJJ"
                selected={filterData.incident_date && moment(filterData.incident_date)}
              />

              {filterData.incident_date && (
                <input
                  defaultValue={moment(filterData.incident_date).format('YYYY-MM-DD')}
                  name="incident_date"
                  readOnly
                  type="hidden"
                />
              )}
            </div>
          </FilterGroup>

          <FilterGroup>
            <Label htmlFor="filter_address">Adres</Label>
            <div className="invoer">
              <input type="text" name="address_text" id="filter_address" defaultValue={filterData.address_text} />
            </div>
          </FilterGroup>
        </Fieldset>
      </ControlsWrapper>

      <ControlsWrapper>
        <Fieldset>
          <legend>Filter categorieën</legend>

          <Label $as="span" htmlFor="not_used">
            Categorie
          </Label>

          {Object.keys(categories.mainToSub)
            .filter(key => !!key) // remove elements without 'key' prop
            .sort()
            .map(mainCategory => {
              const mainCatObj = categories.main.find(({ slug }) => slug === mainCategory);
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
            <ResetButton data-testid="resetBtn" onClick={onResetForm} type="reset">
              Nieuw filter
            </ResetButton>

            <CancelButton data-testid="cancelBtn" onClick={onCancel} type="button">
              Annuleren
            </CancelButton>

            <SubmitButton name="submit_button" onClick={onSubmitForm} type="submit">
              {submitBtnLabel}
            </SubmitButton>
          </ButtonContainer>
        </Row>
      </FormFooter>
    </Form>
  );
};

FilterForm.defaultProps = {
  activeFilter: {
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
  feedback: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  activeFilter: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    options: PropTypes.shape({
      feedback: PropTypes.string,
      incident_date: PropTypes.string,
      address_text: PropTypes.string,
      stadsdeel: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      maincategory_slug: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      priority: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      status: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      category_slug: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    }),
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
