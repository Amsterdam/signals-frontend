import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import { isEqual } from 'lodash';

// import MapInteractive from 'components/MapInteractive';
import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import MapInput from '../../../../components/MapInput';

import './style.scss';

class Form extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      location: props.location,
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
      return { location: props.incident.location };
    }

    return null;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const patch = {
      location: {
        ...this.props.incident.location,
        address: {
          ...this.props.incident.location.address,
          huisletter: 'E'
        }
      }
    };
    this.props.onPatchIncident({ id: this.props.incident.id, patch });
  }

  // componentWillUpdate(props) {
    // if (props.loading !== this.props.loading) {
      // this.locationForm.controls.loading.setValue(props.loading);
    // }
  // }
  componentDidMount(props) {
    console.log('mount', props);
  }

  onQueryResult(location) {
    console.log('onQueryResult', location);
  }

  render() {
    const { loading, incident } = this.props;
    const { location, locationForm } = this.state;
    console.log('render', location);
    console.log('locationForm', locationForm);
    return (
      <div className="incident-location-form">
        <div className="incident-location-form__body">
          <FieldGroup
            control={this.locationForm}
            render={({ invalid }) => (
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
  incident: {}
};

Form.propTypes = {
  id: PropTypes.string,
  loading: PropTypes.bool,
  incident: PropTypes.object,
  location: PropTypes.object,

  onPatchIncident: PropTypes.func.isRequired
};

export default Form;
