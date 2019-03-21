import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { FormGenerator } from 'react-reactive-form';
import { defer, isEqual } from 'lodash';

import ktoForm from 'signals/incident/definitions/ktoForm';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectKtoContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import { updateKto, requestKtaAnswers } from './actions';
import formatConditionalForm from '../../components/IncidentForm/services/format-conditional-form';

const andersOption = { 'Anders, namelijk...': 'Anders, namelijk...' };

export class KtoContainer extends React.Component {
  constructor(props) {
    super(props);

    this.setForm = this.setForm.bind(this);
    this.setValues = this.setValues.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateKto = this.updateKto.bind(this);

    this.ktoForm = ktoForm;
  }

  componentWillMount() {
    this.props.requestKtaAnswers(this.props.yesNo);
  }

  componentWillReceiveProps(props) {
    if (!isEqual(props.ktoContainer.answers, this.props.ktoContainer.answers) && this.ktoForm && this.ktoForm.controls) {
      if (this.props.yesNo === 'ja' && this.ktoForm.controls.tevreden && this.ktoForm.controls.tevreden.meta) {
        this.ktoForm.controls.tevreden.meta.values = {
          ...props.ktoContainer.answers,
          ...andersOption
        };
      }

      if (this.props.yesNo === 'nee' && this.ktoForm.controls.niet_tevreden && this.ktoForm.controls.niet_tevreden.meta) {
        this.ktoForm.controls.niet_tevreden.meta.values = {
          ...props.ktoContainer.answers,
          ...andersOption
        };
      }
    }

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
    this.form = form;
    this.form.meta = {
      updateIncident: this.updateKto
    };
  }

  updateKto(value) {
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
              <h1>Ja ik ben vraag</h1>
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
  // uuid: PropTypes.string.isRequired,
  yesNo: PropTypes.string.isRequired,
  ktoContainer: PropTypes.object,

  updateKto: PropTypes.func.isRequired,
  requestKtaAnswers: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  ktoContainer: makeSelectKtoContainer(),
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateKto,
  requestKtaAnswers
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'ktoContainer', reducer });
const withSaga = injectSaga({ key: 'ktoContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(KtoContainer);
