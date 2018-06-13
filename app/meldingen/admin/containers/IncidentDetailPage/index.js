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
    console.log('IncidentDetailPage');
    console.log(props.baseUrl);
    console.log(props.id);
    super(props);
    this.requestIncident = this.props.requestIncident.bind(this);
  }

  componentDidMount() {
    this.requestIncident(this.props.id);
  }

  render() {
    const { incident } = this.props.incidentdetailpage;
    const { loading } = this.props;
    return (
      <div className="incident-detail-page">
        <FormattedMessage {...messages.header} /> = {loading}
        Id={this.props.id}
        <Link to={`${this.props.baseUrl}/incidents`} >Terug</Link>
        <hr />
        {JSON.stringify(incident)};
      </div>
    );
  }
}

IncidentDetailPage.propTypes = {
  requestIncident: PropTypes.func.isRequired,

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
