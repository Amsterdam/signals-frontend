import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { makeSelectCategories } from 'containers/App/selectors';
import { Tag } from '@datapunt/asc-ui';
import { isDate } from 'utils';
import moment from 'moment';

import makeSelectOverviewPage from '../IncidentOverviewPage/selectors';

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

  const foundMain = mainCategories.find((i) => i.slug === key);

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
    overviewpage: { priorityList, stadsdeelList, statusList, feedbackList },
    categories: { main, sub },
  } = props;

  const map = {
    feedback: feedbackList,
    priority: priorityList,
    stadsdeel: stadsdeelList,
    status: statusList,
    maincategory_slug: main,
    category_slug: sub,
  };

  return (
    <FilterWrapper>
      {Object.entries(tags).map(([tagKey, tag]) =>
        Array.isArray(tag)
          ? tag.map((item) => renderTag(item, tagKey, main, map[tagKey]))
          : renderTag(tag, tagKey, main, map[tagKey]),
      )}
    </FilterWrapper>
  );
};

FilterTagListComponent.propTypes = {
  tags: PropTypes.shape({
    incident_date: PropTypes.string,
    address_text: PropTypes.string,
    stadsdeel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    maincategory_slug: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    priority: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    status: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    category_slug: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
  }),
  overviewpage: PropTypes.shape({
    feedbackList: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ),
    priorityList: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ),
    stadsdeelList: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ),
    statusList: PropTypes.arrayOf(
      PropTypes.shape({
        color: PropTypes.string,
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        warning: PropTypes.string,
      }),
    ),
  }).isRequired,
  categories: PropTypes.shape({
    main: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        slug: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ),
    sub: PropTypes.arrayOf(
      PropTypes.shape({
        category_slug: PropTypes.string,
        handling_message: PropTypes.string,
        key: PropTypes.string.isRequired,
        slug: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
};

FilterTagListComponent.defaultProps = {
  tags: {},
};

const mapStateToProps = createStructuredSelector({
  overviewpage: makeSelectOverviewPage(),
  categories: makeSelectCategories(),
});

const withConnect = connect(mapStateToProps);

export default withConnect(FilterTagListComponent);
