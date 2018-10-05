import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import makeSelectOverviewPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import { requestIncidents, requestCategories, incidentSelected, mainCategoryFilterSelectionChanged } from './actions';
import Filter from './components/Filter';
import ListComponent from './components/List';
import Pager from './components/Pager';

export class IncidentOverviewPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onPageChanged = this.onPageChanged.bind(this);
  }

  componentDidMount() {
    this.props.onRequestCategories({});
    this.props.onRequestIncidents({});
  }

  onPageChanged(page) {
    this.props.onRequestIncidents({ filter: null, page });
  }

  render() {
    const { incidents, loading, filter, incidentsCount, page, ...rest } = this.props.overviewpage;
    return (
      <div className="overview-page">
        <div className="row">
          <div className="col-3">
            <Filter onRequestIncidents={this.props.onRequestIncidents} onMainCategoryFilterSelectionChanged={this.props.onMainCategoryFilterSelectionChanged} filter={filter} {...rest} />
          </div>
          <div className="col-9">
            {loading ? (<LoadingIndicator />) : (
              <div>
                <ListComponent incidentSelected={this.props.onIncidentSelected} incidents={incidents} baseUrl={this.props.baseUrl} incidentsCount={incidentsCount} {...rest} />
                <Pager incidentsCount={incidentsCount} page={page} onPageChanged={this.onPageChanged} />
              </div>)
            }
          </div>
        </div>
      </div>
    );
  }
}

IncidentOverviewPage.propTypes = {
  overviewpage: PropTypes.object.isRequired,
  baseUrl: PropTypes.string.isRequired,

  onRequestIncidents: PropTypes.func.isRequired,
  onRequestCategories: PropTypes.func.isRequired,
  onIncidentSelected: PropTypes.func.isRequired,
  onMainCategoryFilterSelectionChanged: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  overviewpage: makeSelectOverviewPage(),
  loading: makeSelectLoading(),
  error: makeSelectError()
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestIncidents: requestIncidents,
  onRequestCategories: requestCategories,
  onIncidentSelected: incidentSelected,
  onMainCategoryFilterSelectionChanged: mainCategoryFilterSelectionChanged
}, dispatch);


const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'overviewPage', reducer });
const withSaga = injectSaga({ key: 'overviewPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentOverviewPage);
