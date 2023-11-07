// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
} from 'react'

import { Label as AscLabel } from '@amsterdam/asc-ui'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import { useSelector } from 'react-redux'

import AutoSuggest from 'components/AutoSuggest'
import Checkbox from 'components/Checkbox'
import Input from 'components/Input'
import Label from 'components/Label'
import { makeSelectStructuredCategories } from 'models/categories/selectors'
import {
  makeSelectDirectingDepartments,
  makeSelectRoutingDepartments,
} from 'models/departments/selectors'
import configuration from 'shared/services/configuration/configuration'
import { dateToISOString } from 'shared/services/date-utils'
import dataLists from 'signals/incident-management/definitions'
import { parseOutputFormData } from 'signals/shared/filter/parse'

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
import {
  CategoryGroups,
  CheckboxGroup,
  Notification,
  RadioGroup,
} from './components'
import reducer, { init } from './reducer'
import type { KeyValue } from './reducer'
import {
  ControlsWrapper,
  DatesWrapper,
  Fieldset,
  FilterGroup,
  Form,
  FormFooterWrapper,
} from './styled'
import type { FilterFormData, UserOptions } from './types'
import { hasTooManyFiltersSelected } from './utils'
import CheckboxList from '../../../../components/CheckboxList'
import AppContext from '../../../../containers/App/context'
import RefreshIcon from '../../../../images/icon-refresh.svg'
import { useIncidentManagementContext } from '../../context'
import { makeSelectFilterParams } from '../../selectors'
import type { SaveFilterAction, UpdateFilterAction } from '../../types'
import CalendarInput from '../CalendarInput'
import { Accordion } from 'components/Accordion'

const USERS_AUTO_SUGGEST_URL = `${configuration.AUTOCOMPLETE_USERNAME_ENDPOINT}?is_active=true&username=`

const getUserOptions = (data: UserOptions) =>
  data.results?.map((user) => ({
    id: user.username,
    value: user.username,
  }))

const getUserCount = (data: UserOptions) => data.count

