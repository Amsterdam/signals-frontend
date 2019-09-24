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
    overviewpage,
    categories: { main: maincategory_slug, sub: category_slug },
  } = props;

  const {
    feedbackList: feedback,
    priorityList: priority,
    stadsdeelList: stadsdeel,
    statusList: status,
  } = overviewpage;

  const map = {
    category_slug,
    feedback,
    maincategory_slug,
    priority,
    stadsdeel,
    status,
  };

  return (
    <FilterWrapper>
      {Object.entries(tags).map(([tagKey, tag]) =>
        Array.isArray(tag)
          ? tag.map((item) => renderTag(item.key, tagKey, maincategory_slug, map[tagKey]))
          : renderTag(tag, tagKey, maincategory_slug, map[tagKey]),
      )}
    </FilterWrapper>
  );
};

FilterTagListComponent.propTypes = {
  tags: PropTypes.shape({
    incident_date: PropTypes.string,
    address_text: PropTypes.string,
    stadsdeel: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        slug: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ),
    maincategory_slug: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        slug: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ),
    priority: PropTypes.string,
    status: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ),
    category_slug: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        slug: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ),
  }),
  overviewpage: PropTypes.shape({
    feedbackList: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
    priorityList: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
    stadsdeelList: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
    statusList: PropTypes.arrayOf(
      PropTypes.shape({
        color: PropTypes.string,
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        warning: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  categories: PropTypes.shape({
    main: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        slug: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
    sub: PropTypes.arrayOf(
      PropTypes.shape({
        category_slug: PropTypes.string,
        handling_message: PropTypes.string,
        key: PropTypes.string.isRequired,
        slug: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
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
