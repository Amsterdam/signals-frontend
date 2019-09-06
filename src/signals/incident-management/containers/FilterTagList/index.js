import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectCategories } from 'containers/App/selectors';

import './style.scss';

import makeSelectOverviewPage from '../IncidentOverviewPage/selectors';

const ignoredTags = ['id'];

const renderTag = (key, value, tagKey, mainCategories, allLists) => {
  const found = allLists.find((i) => i.key === key || i.slug === key);
  const display = (found && found.value) || value;
  if (!display || ignoredTags.includes(tagKey)) {
    return;
  }

  const foundMain = mainCategories.find((i) => i.slug === value);
  // eslint-disable-next-line consistent-return
  return <span className="filter-tag-list__item" key={key}>{display}{foundMain && ': Alles'}</span>;
};

export const FilterTagList = ({ tags, overviewpage: { priorityList, stadsdeelList, statusList }, categories: { main, sub } }) => (
  <div className="filter-tag-list">
    {Object.entries(tags).map(([tagKey, tag]) => (Array.isArray(tag) ?
      <span key={tag}>{tag.map((item) =>
        renderTag(item, item, tagKey, main, [...priorityList, ...stadsdeelList, ...statusList, ...sub, ...main]))}</span> :
        renderTag(tag, tag, tagKey, main, [...priorityList, ...stadsdeelList, ...statusList, ...sub, ...main])))}
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
