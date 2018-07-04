/**
*
* FilterComponent
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import './style.scss';
import { TextInput } from './components/TextInput';

class FilterComponent extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);

    this.filterForm = FormBuilder.group({
      id: [''],
      stadsdeel: [''],
    });
    if (props.filter) this.filterForm.setValue(this.props.filter);
  }

  handleReset = () => {
    // console.log('Form reset');
    this.filterForm.reset();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    // console.log('Form values', this.filterForm.value);
    this.props.filterIncidents(this.filterForm.value);
  }

  render() {
    return (
      <div className="filter-component">
        <FieldGroup
          control={this.filterForm}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit}>
              <div>
                <TextInput name="id" display="Melding Id" control={this.filterForm.get('id')} />
                <TextInput name="stadsdeel" display="Staadsdeel" control={this.filterForm.get('stadsdeel')} />
                {/* <TextInputWrapper name="stadsdeel" display="Staadsdeel" control={this.filterForm.get('stadsdeel')} /> */}
                {/* <FieldControl name="id" render={TextInputRender('id', 'Melding Id')} />
              <FieldControl name="stadsdeel" render={TextInputRender('stadsdeel', 'Staadsdeel')} /> */}

                <button className="action primary" onClick={this.handleReset} type="button">
                  <span className="value">Reset filter</span>
                </button>
                <button className="action primary" type="submit" disabled={invalid}>
                  <span className="value">Zoek</span>
                </button>
              </div>
            </form>
          )}
        />
      </div>
    );
  }
}

FilterComponent.propTypes = {
  filter: PropTypes.object,
  filterIncidents: PropTypes.func.isRequired
};

export default FilterComponent;
