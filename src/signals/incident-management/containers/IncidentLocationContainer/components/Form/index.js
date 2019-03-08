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
      newLocation: props.newLocation,
      locationForm: FormBuilder.group({
        coordinates: ['', Validators.required],
        location: props.incident.location,
        loading: false
      })
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

  // componentWillUpdate(props) {
    // if (props.loading !== this.props.loading) {
      // this.state.locationForm.controls.loading.setValue(props.loading);
    // }
  // }

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
      id: this.props.incident.id,
      patch: { location: { ...this.state.newLocation } }
    });
  }

  render() {
    const { loading } = this.props;
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

                  <button className="action primary" type="submit" disabled={invalid || loading}>
                    <span className="value">Locatie wijzigen</span>
                    {loading ?
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
  loading: false,
  location: {},
  newLocation: {},
  incident: {}
};

Form.propTypes = {
  id: PropTypes.string,
  loading: PropTypes.bool,
  incident: PropTypes.object,
  location: PropTypes.object,
  newLocation: PropTypes.object,

  onPatchIncident: PropTypes.func.isRequired
};

export default Form;
