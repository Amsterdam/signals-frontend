import React, { memo } from 'react';
import PropTypes from 'prop-types';

import * as types from 'shared/types';
import Label from 'components/Label';
import CheckboxList from '../../CheckboxList';

const CategoryGroups = ({ categories, filterSlugs, onChange, onToggle }) =>
  Object.keys(categories.mainToSub)
    .sort()
    .map(mainCategory => {
      const mainCatObj = categories.main.find(
        ({ slug }) => slug === mainCategory
      );
      const options = categories.mainToSub[mainCategory];
      const defaultValue = filterSlugs.filter(({ key, id }) =>
        new RegExp(`/terms/categories/${mainCatObj.slug}`).test(key || id)
      );

      return (
        <CheckboxList
          defaultValue={defaultValue}
          groupId={mainCatObj.key}
          groupName="maincategory_slug"
          groupValue={mainCatObj.slug}
          hasToggle
          key={mainCategory}
          name={`${mainCatObj.slug}_category_slug`}
          onChange={onChange}
          onToggle={onToggle}
          options={options}
          title={<Label as="span">{mainCatObj.value}</Label>}
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
};

export default memo(CategoryGroups);
