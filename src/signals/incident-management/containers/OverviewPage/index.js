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

import { requestIncidents, incidentSelected } from './actions';
import Filter from './components/Filter';
import ListComponent from './components/List';
import Pager from './components/Pager';

export class OverviewPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onPageChanged = this.onPageChanged.bind(this);
  }

  componentDidMount() {
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
          <div className="col-4">
            <Filter filterIncidents={this.props.onRequestIncidents} filter={filter} {...rest} />
          </div>
          <div className="col-8">
            {loading ? (<LoadingIndicator />) : (
              <div>
                <ListComponent incidentSelected={this.props.onIncidentSelected} incidents={incidents} baseUrl={this.props.baseUrl} incidentsCount={incidentsCount} />
                <Pager incidentsCount={incidentsCount} page={page} onPageChanged={this.onPageChanged} />
              </div>)
            }
          </div>
        </div>
      </div>
    );
  }
}

OverviewPage.propTypes = {
  overviewpage: PropTypes.object.isRequired,
  baseUrl: PropTypes.string.isRequired,

  onRequestIncidents: PropTypes.func.isRequired,
  onIncidentSelected: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  overviewpage: makeSelectOverviewPage(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestIncidents: requestIncidents,
  onIncidentSelected: incidentSelected,
}, dispatch);


const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'overviewPage', reducer });
const withSaga = injectSaga({ key: 'overviewPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(OverviewPage);
