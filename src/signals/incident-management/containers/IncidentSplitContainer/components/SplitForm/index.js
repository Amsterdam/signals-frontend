/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { omitBy } from 'lodash';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import './style.scss';

import IncidentPart from '../IncidentPart';

class SplitForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: props.isVisible,
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
        part2priority: props.incident.priority.priority,
        part3subcategory: props.incident.category.sub_slug,
        part3text: props.incident.text,
        part3file: true,
        part3note: '',
        part3priority: props.incident.priority.priority
      })
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setVisibility = this.setVisibility.bind(this);
  }

  handleSubmit() {
    const values = omitBy(this.state.splitForm.value, (value, key) => {
      return !this.state.isVisible && key.match(/^part3/);
    });
    this.props.handleSubmit(values);
  }

  setVisibility(isVisible) {
    this.setState({ isVisible });
  }

  render() {
    const { incident, subcategories, priorityList, handleSubmit, handleCancel } = this.props;
    return (
      <div className="split-form">
        {incident ? (
          <div>
            <h1>Splitsen</h1>

            <IncidentPart
              index="1"
              incident={incident}
              subcategories={subcategories}
              priorityList={priorityList}
              splitForm={this.state.splitForm}
            />

            <IncidentPart
              index="2"
              incident={incident}
              subcategories={subcategories}
              priorityList={priorityList}
              splitForm={this.state.splitForm}
            />

            {this.state.isVisible ?
              <div>
                <button onClick={() => this.setVisibility(false)} className="action reset split-form__button-remove">Verwijder</button>

                <IncidentPart
                  index="3"
                  incident={incident}
                  subcategories={subcategories}
                  priorityList={priorityList}
                  splitForm={this.state.splitForm}
                />

              </div>
              :
              <button onClick={() => this.setVisibility(true)} className="action tertiair split-form__button-add">Deelmelding 3 toevoegen</button>
            }

            <div className="split-form__disclainer">
              <h4>Let op</h4>
              <ul>
                <li>De persoon die de oorspronkelijke melding heeft gedaan, ontvangt een email per deelmelding.</li>
                <li>De oorspronkelijke melding wordt afgesloten als deze gesplitst wordt.</li>
                <li>Een melding kan maar 1 keer gesplitst worden.</li>
              </ul>
            </div>

            <div>
              <button onClick={this.handleSubmit} className="action primary">Splitsen</button>
              <button onClick={handleCancel} className="action tertiair">Annuleer</button>
            </div>
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
  isVisible: false,
  subcategories: []
};

SplitForm.propTypes = {
  incident: PropTypes.object,
  isVisible: PropTypes.bool,
  subcategories: PropTypes.array,
  priorityList: PropTypes.array,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};

export default SplitForm;
