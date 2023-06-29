// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useMemo } from 'react'

import type { FieldError } from 'react-hook-form'
import { useSelector } from 'react-redux'

import Button from 'components/Button'
import { makeSelectSubCategories } from 'models/categories/selectors'

import { StyledErrorMessage } from './styled'

export interface Props {
  name: string
  error?: FieldError
  onChange: (strings: string[]) => void
  value: string[]
}

export const SelectedSubcategories = ({ error, value }: Props) => {
  const subcategories = useSelector(makeSelectSubCategories)

  const checkedSubcategories = useMemo(() => {
    if (!subcategories) return []

    return value
      ?.map((id) => {
        return subcategories?.find((sub) => {
          return sub.fk == id
        })
      })
      .map((cat) => cat?.public_name ?? cat?.name)
      .filter(Boolean)
      .join(', ')
  }, [subcategories, value])

  return (
    <span>
      {error?.message && (
        <StyledErrorMessage id="textareaErrorMessage" message={error.message} />
      )}
      <Button variant="secondary" type="button">
        Selecteer subcategorie(ën)
      </Button>

      <p>{checkedSubcategories}</p>
    </span>
  )
}
