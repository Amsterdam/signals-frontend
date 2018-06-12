/**
*
* FilterComponent
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, FieldControl, Validators, } from 'react-reactive-form';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import './style.scss';
import { TextInput } from './components/TextInput';

class FilterComponent extends React.Component { // eslint-disable-line react/prefer-stateless-function
  filterForm = FormBuilder.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
  });
  handleReset = () => {
    this.filterForm.reset();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    // console.log('Form values', this.filterForm.value);
    this.props.filterIncidents(this.filterForm.value);
  }
  render() {
    return (
      <div className="filter-component col-md-4">
        <FormattedMessage {...messages.header} />

        <FieldGroup
          control={this.filterForm}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit}>

              <TextInput name="id" />
              {/* <FieldControl name="id" render={TextInput} /> */}
              <FieldControl
                name="name"
                render={(props) => (
                  <div>
                    {/* {console.log(props)} */}
                    <div className="rij mode_input text rij_verplicht">
                      <div className="label">
                        <label htmlFor="formName">Name</label>
                      </div>

                      <div className="invoer">
                        <input name="" id="formName" value="" className="input" type="text" {...props.handler()} />
                      </div>
                      <div>
                        {props.touched
                          && props.hasError('required')
                          && 'Name is required'}
                      </div>

                    </div>
                  </div>
                )}
              />
              <button className="action primary" onClick={this.handleReset}>
                <span className="value">Reset</span>
              </button>
              <button className="action primary" type="submit" disabled={invalid}>
                <span className="value">Submit</span>
              </button>
            </form>
          )}
        />
      </div>
    );
  }
}

FilterComponent.propTypes = {
  filterIncidents: PropTypes.func.isRequired
};

export default FilterComponent;
