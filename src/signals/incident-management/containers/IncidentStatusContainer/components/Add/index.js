import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import TextAreaInput from '../../../../components/TextAreaInput';
import SelectInput from '../../../../components/SelectInput';
import Thor from '../Thor';
import './style.scss';


class Add extends React.Component { // eslint-disable-line react/prefer-stateless-function
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

  render() {
    const { incidentStatusList, changeStatusOptionList, error, loading, loadingExternal } = this.props;
    return (
      <div className="incident-status-add">
        <div className="incident-status-add__body">
          <FieldGroup
            control={this.statusForm}
            render={({ invalid }) => (
              <form onSubmit={this.handleSubmit}>
                <div>
                  <FieldControlWrapper render={SelectInput} name="state" display="Status" control={this.statusForm.get('state')} values={changeStatusOptionList} multiple={false} emptyOptionText="Selecteer..." />
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
                  <Thor
                    id={this.props.id}
                    currentState={incidentStatusList[incidentStatusList.length - 1].state}
                    onRequestStatusCreate={this.props.onRequestStatusCreate}
                    loading={loadingExternal}
                  />
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
  changeStatusOptionList: PropTypes.array,
  incidentStatusList: PropTypes.array,
  loading: PropTypes.bool,
  loadingExternal: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),

  onRequestStatusCreate: PropTypes.func.isRequired
};

export default Add;
