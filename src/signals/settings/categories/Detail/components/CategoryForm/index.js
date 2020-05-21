import React from 'react';
import PropTypes from 'prop-types';
import { themeSpacing, Row, Column, Select } from '@datapunt/asc-ui';
import styled from 'styled-components';

import RadioButtonList from 'signals/incident-management/components/RadioButtonList';

import History from 'components/History';
import Label from 'components/Label';
import Input from 'components/Input';
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

const StyledSelect = styled(Select)`
  height: 44px;
`;

const StyledHistory = styled(History)`
  h2 {
    font-size: 16px;
  }
`;

const statusOptions = [
  { key: 'true', value: 'Actief' },
  { key: 'false', value: 'Niet actief' },
];

const DEFAULT_STATUS_OPTION = 'true';

const CategoryForm = ({ data, history, onCancel, onSubmitForm, readOnly }) => (
  <Form action="" data-testid="detailCategoryForm">
    <Row>
      <StyledColumn span={{ small: 1, medium: 2, big: 4, large: 5, xLarge: 5 }}>
        <FieldGroup>
          <Input
            as="input"
            defaultValue={data.name}
            disabled={readOnly}
            hint="Het wijzigen van de naam heeft geen invloed op het type melding"
            id="name"
            label="Naam"
            name="name"
            readOnly={readOnly}
            type="text"
          />
        </FieldGroup>

        <FieldGroup>
          <Input
            as="textarea"
            defaultValue={data.description}
            disabled={readOnly}
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
            <Input
              as="input"
              defaultValue={data.sla.n_days}
              disabled={readOnly}
              id="n_days"
              name="n_days"
              readOnly={readOnly}
              type="number"
              size="50"
            />

            <StyledSelect
              defaultValue={data.sla.use_calendar_days ? 1 : 0}
              disabled={readOnly}
              id="use_calendar_days"
              name="use_calendar_days"
              readOnly={readOnly}
              type="number"
            >
              <option value="1">Dagen</option>
              <option value="0">Werkdagen</option>
            </StyledSelect>
          </CombinedFields>
        </FieldGroup>

        <FieldGroup>
          <Input
            as="textarea"
            defaultValue={data.handling_message}
            disabled={readOnly}
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
            defaultValue={data.is_active === undefined ? DEFAULT_STATUS_OPTION : `${data.is_active}`}
            groupName="is_active"
            hasEmptySelectionButton={false}
            options={statusOptions}
            disabled={readOnly}
          />
        </FieldGroup>
      </StyledColumn>

      <StyledColumn span={{ small: 1, medium: 2, big: 6, large: 7, xLarge: 6 }}>
        {history && <StyledHistory list={history} />}
      </StyledColumn>

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
  data: {
    sla: {},
  },
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
  history: PropTypes.arrayOf(
    PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      when: PropTypes.string.isRequired,
      what: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      who: PropTypes.string.isRequired,
    })
  ),
  onCancel: PropTypes.func,
  onSubmitForm: PropTypes.func,
  /** When true, none of the fields in the form can be edited */
  readOnly: PropTypes.bool,
};

export default CategoryForm;
