// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { FormBuilder, FieldGroup } from 'react-reactive-form'

import { dataListType } from 'shared/types'
import { reCategory } from 'shared/services/resolveClassification'

import FieldControlWrapper from 'signals/incident-management/components/FieldControlWrapper'
import SelectInput from 'signals/incident-management/components/SelectInput'
import RadioInput from 'signals/incident-management/components/RadioInput'
import { useSelector } from 'react-redux'
import { makeSelectSubcategoriesGroupedByCategories } from 'models/categories/selectors'

const form = FormBuilder.group({
  category_url: null,
  state: 'o',
  sub_slug: null,
  main_slug: null,
})

const SelectForm = ({ defaultTextsOptionList, onFetchDefaultTexts }) => {
  const [subcategoryGroups, subcategoryOptions] = useSelector(
    makeSelectSubcategoriesGroupedByCategories
  )

  const handleChange = useCallback(
    (changed) => {
      const newValues = {
        ...form.value,
        ...changed,
      }

      onFetchDefaultTexts(newValues)
    },
    [onFetchDefaultTexts]
  )

  useEffect(() => {
    form.controls.category_url.valueChanges.subscribe((category_url) => {
      const found =
        category_url &&
        subcategoryOptions.find((sub) => sub?.key === category_url)

      /* istanbul ignore else */
      if (found) {
        const [, main_slug, sub_slug] = found.key.match(reCategory)

        form.patchValue({
          sub_slug,
          main_slug,
        })

        handleChange({ category_url })
      }
    })

    form.controls.state.valueChanges.subscribe((state) => {
      if (form.value.category_url) {
        handleChange({ state })
      }
    })

    const firstCategoryUrl = subcategoryOptions[0]?.key
    if (firstCategoryUrl) {
      form.patchValue({
        category_url: firstCategoryUrl,
      })
    }

    return () => {
      form.controls.category_url.valueChanges.unsubscribe()
      form.controls.state.valueChanges.unsubscribe()
    }
  }, [handleChange, subcategoryOptions])

  useEffect(() => {
    form.updateValueAndValidity()
  }, [subcategoryOptions])

  return (
    <FieldGroup
      control={form}
      render={() => (
        <form data-testid="selectFormForm" className="select-form__form">
          <FieldControlWrapper
            render={SelectInput}
            display="Subcategorie"
            name="category_url"
            values={subcategoryOptions}
            groups={subcategoryGroups}
            control={form.get('category_url')}
          />
          <FieldControlWrapper
            display="Status"
            render={RadioInput}
            name="state"
            values={defaultTextsOptionList}
            control={form.get('state')}
          />
        </form>
      )}
    />
  )
}

SelectForm.propTypes = {
  defaultTextsOptionList: dataListType.isRequired,

  onFetchDefaultTexts: PropTypes.func.isRequired,
}

export default SelectForm
