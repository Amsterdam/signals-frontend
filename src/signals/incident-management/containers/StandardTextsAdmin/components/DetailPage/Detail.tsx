// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Row } from '@amsterdam/asc-ui'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'

import BackLink from 'components/BackLink'
import Button from 'components/Button'
import Checkbox from 'components/Checkbox'
import GlobalError from 'components/GlobalError'
import Input from 'components/Input'
import Label from 'components/Label'
import LoadingIndicator from 'components/LoadingIndicator'
import RadioButtonList from 'components/RadioButtonList'
import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import useFetch from 'hooks/useFetch'
import { getErrorMessage } from 'shared/services/api/api'
import configuration from 'shared/services/configuration/configuration'
import { changeStatusOptionList } from 'signals/incident-management/definitions/statusList'

import {
  Form,
  Grid,
  LeftSection,
  RightSection,
  StyledColumn,
  StyledFormFooter,
  StyledLabel,
  StyledTextArea,
} from './styled'
import type { StandardTextDetailData, StandardTextForm } from './types'
import { createPatch, createPost } from './utils'
import { PageHeader } from '../PageHeader'
import { SelectedSubcategories } from '../SelectedSubcategories'

interface Option {
  key: string
  value: string
}

const schema = yup.object({
  categories: yup
    .array()
    .min(1, 'Vul de subcategorie(ën) in')
    .required('Vul de subcategorie(ën) in.'),
  title: yup.string().required('Vul een titel in'),
  text: yup.string().required('Vul een omschrijving in'),
})

export const Detail = () => {
  const navigate = useNavigate()
  const [waitForTimeout, setWaitForTimeout] = useState(false)
  const dispatch = useDispatch()
  const { id } = useParams()
  const isNewPage = location.pathname.split('/').pop() === 'new'
  const hasID = useParams().id

  const { get, data, isLoading, patch, post, del, isSuccess, error } =
    useFetch<StandardTextDetailData>()

  const title = id ? 'Standaardtekst wijzigen' : 'Standaardtekst toevoegen'
  const redirectURL = '..'

  const defaultValues: StandardTextForm | null = useMemo(() => {
    if (data) {
      return {
        categories: (data.categories =
          Object.keys(data.categories).length === 0 ? [4] : data.categories), // fake data, when Selecteer subcategorieënpage has been made, this needs to deleted
        state: data.state,
        title: data.title,
        text: data.text,
        active: data.active,
      }
    } else {
      return {
        categories: [4], // fake data, when Selecteer subcategorieënpage has been made, this needs to be an empty array
        state: 'm',
        title: '',
        text: '',
        active: false,
      }
    }
  }, [data])

  const options = changeStatusOptionList.map((option) => ({
    key: option.key,
    value: option.value,
  }))

  const formMethods = useForm<StandardTextForm>({
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues: { ...defaultValues },
  })

  const { handleSubmit, formState, reset, getValues } = formMethods

  const onSubmit = useCallback(() => {
    const hasDirtyFields = Object.keys(formState.dirtyFields).length > 0

    !hasDirtyFields && navigate(redirectURL)

    if (!isNewPage && hasID) {
      patch(
        `${configuration.STANDARD_TEXTS_ENDPOINT}${id}`,
        createPatch(getValues(), formState.dirtyFields)
      )
    } else {
      post(`${configuration.STANDARD_TEXTS_ENDPOINT}`, createPost(getValues()))
    }
  }, [formState.dirtyFields, getValues, id, navigate, patch, post])

  const handleOnCancel = () => {
    navigate(redirectURL)
  }

  const handleOnDelete = () => {
    del(`${configuration.STANDARD_TEXTS_ENDPOINT}${id}`)
  }

  useEffect(() => {
    if (id && parseInt(id) && !data && !isLoading) {
      get(`${configuration.STANDARD_TEXTS_ENDPOINT}${id}`)
    }
  }, [data, get, id, isLoading])

  useEffect(() => {
    // Prefill form with data from query
    defaultValues && reset(defaultValues)
  }, [defaultValues, reset])

  useEffect(() => {
    if (isSuccess) {
      setWaitForTimeout(true)

      // Set delay to wait for search endpoint to be updated
      const timer = setTimeout(() => {
        navigate(redirectURL)
      }, 750)

      return () => clearTimeout(timer)
    }
  }, [isSuccess, navigate, waitForTimeout])

  useEffect(() => {
    if (error) {
      dispatch(
        showGlobalNotification({
          title: getErrorMessage(error),
          message: 'De standaardtekst kon niet worden opgehaald',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [dispatch, error])
  return (
    <Row>
      <FormProvider {...formMethods}>
        <StyledColumn span={12}>
          <GlobalError
            meta={{ label: 'De standaardtekst kan niet worden opgeslagen' }}
          />
          <PageHeader
            title={title}
            backLink={
              <BackLink to={redirectURL}>Terug naar overzicht</BackLink>
            }
          />
        </StyledColumn>

        {(isLoading || waitForTimeout) && <LoadingIndicator />}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Grid>
            <LeftSection>
              <Controller
                name="categories"
                render={({
                  field: { name, onChange, value },
                  fieldState: { error },
                }) => (
                  <SelectedSubcategories
                    name={name}
                    error={error}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
              <Controller
                name="state"
                render={({ field: { value, onChange } }) => {
                  const handleOnchange = (
                    _groupName: string,
                    option: Option
                  ) => {
                    onChange(option.key)
                  }
                  return (
                    <>
                      <Label as="span">Status</Label>
                      <RadioButtonList
                        groupName="Status"
                        hasEmptySelectionButton={false}
                        defaultValue={value}
                        options={options}
                        onChange={handleOnchange}
                      />
                    </>
                  )
                }}
              />
            </LeftSection>

            <RightSection>
              <Controller
                name="title"
                render={({
                  field: { name, value = '', onChange },
                  fieldState: { error },
                }) => (
                  <Input
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={'Titel'}
                    error={error?.message}
                  />
                )}
              />
              <Controller
                name="text"
                render={({
                  field: { name, value, onChange },
                  fieldState: { error },
                }) => (
                  <StyledTextArea
                    showError={Boolean(error)}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder="Tekst"
                    errorMessage={error?.message}
                  />
                )}
              />
              <Controller
                name="active"
                render={({ field: { name, value, onChange } }) => (
                  <div>
                    <StyledLabel htmlFor={name} label="Actief">
                      <Checkbox
                        name={name}
                        checked={value}
                        id={name}
                        onChange={onChange}
                      />
                    </StyledLabel>
                  </div>
                )}
              />
              {id && parseInt(id) && (
                <Button
                  variant="secondary"
                  onClick={handleOnDelete}
                  type="button"
                >
                  Verwijderen
                </Button>
              )}
            </RightSection>
          </Grid>

          <StyledFormFooter
            cancelBtnLabel="Annuleer"
            onCancel={handleOnCancel}
            submitBtnLabel="Opslaan"
          />
        </Form>
      </FormProvider>
    </Row>
  )
}
