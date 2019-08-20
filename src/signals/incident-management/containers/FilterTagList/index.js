import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectCategories } from 'containers/App/selectors';

import './style.scss';

import makeSelectOverviewPage from '../IncidentOverviewPage/selectors';

const renderTag = (key, value, mainCategories, allLists) => {
  const found = allLists.find((i) => i.key === key || i.slug === key);
  const display = (found && found.value) || value;
  if (!display) {
    return;
  }

  const foundMain = mainCategories.find((i) => i.slug === value);
  // eslint-disable-next-line consistent-return
  return <span className="filter-tag-list__item" key={key}>{display}{foundMain && ': Alles'}</span>;
};

export const FilterTagList = ({ tags, overviewpage: { priorityList, stadsdeelList, statusList }, categories: { main, sub } }) => (
  <div className="filter-tag-list">
    {Object.values(tags).map((tag) => (Array.isArray(tag) ?
      <span key={tag}>{tag.map((item) =>
        renderTag(item, item, main, [...priorityList, ...stadsdeelList, ...statusList, ...sub, ...main]))}</span> :
        renderTag(tag, tag, main, [...priorityList, ...stadsdeelList, ...statusList, ...sub, ...main])))}
  </div>
);

FilterTagList.propTypes = {
  tags: PropTypes.object,
  overviewpage: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
};

FilterTagList.defaultProps = {
  tags: {}
};

const mapStateToProps = createStructuredSelector({
  overviewpage: makeSelectOverviewPage(),
  categories: makeSelectCategories(),
});

const withConnect = connect(
  mapStateToProps,
);

export default withConnect(FilterTagList);
