import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import { TextInput } from '../../../../components/TextInput';
import { SelectInput } from '../../../../components/SelectInput';
import './style.scss';


class Add extends React.Component { // eslint-disable-line react/prefer-stateless-function
  statusForm = FormBuilder.group({
    _signal: [''],
    state: [''],
    text: [''],
  });

  handleSubmit = (event) => {
    event.preventDefault();
    const status = { ...this.statusForm.value, _signal: this.props.id };
    this.props.onRequestStatusCreate(status);
  }

  render() {
    const { statusList } = this.props;
    return (
      <div className="incident-status-add">
        <div className="filter-component__title">Filters</div>
        <div className="filter-component__body">
          <FieldGroup
            control={this.statusForm}
            render={({ invalid }) => (
              <form onSubmit={this.handleSubmit}>
                <div>
                  {/* <HiddenInput name="_signal" control={this.statusForm.get('_signal')} value={this.props.id} /> */}
                  <SelectInput name="state" display="Status" control={this.statusForm.get('state')} values={statusList} multiple={false} />
                  <TextInput name="text" display="Omschrijving" control={this.statusForm.get('text')} />

                  <button className="action primary" type="submit" disabled={invalid}>
                    <span className="value">Status toevoegen</span>
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

Add.propTypes = {
  id: PropTypes.string,
  statusList: PropTypes.array,

  onRequestStatusCreate: PropTypes.func.isRequired
};

export default Add;
