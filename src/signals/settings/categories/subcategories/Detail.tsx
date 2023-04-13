// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { Fragment, useMemo, useCallback, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import BackLink from 'components/BackLink'
import LoadingIndicator from 'components/LoadingIndicator'
import { makeSelectUserCan } from 'containers/App/selectors'
import useFetch from 'hooks/useFetch'
import useLocationReferrer from 'hooks/useLocationReferrer'
import { fetchCategories } from 'models/categories/actions'
import configuration from 'shared/services/configuration/configuration'
import PageHeader from 'signals/settings/components/PageHeader'
import routes from 'signals/settings/routes'
import type { Category } from 'types/category'
import type { History } from 'types/history'

import { FormContainer } from './styled'
import { getTransformedData } from './utils'
import useConfirmedCancel from '../../hooks/useConfirmedCancel'
import useFetchResponseNotification from '../../hooks/useFetchResponseNotification'
import { CategoryForm } from '../components/CategoryForm'
import type { CategoryFormValues } from '../types'

type Params = {
  categoryId: string
}

const DEFAULT_STATUS_OPTION = 'true'

export const CategoryDetail = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const entityName = 'Subcategorie'

  const location = useLocationReferrer()
  const redirectURL = location.referrer || routes.categories
  const confirmedCancel = useConfirmedCancel(redirectURL)

  const { categoryId } = useParams<Params>()
  const isExistingCategory = categoryId !== undefined

  const { isLoading, isSuccess, error, data, get, patch } = useFetch<Category>()
  const { get: historyGet, data: historyData } = useFetch<History[]>()

  const responsibleDepartments = useMemo(
    () =>
      data
        ? data.departments
            .filter((department) => department.is_responsible)
            .map((department) => department.code)
        : [],
    [data]
  )

  const defaultValues: CategoryFormValues | null = useMemo(() => {
    if (!data) return null

    return {
      description: data.description,
      handling_message: data.handling_message,
      is_active:
        data.is_active === undefined
          ? DEFAULT_STATUS_OPTION
          : `${data.is_active}`,
      is_public_accessible: data.is_public_accessible || true,
      name: data.name,
      public_name: data.public_name || data.name,
      note: data.note,
      n_days: data.sla.n_days,
      use_calendar_days: data.sla.use_calendar_days ? 1 : 0,
    }
  }, [data])

  const formMethods = useForm<CategoryFormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: { ...defaultValues },
  })
  const isDirty = formMethods.formState.isDirty
  const formValues = formMethods.getValues()

  const categoryURL = `${configuration.CATEGORIES_PRIVATE_ENDPOINT}${categoryId}`

  const shouldRenderForm =
    !isExistingCategory || (isExistingCategory && Boolean(data))

  const userCan = useSelector(makeSelectUserCan)

  const userCanSubmitForm =
    (isExistingCategory && userCan('change_category')) ||
    (!isExistingCategory && userCan('add_category'))

  useFetchResponseNotification({
    entityName,
    error,
    isExisting: isExistingCategory,
    isLoading,
    isSuccess,
    redirectURL,
  })

  const title = `${entityName} ${isExistingCategory ? 'wijzigen' : 'toevoegen'}`

  useEffect(() => {
    // Prefill form with data from query
    defaultValues && formMethods.reset(defaultValues)
  }, [data, defaultValues, formMethods])

  useEffect(() => {
    if (isSuccess) {
      dispatch(fetchCategories())
    }
  }, [isSuccess, dispatch])

  useEffect(() => {
    if (isExistingCategory) {
      get(categoryURL)
      historyGet(`${categoryURL}/history`)
    }
  }, [get, historyGet, categoryURL, isExistingCategory])

  const onCancel = useCallback(() => {
    confirmedCancel(!isDirty)
  }, [confirmedCancel, isDirty])

  const onSubmit = useCallback(() => {
    if (!isDirty) {
      history.push(redirectURL)
    }

    const formData = formMethods.getValues()

    const transformedData = getTransformedData(formData)
    patch(categoryURL, { ...transformedData })
  }, [isDirty, formMethods, patch, categoryURL, history, redirectURL])

  return (
    <Fragment>
      <PageHeader
        title={title}
        BackLink={<BackLink to={redirectURL}>Terug naar overzicht</BackLink>}
      />

      {isLoading && <LoadingIndicator />}

      <FormContainer>
        {shouldRenderForm && historyData && (
          <CategoryForm
            formMethods={formMethods}
            formValues={formValues}
            history={historyData}
            onCancel={onCancel}
            onSubmit={formMethods.handleSubmit(onSubmit)}
            readOnly={!userCanSubmitForm}
            register={formMethods.register}
            responsibleDepartments={responsibleDepartments}
          />
        )}
      </FormContainer>
    </Fragment>
  )
}
