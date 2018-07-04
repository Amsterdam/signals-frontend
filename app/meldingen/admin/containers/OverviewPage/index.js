import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import makeSelectOverviewPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import { requestIncidents, incidentSelected } from './actions';
import FilterComponent from './components/FilterComponent';
import ListComponent from './components/ListComponent';

export class OverviewPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.onRequestIncidents();
  }

  render() {
    const { incidents, loading, filter } = this.props.overviewpage;
    return (
      <div className="overview-page">
        {
          loading ? (
            <LoadingIndicator />
          ) : (
            <div className="row">
              <div className="col-4">
                <FilterComponent filterIncidents={this.props.onRequestIncidents} filter={filter} />
              </div>
              <div className="col-8">
                <ListComponent incidentSelected={this.props.onIncidentSelected} incidents={incidents} baseUrl={this.props.baseUrl} />
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

OverviewPage.propTypes = {
  overviewpage: PropTypes.object.isRequired,

  onRequestIncidents: PropTypes.func.isRequired,
  onIncidentSelected: PropTypes.func.isRequired,

  baseUrl: PropTypes.string.isRequired
};

const mapStateToProps = createStructuredSelector({
  overviewpage: makeSelectOverviewPage(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestIncidents: requestIncidents,
  onIncidentSelected: incidentSelected
}, dispatch);


// function mapDispatchToProps(dispatch) {
//   return {
//     requestIncidents: (filter) => dispatch(requestIncidents(filter)),
//     incidentSelected: (incident) => dispatch(incidentSelected(incident))
//   };
// }

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'overviewPage', reducer });
const withSaga = injectSaga({ key: 'overviewPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(OverviewPage);
