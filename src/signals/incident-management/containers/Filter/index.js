import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import { makeSelectCategories } from 'containers/App/selectors';
import {
  requestIncidents as onRequestIncidents,
  incidentSelected as onIncidentSelected,
  mainCategoryFilterSelectionChanged as onMainCategoryFilterSelectionChanged,
} from 'signals/incident-management/containers/IncidentOverviewPage/actions';
import makeSelectOverviewPage from 'signals/incident-management/containers/IncidentOverviewPage/selectors';
import FilterForm from 'signals/incident-management/components/FilterForm';

import saga from './saga';
import reducer from './reducer';
import { filterSaved, filterUpdated, filterCleared } from './actions';

export const FilterContainerComponent = (props) => (
  <FilterForm {...props} {...props.overviewpage} />
);

FilterContainerComponent.propTypes = {
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
  overviewpage: PropTypes.shape({
    filter: PropTypes.shape({
      incident_date_start: PropTypes.string,
      address_text: PropTypes.string,
      stadsdeel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      main_slug: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      name: PropTypes.string,
      priority: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      status: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      sub_slug: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
    }),
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
  onSaveFilter: PropTypes.func.isRequired,
  onClearFilter: PropTypes.func.isRequired,
  onUpdateFilter: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  overviewpage: makeSelectOverviewPage(),
  categories: makeSelectCategories(),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onClearFilter: filterCleared,
      onIncidentSelected,
      onMainCategoryFilterSelectionChanged,
      onRequestIncidents,
      onSaveFilter: filterSaved,
      onUpdateFilter: filterUpdated,
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
