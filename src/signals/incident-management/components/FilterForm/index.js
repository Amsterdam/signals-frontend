// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import {
  Fragment,
  useLayoutEffect,
  useContext,
  useMemo,
  useCallback,
  useReducer,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash.isequal'
import cloneDeep from 'lodash.clonedeep'
import { useSelector } from 'react-redux'
import { Label as AscLabel } from '@amsterdam/asc-ui'

import AutoSuggest from 'components/AutoSuggest'
import Checkbox from 'components/Checkbox'
import Input from 'components/Input'
import Label from 'components/Label'
import { makeSelectStructuredCategories } from 'models/categories/selectors'
import configuration from 'shared/services/configuration/configuration'
import { dateToISOString } from 'shared/services/date-utils'
import { filterType } from 'shared/types'
import dataLists from 'signals/incident-management/definitions'
import { parseOutputFormData } from 'signals/shared/filter/parse'

import {
  makeSelectDirectingDepartments,
  makeSelectRoutingDepartments,
} from 'models/departments/selectors'
import CalendarInput from '../CalendarInput'
import CheckboxList from '../CheckboxList'
import RefreshIcon from '../../../../shared/images/icon-refresh.svg'
import AppContext from '../../../../containers/App/context'
import IncidentManagementContext from '../../context'
import RadioGroup from './components/RadioGroup'
import CheckboxGroup from './components/CheckboxGroup'
import CategoryGroups from './components/CategoryGroups'
import {
  ControlsWrapper,
  DatesWrapper,
  Fieldset,
  FilterGroup,
  Form,
  FormFooterWrapper,
} from './styled'

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
} from './actions'

import reducer, { init } from './reducer'

const USERS_AUTO_SUGGEST_URL = `${configuration.AUTOCOMPLETE_USERNAME_ENDPOINT}?is_active=true&username=`
const getUserOptions = (data) =>
  data.results?.map((user) => ({
    id: user.username,
    value: user.username,
  }))

