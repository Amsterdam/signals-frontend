/**
*
* FilterComponent
*
*/

import React from 'react';
import { FormBuilder, FieldGroup, FieldControl, Validators, } from 'react-reactive-form';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import './style.scss';

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
    console.log('Form values', this.filterForm.value);
  }
  render() {
    return (
      <div className="filter-component">
        <FormattedMessage {...messages.header} />
        <FieldGroup
          control={this.filterForm}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit}>
              <FieldControl
                name="id"
                render={({ handler, touched, hasError }) => (
                  <div>
                    <input {...handler()} />
                    <span>
                      {touched
                        && hasError('required')
                        && 'Username is required'}
                    </span>
                  </div>
                )}
              />
              <FieldControl
                name="name"
                render={({ handler, touched, hasError }) => (
                  <div>
                    <input {...handler()} />
                    <span>
                      {touched
                        && hasError('required')
                        && 'Password is required'}
                    </span>
                  </div>
                )}
              />
              <button
                type="button"
                onClick={this.handleReset}
              >
                Reset
                    </button>
              <button
                type="submit"
                disabled={invalid}
              >
                Submit
                    </button>
            </form>
          )}
        />
      </div>
    );
  }
}

FilterComponent.propTypes = {

};

export default FilterComponent;
