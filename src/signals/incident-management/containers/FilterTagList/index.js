import React, { useContext, useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { Tag } from '@datapunt/asc-ui';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

import { makeSelectMainCategories, makeSelectSubCategories } from 'models/categories/selectors';
import dataLists from 'signals/incident-management/definitions';
import configuration from 'shared/services/configuration/configuration';
import { dataListType, filterType } from 'shared/types';

import AppContext from '../../../../containers/App/context';
import IncidentManagementContext from '../../context';

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
  <StyledTag colorType="tint" colorSubtype="level3" key={key} data-testid="filterTagListTag">
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
  const { tags, mainCategories, subCategories } = props;
  const { sources } = useContext(AppContext);
  const { districts } = useContext(IncidentManagementContext);

  const map = {
    ...dataLists,
    area: districts,
    maincategory_slug: mainCategories,
    category_slug: subCategories,
    source: configuration.fetchSourcesFromBackend ? sources : dataLists.source,
  };

  const tagsList = { ...tags };

  // piece together date strings into one tag
  const dateRange = useMemo(() => {
    if (!tagsList.created_after && !tagsList.created_before) return undefined;

    return [
      'Datum:',
      tagsList.created_after && format(parseISO(tagsList.created_after), 'dd-MM-yyyy'),
      't/m',
      (tagsList.created_before && format(parseISO(tagsList.created_before), 'dd-MM-yyyy')) || 'nu',
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
  tags: filterType,
  mainCategories: dataListType,
  subCategories: dataListType,
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
