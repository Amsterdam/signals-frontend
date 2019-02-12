/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import './style.scss';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import TextInput from '../../../../components/TextInput';
import SelectInput from '../../../../components/SelectInput';
import TextAreaInput from '../../../../components/TextAreaInput';

class SplitForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      splitForm: FormBuilder.group({
        id: '',
        part1subcategory: '',
        part1text: '',
        part2text: ''
      })
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.props.handleSubmit(this.state.splitForm);
  }

  render() {
    const { incident, subcategories, handleSubmit, handleCancel } = this.props;
    return (
      <div className="split-form">
        {incident ? (
          <div>
            <h1>Splitsen</h1>

            <FieldGroup
              control={this.state.splitForm}
              render={({ invalid }) => (
                <form onSubmit={this.handleSubmit}>
                  <h2>Deelmelding 1</h2>

                  {/* <FieldControlWrapper
                    render={SelectInput}
                    name="part1subcategory"
                    display="Subcategorie"
                    control={this.state.splitForm.get('part1subcategory')}
                    values={subcategories}
                    useSlug
                    defaultValue={incident.category.sub_slug}
                  /> */}
                  <FieldControlWrapper
                    render={TextAreaInput}
                    name="part1text"
                    display="Tekst"
                    control={this.state.splitForm.get('part1text')}
                    value={incident.text}
                  />

                  <h2>Deelmelding 2</h2>

                  <FieldControlWrapper
                    render={TextAreaInput}
                    name="part2text"
                    display="Tekst"
                    control={this.state.splitForm.get('part2text')}
                    value={incident.text}
                  />

                </form>
              )}
            />
            <button onClick={this.handleSubmit} className="action primary">Splitsen</button>
            <button onClick={handleCancel} className="action tertiair">Annuleer</button>
          </div>
        )
      : ''}
      </div>
    );
  }
};

SplitForm.propTypes = {
  incident: PropTypes.object,
  subcategories: PropTypes.array,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};

export default SplitForm;
