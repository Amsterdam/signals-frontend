import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import { isEqual } from 'lodash';

import mapLocation from 'shared/services/map-location';
import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import MapInput from '../../../../components/MapInput';
import HiddenInput from '../../../../components/HiddenInput';

import './style.scss';

class LocationForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      location: props.location,
      newLocation: props.newLocation
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onQueryResult = this.onQueryResult.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(props.incidentModel.incident.location, state.location)) {
      return {
        location: props.incidentModel.incident.location,
        newLocation: props.incidentModel.incident.location
      };
    }

    return null;
  }

  componentDidUpdate(props) {
    if (props.incidentModel.patching.location !== this.props.incidentModel.patching.location) {
      this.locationForm.updateValueAndValidity();
    }
  }

  onQueryResult(location) {
    const newLocation = mapLocation(location);
    this.setState({
      newLocation
    });

    this.locationForm.controls.location.setValue(newLocation);
    this.locationForm.controls.coordinates.setValue(newLocation.geometrie.coordinates.join(','));
  }
  locationForm = FormBuilder.group({
    coordinates: ['', Validators.required],
    location: this.props.incidentModel.incident.location
  });

  handleSubmit = (event) => {
    event.preventDefault();

    this.props.onPatchIncident({
      id: this.props.incidentModel.incident.id,
      type: 'location',
      patch: { location: { ...this.state.newLocation } }
    });

    this.props.onClose();
  }

  render() {
    const { incidentModel, onClose } = this.props;
    return (
      <div className="location-form">
        <FieldGroup
          control={this.locationForm}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit}>
              <div>
                <FieldControlWrapper
                  render={HiddenInput}
                  name="coordinates"
                  display="Coordinates"
                  control={this.locationForm.get('coordinates')}
                />

                <FieldControlWrapper
                  render={MapInput}
                  name="location"
                  control={this.locationForm.get('location')}
                  onQueryResult={this.onQueryResult}
                />

                {incidentModel.error ? <div className="notification notification-red" >
                  {incidentModel.error && incidentModel.error.response && incidentModel.error.response.status === 403 ?
                      'U bent niet geautoriseerd om dit te doen.' :
                      'De nieuwe locatie kon niet worden gewijzigd.'}
                </div> : ''}

                <button className="action primary" type="submit" disabled={invalid || incidentModel.patching.location}>
                  <span className="value">Locatie wijzigen</span>
                </button>

                <button className="location-form__cancel action secundary-grey" onClick={onClose}>Cancel</button>
              </div>
            </form>
            )}
        />
      </div>
    );
  }
}

LocationForm.defaultProps = {
  location: {},
  newLocation: {},
  incidentModel: {
    incident: {},
    patching: {
      location: false
    }
  }
};

LocationForm.propTypes = {
  id: PropTypes.string,
  incidentModel: PropTypes.object,
  location: PropTypes.object,
  newLocation: PropTypes.object,

  onPatchIncident: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default LocationForm;
