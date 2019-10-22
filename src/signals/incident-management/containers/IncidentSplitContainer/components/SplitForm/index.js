import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Heading, themeColor } from '@datapunt/asc-ui';
import styled from 'styled-components';
import { incidentType, attachmentsType, dataListType } from 'shared/types';

import { FormBuilder } from 'react-reactive-form';

import IncidentPart from '../IncidentPart';

const StyledButton = styled(Button)`
  margin-right: 20px;
  background-color: ${themeColor('tint', 'level1')};
`;

const StyledSubmitButton = styled(Button)`
  margin-right: 20px;
`;

const StyledRemoveButton = styled(Button)`
  background-color: ${themeColor('tint', 'level1')};
  padding: 0;
  border-color: transparent;
  float: right;
`;

const StyledH4 = styled(Heading)`
  font-weight: normal;
  margin-bottm: 8px;
`;

const StyledDisclaimer = styled.div`
  background-color: ${themeColor('tint', 'level3')};
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

let form;

const SplitForm = ({
  incident,
  attachments,
  subcategories,
  priorityList,
  onHandleCancel,
  onHandleSubmit,
}) => {
  const [isVisible, setVisibility] = useState(false);

  const handleSubmit = () => {
    const create = [];
    const update = [];
    const parts = ['part1', 'part2'];
    if (isVisible) {
      parts.push('part3');
    }

    parts.forEach(part => {
      update.push(form.value[part]);
      create.push({
        category: {
          sub_category: form.value[part].subcategory,
        },
        reuse_parent_image: form.value[part].image,
        text: form.value[part].text,
      });
    });

    onHandleSubmit({
      id: incident.id,
      create,
      update,
    });
  };

  useEffect(() => {
    form = FormBuilder.group({
      part1: FormBuilder.group({
        subcategory: incident.category.category_url,
        text: incident.text,
        image: true,
        note: '',
        priority: incident.priority.priority,
      }),
      part2: FormBuilder.group({
        subcategory: incident.category.category_url,
        text: incident.text,
        image: true,
        note: '',
        priority: incident.priority.priority,
      }),
      part3: FormBuilder.group({
        subcategory: incident.category.category_url,
        text: incident.text,
        image: true,
        note: '',
        priority: incident.priority.priority,
      }),
    });
  }, []);

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
        splitForm={form}
      />

      <IncidentPart
        index="2"
        attachments={attachments}
        subcategories={subcategories}
        priorityList={priorityList}
        splitForm={form}
      />

      {isVisible ?
        <Fragment>
          <StyledRemoveButton
            data-testid="splitFormPartRemove"
            variant="textButton"
            onClick={() => setVisibility(false)}
          >Verwijder</StyledRemoveButton>

          <IncidentPart
            index="3"
            attachments={attachments}
            subcategories={subcategories}
            priorityList={priorityList}
            splitForm={form}
          />

        </Fragment>
        :
        <StyledButton
          data-testid="splitFormPartAdd"
          variant="primaryInverted"
          onClick={() => setVisibility(true)}
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

      <StyledSubmitButton
        data-testid="splitFormSubmit"
        variant="secondary"
        onClick={handleSubmit}
      >Splitsen</StyledSubmitButton>
      <StyledButton
        data-testid="splitFormCancel"
        variant="primaryInverted"
        onClick={onHandleCancel}
      >Annuleer</StyledButton>
    </div>
  );
};

SplitForm.defaultProps = {
  incident: {
    category: {
      category_url: '',
    },
    priority: {
      priority: '',
    },
  },
  attachments: [],
  subcategories: [],
  priorityList: [],
};

SplitForm.propTypes = {
  incident: incidentType,
  attachments: attachmentsType,
  subcategories: dataListType,
  priorityList: dataListType,
  onHandleSubmit: PropTypes.func.isRequired,
  onHandleCancel: PropTypes.func.isRequired,
};

export default SplitForm;
