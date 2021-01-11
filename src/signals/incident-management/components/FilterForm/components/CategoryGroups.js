import React, { memo } from 'react';
import PropTypes from 'prop-types';

import * as types from 'shared/types';
import Label from 'components/Label';
import CheckboxList from '../../CheckboxList';

const CategoryGroups = ({ categories, filterSlugs, onChange, onToggle, onSubmit }) =>
  Object.entries(categories).map(([slug, { name, sub, key }]) => {
    const defaultValue = filterSlugs.filter(({ _links: { self }, id }) =>
      new RegExp(`/terms/categories/${slug}`).test(self.public || id)
    );

    return (
      <CheckboxList
        defaultValue={defaultValue}
        groupId={key}
        groupName="maincategory_slug"
        groupValue={slug}
        hasToggle
        key={slug}
        name={`${slug}_category_slug`}
        onChange={onChange}
        onToggle={onToggle}
        onSubmit={onSubmit}
        options={sub}
        title={<Label as="span">{name}</Label>}
      />
    );
  });

CategoryGroups.defaultProps = {
  filterSlugs: [],
};

CategoryGroups.propTypes = {
  categories: types.categoriesType.isRequired,
  filterSlugs: types.dataListType,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default memo(CategoryGroups);
