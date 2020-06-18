import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { Tag } from '@datapunt/asc-ui';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import {
  makeSelectMainCategories,
  makeSelectSubCategories,
} from 'models/categories/selectors';
import dataLists from 'signals/incident-management/definitions';
import * as types from 'shared/types';

const FilterWrapper = styled.div`
  margin-top: 10px;
  flex-basis: 100%;
`;

const StyledTag = styled(Tag)`
  display: inline-block;
  margin: 0 5px 5px 0;
  white-space: nowrap;
  :first-letter {
    text-transform: capitalize;
  }
`;

export const allLabelAppend = ': Alles';

export const mapKeys = key => {
  switch (key) {
    case 'source':
      return 'bron';

    case 'priority':
      return 'urgentie';

    case 'contact_details':
      return 'contact';

    default:
      return key;
  }
};
const renderItem = (display, key) => (
  <StyledTag
    colorType="tint"
    colorSubtype="level3"
    key={key}
    data-testid="filterTagListTag"
  >
    {display}
  </StyledTag>
);

const renderGroup = (tag, main, list, tagKey) => {
  if (tag.length === list.length) {
    return renderItem(`${mapKeys(tagKey)}${allLabelAppend}`, tagKey);
  }

  return tag.map(item => renderTag(item.key, main, list));
};

const renderTag = (key, mainCategories, list) => {
  let found = false;

  if (list) {
    found = list.find(i => i.key === key || i.slug === key);
  }

  let display = (found && found.value) || key;
  if (!display) {
    return null;
  }

  const foundMain = mainCategories.find(i => i.key === key);

  display += foundMain ? allLabelAppend : '';
  // eslint-disable-next-line consistent-return
  return renderItem(display, key);
};

export const FilterTagListComponent = props => {
  const {
    tags,
    mainCategories,
    subCategories,
  } = props;

  const map = {
    ...dataLists,
    maincategory_slug: mainCategories,
    category_slug: subCategories,
  };

  const tagsList = { ...tags };

  // piece together date strings into one tag
  const dateRange = useMemo(() => {
    if (!tagsList.created_after && !tagsList.created_before) return undefined;

    return [
      'Datum:',
      tagsList.created_after && format(parseISO(tagsList.created_after),'DD-MM-YYYY'),
      't/m',
      (tagsList.created_before &&
        format(parseISO(tagsList.created_before),'DD-MM-YYYY')) ||
      'nu',
    ]
      .filter(Boolean)
      .join(' ');
  }, [tagsList.created_after, tagsList.created_before]);

  if (dateRange) {
    delete tagsList.created_after;
    delete tagsList.created_before;

    tagsList.dateRange = dateRange;
  }

  return mainCategories && subCategories ? (
    <FilterWrapper>
      {Object.entries(tagsList).map(([tagKey, tag]) =>
        Array.isArray(tag)
          ? renderGroup(tag, mainCategories, map[tagKey], tagKey)
          : renderTag(tag, mainCategories, map[tagKey])
      )}
    </FilterWrapper>
  ) : null;
};

FilterTagListComponent.propTypes = {
  tags: types.filterType,
  mainCategories: types.dataListType,
  subCategories: types.dataListType,
};

FilterTagListComponent.defaultProps = {
  tags: {},
};

const mapStateToProps = createStructuredSelector({
  mainCategories: makeSelectMainCategories,
  subCategories: makeSelectSubCategories,
});

const withConnect = connect(mapStateToProps);

export default withConnect(FilterTagListComponent);
