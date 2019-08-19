import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import './style.scss';

import makeSelectOverviewPage from '../IncidentOverviewPage/selectors';

const renderTag = (key, value, allLists) => {
  const found = allLists.find((i) => i.key === key);
  const display = (found && found.value) || value;
  if (!display) {
    return;
  }
  // eslint-disable-next-line consistent-return
  return <span className="filter-tag-list__item" key={key}>{display}</span>;
};

export const FilterTagList = ({ tags, overviewpage: { priorityList, stadsdeelList, statusList } }) => (
  <div className="filter-tag-list">
    {Object.values(tags).map((tag) => (Array.isArray(tag) ?
      <span key={tag}>{tag.map((item) =>
        renderTag(item, item, [...priorityList, ...stadsdeelList, ...statusList]))}</span> :
        renderTag(tag, tag, [...priorityList, ...stadsdeelList, ...statusList])))}
  </div>
);

FilterTagList.propTypes = {
  tags: PropTypes.object.isRequired,
  overviewpage: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  overviewpage: makeSelectOverviewPage(),
});

const withConnect = connect(
  mapStateToProps,
);

export default withConnect(FilterTagList);
