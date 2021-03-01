import React, { useCallback, useReducer } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { themeColor } from '@amsterdam/asc-ui';

import RadioButtonList from 'signals/incident-management/components/RadioButtonList';
import TextArea from 'components/TextArea';
import Label from 'components/Label';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import ErrorMessage from 'components/ErrorMessage';

export const andersOptionText = 'Anders, namelijk...';

const Form = styled.form`
  display: grid;
  grid-row-gap: 32px;
  margin-top: 32px;
`;

const GridArea = styled.div``;

const Optional = styled.span`
  font-family: Avenir Next LT W01-Regular;
`;

const HelpText = styled.div`
  color: ${themeColor('tint', 'level5')};
  margin-bottom: 8px;
`;

const initialState = {
  areaVisibility: false,
  errors: {},
  formData: {
    allows_contact: false,
    is_satisfied: undefined,
    text_extra: '',
    text: '',
  },
  formOptions: undefined,
  numChars: 0,
  renderSection: undefined,
  shouldRender: false,
};

const init = formData => ({
  ...initialState,
  formData: {
    ...initialState.formData,
    ...formData,
  },
});

// eslint-disable-next-line consistent-return
const reducer = (state, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case 'SET_AREA_VISIBILITY': {
      const text = action.payload.key !== 'anders' ? action.payload.value : '';

      return {
        ...state,
        areaVisibility: action.payload.key === 'anders',
        formData: { ...state.formData, text },
        errors: { ...state.errors, text: undefined },
      };
    }

    case 'SET_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };

    case 'SET_TEXT_EXTRA':
      return { ...state, numChars: action.payload.length, formData: { ...state.formData, text_extra: action.payload } };

    case 'SET_TEXT': {
      return {
        ...state,
        formData: { ...state.formData, text: action.payload },
        errors: { ...state.errors, text: undefined },
      };
    }

    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
  }
};

const KtoForm = ({ options, isSatisfied, onSubmit }) => {
  const [state, dispatch] = useReducer(reducer, { is_satisfied: isSatisfied }, init);
  const extraTextMaxLength = 1000;

  const onChangeOption = useCallback((groupName, option) => {
    dispatch({ type: 'SET_AREA_VISIBILITY', payload: option });
  }, []);

  const onChangeText = useCallback(
    type => event => {
      const { value } = event.target;

      dispatch({ type, payload: value });
    },
    []
  );

  const onChangeAllowsContact = useCallback(event => {
    const { checked } = event.target;

    dispatch({ type: 'SET_FORM_DATA', payload: { allows_contact: checked } });
  }, []);

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      const { formData } = state;
      const errors = {};

      if (!formData.text) {
        errors.text = 'Dit veld is verplicht';
      }

      dispatch({ type: 'SET_ERRORS', payload: errors });

      if (Object.keys(errors).length) return;

      onSubmit(formData);
    },
    [onSubmit, state]
  );

  return (
    <Form data-testid="ktoForm" onSubmit={handleSubmit}>
      <GridArea>
        <header>
          <strong>Waarom bent u {!isSatisfied ? 'on' : ''}tevreden?</strong>
          <HelpText>Een antwoord mogelijk, kies de belangrijkste reden</HelpText>
        </header>

        <RadioButtonList
          error={Boolean(state.errors.text)}
          groupName="kto"
          hasEmptySelectionButton={false}
          onChange={onChangeOption}
          options={options}
        />
        {state.areaVisibility && (
          <TextArea data-testid="ktoText" maxRows={5} name="text" onChange={onChangeText('SET_TEXT')} rows="2" />
        )}
        {state.errors.text && <ErrorMessage message={state.errors.text} />}
      </GridArea>

      <GridArea>
        <Label htmlFor="text_extra">
          Wilt u verder nog iets vermelden of toelichten? <Optional>(optioneel)</Optional>
        </Label>
        <TextArea
          data-testid="ktoTextExtra"
          infoText={`${state.numChars}/${extraTextMaxLength} tekens`}
          id="text_extra"
          maxLength={extraTextMaxLength}
          name="text_extra"
          onChange={onChangeText('SET_TEXT_EXTRA')}
        />
      </GridArea>

      <GridArea>
        <Label as="span">
          Mogen wij contact met u opnemen naar aanleiding van uw feedback? <Optional>(optioneel)</Optional>
        </Label>
        <div />
        <Label inline htmlFor="allows_contact" >
          <Checkbox
            data-testid="ktoAllowsContact"
            id="allows_contact"
            name="allows_contact"
            onChange={onChangeAllowsContact}
          />
          Ja
        </Label>
      </GridArea>

      <GridArea>
        <Button data-testid="ktoSubmit" type="submit" variant="secondary">
          Verstuur
        </Button>
      </GridArea>
    </Form>
  );
};

KtoForm.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  isSatisfied: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};

export default KtoForm;
