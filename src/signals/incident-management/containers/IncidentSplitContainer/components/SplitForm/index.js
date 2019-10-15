import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Heading } from '@datapunt/asc-ui';
import styled, { ascDefaultTheme } from '@datapunt/asc-core';

import { FormBuilder } from 'react-reactive-form';

import IncidentPart from '../IncidentPart';
console.log('-', ascDefaultTheme.colors);
const StyledButton = styled(Button)`
  margin-right: 20px;
  background-color: white;
`;

const StyledSubmitButton = styled(Button)`
  margin-right: 20px;
`;

const StyledRemoveButton = styled(Button)`
  background-color: ${ascDefaultTheme.colors.bright.main};
  padding: 0;
  border-color: transparent;
  float: right;
`;

const StyledH4 = styled(Heading)`
  font-weight: normal;
  margin-bottm: 8px;
`;

const StyledDisclaimer = styled.div`
  background-color: ${ascDefaultTheme.colors.tint.level3};
  padding: 15px;
  margin-bottom: 20px;
  line-height: 22px;

  ul {
    margin: 0 0 0 25px;
    padding: 0;

    li {
      list-style-type: square;
      margin-top: 10px;
    }
  }
`;

const StyledBottomDisclaimer = styled(StyledDisclaimer)`
  margin: 20px 0;
`;

class SplitForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: props.isVisible
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setVisibility = this.setVisibility.bind(this);
  }

  setVisibility(isVisible) {
    this.setState({ isVisible });
  }

  form = FormBuilder.group({
    part1: FormBuilder.group({
      subcategory: this.props.incident.category.category_url,
      text: this.props.incident.text,
      image: true,
      note: '',
      priority: this.props.incident.priority.priority,
    }),
    part2: FormBuilder.group({
      subcategory: this.props.incident.category.category_url,
      text: this.props.incident.text,
      image: true,
      note: '',
      priority: this.props.incident.priority.priority,
    }),
    part3: FormBuilder.group({
      subcategory: this.props.incident.category.category_url,
      text: this.props.incident.text,
      image: true,
      note: '',
      priority: this.props.incident.priority.priority,
    }),
  });

  handleSubmit() {
    const create = [];
    const update = [];
    const parts = ['part1', 'part2'];
    if (this.state.isVisible) {
      parts.push('part3');
    }

    parts.forEach((part) => {
      update.push(this.form.value[part]);
      create.push({
        category: {
          sub_category: this.form.value[part].subcategory
        },
        reuse_parent_image: this.form.value[part].image,
        text: this.form.value[part].text
      });
    });

    this.props.handleSubmit({
      id: this.props.incident.id,
      create,
      update
    });
  }

  render() {
    const { incident, attachments, subcategories, priorityList, handleCancel } = this.props;
    return (
      <div>
        <StyledDisclaimer data-testid="splitFormDisclaimer">
          Splitsen mag alleen als de oorspronkelijke melding over twee verschillende onderwerpen gaat, die zonder samenwerking met een andere afdeling kan worden afgehandeld.
        </StyledDisclaimer>

        <IncidentPart
          index="1"
          attachments={attachments}
          subcategories={subcategories}
          priorityList={priorityList}
          splitForm={this.form}
        />

        <IncidentPart
          index="2"
          incident={incident}
          attachments={attachments}
          subcategories={subcategories}
          priorityList={priorityList}
          splitForm={this.form}
        />

        {this.state.isVisible ?
          <Fragment>
            <StyledRemoveButton
              data-testid="splitForPartRemove"
              variant="textButton"
              onClick={() => this.setVisibility(false)}
            >Verwijder</StyledRemoveButton>

            <IncidentPart
              index="3"
              incident={incident}
              attachments={attachments}
              subcategories={subcategories}
              priorityList={priorityList}
              splitForm={this.form}
            />

          </Fragment>
          :
          <StyledButton
            data-testid="splitForPartAdd"
            variant="primaryInverted"
            onClick={() => this.setVisibility(true)}
          >Deelmelding 3 toevoegen</StyledButton>
        }

        <StyledBottomDisclaimer data-testid="splitFormBottomDisclaimer">
          <StyledH4 $as="h4">Let op</StyledH4>
          <ul>
            <li>De persoon die de oorspronkelijke melding heeft gedaan, ontvangt een email per deelmelding.</li>
            <li>De oorspronkelijke melding wordt afgesloten als deze gesplitst wordt.</li>
            <li>Een melding kan maar 1 keer gesplitst worden.</li>
          </ul>
        </StyledBottomDisclaimer>

        <Fragment>
          <StyledSubmitButton
            variant="secondary"
            onClick={this.handleSubmit}
          >Splitsen</StyledSubmitButton>
          <StyledButton
            variant="primaryInverted"
            onClick={handleCancel}
          >Annuleer</StyledButton>
        </Fragment>
      </div>
    );
  }
}

SplitForm.defaultProps = {
  incident: {
    category: {},
    priority: {
      priority: ''
    }
  },
  isVisible: false,
  subcategories: []
};

SplitForm.propTypes = {
  incident: PropTypes.object,
  attachments: PropTypes.array,
  isVisible: PropTypes.bool,
  subcategories: PropTypes.array,
  priorityList: PropTypes.array,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};

export default SplitForm;
