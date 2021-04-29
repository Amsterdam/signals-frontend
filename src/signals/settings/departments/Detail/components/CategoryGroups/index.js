// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { memo, useContext } from 'react'
import PropTypes from 'prop-types'

import Label from 'components/Label'
import CheckboxList from 'signals/incident-management/components/CheckboxList'

import DepartmentDetailContext from '../../context'

const CategoryGroups = ({ boxWrapperKeyPrefix, onChange, onToggle, state }) => {
  const { categories, findByMain } = useContext(DepartmentDetailContext)

  return Object.entries(categories).map(([slug, { name, sub, key }]) => {
    const categoriesInState = (state && state[slug]) || []
    const defaultValue = categoriesInState.filter(({ _links: { self }, id }) =>
      new RegExp(`/terms/categories/${slug}`).test(self.public || id)
    )

    const numOptionsCheckedInCategory = categoriesInState.filter(
      ({ parentKey, disabled }) => disabled && parentKey === key
    ).length

    const hasToggle = numOptionsCheckedInCategory !== findByMain(key).length

    return (
      <CheckboxList
        boxWrapperKeyPrefix={boxWrapperKeyPrefix}
        defaultValue={defaultValue}
        groupId={key}
        groupValue={slug}
        hasToggle={hasToggle}
        key={slug}
        name={`${slug}_category_slug`}
        onChange={onChange}
        onToggle={onToggle}
        options={sub}
        title={<Label as="span">{name}</Label>}
      />
    )
  })
}

CategoryGroups.propTypes = {
  boxWrapperKeyPrefix: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  state: PropTypes.shape({}),
}

export default memo(CategoryGroups)
