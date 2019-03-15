import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import { patchIncident } from 'models/incident/actions';
import makeSelectIncidentModel from 'models/incident/selectors';

import Form from './components/Form';

import './style.scss';

export const LocationForm = ({ incidentModel, onPatchIncident }) => (
  <div className="incident-location-container">
    <Form incidentModel={incidentModel} onPatchIncident={onPatchIncident} />
  </div>
);

LocationForm.propTypes = {
  incidentModel: PropTypes.object.isRequired,
  onPatchIncident: PropTypes.func.isRequired
};

/* istanbul ignore next */
const mapStateToProps = () => createStructuredSelector({
  incidentModel: makeSelectIncidentModel()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onPatchIncident: patchIncident
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LocationForm);
