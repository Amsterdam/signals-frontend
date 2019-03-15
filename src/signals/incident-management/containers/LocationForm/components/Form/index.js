import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import { isEqual } from 'lodash';

import mapLocation from 'shared/services/map-location';
import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import MapInput from '../../../../components/MapInput';
import HiddenInput from '../../../../components/HiddenInput';

import './style.scss';

class Form extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      location: props.location,
      newLocation: props.newLocation,
      locationForm: FormBuilder.group({
        coordinates: ['', Validators.required],
        location: props.incidentModel.incident.location
      })
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
      this.state.locationForm.updateValueAndValidity();
    }
  }

  onQueryResult(location) {
    const newLocation = mapLocation(location);
    this.setState({
      newLocation
    });

    this.state.locationForm.controls.location.setValue(newLocation);
    this.state.locationForm.controls.coordinates.setValue(newLocation.geometrie.coordinates.join(','));
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.props.onPatchIncident({
      id: this.props.incidentModel.incident.id,
      type: 'location',
      patch: { location: { ...this.state.newLocation } }
    });
  }

  render() {
    const { incidentModel } = this.props;
    const { locationForm } = this.state;
    return (
      <div className="incident-location-form">
        <div className="incident-location-form__body">
          <FieldGroup
            control={locationForm}
            render={({ invalid }) => (
              <form onSubmit={this.handleSubmit}>
                <div>
                  <FieldControlWrapper
                    render={HiddenInput}
                    name="coordinates"
                    display="Coordinates"
                    control={locationForm.get('coordinates')}
                  />

                  <FieldControlWrapper
                    render={MapInput}
                    name="location"
                    display="Locatie"
                    control={locationForm.get('location')}
                    onQueryResult={this.onQueryResult}
                  />

                  {incidentModel.error ? <div className="notification notification-red" >
                    {incidentModel.error && incidentModel.error.response && incidentModel.error.response.status === 403 ?
                      'U bent niet geautoriseerd om dit te doen.' :
                      'De nieuwe locatie kon niet worden gewijzigd.'}
                  </div> : ''}

                  <button className="action primary" type="submit" disabled={invalid || incidentModel.patching.location}>
                    <span className="value">Locatie wijzigen</span>
                    {incidentModel.patching.location ?
                      <span className="working">
                        <div className="progress-indicator progress-white"></div>
                      </span>
                    : ''}
                  </button>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    );
  }
}

Form.defaultProps = {
  location: {},
  newLocation: {},
  incidentModel: {
    incident: {},
    patching: {
      location: false
    }
  }
};

Form.propTypes = {
  id: PropTypes.string,
  incidentModel: PropTypes.object,
  location: PropTypes.object,
  newLocation: PropTypes.object,

  onPatchIncident: PropTypes.func.isRequired
};

export default Form;
