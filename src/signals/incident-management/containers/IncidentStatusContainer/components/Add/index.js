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

  statusForm = FormBuilder.group({
    _signal: [''],
    state: ['', Validators.required],
    text: [''],
  });

  handleSubmit = (event) => {
    event.preventDefault();
    const status = { ...this.statusForm.value, _signal: this.props.id };
    this.props.onRequestStatusCreate(status);
    this.statusForm.reset();
  }

  sendToSigmax = () => {
    const status = { _signal: this.props.id, state: 'i', text: 'sigmax' };
    this.props.onRequestStatusCreate(status);
  }

  render() {
    // TODO enable this when sigmax link is implemented
    // const { incidentStatusList, statusList } = this.props;
    // const currentState = incidentStatusList[incidentStatusList.length - 1].state;
    // const canSendToSigmax = !['i', 'o', 'a'].some((value) => value === currentState);
    const { statusList } = this.props;
    const canSendToSigmax = false; // disabled for the moment
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

                  <button className="action primary" type="submit" disabled={invalid}>
                    <span className="value">Status toevoegen</span>
                  </button>
                  {canSendToSigmax ?
                    <button className="action tertiair" type="button" onClick={this.sendToSigmax}>
                      <span className="value">Naar sigmax sturen</span>
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

Add.propTypes = {
  id: PropTypes.string,
  statusList: PropTypes.array,

  onRequestStatusCreate: PropTypes.func.isRequired
};

export default Add;
