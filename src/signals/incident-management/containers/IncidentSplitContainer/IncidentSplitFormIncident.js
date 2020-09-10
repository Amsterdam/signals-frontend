/* eslint-disable no-console */
import React, { useState, Fragment, useMemo } from 'react';

import { useForm, Controller } from 'react-hook-form';

// import { typesList, priorityList } from 'signals/incident-management/definitions';

// import PropTypes from 'prop-types';
import SelectInputNG from 'signals/incident-management/components/SelectInput/SelectInputNG';
import TextArea from 'components/TextArea';
import { makeSelectSubCategories } from 'models/categories/selectors';
import { useSelector } from 'react-redux';

// import RadioInputNG from 'signals/incident-management/components/RadioInput/RadioInputNG';

import { StyledButton, StyledSubmitButton } from './styled';

const INCIDENT_MAX_SPLIT_LEVEL = 10;

const defaultValues = {
  select: '',
};

const IncidentSplitFormIncident = ({ parentIncident, onSubmit }) => {
  const [indexes, setIndexes] = useState([]);
  const [counter, setCounter] = useState(0);
  const { register, handleSubmit, control } = useForm({ defaultValues });

  const subcategories = useSelector(makeSelectSubCategories);
  const subcategoryOptions = useMemo(
    () =>
      subcategories?.map(category => ({ ...category, value: category.extendedName })),
    // disabling linter; we want to allow possible null subcategories
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subcategories]
  );

  if (!subcategories) return null;

  const addIncident = () => {
    console.log('add incident:', counter);
    if (counter > INCIDENT_MAX_SPLIT_LEVEL - 1) {
      console.log('maximum split level reached');
      return;
    }
    setIndexes(prevIndexes => [...prevIndexes, counter]);
    setCounter(prevCounter => prevCounter + 1);
  };

  const removeIncident = index => () => {
    setIndexes(prevIndexes => [...prevIndexes.filter(item => item !== index)]);
    setCounter(prevCounter => prevCounter - 1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {indexes.map(index => (
        <Fragment>
          <TextArea
            name={`issues[${index}].description`}
            ref={register}
            rows={10}
            defaultValue={parentIncident.text}
          />

          <Controller
            as={<SelectInputNG />}
            display="Subcategorie"
            values={subcategoryOptions}
            control={control}
            name={`issues[${index}].subcategory`}
            defaultValue={parentIncident.subcategory}
            sort
          />

          {/*
          // RadioInput component need some changes first to make this work

          <Controller
            as={<RadioInputNG />}
            display="Urgentie"
            values={priorityList}
            control={control}
            name={`issues[${index}].priority`}
            defaultValue={parentIncident.priority}
          />

          <Controller
            as={<RadioInputNG />}
            display="Type"
            control={control}
            handler={(data, value) => { console.log('type handler:', data, value); }}
            defaultValue={parentIncident.type}
            values={typesList}
          />
          */}
        </Fragment>
      ))}

      {counter < INCIDENT_MAX_SPLIT_LEVEL && (
        <StyledButton data-testid="splitAnother" variant="primaryInverted" onClick={addIncident}>
          Extra deelmelding toevoegen
        </StyledButton>
      )}

      <StyledSubmitButton data-testid="splitFormSubmit" variant="secondary">Opslaan</StyledSubmitButton>

      <StyledButton
        data-testid="splitFormCancel"
        variant="primaryInverted"
        onClick={() => { console.warn('`goBack` is not implemented yet (in IncidentSplitContainer)'); }}
      >
        Annuleren
      </StyledButton>
    </form>
  );
};

// IncidentSplitFormIncident.propTypes = {
//   parentIncident: incidentType,
//   onSubmit: PropTypes.func.isRequired,
// };

export default IncidentSplitFormIncident;
