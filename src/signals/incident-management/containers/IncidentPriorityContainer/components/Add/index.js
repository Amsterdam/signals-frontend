import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import SelectInput from '../../../../components/SelectInput';
import './style.scss';


class Add extends React.Component { // eslint-disable-line react/prefer-stateless-function
  priorityForm = FormBuilder.group({ // eslint-disable-line react/sort-comp
    _signal: [''],
    priority: ['', Validators.required],
    loading: false
  });

  handleSubmit = (event) => {
    event.preventDefault();
    const status = { ...this.priorityForm.value, _signal: this.props.id };
    this.props.onRequestPriorityUpdate(status);
  }

  componentWillUpdate(props) {
    if (props.loading !== this.props.loading) {
      this.priorityForm.controls.loading.setValue(props.loading);
    }
  }

  render() {
    const { priorityList, loading } = this.props;
    return (
      <div className="incident-priority-add">
        <div className="incident-priority-add__body">
          <FieldGroup
            control={this.priorityForm}
            render={({ invalid }) => (
              <form onSubmit={this.handleSubmit}>
                <div>
                  <FieldControlWrapper
                    render={SelectInput}
                    name="priority"
                    display="Urgentie"
                    control={this.priorityForm.get('priority')}
                    values={priorityList}
                    multiple={false}
                    emptyOptionText="Selecteer..."
                  />

                  <button className="action primary" type="submit" disabled={invalid || loading}>
                    <span className="value">Urgentie wijzigen</span>
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

Add.defaultProps = {
  loading: false
};

Add.propTypes = {
  id: PropTypes.string,
  priorityList: PropTypes.array,
  loading: PropTypes.bool,

  onRequestPriorityUpdate: PropTypes.func.isRequired
};

export default Add;
