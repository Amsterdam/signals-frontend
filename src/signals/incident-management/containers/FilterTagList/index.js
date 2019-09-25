import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import {
  makeSelectCategories,
  makeSelectDataLists,
} from 'containers/App/selectors';
import { makeSelectFilter } from 'signals/incident-management/containers/IncidentOverviewPage/selectors';
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
    return null;
  }

  if (isDate(display)) {
    display = moment(display).format('DD-MM-YYYY');
  }

  const foundMain = mainCategories.find((i) => i.key === key);

  display += foundMain ? allLabelAppend : '';

  return (
    <StyledTag colorType="tint" colorSubtype="level3" key={key}>
      {display}
    </StyledTag>
  );
};

export const FilterTagListComponent = (props) => {
  const {
    activeFilter,
    dataLists,
    categories: { main: maincategory_slug, sub: category_slug },
  } = props;

  const map = {
    category_slug,
    maincategory_slug,
    ...dataLists,
  };

  return (
    <FilterWrapper>
      {Object.entries(activeFilter.options).map(([tagKey, tag]) =>
        Array.isArray(tag)
          ? tag.map((item) =>
              renderTag(item.key, tagKey, maincategory_slug, map[tagKey]),
            )
          : renderTag(tag, tagKey, maincategory_slug, map[tagKey]),
      )}
    </FilterWrapper>
  );
};

FilterTagListComponent.propTypes = {
  activeFilter: types.parsedFilterType,
  categories: types.categories.isRequired,
  dataLists: types.dataLists.isRequired,
};

FilterTagListComponent.defaultProps = {
  activeFilter: {},
};

const mapStateToProps = createStructuredSelector({
  categories: makeSelectCategories(),
  dataLists: makeSelectDataLists(),
  activeFilter: makeSelectFilter(),
});

const withConnect = connect(mapStateToProps);

export default withConnect(FilterTagListComponent);
