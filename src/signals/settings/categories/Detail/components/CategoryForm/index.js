import React from 'react';
import PropTypes from 'prop-types';
import { themeSpacing, Row, Column, Select } from '@datapunt/asc-ui';
import styled from 'styled-components';

import RadioButtonList from 'signals/incident-management/components/RadioButtonList';

import Label from 'components/Label';
import FormInput from 'components/FormInput';
import FormFooter from 'components/FormFooter';

const Form = styled.form`
  width: 100%;
`;

const StyledColumn = styled(Column)`
  flex-direction: column;
`;

const FieldGroup = styled.div`
  & + & {
    margin-top: ${themeSpacing(8)};
  }
`;

const StyledFormFooter = styled(FormFooter)`
  position: fixed;
`;

const CombinedFields = styled.div`
  display: flex;

  input {
    flex: 1 0 auto;
    max-width: 75px;
    margin-right: ${themeSpacing(3)};
  }

  select {
    flex: 2 1 auto;
    max-width: 150px;
  }
`;

const statusOptions = [
  { key: 'true', value: 'Actief' },
  { key: 'false', value: 'Niet actief' },
];

const DEFAULT_STATUS_OPTION = 'true';

const CategoryForm = ({ data, onCancel, onSubmitForm, readOnly }) => (
  <Form action="" data-testid="detailCategoryForm">
    <Row>
      <StyledColumn span={{ small: 1, medium: 2, big: 4, large: 5, xLarge: 5 }}>
        <FieldGroup>
          <FormInput
            as="input"
            defaultValue={data.name}
            hint="Het wijzigen van de naam heeft geen invloed op het type melding"
            id="name"
            label="Naam"
            name="name"
            readOnly={readOnly}
            type="text"
          />
        </FieldGroup>

        <FieldGroup>
          <FormInput
            as="textarea"
            defaultValue={data.description}
            hint="Ter verduidelijking van de inhoud van de categorie"
            id="description"
            label="Beschrijving"
            name="description"
            readOnly={readOnly}
            rows="8"
          />
        </FieldGroup>

        <FieldGroup>
          <Label as="span">Service belofte</Label>

          <CombinedFields>
            <FormInput
              defaultValue={data.sla.n_days}
              id="n_days"
              name="n_days"
              readOnly={readOnly}
              type="number"
              size="50"
            />

            <Select
              id="use_calendar_days"
              name="use_calendar_days"
              readOnly={readOnly}
              type="number"
            >
              <option value="1" selected={data.sla.use_calendar_days}>
                Dagen
              </option>
              <option value="0" selected={!data.sla.use_calendar_days}>
                Werkdagen
              </option>
            </Select>
          </CombinedFields>
        </FieldGroup>

        <FieldGroup>
          <FormInput
            as="textarea"
            defaultValue={data.handling_message}
            hint="Deze tekst krijgt de burger via e-mail bij het aanmaken van een melding"
            id="handling_message"
            label="Wat doen we met uw melding?"
            name="handling_message"
            readOnly={readOnly}
            rows="8"
          />
        </FieldGroup>

        <FieldGroup>
          <Label as="span">Status</Label>
          <RadioButtonList
            defaultValue={
              data.is_active === undefined
                ? DEFAULT_STATUS_OPTION
                : `${data.is_active}`
            }
            groupName="is_active"
            hasEmptySelectionButton={false}
            options={statusOptions}
            disabled={readOnly}
          />
        </FieldGroup>
      </StyledColumn>

      <StyledColumn push={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }}>
        {/* <FieldGroup>
          <Label as="span">Notitie</Label>
          <TextArea
            id="note"
            name="note"
            rows="8"
            defaultValue={data.profile && data.profile.note}
          />
        </FieldGroup> */}
      </StyledColumn>

      <Column span={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }} />

      {!readOnly && (
        <StyledFormFooter
          cancelBtnLabel="Annuleren"
          onCancel={onCancel}
          submitBtnLabel="Opslaan"
          onSubmitForm={onSubmitForm}
        />
      )}
    </Row>
  </Form>
);

CategoryForm.defaultProps = {
  data: {},
  onCancel: null,
  onSubmitForm: null,
  readOnly: false,
};

CategoryForm.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    handling_message: PropTypes.string,
    is_active: PropTypes.bool,
    sla: PropTypes.shape({
      n_days: PropTypes.number,
      use_calendar_days: PropTypes.bool,
    }),
  }),
  onCancel: PropTypes.func,
  onSubmitForm: PropTypes.func,
  /** When true, none of the fields in the form can be edited */
  readOnly: PropTypes.bool,
};

export default CategoryForm;
