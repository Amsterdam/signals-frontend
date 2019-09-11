import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectCategories } from 'containers/App/selectors';

import './style.scss';

import makeSelectOverviewPage from '../IncidentOverviewPage/selectors';

const ignoredTags = ['id'];

const renderTag = (key, tagKey, mainCategories, list) => {
  let found = false;
  if (list) {
    found = list.find((i) => i.key === key || i.slug === key);
  }
  const display = (found && found.value) || key;
  if (!display || ignoredTags.includes(tagKey)) {
    return;
  }

  const foundMain = mainCategories.find((i) => i.slug === key);
  // eslint-disable-next-line consistent-return
  return <span className="filter-tag-list__item" key={key}>{display}{foundMain && ': Alles'}</span>;
};

export const FilterTagList = (props) => {
  const { tags, overviewpage: { priorityList, stadsdeelList, statusList, feedbackList }, categories: { main, sub } } = props;

  const map = {
    feedback: feedbackList,
    priority: priorityList,
    stadsdeel: stadsdeelList,
    status: statusList,
    maincategory_slug: main,
    category_slug: sub,
  };

  return (
    <div className="filter-tag-list">
      {Object.entries(tags).map(([tagKey, tag]) => (Array.isArray(tag) ?
        <span key={tag}>{tag.map((item) =>
        renderTag(item, tagKey, main, map[tagKey]))}</span> :
        renderTag(tag, tagKey, main, map[tagKey])))}
    </div>
  );
};

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
