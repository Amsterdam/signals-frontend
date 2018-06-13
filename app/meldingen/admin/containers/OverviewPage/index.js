import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import makeSelectOverviewPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import './style.scss';

import { requestIncidents, incidentSelected, filterIncidents } from './actions';
import FilterComponent from './components/FilterComponent';
import ListComponent from './components/ListComponent';


export class OverviewPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    // console.log('OverviewPage');
    // console.log(props.baseUrl);
    super(props);
    this.onFilterIncidents = this.onFilterIncidents.bind(this);
    this.requestIncidents = this.props.requestIncidents.bind(this);
    this.filterIncidents = this.props.filterIncidents.bind(this);
    this.incidentSelected = this.props.incidentSelected.bind(this);
  }

  componentWillMount() {
    this.props.requestIncidents();
  }

  onFilterIncidents(filter) {
    this.filterIncidents(filter);
    this.requestIncidents();
  }

  render() {
    const { incidents, selectedIncident, filter } = this.props.overviewpage;
    const { loading } = this.props;
    return (
      <div className="overview-page container">

        <FormattedMessage {...messages.header} /> - loading: {loading.toString()}
        <div>
          <FilterComponent filterIncidents={this.onFilterIncidents} />
          <ListComponent incidentSelected={this.incidentSelected} incidents={incidents} baseUrl={this.props.baseUrl} />
        </div>
        <br />Selected incident:
        <hr />
        <button className="action primary" onClick={this.requestIncidents}>
          <span className="value">Refresh</span>
        </button>

        <hr />
        <br />Selected incident: {JSON.stringify(selectedIncident)}
        <br />Selected filter:{JSON.stringify(filter)}
        <hr />

      </div>
    );
  }
}

OverviewPage.propTypes = {
  overviewpage: PropTypes.object.isRequired,
  loading: PropTypes.bool,

  requestIncidents: PropTypes.func.isRequired,
  incidentSelected: PropTypes.func.isRequired,
  filterIncidents: PropTypes.func.isRequired,

  baseUrl: PropTypes.string.isRequired
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  overviewpage: makeSelectOverviewPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    requestIncidents: (filter) => dispatch(requestIncidents(filter)),
    incidentSelected: (incident) => dispatch(incidentSelected(incident)),
    filterIncidents: (incident) => dispatch(filterIncidents(incident)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'overviewPage', reducer });
const withSaga = injectSaga({ key: 'overviewPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(OverviewPage);
