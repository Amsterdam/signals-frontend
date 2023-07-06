// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useMemo } from 'react'

import type { FieldError } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Button from 'components/Button'
import { makeSelectSubCategories } from 'models/categories/selectors'

import { StyledErrorMessage } from './styled'

export interface Props {
  name: string
  value: string[]
  error?: FieldError
  onChange?: (strings: string[]) => void
}

export const SelectedSubcategories = ({ error, value }: Props) => {
  const subcategories = useSelector(makeSelectSubCategories)

  const checkedSubcategories = useMemo(() => {
    if (!subcategories) return []

    return value
      ?.map((id) => {
        const sub = subcategories.find((sub) => sub.fk == id)
        return sub?.public_name ?? sub?.name
      })
      .filter(Boolean)
      .join(', ')
  }, [subcategories, value])

  return (
    <span>
      {error?.message && (
        <StyledErrorMessage id="textareaErrorMessage" message={error.message} />
      )}
      <Link to="./subcategories">
        <Button variant="secondary" type="button">
          Selecteer subcategorie(ën)
        </Button>
      </Link>

      <p>{checkedSubcategories}</p>
    </span>
  )
}
