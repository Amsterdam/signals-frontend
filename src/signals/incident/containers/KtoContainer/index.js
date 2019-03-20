import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { FormGenerator } from 'react-reactive-form';
import { defer } from 'lodash';

import ktoForm from 'signals/incident/definitions/ktoForm';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectKtoContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import { updateKto } from './actions';
import formatConditionalForm from '../../components/IncidentForm/services/format-conditional-form';

export class KtoContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.setForm = this.setForm.bind(this);
    this.setValues = this.setValues.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateKto = this.updateKto.bind(this);

    this.ktoForm = ktoForm;
  }

  componentWillMount() {
    console.log('mount', this.props.yesNo, this.props.uuid);
  }

  componentWillReceiveProps(props) {
    this.setValues(props.ktoContainer.kto);
  }

  setValues(incident, setAllValues) {
    defer(() => {
      Object.keys(this.form.controls).map((key) => {
        const control = this.form.controls[key];
        if (control.meta.isVisible) {
          control.enable();
        } else {
          control.disable();
        }
        if (!control.meta.doNotUpdateValue || setAllValues) {
          control.setValue(incident[key]);
        }
        return true;
      });
    });
  }

  setForm = (form) => {
    console.log('setForm');
    this.form = form;
    this.form.meta = {
      updateIncident: this.updateKto
    };

    if (this.ktoForm && this.ktoForm.controls && this.ktoForm.controls.tevreden && this.props.ktoContainer && this.props.ktoContainer.answers) {
      console.log('set answers', this.props.ktoContainer.answers);
      this.ktoForm.controls.tevreden.meta.values = {
        ...this.props.ktoContainer.answers,
        'Anders, namelijk...': 'Anders, namelijk...'
      };
    }
  }

  updateKto(value) {
    console.log('updateKto');
    this.props.updateKto(value);
  }

  handleSubmit(e) {
    console.log('handleSubmit');
    e.preventDefault();

    Object.values(this.form.controls).map((control) => control.onBlur());
  }

  render() {
    const { ktoContainer } = this.props;
    return (
      <div className="kto-container">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>Ja ik ben tevreden</h1>
              <form onSubmit={this.handleSubmit}>
                <FormGenerator
                  onMount={this.setForm}
                  fieldConfig={formatConditionalForm(this.ktoForm, ktoContainer.kto)}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

KtoContainer.defaultProps = {
  ktoContainer: {
    kto: {},
    answers: {}
  }
};

KtoContainer.propTypes = {
  uuid: PropTypes.string.isRequired,
  yesNo: PropTypes.string.isRequired,
  ktoContainer: PropTypes.object,

  updateKto: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  ktoContainer: makeSelectKtoContainer(),
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateKto
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'ktoContainer', reducer });
const withSaga = injectSaga({ key: 'ktoContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(KtoContainer);