interface Props {
  filter: any
  onCancel?: () => void
  onClearFilter: () => {
    type: string
  }
  onSaveFilter: (payload: any) => SaveFilterAction
  onSubmit: (event: Event, formData: FilterFormData) => void
  onUpdateFilter?: (payload: any) => UpdateFilterAction
}

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
}: Props) => {
  const { sources } = useContext(AppContext)
  const { districts } = useIncidentManagementContext()
  const categories = useSelector(makeSelectStructuredCategories)
  const directingDepartments = useSelector(makeSelectDirectingDepartments)
  const routingDepartments = useSelector(makeSelectRoutingDepartments)
  const params = useSelector(makeSelectFilterParams)

  const notificationRef = useRef(null)
  const [, ...otherRoutingDepartments] = routingDepartments
  const notRoutedOption = routingDepartments[0]

  const [state, dispatch] = useReducer(reducer, filter, init)

  const isNewFilter = !filter.name

  const [showNotification, setShowNotification] = useState(false)
  const [assignedSelectValue, setAssignedSelectValue] = useState<string | null>(
    null
  )
  const [routedFilterValue, setRoutedFilterValue] = useState<KeyValue[]>([])
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

  const valuesHaveChanged =
    ((!isNewFilter && !isEqual(currentState, initialState)) || isNewFilter) &&
    state?.filter.name &&
    state.filter.name.trim().length > 0

  // state update handler; if the form values have changed compared with
  // the initial state, the form's submit button label will change accordingly
  useLayoutEffect(() => {
    valuesHaveChanged && dispatch(setSaveButtonLabel(valuesHaveChanged))
  }, [state.filter.name, valuesHaveChanged, isNewFilter])

  useEffect(() => {
    const hasTooManyFilters = hasTooManyFiltersSelected(
      params,
      currentState.options
    )

    setShowNotification(hasTooManyFilters)
  }, [currentState, params])

  // collection of category objects that is used to set form field values with
  const filterSlugs = state.options.maincategory_slug.concat(
    state.options.category_slug
  )

  const dateFrom = state.options.created_after
    ? new Date(state.options.created_after)
    : undefined

  const dateBefore = state.options.created_before
    ? new Date(state.options.created_before)
    : undefined

  const onSubmitForm = useCallback(
    (event) => {
      event.preventDefault()
      const options = parseOutputFormData(state.options)
      const formData = { ...state.filter, options }

      const hasName = formData.name?.trim() !== ''

      if (showNotification) {
        return
      }

      if (isNewFilter && hasName) {
        dispatch(onSaveFilter(formData))
      }

      if (onUpdateFilter && !isNewFilter && valuesHaveChanged) {
        dispatch(onUpdateFilter(formData))
      }

      onSubmit(event, formData)
    },
    [
      state.options,
      state.filter,
      showNotification,
      isNewFilter,
      valuesHaveChanged,
      onSubmit,
      onSaveFilter,
      onUpdateFilter,
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
      categories &&
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
      const options = isToggled
        ? dataListValues[groupName as keyof typeof dataListValues]
        : []
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
    <Fragment>
      {showNotification && <Notification reference={notificationRef} />}

      <Form action="" noValidate>
        <ControlsWrapper>
          {filter.id && <input type="hidden" name="id" value={filter.id} />}
          <Fieldset isSection>
            <legend className="hiddenvisually">Naam van het filter</legend>

            <Label htmlFor="filter_name" isGroupHeader>
              Filternaam
            </Label>
            <div className="invoer">
              <Input
                data-testid="filter-name"
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
                data-testid="filter-refresh"
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
                data-testid="filter-notes"
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
              state={state}
              onChange={onGroupChange}
              onToggle={onGroupToggle}
              onSubmit={onSubmitForm}
              options={dataLists.status}
              hasAccordion
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
                  state={state}
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
                state={state}
                hasAccordion
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
              state={state}
              hasAccordion
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
              state={state}
              hasAccordion
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
              state={state}
              hasAccordion
            />

            <Accordion
              id="feedback"
              title="Feedback"
              count={state.options.feedback?.length ?? ''}
            >
              <RadioGroup
                defaultValue={state.options.feedback}
                name="feedback"
                onChange={onRadioChange}
                options={dataLists.feedback}
              />
            </Accordion>

            <CheckboxGroup
              defaultValue={state.options.kind}
              hasToggle={false}
              label="Soort"
              name="kind"
              onChange={onGroupChange}
              onToggle={onGroupToggle}
              onSubmit={onSubmitForm}
              options={dataLists.kind}
              state={state}
              hasAccordion
            />

            {sources && (
              <CheckboxGroup
                defaultValue={state.options.source}
                label="Bron"
                name="source"
                onChange={onGroupChange}
                onToggle={onGroupToggle}
                onSubmit={onSubmitForm}
                options={sources}
                state={state}
                hasAccordion
              />
            )}

            <Accordion
              id="punctuality"
              title="Doorlooptijd"
              count={state.options.punctuality?.length ?? ''}
            >
              <RadioGroup
                defaultValue={state.options.punctuality}
                label="Doorlooptijd"
                name="punctuality"
                onChange={onRadioChange}
                options={dataLists.punctuality}
              />
            </Accordion>

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
                state={state}
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
                state={state}
              />
            </Fieldset>

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
                data-testid="filter-address"
                name="address_text"
                id="filter_address"
                onBlur={onAddressBlur}
                onChange={onAddressChange}
                value={controlledTextInput.address}
                type="text"
              />
            </FilterGroup>

            {configuration.featureFlags.assignSignalToEmployee && (
              <FilterGroup data-testid="filter-assigned-user-email">
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
                      data-testid="filter-not-assigned"
                      checked={state.options.assigned_user_email === 'null'}
                      id="filter_not_assigned"
                      name="notAssigned"
                      onClick={onNotAssignedChange}
                    />
                  </AscLabel>
                </div>

                <AutoSuggest
                  value={
                    state.options.assigned_user_email === 'null' ||
                    state.options.assigned_user_email === null
                      ? ''
                      : state.options.assigned_user_email
                  }
                  id="filter_assigned_user_email"
                  includeAuthHeaders={true}
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

            {configuration.featureFlags.assignSignalToDepartment && (
              <FilterGroup data-testid="filter-routing-department">
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
                      data-testid="filter-not-routed"
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
                state={state}
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
    </Fragment>
  )
}

export default FilterForm