const getUserCount = (data) => data?.count

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
}) => {
  const { sources } = useContext(AppContext)
  const { districts } = useContext(IncidentManagementContext)
  const categories = useSelector(makeSelectStructuredCategories)
  const directingDepartments = useSelector(makeSelectDirectingDepartments)
  const routingDepartments = useSelector(makeSelectRoutingDepartments)
  const [, ...otherRoutingDepartments] = routingDepartments
  const notRoutedOption = routingDepartments[0]

  const [state, dispatch] = useReducer(reducer, filter, init)

  const isNewFilter = !filter.name

  const [assignedSelectValue, setAssignedSelectValue] = useState('')
  const [routedFilterValue, setRoutedFilterValue] = useState([])
  const [controlledTextInput, setControlledTextInput] = useState({
    name: state.filter.name,
    address: state.options.address_text,
    note: state.options.note_keyword,
  })

  const dataListValues = useMemo(
    () => ({
      ...dataLists,
      area: districts,
      source: sources,
      directing_department: directingDepartments,
      routing_department: routingDepartments,
    }),
    [districts, sources, directingDepartments, routingDepartments]
  )

  const initialFormState = useMemo(() => cloneDeep(init(filter)), [filter])

  const currentState = useMemo(
    () => ({
      ...state.filter,
      options: parseOutputFormData(state.options),
    }),
    [state.filter, state.options]
  )

  const initialState = useMemo(
    () => ({
      ...initialFormState.filter,
      options: parseOutputFormData(initialFormState.options),
    }),
    [initialFormState.filter, initialFormState.options]
  )

  const valuesHaveChanged = useMemo(
    () =>
      ((!isNewFilter && !isEqual(currentState, initialState)) || isNewFilter) &&
      state.filter.name.trim(),
    [currentState, initialState, state.filter.name, isNewFilter]
  )

  // state update handler; if the form values have changed compared with
  // the initial state, the form's submit button label will change accordingly
  useLayoutEffect(() => {
    dispatch(setSaveButtonLabel(valuesHaveChanged))
  }, [state.filter.name, valuesHaveChanged, isNewFilter])

  // collection of category objects that is used to set form field values with
  const filterSlugs = useMemo(
    () => state.options.maincategory_slug.concat(state.options.category_slug),
    [state.options.category_slug, state.options.maincategory_slug]
  )

  const dateFrom =
    state.options.created_after && new Date(state.options.created_after)
  const dateBefore =
    state.options.created_before && new Date(state.options.created_before)

  const onSubmitForm = useCallback(
    (event) => {
      event.preventDefault()
      const options = parseOutputFormData(state.options)
      const formData = { ...state.filter, options }
      const hasName = formData.name.trim() !== ''

      if (isNewFilter && hasName) {
        onSaveFilter(formData)
      }

      if (!isNewFilter && valuesHaveChanged) {
        onUpdateFilter(formData)
      }

      onSubmit(event, formData)
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
  )

  const onResetForm = useCallback(() => {
    dispatch(reset())
    onClearFilter()
    setControlledTextInput({
      name: '',
      address: '',
      note: '',
    })
  }, [dispatch, onClearFilter])

  // callback handler that is called whenever a checkbox is (un)checked in the list of
  // category checkbox groups
  const onChangeCategories = useCallback(
    (slug, subCategories) => {
      dispatch(setCategories({ slug, subCategories }))
    },
    [dispatch]
  )

  // callback handler that is called whenever a toggle is (un)checked in the list of
  // category checkbox groups
  const onMainCategoryToggle = useCallback(
    (slug, isToggled) => {
      dispatch(
        setMainCategory({
          category: categories[slug],
          isToggled,
        })
      )
    },
    [categories, dispatch]
  )

  const onNameBlur = useCallback(
    (event) => {
      const { value } = event.target

      dispatch(setName(value))
    },
    [dispatch]
  )

  const onNameChange = useCallback(
    (event) =>
      setControlledTextInput({
        ...controlledTextInput,
        name: event.target?.value,
      }),
    [controlledTextInput]
  )
  const onNoteChange = useCallback(
    (event) =>
      setControlledTextInput({
        ...controlledTextInput,
        note: event.target?.value,
      }),
    [controlledTextInput]
  )
  const onAddressChange = useCallback(
    (event) =>
      setControlledTextInput({
        ...controlledTextInput,
        address: event.target?.value,
      }),
    [controlledTextInput]
  )

  const onRefreshChange = useCallback(
    (event) => {
      event.persist()
      const {
        currentTarget: { checked },
      } = event

      dispatch(setRefresh(checked))
    },
    [dispatch]
  )

  const updateFilterDate = useCallback(
    (prop, dateValue) => {
      dispatch(setDate({ [prop]: dateValue }))
    },
    [dispatch]
  )

  const onAddressBlur = useCallback(
    (event) => {
      dispatch(setAddress(event.target.value))
    },
    [dispatch]
  )

  const onNoteBlur = useCallback(
    (event) => {
      dispatch(setNoteKeyword(event.target.value))
    },
    [dispatch]
  )

  // callback handler that is called whenever a radio button is (un)checked in a
  // radio button list group
  const onRadioChange = useCallback(
    (groupName, option) => {
      dispatch(setGroupOptions({ [groupName]: option.key }))
    },
    [dispatch]
  )

  // callback handler that is called whenever a checkbox is (un)checked in a checkbox
  // group that is not one of the category checkbox groups
  const onGroupChange = useCallback(
    (groupName, options) => {
      dispatch(setGroupOptions({ [groupName]: options }))
    },
    [dispatch]
  )

  // callback handler that is called whenever a toggle is (un)checked in a checkbox
  // group that is not one of the category checkbox groups
  const onGroupToggle = useCallback(
    (groupName, isToggled) => {
      const options = isToggled ? dataListValues[groupName] : []
      dispatch(setGroupOptions({ [groupName]: options }))
    },
    [dispatch, dataListValues]
  )

  const onAssignedSelect = useCallback(
    (option) => {
      dispatch(setGroupOptions({ assigned_user_email: option.id }))
    },
    [dispatch]
  )

  const onAssignedClear = useCallback(() => {
    dispatch(setGroupOptions({ assigned_user_email: '' }))
  }, [dispatch])

  const onNotAssignedChange = useCallback(
    (event) => {
      const { checked } = event.currentTarget
      const newAssignedSelectValue = checked
        ? state.options.assigned_user_email
        : ''
      const newAssignedFilterValue = checked ? 'null' : assignedSelectValue
      setAssignedSelectValue(newAssignedSelectValue)
      dispatch(setGroupOptions({ assigned_user_email: newAssignedFilterValue }))
    },
    [dispatch, assignedSelectValue, setAssignedSelectValue, state]
  )

  const onNotRoutedChange = useCallback(
    (event) => {
      const { checked } = event.currentTarget
      const newRoutedFilterValue = checked
        ? [notRoutedOption]
        : routedFilterValue
      if (checked) {
        setRoutedFilterValue(state.options.routing_department)
      }
      dispatch(setGroupOptions({ routing_department: newRoutedFilterValue }))
    },
    [notRoutedOption, routedFilterValue, state.options.routing_department]
  )

  const isNotRoutedChecked = useCallback(
    () =>
      state.options.routing_department.length === 1 &&
      state.options.routing_department[0].key === notRoutedOption.key,
    [notRoutedOption.key, state.options.routing_department]
  )

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
              value={controlledTextInput.name}
              id="filter_name"
              name="name"
              onBlur={onNameBlur}
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
            <Label htmlFor="filter_notes" isGroupHeader>
              Zoek in notitie
            </Label>
            <Input
              data-testid="filterNotes"
              name="note_keyword"
              id="filter_notes"
              onBlur={onNoteBlur}
              onChange={onNoteChange}
              value={controlledTextInput.note}
              type="text"
            />
          </FilterGroup>
        </Fieldset>

        <Fieldset>
          <legend>Filter parameters</legend>

          <CheckboxGroup
            defaultValue={state.options.status}
            label="Status"
            name="status"
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            onSubmit={onSubmitForm}
            options={dataLists.status}
          />

          {configuration.featureFlags.fetchDistrictsFromBackend &&
            districts && (
              <CheckboxGroup
                defaultValue={state.options.area}
                label={configuration.language.district}
                name="area"
                onChange={onGroupChange}
                onToggle={onGroupToggle}
                onSubmit={onSubmitForm}
                options={districts}
              />
            )}

          {!configuration.featureFlags.fetchDistrictsFromBackend && (
            <CheckboxGroup
              defaultValue={state.options.stadsdeel}
              label="Stadsdeel"
              name="stadsdeel"
              onChange={onGroupChange}
              onToggle={onGroupToggle}
              onSubmit={onSubmitForm}
              options={dataLists.stadsdeel}
            />
          )}

          <CheckboxGroup
            defaultValue={state.options.priority}
            hasToggle={false}
            label="Urgentie"
            name="priority"
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            onSubmit={onSubmitForm}
            options={dataLists.priority}
          />

          <CheckboxGroup
            defaultValue={state.options.type}
            hasToggle={false}
            label="Type"
            name="type"
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            onSubmit={onSubmitForm}
            options={dataLists.type}
          />

          <CheckboxGroup
            defaultValue={state.options.contact_details}
            hasToggle={false}
            label="Contact"
            name="contact_details"
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            onSubmit={onSubmitForm}
            options={dataLists.contact_details}
          />

          <RadioGroup
            defaultValue={state.options.feedback}
            label="Feedback"
            name="feedback"
            onChange={onRadioChange}
            options={dataLists.feedback}
          />

          <CheckboxGroup
            defaultValue={state.options.kind}
            hasToggle={false}
            label="Soort"
            name="kind"
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            onSubmit={onSubmitForm}
            options={dataLists.kind}
          />

          <Fieldset isSection>
            <CheckboxGroup
              defaultValue={state.options.directing_department}
              hasToggle={false}
              label="Regie hoofdmelding"
              name="directing_department"
              onChange={onGroupChange}
              onToggle={onGroupToggle}
              onSubmit={onSubmitForm}
              options={directingDepartments}
            />

            <CheckboxGroup
              defaultValue={state.options.has_changed_children}
              hasToggle={false}
              label="Wijziging"
              name="has_changed_children"
              onChange={onGroupChange}
              onToggle={onGroupToggle}
              onSubmit={onSubmitForm}
              options={dataLists.has_changed_children}
            />
          </Fieldset>

          <RadioGroup
            defaultValue={state.options.punctuality}
            label="Doorlooptijd"
            name="punctuality"
            onChange={onRadioChange}
            options={dataLists.punctuality}
          />

          <FilterGroup>
            <Label htmlFor="filter_date" isGroupHeader>
              Datum
            </Label>

            <DatesWrapper>
              <CalendarInput
                id="filter_created_after"
                onSelect={(dateValue) => {
                  updateFilterDate(
                    'created_after',
                    dateValue && dateToISOString(dateValue)
                  )
                }}
                selectedDate={dateFrom}
                label="Vanaf"
                name="created_after"
              />

              <CalendarInput
                id="filter_created_before"
                onSelect={(dateValue) => {
                  updateFilterDate(
                    'created_before',
                    dateValue && dateToISOString(dateValue)
                  )
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
              data-testid="filterAddress"
              name="address_text"
              id="filter_address"
              onBlur={onAddressBlur}
              onChange={onAddressChange}
              value={controlledTextInput.address}
              type="text"
            />
          </FilterGroup>

          {configuration.featureFlags.assignSignalToEmployee && (
            <FilterGroup data-testid="filterAssignedUserEmail">
              <Label htmlFor="filter_assigned_user_email" isGroupHeader>
                Toegewezen aan
              </Label>
              <div>
                <AscLabel
                  htmlFor="filter_not_assigned"
                  label="Niet toegewezen"
                  noActiveState
                >
                  <Checkbox
                    data-testid="filterNotAssigned"
                    checked={state.options.assigned_user_email === 'null'}
                    id="filter_not_assigned"
                    name="notAssigned"
                    onClick={onNotAssignedChange}
                  />
                </AscLabel>
              </div>

              <AutoSuggest
                value={
                  state.options.assigned_user_email === 'null'
                    ? ''
                    : state.options.assigned_user_email
                }
                id="filter_assigned_user_email"
                name="assigned_user_email"
                onSelect={onAssignedSelect}
                onClear={onAssignedClear}
                placeholder="medewerker@example.com"
                url={USERS_AUTO_SUGGEST_URL}
                formatResponse={getUserOptions}
                numOptionsDeterminer={getUserCount}
                disabled={state.options.assigned_user_email === 'null'}
              />
            </FilterGroup>
          )}

          <CheckboxGroup
            defaultValue={state.options.source}
            label="Bron"
            name="source"
            onChange={onGroupChange}
            onToggle={onGroupToggle}
            onSubmit={onSubmitForm}
            options={sources}
          />

          {configuration.featureFlags.assignSignalToDepartment && (
            <FilterGroup data-testid="filterRoutingDepartment">
              <Label htmlFor="filter_routing_department" isGroupHeader>
                Afdeling
              </Label>
              <div>
                <AscLabel
                  htmlFor="filter_not_routed"
                  label={notRoutedOption.value}
                  noActiveState
                >
                  <Checkbox
                    data-testid="filterNotRouted"
                    checked={isNotRoutedChecked()}
                    id="filter_not_routed"
                    name="notRouted"
                    onClick={onNotRoutedChange}
                  />
                </AscLabel>
              </div>
              <CheckboxList
                defaultValue={
                  isNotRoutedChecked() ? [] : state.options.routing_department
                }
                id="filter_routing_department"
                name="routing_department"
                onChange={onGroupChange}
                onSubmit={onSubmitForm}
                options={otherRoutingDepartments}
              />
            </FilterGroup>
          )}
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
              onSubmit={onSubmitForm}
            />
          )}
        </Fieldset>
      </ControlsWrapper>

      <FormFooterWrapper
        cancelBtnLabel="Annuleer"
        onCancel={onCancel}
        onResetForm={onResetForm}
        onSubmitForm={onSubmitForm}
        resetBtnLabel="Nieuw filter"
        submitBtnLabel={state.submitBtnLabel}
      />
    </Form>
  )
}

FilterForm.defaultProps = {
  filter: {
    name: '',
    options: {},
  },
}

FilterForm.propTypes = {
  filter: filterType,
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
}

export default FilterForm
