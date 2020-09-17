import React, { useState, Fragment, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { typesList, priorityList } from 'signals/incident-management/definitions';

import SelectInputNG from 'signals/incident-management/components/SelectInput/SelectInputNG';
import TextArea from 'components/TextArea';
import { makeSelectSubCategories } from 'models/categories/selectors';

import RadioInput from './RadioInput';

import { StyledBorderBottomWrapper, StyledButton, StyledHeading } from './styled';

const INCIDENT_SPLIT_LIMIT = 10;

const IncidentSplitFormIncident = ({ parentIncident, register, control }) => {
  const [indexes, setIndexes] = useState([1]);

  const subcategories = useSelector(makeSelectSubCategories);
  const subcategoryOptions = useMemo(
    () => subcategories?.map(category => ({ ...category, value: category.extendedName })),
    [subcategories]
  );

  if (!subcategories) return null;

  const addIncident = () => {
    if (indexes.length > INCIDENT_SPLIT_LIMIT - 1) return;
    setIndexes(previousIndexes => [...previousIndexes, indexes.length + 1]);
  };

  return (
    <Fragment>
      {indexes.map(index => (
        <StyledBorderBottomWrapper>
          <StyledHeading forwardedAs="h3" data-testid="incidentPartTitle">Deelmelding {index}</StyledHeading>

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

          <RadioInput
            display="Urgentie"
            register={register}
            initialValue={parentIncident.priority}
            name={`issues[${index}].priority`}
            id="priority"
            options={priorityList}
          />

          <RadioInput
            display="Type"
            register={register}
            initialValue={parentIncident.type}
            name={`issues[${index}].type`}
            id="type"
            options={typesList}
          />
        </StyledBorderBottomWrapper>
      ))}

      {indexes.length < INCIDENT_SPLIT_LIMIT && (
        <StyledBorderBottomWrapper>
          <StyledButton type="button" variant="primaryInverted" onClick={addIncident}>
            Extra deelmelding toevoegen
          </StyledButton>
        </StyledBorderBottomWrapper>
      )}
    </Fragment>
  );
};

IncidentSplitFormIncident.propTypes = {
  parentIncident: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    statusDisplayName: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    subcategory: PropTypes.string.isRequired,
    subcategoryDisplayName: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
  register: PropTypes.func,
  control: PropTypes.shape({ setValue: PropTypes.func }).isRequired,
};

export default IncidentSplitFormIncident;
