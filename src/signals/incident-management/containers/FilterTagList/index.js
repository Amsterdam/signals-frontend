import React, { useCallback } from 'react';
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
  :first-letter {
    text-transform: capitalize;
  }`;

export const allLabelAppend = ': Alles';

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

  const mapKeys = useCallback(key => {
    switch (key) {
      case 'source':
        return 'bron';

      default:
        return key;
    }
  }, []);

  const renderItem = useCallback((display, key) => (
    <StyledTag
      colorType="tint"
      colorSubtype="level3"
      key={key}
      data-testid="filterTagListTag"
    >
      {display}
    </StyledTag>
  ), []);

  const renderGroup = useCallback((tag, list, tagKey) => {
    if (tag.length === list.length) {
      return renderItem(`${mapKeys(tagKey)}${allLabelAppend}`, tagKey);
    }
    return tag.map(item => renderTag(item.key, list));
  }, [mapKeys, renderItem, renderTag]);

  const renderTag = useCallback((key, list) => {
    let found = false;

    if (list) {
      found = list.find(i => i.key === key || i.slug === key);
    }

    let display = (found && found.value) || key;

    if (!display) {
      return;
    }

    if (moment(display, 'YYYY-MM-DD', true).isValid()) {
      display = moment(display).format('DD-MM-YYYY');
    }

    const foundMain = main.find(i => i.key === key);

    display += foundMain ? allLabelAppend : '';
    // eslint-disable-next-line consistent-return
    return renderItem(display, key);
  }, [main, renderItem]);

  return (
    <FilterWrapper className="incident-overview-page__filter-tag-list">
      {Object.entries(tags).map(([tagKey, tag]) =>
        Array.isArray(tag)
          ? renderGroup(tag, map[tagKey], tagKey)
          : renderTag(tag, map[tagKey])
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
