import React, { Fragment, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Heading, themeColor, themeSpacing } from '@datapunt/asc-ui';
import Button from 'components/Button';
import styled from 'styled-components';
import { incidentType, attachmentsType } from 'shared/types';

import { FormBuilder } from 'react-reactive-form';

import IncidentPart from '../IncidentPart';

const StyledButton = styled(Button)`
  margin-right: ${themeSpacing(5)};
  background-color: ${themeColor('tint', 'level1')};
`;

const StyledSubmitButton = styled(Button)`
  margin-right: ${themeSpacing(5)};
`;

const StyledRemoveButton = styled(Button)`
  background-color: ${themeColor('tint', 'level1')};
  padding: 0;
  border-color: transparent;
  float: right;
`;

const StyledH4 = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${themeSpacing(2)};
`;

const StyledDisclaimer = styled.div`
  background-color: ${themeColor('tint', 'level3')};
  padding: ${themeSpacing(4)};
  margin-bottom: ${themeSpacing(5)};
  line-height: 22px;

  ul {
    margin: 0 0 0 ${themeSpacing(6)};
    padding: 0;

    li {
      list-style-type: square;
      margin-top: ${themeSpacing(2)};
    }
  }
`;

const StyledBottomDisclaimer = styled(StyledDisclaimer)`
  margin: ${themeSpacing(5)} 0;
`;

const form = FormBuilder.group({
  part1: FormBuilder.group({
    subcategory: '', // incident.category.category_url,
    text: '', // incident.text,
    image: true,
    note: '',
    priority: 'normal', // incident.priority.priority,
    type: 'SIG',
  }),
  part2: FormBuilder.group({
    subcategory: '', // incident.category.category_url,
    text: '', // incident.text,
    image: true,
    note: '',
    priority: 'normal', // incident.priority.priority,
    type: 'SIG',
  }),
  part3: FormBuilder.group({
    subcategory: '', // incident.category.category_url,
    text: '', // incident.text,
    image: true,
    note: '',
    priority: 'normal', // incident.priority.priority,
    type: 'SIG',
  }),
});

const SplitForm = ({ incident, attachments, onHandleCancel, onHandleSubmit }) => {
  const [isVisible, setVisibility] = useState(false);

  const handleSubmit = useCallback(() => {
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
        type: {
          code: form.value[part].type,
        },
      });
    });

    onHandleSubmit({
      id: incident.id,
      create,
      update,
    });
  }, [incident.id, isVisible, onHandleSubmit]);

  useEffect(() => {
    if (!incident) return;
    Object.values(form.controls).forEach(part => {
      part.patchValue({
        subcategory: incident.category.category_url,
        text: incident.text,
        priority: incident.priority.priority,
        type: incident.type.code,
      });
    });
  }, [incident]);

  return (
    <div>
      <StyledDisclaimer data-testid="splitFormDisclaimer">
        Splitsen mag alleen als de oorspronkelijke melding over twee verschillende onderwerpen gaat, die zonder
        samenwerking met een andere afdeling kan worden afgehandeld.
      </StyledDisclaimer>

      <IncidentPart index="1" attachments={attachments} splitForm={form} />

      <IncidentPart index="2" attachments={attachments} splitForm={form} />

      {isVisible ? (
        <Fragment>
          <StyledRemoveButton
            data-testid="splitFormPartRemove"
            variant="textButton"
            onClick={() => setVisibility(false)}
          >
            Verwijder
          </StyledRemoveButton>

          <IncidentPart index="3" attachments={attachments} splitForm={form} />
        </Fragment>
      ) : (
        <StyledButton data-testid="splitFormPartAdd" variant="primaryInverted" onClick={() => setVisibility(true)}>
          Deelmelding 3 toevoegen
        </StyledButton>
      )}

      <StyledBottomDisclaimer data-testid="splitFormBottomDisclaimer">
        <StyledH4 forwardedAs="h4">Let op</StyledH4>
        <ul>
          <li>De persoon die de oorspronkelijke melding heeft gedaan, ontvangt een email per deelmelding.</li>
          <li>De oorspronkelijke melding wordt afgesloten als deze gesplitst wordt.</li>
          <li>Een melding kan maar 1 keer gesplitst worden.</li>
        </ul>
      </StyledBottomDisclaimer>

      <StyledSubmitButton
        data-testid="splitFormSubmit"
        variant="secondary"
        onClick={event => {
          event.persist();
          const { target } = event;
          target.disabled = true;
          handleSubmit(event);
        }}
      >
        Splitsen
      </StyledSubmitButton>

      <StyledButton data-testid="splitFormCancel" variant="primaryInverted" onClick={onHandleCancel}>
        Annuleer
      </StyledButton>
    </div>
  );
};

SplitForm.propTypes = {
  incident: incidentType,
  attachments: attachmentsType,
  onHandleSubmit: PropTypes.func.isRequired,
  onHandleCancel: PropTypes.func.isRequired,
};

export default SplitForm;
