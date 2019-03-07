import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import { isEqual } from 'lodash';

import mapLocation from 'shared/services/map-location';
import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import MapInput from '../../../../components/MapInput';

import './style.scss';

class Form extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      newLocation: props.newLocation,
      locationForm: FormBuilder.group({
        location: props.incident.location,
        loading: false
      })
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onQueryResult = this.onQueryResult.bind(this);
  }

  locationForm = FormBuilder.group({ // eslint-disable-line react/sort-comp
    address_text: ['', Validators.required],
    loading: false
  });

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(props.incident.location, state.location)) {
      return {
        location: props.incident.location,
        newLocation: props.incident.location
      };
    }

    return null;
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.props.onPatchIncident({
      id: this.props.incident.id,
      patch: { location: { ...this.state.newLocation } }
    });
  }

  // componentWillUpdate(props) {
    // if (props.loading !== this.props.loading) {
      // this.locationForm.controls.loading.setValue(props.loading);
    // }
  // }

  onQueryResult(location) {
    this.setState({
      newLocation: mapLocation(location)
    });
  }

  render() {
    const { loading, incident } = this.props;
    const { locationForm } = this.state;
    return (
      <div className="incident-location-form">
        <div className="incident-location-form__body">
          <FieldGroup
            control={this.locationForm}
            render={() => (
              <form onSubmit={this.handleSubmit}>
                <div>
                  form for {incident.id}

                  <FieldControlWrapper
                    render={MapInput}
                    name="location"
                    display="Locatie"
                    control={locationForm.get('location')}
                    onQueryResult={this.onQueryResult}
                  />

                  <button className="action primary" type="submit" disabled={loading}>
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
