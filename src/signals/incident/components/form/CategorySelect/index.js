import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import Select from 'components/SelectInput';
import { useSelector } from 'react-redux';
import { makeSelectSubCategories } from 'models/categories/selectors';
import { getCategory } from 'shared/services/resolveClassification';

const CategorySelect = ({ handler, meta, parent }) => {
  const subcategories = useSelector(makeSelectSubCategories);
  const options = useMemo(() => subcategories?.map(({ slug, name }) => ({ key: slug, name, value: slug })), [
    subcategories,
  ]);

  const handleChange = useCallback(
    event => {
      const { handling_message, ...category } = getCategory(subcategories.find(s => s.slug === event.target.value));
      parent.meta.updateIncident({
        category,
        handling_message: category.handling_message,
      });
    },
    [parent, subcategories]
  );

  return (
    <Select name={meta.name} value={`${handler().value.slug}`} onChange={handleChange} options={options || []} />
  );
};

CategorySelect.propTypes = {
  handler: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
};

export default CategorySelect;
