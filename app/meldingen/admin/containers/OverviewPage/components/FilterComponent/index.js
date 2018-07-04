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
      datum: [''],
      stadsdeel: [''],
      rubriek: [''],
      status: [''],
      adres: [''],
    });
    if (props.filter) this.filterForm.setValue(this.props.filter);
  }

  onFilter = (filter) => {
    this.props.filterIncidents(filter);
  }

  handleReset = () => {
    // console.log('Form reset');
    this.filterForm.reset();
    this.onFilter(this.filterForm.value);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    // console.log('Form values', this.filterForm.value);
    this.onFilter(this.filterForm.value);
  }

  status = [
  { id: '', name: 'Alle statussen' },
    { id: '1', name: 'Gemeld' },
    { id: '2', name: 'In afwachting op behandeling' },
    { id: '3', name: 'Goedgekeurd voor verzenden' },
    { id: '4', name: 'Verzonden' },
    { id: '5', name: 'In behandeling' },
    { id: '6', name: 'Afgehandeld' },
  ];

  rubriek = [
    { id: '1', name: 'Snel varen' },
    { id: '2', name: 'Schepvaart nautisch toezicht' },
    { id: '3', name: 'Gezonken boot' },
    { id: '4', name: 'Geluid' },
  ];

  stadsdeel = [
    { id: '', name: 'Alle stadsdelen' },
    { id: 'C', name: 'Centrum' },
    { id: 'N', name: 'Noord' },
    { id: 'W', name: 'West' },
    { id: 'NW', name: 'Nieuw-West' },
    { id: 'O', name: 'Oost' },
    { id: 'Z', name: 'Zuid' },
    { id: 'ZO', name: 'Zuidoost' },
    { id: 'G', name: 'Geen stadsdeel' },
  ];

  render() {
    return (
      <div className="filter-component">
        <FieldGroup
          control={this.filterForm}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit}>
              <div>
                <TextInput name="id" display="Melding Id" control={this.filterForm.get('id')} />
                <TextInput name="datum" display="Datum" control={this.filterForm.get('datum')} />
                <TextInput name="stadsdeel" display="Staadsdeel" control={this.filterForm.get('stadsdeel')} />
                <TextInput name="rubriek" display="Rubriek" control={this.filterForm.get('rubriek')} />
                <TextInput name="status" display="Status" control={this.filterForm.get('status')} />
                <TextInput name="adres" display="Adres" control={this.filterForm.get('adres')} />

                <button className="action" onClick={this.handleReset} type="button">
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
