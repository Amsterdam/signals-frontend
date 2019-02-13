/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import './style.scss';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import CopyFileInput from '../../../../components/CopyFileInput';
import RadioInput from '../../../../components/RadioInput';
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
        part1file: true,
        part1note: '',
        part1priority: props.incident.priority.priority,
        part2subcategory: props.incident.category.sub_slug,
        part2text: props.incident.text,
        part2file: true,
        part2note: '',
        part2priority: props.incident.priority.priority
      })
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.props.handleSubmit(this.state.splitForm);
  }

  render() {
    const { incident, subcategories, priorityList, handleSubmit, handleCancel } = this.props;
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
                  {incident.image &&
                    <FieldControlWrapper
                      render={CopyFileInput}
                      name="part1file"
                      control={this.state.splitForm.get('part1file')}
                      values={[{ key: '1', alt: `Foto bij melding ${incident.id}`, value: incident.image }]}
                    />
                  }
                  <FieldControlWrapper
                    render={TextAreaInput}
                    name="part1note"
                    display="Notitie"
                    control={this.state.splitForm.get('part1note')}
                    rows={5}
                  />
                  <FieldControlWrapper
                    render={RadioInput}
                    name="part1priority"
                    display="Urgentie"
                    control={this.state.splitForm.get('part1priority')}
                    values={priorityList}
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
                  {incident.image &&
                    <FieldControlWrapper
                      render={CopyFileInput}
                      name="part2file"
                      control={this.state.splitForm.get('part2file')}
                      values={[{ key: '1', alt: `Foto bij melding ${incident.id}`, value: incident.image }]}
                    />
                  }
                  <FieldControlWrapper
                    render={TextAreaInput}
                    name="part2note"
                    display="Notitie"
                    control={this.state.splitForm.get('part2note')}
                    rows={5}
                  />
                  <FieldControlWrapper
                    render={RadioInput}
                    name="part2priority"
                    display="Urgentie"
                    control={this.state.splitForm.get('part2priority')}
                    values={priorityList}
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
    category: {},
    priority: {
      priority:  ''
    }
  },
  subcategories: []
};

SplitForm.propTypes = {
  incident: PropTypes.object,
  subcategories: PropTypes.array,
  priorityList: PropTypes.array,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};

export default SplitForm;
