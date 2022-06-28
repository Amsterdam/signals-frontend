// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import RadioInput from 'signals/incident-management/components/RadioInput_b'
import SelectInput from 'signals/incident-management/components/SelectInput_b'

import { dataListType } from 'shared/types'
import { reCategory } from 'shared/services/resolveClassification'

import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { makeSelectSubcategoriesGroupedByCategories } from 'models/categories/selectors'

const SelectForm = ({ defaultTextsOptionList, onFetchDefaultTexts }) => {
  const [subcategoryGroups, subcategoryOptions] = useSelector(
    makeSelectSubcategoriesGroupedByCategories
  )

  const handleChange = useCallback(
    (changed) => {
      const newValues = {
        ...getValues(),
        ...changed,
      }
      onFetchDefaultTexts(newValues)
    },
    [getValues, onFetchDefaultTexts]
  )

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      const { category_url, state } = value
      handleForm({ category_url, state, name })
    })
    handleForm({ ...getValues(), name: 'category_url' })
    return () => subscription.unsubscribe()
  }, [handleChange, handleForm, setValue, subcategoryOptions, watch, getValues])

  const handleForm = useCallback(
    ({ category_url, state, name }) => {
      if (name === 'category_url') {
        const found =
          category_url &&
          subcategoryOptions.find((sub) => sub?.key === category_url)

        /* istanbul ignore else */
        if (found) {
          const [, main_slug, sub_slug] = found.key.match(reCategory)
          setValue('sub_slug', sub_slug)
          setValue('main_slug', main_slug)
          handleChange({ category_url, sub_slug, main_slug })
        }
      } else if (name === 'state') {
        if (category_url) {
          handleChange({ state })
        }
      }
    },
    [handleChange, setValue, subcategoryOptions]
  )

  const { control, getValues, watch, setValue } = useForm({
    defaultValues: {
      state: 'o',
      category_url: subcategoryOptions[0]?.key,
      sub_slug: null,
      main_slug: null,
    },
  })

  return (
    <form data-testid="selectFormForm" className="select-form__form">
      <Controller
        name="category_url"
        control={control}
        render={({ field: { name, onChange } }) => (
          <SelectInput
            name={name}
            display="Subcategorie"
            values={subcategoryOptions}
            groups={subcategoryGroups}
            onChange={onChange}
          />
        )}
      />

      <Controller
        name="state"
        control={control}
        render={({ field: { name, value, onChange } }) => (
          <RadioInput
            name={name}
            display="Status"
            values={defaultTextsOptionList}
            onChange={onChange}
            value={value}
          />
        )}
      />
    </form>
  )
}

SelectForm.propTypes = {
  defaultTextsOptionList: dataListType.isRequired,
  onFetchDefaultTexts: PropTypes.func.isRequired,
}

export default SelectForm
