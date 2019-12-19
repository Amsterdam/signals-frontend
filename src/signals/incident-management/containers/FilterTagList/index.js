import React, { useMemo} from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { makeSelectCategories } from 'containers/App/selectors';
import { makeSelectDataLists } from 'signals/incident-management/selectors';
import { Tag } from '@datapunt/asc-ui';
import moment from 'moment';
import * as types from 'shared/types';

const FilterWrapper = styled.div`
  margin-top: 10px;
`;

const StyledTag = styled(Tag)`
  display: inline-block;
  margin: 0 5px 5px 0;
`;

export const allLabelAppend = ': Alles';

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

  return (
    <StyledTag
      colorType="tint"
      colorSubtype="level3"
      key={key}
      data-testid="filterTagListTag"
    >
      {display}
    </StyledTag>
  );
};

export const FilterTagListComponent = props => {
  const {
    tags,
    dataLists,
    categories: { main, sub },
  } = props;

  const map = {
    ...dataLists,
    maincategory_slug: main,
    category_slug: sub,
  };

  const tagsList = { ...tags };

  // piece together date strings into one tag
  const dateRange = useMemo(() => {
    if (!tagsList.created_after && !tagsList.created_before) return undefined;

    return [
      'Datum:',
      tagsList.created_after && moment(tagsList.created_after).format('DD-MM-YYYY'),
      't/m',
      (tagsList.created_before &&
        moment(tagsList.created_before).format('DD-MM-YYYY')) ||
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

  return (
    <FilterWrapper className="incident-overview-page__filter-tag-list">
      {Object.entries(tagsList).map(([tagKey, tag]) =>
        Array.isArray(tag)
          ? tag.map(item => renderTag(item.key, main, map[tagKey]))
          : renderTag(tag, main, map[tagKey])
      )}
    </FilterWrapper>
  );
};

FilterTagListComponent.propTypes = {
  tags: types.filterType,
  categories: types.categoriesType.isRequired,
  dataLists: types.dataListsType.isRequired,
};

FilterTagListComponent.defaultProps = {
  tags: {},
};

const mapStateToProps = createStructuredSelector({
  categories: makeSelectCategories(),
  dataLists: makeSelectDataLists,
});

const withConnect = connect(mapStateToProps);

export default withConnect(FilterTagListComponent);
