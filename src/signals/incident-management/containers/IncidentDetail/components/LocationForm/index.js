import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import isEqual from 'lodash.isequal';

import { incidentType, locationType } from 'shared/types';
import { PATCH_TYPE_LOCATION } from 'models/incident/constants';

import { mapLocation } from 'shared/services/map-location';
import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import MapInput from '../../../../components/MapInput';
import HiddenInput from '../../../../components/HiddenInput';

import './style.scss';

class LocationForm extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      location: props.location,
      newLocation: props.newLocation,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onQueryResult = this.onQueryResult.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(props.incident.location, state.location)) {
      return {
        location: props.incident.location,
        newLocation: props.incident.location,
      };
    }

    return null;
  }

  componentDidMount() {
    this.props.onDismissError();
  }

  componentDidUpdate(prevProps) {
    const prevPatchingLocation = prevProps.patching && prevProps.patching.location;
    const patchingLocation = this.props.patching && this.props.patching.location;
    if (prevPatchingLocation !== patchingLocation && patchingLocation === false) {
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
      newLocation,
    });

    this.form.controls.location.setValue(newLocation);
    this.form.controls.coordinates.setValue(newLocation.geometrie.coordinates.join(','));
  }

  form = FormBuilder.group({
    coordinates: ['', Validators.required],
    location: this.props.incident.location,
  });

  handleSubmit = event => {
    event.preventDefault();

    this.props.onPatchIncident({
      id: this.props.incident.id,
      type: PATCH_TYPE_LOCATION,
      patch: { location: { ...this.state.newLocation } },
    });
  };

  render() {
    const { patching, error, onClose } = this.props;
    return (
      <div className="location-form">
        <FieldGroup
          control={this.form}
          render={() => (
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

                {error && (
                  <div className="notification notification-red">
                    {error && error.response && error.response.status === 403
                      ? 'U bent niet geautoriseerd om dit te doen.'
                      : 'De nieuwe locatie kon niet worden gewijzigd.'}
                  </div>
                )}

                <button
                  className="location-form__submit action primary"
                  type="submit"
                  data-testid="location-form-button-submit"
                >
                  <span className="value">Locatie opslaan</span>
                  {patching.location && (
                    <span className="working">
                      <div className="progress-indicator progress-white"></div>
                    </span>
                  )}
                </button>
                <button
                  className="location-form__cancel action secundary-grey"
                  type="button"
                  onClick={onClose}
                  data-testid="location-form-button-cancel"
                >
                  Annuleren
                </button>
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
};

LocationForm.propTypes = {
  incident: incidentType.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.shape({
      response: {
        status: PropTypes.number.isRequired,
        ok: PropTypes.bool.isRequired,
      },
    }),
    PropTypes.bool,
  ]).isRequired,
  patching: PropTypes.shape({
    location: PropTypes.bool,
  }).isRequired,
  location: locationType,
  newLocation: locationType,

  onPatchIncident: PropTypes.func.isRequired,
  onDismissError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LocationForm;
