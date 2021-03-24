import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Select from 'components/Select';
import { useSelector } from 'react-redux';
import { makeSelectSubcategoriesGroupedByCategories } from 'models/categories/selectors';
import InfoText from 'components/InfoText';

const StyledInfoText = styled(InfoText)`
  margin-bottom: 0;
`;

const emptyOption = { key: '', name: 'Selecteer subcategorie', slug: '', group: '' };

const CategorySelect = ({ handler, meta, parent }) => {
  const [subcategoryGroups, subcategoryOptions] = useSelector(makeSelectSubcategoriesGroupedByCategories);

  const { value } = handler();
  const [info, setInfo] = useState();

  const getSubcategory = useCallback(slug => subcategoryOptions?.find(s => s.slug === slug) || {}, [subcategoryOptions]);

  useEffect(() => {
    const { description } = getSubcategory(value);
    setInfo(description);
  }, [value, getSubcategory]);

  const handleChange = useCallback(
    event => {
      const item = getSubcategory(event.target.value);

      const { id, slug, category_slug: category, name, description, handling_message } = item;
      setInfo(description);
      parent.meta.updateIncident({
        category,
        subcategory: slug,
        classification: {
          id,
          name,
          slug,
        },
        handling_message,
      });
    },
    [parent, getSubcategory]
  );

  return (
    <div>
      {subcategoryOptions && (
        <Select
          id={meta.name}
          aria-describedby={info && `info-${meta.name}`}
          name={meta.name}
          value={value}
          onChange={handleChange}
          options={subcategoryOptions}
          optionKey="slug"
          optionValue="slug"
          groups={subcategoryGroups}
          emptyOption={emptyOption}
        />
      )}
      {info && <StyledInfoText text={`${info}`} id={`info-${meta.name}`} />}
    </div>
  );
};

CategorySelect.propTypes = {
  handler: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
};

export default CategorySelect;
