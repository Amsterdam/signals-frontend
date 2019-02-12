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
        id: props.incident.id,
        part1subcategory: props.incident.category.sub_slug,
        part1text: props.incident.text,
        part1note: '',
        part2subcategory: props.incident.category.sub_slug,
        part2text: props.incident.text,
        part2note: ''
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
                  <FieldControlWrapper
                    render={SelectInput}
                    name="part1subcategory"
                    display="Subcategorie"
                    control={this.state.splitForm.get('part1subcategory')}
                    values={subcategories}
                    useSlug
                  />
                  <FieldControlWrapper
                    render={TextAreaInput}
                    name="part1text"
                    display="Omschrijving"
                    control={this.state.splitForm.get('part1text')}
                    rows={5}
                  />
                  <FieldControlWrapper
                    render={TextAreaInput}
                    name="part1note"
                    display="Notitie"
                    control={this.state.splitForm.get('part1note')}
                    rows={5}
                  />

                  <h2>Deelmelding 2</h2>
                  <FieldControlWrapper
                    render={SelectInput}
                    name="part2subcategory"
                    display="Subcategorie"
                    control={this.state.splitForm.get('part2subcategory')}
                    values={subcategories}
                    useSlug
                  />
                  <FieldControlWrapper
                    render={TextAreaInput}
                    name="part2text"
                    display="Omschrijving"
                    control={this.state.splitForm.get('part2text')}
                    rows={5}
                  />
                  <FieldControlWrapper
                    render={TextAreaInput}
                    name="part2note"
                    display="Notitie"
                    control={this.state.splitForm.get('part2note')}
                    rows={5}
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

SplitForm.defaultProps = {
  incident: {
    category: {}
  },
  subcategories: []
};

SplitForm.propTypes = {
  incident: PropTypes.object.isRequired,
  subcategories: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};

export default SplitForm;
