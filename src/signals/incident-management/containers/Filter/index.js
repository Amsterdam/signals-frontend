import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import { makeSelectCategories } from 'containers/App/selectors';
import {
  requestIncidents,
  incidentSelected as onIncidentSelected,
} from 'signals/incident-management/containers/IncidentOverviewPage/actions';
import makeSelectOverviewPage, { makeSelectFilter } from 'signals/incident-management/containers/IncidentOverviewPage/selectors';
import FilterForm from 'signals/incident-management/components/FilterForm';
import { resetSearchQuery } from 'models/search/actions';

import saga from './saga';
import reducer from './reducer';
import {
  filterSaved as onSaveFilter,
  filterUpdated as onUpdateFilter,
  filterCleared as onClearFilter,
} from './actions';

export const FilterContainerComponent = ({
  onResetSearchQuery,
  onRequestIncidents,
  overviewpage,
  onSubmit,
  ...rest
}) => {
  const onFormSubmit = (event, formData) => {
    onResetSearchQuery();
    onRequestIncidents({ filter: formData });
    onSubmit(event);
  };

  return <FilterForm {...rest} {...overviewpage} onSubmit={onFormSubmit} />;
};

FilterContainerComponent.propTypes = {
  activeFilter: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    options: PropTypes.shape({
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
  }),
  categories: PropTypes.shape({
    main: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        slug: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ),
    mainToSub: PropTypes.shape({
      [PropTypes.string]: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }),
      ),
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
  onClearFilter: PropTypes.func.isRequired,
  onRequestIncidents: PropTypes.func.isRequired,
  onResetSearchQuery: PropTypes.func.isRequired,
  onSaveFilter: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUpdateFilter: PropTypes.func.isRequired,
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
  }),
};

const mapStateToProps = () =>
  createStructuredSelector({
    overviewpage: makeSelectOverviewPage(),
    categories: makeSelectCategories(),
    activeFilter: makeSelectFilter,
  });

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onClearFilter,
      onIncidentSelected,
      onRequestIncidents: requestIncidents,
      onResetSearchQuery: resetSearchQuery,
      onSaveFilter,
      onUpdateFilter,
    },
    dispatch,
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'incidentManagementFilter', reducer });
const withSaga = injectSaga({ key: 'incidentManagementFilter', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(FilterContainerComponent);
