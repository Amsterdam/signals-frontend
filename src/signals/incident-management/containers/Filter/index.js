import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import { makeSelectCategories } from 'containers/App/selectors';

import {
  requestIncidents as onRequestIncidents,
  incidentSelected as onIncidentSelected,
  mainCategoryFilterSelectionChanged as onMainCategoryFilterSelectionChanged,
} from 'signals/incident-management/containers/IncidentOverviewPage/actions';
import makeSelectOverviewPage from 'signals/incident-management/containers/IncidentOverviewPage/selectors';

import Filter from 'signals/incident-management/components/Filter';

export const FiltersContainerComponent = (props) => (
  <Filter {...props} {...props.overviewpage} />
);

FiltersContainerComponent.propTypes = {
  categories: PropTypes.shape({
    main: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        slug: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ),
    mainToSub: PropTypes.shape({
      [PropTypes.string]: PropTypes.arrayOf(PropTypes.string),
    }),
    sub: PropTypes.arrayOf(
      PropTypes.shape({
        category_slug: PropTypes.string,
        handling_message: PropTypes.string,
        key: PropTypes.string.isRequired,
        slug: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ),
  }),
  overviewpage: PropTypes.shape({
    filter: PropTypes.shape({}),
    filterSubCategoryList: PropTypes.arrayOf(PropTypes.shape({})),
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
  }),
};

const mapStateToProps = createStructuredSelector({
  overviewpage: makeSelectOverviewPage(),
  categories: makeSelectCategories(),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onIncidentSelected,
      onMainCategoryFilterSelectionChanged,
      onRequestIncidents,
    },
    dispatch,
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(FiltersContainerComponent);
