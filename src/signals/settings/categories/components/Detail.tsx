// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { Fragment, useMemo, useCallback, useEffect } from 'react'

import { Row } from '@amsterdam/asc-ui'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import BackLink from 'components/BackLink'
import LoadingIndicator from 'components/LoadingIndicator'
import PageHeader from 'components/PageHeader'
import { makeSelectUserCan } from 'containers/App/selectors'
import useFetch from 'hooks/useFetch'
import useLocationReferrer from 'hooks/useLocationReferrer'
import { fetchCategories } from 'models/categories/actions'
import configuration from 'shared/services/configuration/configuration'
import routes from 'signals/settings/routes'
import type { StandardText } from 'types/api/standard-texts'
import type { StatusMessagesCategory } from 'types/api/status-messages'
import type { Category } from 'types/category'
import type { History } from 'types/history'

import { CategoryForm } from './CategoryForm'
import { getPatchPayload } from './utils'
import useConfirmedCancel from '../../hooks/useConfirmedCancel'
import useFetchResponseNotification from '../../hooks/useFetchResponseNotification'
import type { CategoryFormValues } from '../types'

const DEFAULT_STATUS_OPTION = 'true'

export interface Props {
  entityName: string
  isMainCategory: boolean
  isPublicAccessibleLabel: string
}

// istanbul ignore next
export const CategoryDetail = ({
  entityName,
  isMainCategory,
  isPublicAccessibleLabel,
}: Props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const location = useLocationReferrer()

  const redirectURL =
    location.referrer ||
    (isMainCategory ? routes.mainCategories : routes.subcategories)
  const confirmedCancel = useConfirmedCancel(redirectURL)

  const { categoryId } = useParams<{ categoryId: string }>()

  const { isLoading, isSuccess, error, data, get, patch } = useFetch<Category>()
  const { get: historyGet, data: historyData } = useFetch<History[]>()
  const {
    post: postStandardTextsCategory,
    isSuccess: isSuccessPostStandardTextsCategory,
  } = useFetch<StatusMessagesCategory[]>()

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
      is_public_accessible: data.is_public_accessible ?? true,
      icon: data.icon,
      name: data.name,
      public_name: data.public_name ?? data.name,
      note: data.note,
      n_days: data.sla.n_days,
      use_calendar_days: data.sla.use_calendar_days ? 1 : 0,
      ...(isMainCategory && {
        show_children_in_filter:
          data?.configuration?.show_children_in_filter || false,
      }),
    }
  }, [data, isMainCategory])

  const formMethods = useForm<CategoryFormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: { ...defaultValues },
  })
  const isDirty = formMethods.formState.isDirty
  const formValues = formMethods.getValues()

  const categoryURL = `${configuration.CATEGORIES_PRIVATE_ENDPOINT}${categoryId}`

  const userCan = useSelector(makeSelectUserCan)

  const userCanSubmitForm = userCan('change_category')

  useFetchResponseNotification({
    entityName,
    error,
    isLoading,
    isSuccess: isSuccess || isSuccessPostStandardTextsCategory,
    redirectURL,
  })

  const title = `${entityName} wijzigen`

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
    get(categoryURL)
    historyGet(`${categoryURL}/history`)
  }, [get, historyGet, categoryURL])

  const onCancel = useCallback(() => {
    confirmedCancel(!isDirty)
  }, [confirmedCancel, isDirty])

  const onSubmit = useCallback(() => {
    if (!isDirty) {
      navigate(redirectURL)
    }

    const payloadDefaultTexts = formMethods.getValues('standard_texts')?.map(
      (defaultText: StandardText, index): StatusMessagesCategory => ({
        position: index,
        status_message: defaultText.id,
      })
    )

    if (payloadDefaultTexts) {
      postStandardTextsCategory(
        configuration.STANDARD_TEXTS_CATEGORY_ENDPOINT + categoryId,
        payloadDefaultTexts
      )
    }

    const formData = formMethods.getValues()

    const payload = getPatchPayload(formData, formMethods.formState.dirtyFields)
    if (Object.keys(payload).length > 0) {
      patch(categoryURL, { ...payload })
    }
  }, [
    isDirty,
    formMethods,
    patch,
    categoryURL,
    postStandardTextsCategory,
    categoryId,
    navigate,
    redirectURL,
  ])

  if (!data || !historyData) return null

  return (
    <Fragment>
      <Row>
        <PageHeader
          dataTestId={'settings-page-header'}
          title={title}
          BackLink={<BackLink to={redirectURL}>Terug naar overzicht</BackLink>}
        />
      </Row>

      {isLoading && <LoadingIndicator />}

      <CategoryForm
        isMainCategory={isMainCategory}
        formMethods={formMethods}
        formValues={formValues}
        history={historyData}
        onCancel={onCancel}
        onSubmit={formMethods.handleSubmit(onSubmit)}
        readOnly={!userCanSubmitForm}
        responsibleDepartments={responsibleDepartments}
        isPublicAccessibleLabel={isPublicAccessibleLabel}
      />
    </Fragment>
  )
}
