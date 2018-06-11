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

import { requestIncidents, selectIncident, filterIncidents } from './actions';
import FilterComponent from '../../components/FilterComponent';


export class OverviewPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.selectLastIncident = this.selectLastIncident.bind(this);
    this.requestIncidents = this.props.requestIncidents.bind(this);
    this.filterIncidents = this.props.filterIncidents.bind(this);
  }

  componentWillMount() {
    this.props.requestIncidents();
  }

  selectLastIncident() {
    const { incidents } = this.props.overviewpage;
    const incident = incidents[2];
    this.props.selectIncident(incident);
  }

  render() {
    const { incidents, selectedIncident } = this.props.overviewpage;
    const { loading } = this.props;
    return (
      <div className="overview-page">
        <FormattedMessage {...messages.header} /> - loading: {loading.toString()}
        <FilterComponent filterIncidents={this.filterIncidents} />
        <br />There are {incidents.length} found.
        <br /><input type="button" onClick={this.requestIncidents} value="Refresh" />
        <br />{JSON.stringify(incidents)}
        <hr />
        <br /><input type="button" onClick={this.selectLastIncident} value="Select last incident" />
        <hr />
        Selected incident:
        <hr />
        <br />{JSON.stringify(selectedIncident)}

      </div>
    );
  }
}

OverviewPage.propTypes = {
  overviewpage: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  // error: PropTypes.oneOfType([
  //   PropTypes.object,
  //   PropTypes.bool,
  // ]),

  requestIncidents: PropTypes.func.isRequired,
  selectIncident: PropTypes.func.isRequired,
  filterIncidents: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  overviewpage: makeSelectOverviewPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    requestIncidents: (filter) => dispatch(requestIncidents(filter)),
    selectIncident: (incident) => dispatch(selectIncident(incident)),
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
