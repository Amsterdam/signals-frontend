/**
 *
 * IncidentDetailPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Link } from 'react-router-dom';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import makeSelectIncidentDetailPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import './style.scss';

import { requestIncident } from './actions';


export class IncidentDetailPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.requestIncident = this.props.requestIncident.bind(this);
  }

  componentWillMount() {
    this.requestIncident(this.props.id);
  }

  render() {
    const { incident } = this.props.incidentdetailpage;
    const { loading } = this.props;
    return (
      <div className="incident-detail-page row">
        <ul className="col-6">
          <li><FormattedMessage {...messages.header} /> = {loading}</li>
          <li>Id={this.props.id}</li>
          <li><Link to={`${this.props.baseUrl}/incidents`} >Terug</Link></li>
          <li>{JSON.stringify(incident)}</li>
        </ul>
      </div>
    );
  }
}

IncidentDetailPage.propTypes = {
  requestIncident: PropTypes.func.isRequired,
  incidentdetailpage: PropTypes.object.isRequired,
  loading: PropTypes.boolean,

  id: PropTypes.string,
  baseUrl: PropTypes.string
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  incidentdetailpage: makeSelectIncidentDetailPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    requestIncident: (id) => dispatch(requestIncident(id)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentDetailPage', reducer });
const withSaga = injectSaga({ key: 'incidentDetailPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentDetailPage);
