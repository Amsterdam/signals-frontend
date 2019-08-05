import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import isEqual from 'lodash.isequal';

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
    if (!isEqual(props.incident.location, state.location)) {
      return {
        location: props.incident.location,
        newLocation: props.incident.location
      };
    }

    return null;
  }

  componentDidMount() {
    this.props.onDismissError();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.patching && prevProps.patching.location, this.props.patching && this.props.patching.location) && this.props.patching.location === false) {
      const hasError = (this.props.error && this.props.error.response && !this.props.error.response.ok) || false;
      if (!hasError) {
        this.props.onClose();
      }
    }
    this.form.updateValueAndValidity();
  }

  onQueryResult(location) {
    const newLocation = mapLocation(location);
    this.setState({
      newLocation
    });

    this.form.controls.location.setValue(newLocation);
    this.form.controls.coordinates.setValue(newLocation.geometrie.coordinates.join(','));
  }

  form = FormBuilder.group({
    coordinates: ['', Validators.required],
    location: this.props.incident.location
  });

  handleSubmit = (event) => {
    event.preventDefault();

    this.props.onPatchIncident({
      id: this.props.incident.id,
      type: 'location',
      patch: { location: { ...this.state.newLocation } }
    });
  }

  render() {
    const { patching, error, onClose } = this.props;
    return (
      <div className="location-form">
        <FieldGroup
          control={this.form}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit}>
              <div>
                <FieldControlWrapper
                  render={HiddenInput}
                  name="coordinates"
                  display="Coordinates"
                  control={this.form.get('coordinates')}
                />

                <FieldControlWrapper
                  render={MapInput}
                  name="location"
                  control={this.form.get('location')}
                  onQueryResult={this.onQueryResult}
                />

                {error ? <div className="notification notification-red" >
                  {error && error.response && error.response.status === 403 ?
                      'U bent niet geautoriseerd om dit te doen.' :
                      'De nieuwe locatie kon niet worden gewijzigd.'}
                </div> : ''}

                <button className="location-form__submit action primary" type="submit" disabled={invalid} data-testid="location-form-button-submit">
                  <span className="value">Status opslaan</span>
                  {patching.location ? <span className="working"><div className="progress-indicator progress-white"></div></span> : ''}
                </button>
                <button className="location-form__cancel action secundary-grey" onClick={onClose} data-testid="location-form-button-cancel">Annuleren</button>
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
  newLocation: {}
};

LocationForm.propTypes = {
  incident: PropTypes.object.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  patching: PropTypes.object.isRequired,
  location: PropTypes.object,
  newLocation: PropTypes.object,

  onPatchIncident: PropTypes.func.isRequired,
  onDismissError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default LocationForm;
