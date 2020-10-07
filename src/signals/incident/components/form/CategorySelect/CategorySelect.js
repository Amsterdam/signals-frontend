import React, { useMemo, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Select from 'components/SelectInput';
import { useSelector } from 'react-redux';
import { makeSelectSubCategories } from 'models/categories/selectors';
import InfoText from 'components/InfoText';

const StyledInfoText = styled(InfoText)`
  margin-bottom: 0;
`;

const defaultOption = { key: '', name: 'Selecteer subcategorie', value: '' };

const CategorySelect = ({ handler, meta, parent }) => {
  const subcategories = useSelector(makeSelectSubCategories);
  const options = useMemo(() => subcategories?.map(({ slug, name }) => ({ key: slug, name, value: slug })), [
    subcategories,
  ]);

  const { value } = handler();

  const [info, setInfo] = useState();

  const getSubcategory = useCallback(slug => subcategories?.find(
    s => s.slug === slug
  ) || {}, [subcategories]);

  useEffect(() => {
    const { description } = getSubcategory(value);
    setInfo(description);
  }, [value, getSubcategory]);

  const handleChange = useCallback(
    event => {
      const { id, slug, category_slug: category, name, handling_message, description } = getSubcategory(event.target.value);
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
      <Select name={meta.name} value={`${handler().value}`} onChange={handleChange} options={[defaultOption, ...options || []]} />
      {info && <StyledInfoText text={`${info}`} />}
    </div>
  );
};

CategorySelect.propTypes = {
  handler: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
};

export default CategorySelect;
