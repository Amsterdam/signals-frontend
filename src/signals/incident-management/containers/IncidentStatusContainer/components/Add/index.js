import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import TextAreaInput from '../../../../components/TextAreaInput';
import SelectInput from '../../../../components/SelectInput';
import './style.scss';


class Add extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.sendToSigmax = this.sendToSigmax.bind(this);
  }

  statusForm = FormBuilder.group({ // eslint-disable-line react/sort-comp
    _signal: [''],
    state: ['', Validators.required],
    text: [''],
    loading: false,
    loadingExternal: false
  });

  componentWillUpdate(props) {
    if (props.loading !== this.props.loading) {
      this.statusForm.controls.loading.setValue(props.loading);
    }
    if (props.loadingExternal !== this.props.loadingExternal) {
      this.statusForm.controls.loadingExternal.setValue(props.loadingExternal);
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const status = { ...this.statusForm.value, _signal: this.props.id };
    this.props.onRequestStatusCreate(status);
    this.statusForm.reset();
  }

  sendToSigmax = () => {
    const status = {
      _signal: this.props.id,
      state: 'ready to send',
      target_api: 'sigmax'
    };

    this.props.onRequestStatusCreate(status);
  }

  render() {
    const { incidentStatusList, statusList, error, loading, loadingExternal } = this.props;
    const currentState = incidentStatusList[incidentStatusList.length - 1].state;
    const canSendToSigmax = !['o', 'a'].some((value) => value === currentState);
    // const { statusList, loading, error } = this.props;
    // const canSendToSigmax = false; // disabled for the moment
    return (
      <div className="incident-status-add">
        {/* <div className="incident-status-add__title">Status toevoegen</div> */}
        <div className="incident-status-add__body">
          <FieldGroup
            control={this.statusForm}
            render={({ invalid }) => (
              <form onSubmit={this.handleSubmit}>
                <div>
                  <FieldControlWrapper render={SelectInput} name="state" display="Status" control={this.statusForm.get('state')} values={statusList} multiple={false} emptyOptionText="Selecteer..." />
                  <FieldControlWrapper render={TextAreaInput} name="text" display="Omschrijving" control={this.statusForm.get('text')} rows={5} />

                  {error ? <div className="notification notification-red" >De gekozen status is niet mogelijk in deze situatie.</div> : ''}

                  <button className="incident-status-add__submit action primary" type="submit" disabled={invalid || loading}>
                    <span className="value">Status toevoegen</span>
                    {loading ?
                      <span className="working">
                        <div className="progress-indicator progress-white"></div>
                      </span>
                    : ''}
                  </button>
                  {canSendToSigmax ?
                    <button className="incident-status-add__send action tertiair" type="button" onClick={this.sendToSigmax}>
                      <span className="value">Naar sigmax sturen</span>
                      {loadingExternal ?
                        <span className="working">
                          <div className="progress-indicator progress-blue"></div>
                        </span>
                      : ''}
                    </button> : ''
                  }
                  <div>
                  </div>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    );
  }
}

Add.defaultProps = {
  loading: false,
  loadingExternal: false,
  error: false
};

Add.propTypes = {
  id: PropTypes.string,
  statusList: PropTypes.array,
  incidentStatusList: PropTypes.array,
  loading: PropTypes.bool,
  loadingExternal: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),

  onRequestStatusCreate: PropTypes.func.isRequired
};

export default Add;
