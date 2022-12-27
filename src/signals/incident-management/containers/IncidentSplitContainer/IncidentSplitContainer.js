// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { useEffect, useCallback, useMemo, useState } from 'react'

import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import LoadingIndicator from 'components/LoadingIndicator'
import { showGlobalNotification } from 'containers/App/actions'
import {
  VARIANT_SUCCESS,
  VARIANT_ERROR,
  TYPE_LOCAL,
} from 'containers/Notification/constants'
import useFetch from 'hooks/useFetch'
import { makeSelectSubcategoriesGroupedByCategories } from 'models/categories/selectors'
import {
  makeSelectDepartments,
  makeSelectDirectingDepartments,
} from 'models/departments/selectors'
import configuration from 'shared/services/configuration/configuration'
import { INCIDENT_URL } from 'signals/incident-management/routes'

import IncidentSplitForm from './components/IncidentSplitForm'

const IncidentSplitContainer = ({ FormComponent }) => {
  const {
    isLoading: isSubmitting,
    error: errorSplit,
    isSuccess: isSuccessSplit,
    post,
  } = useFetch()
  const {
    data: dataParent,
    error: errorParent,
    get: getParent,
    isLoading: isLoadingParent,
    isSuccess: isSuccessParent,
  } = useFetch()
  const { error: errorUpdate, patch, isSuccess: isSuccessUpdate } = useFetch()
  const { id } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const [parentIncident, setParentIncident] = useState()
  const [directingDepartment, setDirectingDepartment] = useState([])
  const [note, setNote] = useState()
  const departments = useSelector(makeSelectDepartments)
  const directingDepartments = useSelector(makeSelectDirectingDepartments)

  const [subcategoryGroups, subcategoryOptions] = useSelector(
    makeSelectSubcategoriesGroupedByCategories
  )

  const getPatchData = useCallback(() => {
    if (!parentIncident) return null

    // Initially, directing_departments can be undefined
    const parentDirectingDepartments =
      parentIncident.directing_departments || []

    const differentLength =
      parentDirectingDepartments.length !== directingDepartment.length
    const differentValue =
      directingDepartment.length > 0 &&
      !parentDirectingDepartments.some(
        (department) => department.id === directingDepartment[0].id
      )

    const shouldPatchDirectingDepartment = differentLength || differentValue
    const shouldPatchNote = Boolean(note?.trim())

    return shouldPatchDirectingDepartment || shouldPatchNote
      ? {
          ...(shouldPatchDirectingDepartment && {
            directing_departments: directingDepartment,
          }),
          ...(shouldPatchNote && { notes: [{ text: note }] }),
        }
      : null
  }, [parentIncident, note, directingDepartment])

  const parentDirectingDepartment = useMemo(() => {
    const department = parentIncident?.directing_departments
    if (!Array.isArray(department) || department.length !== 1) return 'null'
    const { code } = department[0]
    return directingDepartments.find(({ key }) => key === code) ? code : 'null'
  }, [parentIncident, directingDepartments])

  const updateDepartment = useCallback(
    (name) => {
      const department = departments?.list.find((d) => d.code === name)
      setDirectingDepartment(department ? [{ id: department.id }] : [])
    },
    [departments, setDirectingDepartment]
  )

  const submitCompleted = useCallback(
    /**
     * @param {Object} params
     * @param {boolean} params.success
     */
    ({ success }) => {
      if (success) {
        dispatch(
          showGlobalNotification({
            title: 'Deelmelding gemaakt',
            variant: VARIANT_SUCCESS,
            type: TYPE_LOCAL,
          })
        )
      } else {
        dispatch(
          showGlobalNotification({
            title: 'De deelmelding kon niet gemaakt worden',
            variant: VARIANT_ERROR,
            type: TYPE_LOCAL,
          })
        )
      }

      history.push(`${INCIDENT_URL}/${id}`)
    },
    // Disabling linter; the `history` dependency is generating infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, dispatch]
  )

  useEffect(() => {
    getParent(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`)
  }, [getParent, id])

  useEffect(() => {
    if (errorParent === undefined && dataParent === undefined) return

    /* istanbul ignore else */
    if (errorParent === false) {
      setParentIncident(dataParent)
    }
  }, [errorParent, dataParent])

  useEffect(() => {
    if (isSuccessSplit === undefined || errorSplit === undefined) return

    const patchData = getPatchData()
    if (isSuccessSplit && patchData) {
      patch(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`, patchData)
    } else {
      submitCompleted({ success: isSuccessSplit })
    }
  }, [errorSplit, isSuccessSplit, id, patch, submitCompleted, getPatchData])

  useEffect(() => {
    if (isSuccessUpdate === undefined || errorUpdate === undefined) return

    // The scenario when there is an error during the patch of the parent incident
    // is intentionally left out.
    submitCompleted({ success: true })
  }, [errorUpdate, isSuccessUpdate, submitCompleted])

  const onSubmit = useCallback(
    /**
     * Data coming from the submitted form
     *
     * @param {Object} formData
     * @param {string} formData.department
     * @param {string} formData.incidents[].description
     * @param {string} formData.incidents[].subcategory
     * @param {string} formData.incidents[].priority
     * @param {string} formData.incidents[].type
     * @param {string} formData.noteText
     */
    ({ department, incidents, noteText }) => {
      const {
        id: parent,
        attachments,
        extra_properties,
        incident_date_end,
        incident_date_start,
        location,
        reporter,
        source,
        text_extra,
      } = parentIncident

      updateDepartment(department)
      setNote(noteText)

      const { stadsdeel, buurt_code, address, geometrie } = location

      const parentData = {
        attachments,
        extra_properties,
        incident_date_end,
        incident_date_start,
        location: { stadsdeel, buurt_code, address, geometrie },
        reporter,
        source,
        text_extra,
      }

      const mergedData = incidents
        .filter(Boolean)
        .map(({ subcategory, description, type, priority }) => {
          const partialData = {
            category: { category_url: subcategory },
            priority: { priority },
            text: description,
            type: { code: type },
          }

          return { ...parentData, ...partialData, parent }
        })

      post(configuration.INCIDENTS_ENDPOINT, mergedData)
    },
    [parentIncident, post, updateDepartment]
  )

  return (
    <div data-testid="incident-split-container">
      {isLoadingParent ||
      isSuccessParent ||
      !parentIncident ||
      !subcategoryOptions ? (
        <LoadingIndicator />
      ) : (
        <FormComponent
          data-testid="incident-split-form"
          parentIncident={{
            id: parentIncident.id,
            childrenCount:
              parentIncident?._links?.['sia:children']?.length || 0,
            status: parentIncident.status.state,
            statusDisplayName: parentIncident.status.state_display,
            priority: parentIncident.priority.priority,
            subcategory: parentIncident.category.category_url,
            subcategoryDisplayName: `${parentIncident.category.sub} (${parentIncident.category.departments})`,
            description: parentIncident.text,
            type: parentIncident.type.code,
            directingDepartment: parentDirectingDepartment,
          }}
          subcategories={[subcategoryGroups, subcategoryOptions]}
          directingDepartments={directingDepartments}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      )}
    </div>
  )
}

IncidentSplitContainer.defaultProps = {
  FormComponent: IncidentSplitForm,
}

IncidentSplitContainer.propTypes = {
  FormComponent: PropTypes.func,
}

export default IncidentSplitContainer
