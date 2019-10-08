import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { makeSelectCategories } from 'containers/App/selectors';
import { makeSelectDataLists } from 'signals/incident-management/selectors';
import { Tag } from '@datapunt/asc-ui';
import { isDate } from 'utils';
import moment from 'moment';
import * as types from 'shared/types';

const FilterWrapper = styled.div`
  margin-top: 10px;
`;

const StyledTag = styled(Tag)`
  display: inline-block;
  margin: 0 5px 5px 0;
`;

const ignoredTags = ['id'];

export const allLabelAppend = ': Alles';

const renderTag = (key, tagKey, mainCategories, list) => {
  let found = false;

  if (list) {
    found = list.find((i) => i.key === key || i.slug === key);
  }

  let display = (found && found.value) || key;

  if (!display || ignoredTags.includes(tagKey)) {
    return;
  }

  if (isDate(display)) {
    display = moment(display).format('DD-MM-YYYY');
  }

  const foundMain = mainCategories.find((i) => i.key === key);

  display += foundMain ? allLabelAppend : '';

  // eslint-disable-next-line consistent-return
  return (
    <StyledTag colorType="tint" colorSubtype="level3" key={key}>
      {display}
    </StyledTag>
  );
};

export const FilterTagListComponent = (props) => {
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

  if (!tags) {
    return null;
  }

  return (
    <FilterWrapper className="incident-overview-page__filter-tag-list">
      {Object.entries(tags).map(([tagKey, tag]) =>
        Array.isArray(tag)
          ? tag.map((item) => renderTag(item.key, tagKey, main, map[tagKey]))
          : renderTag(tag, tagKey, main, map[tagKey]),
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
