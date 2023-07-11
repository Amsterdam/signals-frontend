// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useMemo, useState } from 'react'

import { Column, Row } from '@amsterdam/asc-ui'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import BackLink from 'components/BackLink'
import CheckboxList from 'components/CheckboxList'
import FormFooter from 'components/FormFooter'
import Label from 'components/Label'
import { makeSelectStructuredCategories } from 'models/categories/selectors'
import type SubCategory from 'types/api/sub-category'

import { CategoryColumns, StyledUnderline } from './styled'
import PageHeader from '../../../../../../components/PageHeader'

type Props = {
  onChange: (categoryIds: number[]) => void
  value: number[] | undefined
  defaultText?: string
}

export const Subcategories = ({ onChange, value, defaultText }: Props) => {
  const subCategories = useSelector(makeSelectStructuredCategories)
  const [newValue, setNewValue] = useState<number[]>(value ?? [])
  const navigate = useNavigate()

  const categoriesInForm = useMemo(() => {
    if (!(subCategories && newValue)) {
      return
    }
    return Object.fromEntries(
      Object.entries(subCategories).map(([slug, { sub }]) => {
        const defaultValue = sub.filter((subItem) => {
          return newValue?.includes(Number(subItem.fk))
        })
        return [slug, defaultValue]
      })
    )
  }, [subCategories, newValue])

  const onChangeHandler = useCallback(
    (groupName, options) => {
      const newCategoriesInForm: { [k: string]: SubCategory[] } =
        categoriesInForm as { [k: string]: SubCategory[] }

      newCategoriesInForm[groupName] = options

      const newCategoryIdsInForm = Object.values(newCategoriesInForm)
        .flat()
        .map(({ fk }) => Number(fk))

      setNewValue(newCategoryIdsInForm)
    },
    [setNewValue, categoriesInForm]
  )

  const onToggleHandler = useCallback(
    (groupName, toggleVal) => {
      const newCategoriesInForm: { [k: string]: SubCategory[] } =
        categoriesInForm as { [k: string]: SubCategory[] }

      if (toggleVal && subCategories) {
        newCategoriesInForm[groupName] = subCategories[groupName].sub
      } else {
        newCategoriesInForm[groupName] = []
      }

      const newCategoryIdsInForm = Object.values(newCategoriesInForm)
        .flat()
        .map(({ fk }) => Number(fk))

      setNewValue(newCategoryIdsInForm)
    },
    [categoriesInForm, subCategories]
  )

  const onCancel = useCallback(() => {
    navigate('../')
  }, [navigate])

  const onSubmitForm = useCallback(() => {
    onChange(newValue)

    navigate('../')
  }, [navigate, newValue, onChange])

  if (!subCategories) {
    return null
  }

  return (
    <>
      <Row>
        <PageHeader
          dataTestId={'defaulttextadmin-page-header'}
          title={'Standaardtekst toewijzen aan categorie(ën)'}
          BackLink={<BackLink to={'../'}>Terug naar standaardtekst</BackLink>}
        >
          <StyledUnderline>{defaultText}</StyledUnderline>
        </PageHeader>
      </Row>
      <Row>
        <Column span={12}>
          <CategoryColumns>
            {Object.entries(subCategories).map(([slug, { name, sub, key }]) => {
              const defaultValue = categoriesInForm && categoriesInForm[slug]

              return (
                <CheckboxList
                  boxWrapperKeyPrefix={'subcategories'}
                  defaultValue={defaultValue}
                  groupId={key}
                  groupValue={slug}
                  hasToggle
                  key={slug}
                  name={`${slug}_category_slug`}
                  onChange={(groupName, options) => {
                    onChangeHandler(groupName, options)
                  }}
                  onToggle={(groupName, toggleVal) =>
                    onToggleHandler(groupName, toggleVal)
                  }
                  options={sub}
                  title={<Label as="span">{name}</Label>}
                />
              )
            })}
          </CategoryColumns>
          <FormFooter
            cancelBtnLabel="Annuleer"
            onCancel={onCancel}
            onSubmitForm={onSubmitForm}
            submitBtnLabel="Opslaan"
          />
        </Column>
      </Row>
    </>
  )
}
