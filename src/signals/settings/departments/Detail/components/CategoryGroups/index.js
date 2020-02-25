import React, { memo } from 'react';
import PropTypes from 'prop-types';

import * as types from 'shared/types';
import Label from 'components/Label';
import CheckboxList from 'signals/incident-management/components/CheckboxList';

const CategoryGroups = ({
  boxWrapperKeyPrefix,
  categories,
  findByMain,
  onChange,
  onToggle,
  state,
}) =>
  Object.entries(categories).map(([slug, { name, sub, key }]) => {
    const categoriesInState = state && state[slug] || [];
    const defaultValue = categoriesInState.filter(({ _links: { self }, id }) =>
      new RegExp(`/terms/categories/${slug}`).test(self.public || id)
    );

    const numOptionsCheckedInCategory = categoriesInState.filter(
      ({ parentKey, disabled }) => disabled && parentKey === key
    ).length;

    const hasToggle = numOptionsCheckedInCategory !== findByMain(key).length;

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
    );
  });

CategoryGroups.propTypes = {
  boxWrapperKeyPrefix: PropTypes.string.isRequired,
  categories: types.categoriesType.isRequired,
  findByMain: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  state: PropTypes.shape({}),
};

export default memo(CategoryGroups);
