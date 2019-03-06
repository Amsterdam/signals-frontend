import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';

// import MapInteractive from 'components/MapInteractive';

import './style.scss';

//                  <MapInteractive location={incidentModel.incident.location} onQueryResult={this.onQueryResult} />

class Form extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onQueryResult = this.onQueryResult.bind(this);
  }

  locationForm = FormBuilder.group({ // eslint-disable-line react/sort-comp
    _signal: [''],
    location: ['', Validators.required],
    loading: false
  });

  handleSubmit = (event) => {
    event.preventDefault();
    const patch = { location: {} };
    this.props.onPatchIncident({ id: this.props.incident.id, patch });
  }

  componentWillUpdate(props) {
    if (props.loading !== this.props.loading) {
      this.locationForm.controls.loading.setValue(props.loading);
    }
  }

  onQueryResult(a, b) {
    console.log('onQueryResult', a, b);
  }

  render() {
    const { loading, incident } = this.props;
    return (
      <div className="incident-location-form">
        <div className="incident-location-form__body">
          <FieldGroup
            control={this.locationForm}
            render={({ invalid }) => (
              <form onSubmit={this.handleSubmit}>
                <div>
                  form for {incident.id}


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
  incident: {}
};

Form.propTypes = {
  id: PropTypes.string,
  loading: PropTypes.bool,
  incident: PropTypes.object,

  onPatchIncident: PropTypes.func.isRequired
};

export default Form;
