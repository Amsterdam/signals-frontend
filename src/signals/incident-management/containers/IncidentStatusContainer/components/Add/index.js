import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import TextAreaInput from '../../../../components/TextAreaInput';
import SelectInput from '../../../../components/SelectInput';
import './style.scss';


class Add extends React.Component { // eslint-disable-line react/prefer-stateless-function
  // constructor(props) {
    // super(props);
    // this.sendToSigmax = this.sendToSigmax.bind(this);
  // }

  statusForm = FormBuilder.group({
    _signal: [''],
    state: ['', Validators.required],
    text: [''],
    forceRender: 0
  });

  handleSubmit = (event) => {
    event.preventDefault();
    const status = { ...this.statusForm.value, _signal: this.props.id };
    this.props.onRequestStatusCreate(status);
    this.statusForm.reset();
  }

  // sendToSigmax = () => {
    // const status = { _signal: this.props.id, state: 'i', text: 'sigmax' };
    // this.props.onRequestStatusCreate(status);
  // }

  render() {
    // TODO enable this when sigmax link is implemented
    // const { incidentStatusList, statusList } = this.props;
    // const currentState = incidentStatusList[incidentStatusList.length - 1].state;
    // const canSendToSigmax = !['i', 'o', 'a'].some((value) => value === currentState);
    const { statusList, loading } = this.props;
    this.statusForm.controls.forceRender.setValue(Math.random());
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

                  <button className="action primary" type="submit" disabled={invalid || loading}>
                    <span className="value">Status toevoegen</span>
                    {loading ?
                      <span className="working">
                        <div className="progress-indicator progress-white"></div>
                      </span>
                    : ''}
                  </button>
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

/*
{canSendToSigmax ?
  <button className="action tertiair" type="button" onClick={this.sendToSigmax}>
    <span className="value">Naar sigmax sturen</span>
  </button> : ''
}
*/

Add.defaultProps = {
  loading: false
};

Add.propTypes = {
  id: PropTypes.string,
  statusList: PropTypes.array,
  loading: PropTypes.bool,

  onRequestStatusCreate: PropTypes.func.isRequired
};

export default Add;
