import React, { useCallback, useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { typesList, priorityList } from 'signals/incident-management/definitions';

import TextArea from 'components/TextArea';

import RadioInput from './RadioInput';
import SelectInput from './SelectInput';

import { StyledButton, StyledHeading } from './styled';

export const INCIDENT_SPLIT_LIMIT = 10;

const IncidentSplitFormIncident = ({ parentIncident, subcategories, register }) => {
  const [indexes, setIndexes] = useState([1]);

  const addIncident = useCallback(
    event => {
      event.preventDefault();

      // the following code is valid (also from the testing-library philosophy) but won't cover branches 100% ...
      // if (indexes.length < INCIDENT_SPLIT_LIMIT) setIndexes(previousIndexes => [...previousIndexes, indexes.length + 1]);

      // 100% coverage, but needs allowShortCircuit in no-used-expressions, not a recommended pattern, but ....
      // eslint-disable-next-line no-unused-expressions
      // indexes.length < INCIDENT_SPLIT_LIMIT && setIndexes(previousIndexes => [...previousIndexes, indexes.length + 1]);

      // meh, but 100% coverage and no need for allowShortCircuit...
      return indexes.length < INCIDENT_SPLIT_LIMIT &&
        setIndexes(previousIndexes => [...previousIndexes, indexes.length + 1]);
    },
    [indexes]
  );

  return (
    <Fragment>
      {indexes.map(index => (
        <fieldset key={`incident-splitform-incident-${index}`}>
          <StyledHeading forwardedAs="h3" data-testid="splittedIncidentTitle">Deelmelding {index}</StyledHeading>

          <TextArea
            name={`incidents[${index}].description`}
            ref={register}
            rows={10}
            defaultValue={parentIncident.description}
          />

          <SelectInput
            name={`incidents[${index}].subcategory`}
            id="subcategory"
            display="Subcategorie"
            register={register}
            initialValue={parentIncident.subcategory}
            options={subcategories}
          />

          <RadioInput
            display="Urgentie"
            register={register}
            initialValue={parentIncident.priority}
            name={`incidents[${index}].priority`}
            id={`incidents-${index}-priority`}
            options={priorityList}
          />

          <RadioInput
            display="Type"
            register={register}
            initialValue={parentIncident.type}
            name={`incidents[${index}].type`}
            id="type"
            options={typesList}
          />
        </fieldset>
      ))}

      {indexes.length < INCIDENT_SPLIT_LIMIT && (
        <StyledButton
          type="button"
          variant="primaryInverted"
          onClick={addIncident}
          data-testid="incidentSplitFormSplitButton"
        >
          Extra deelmelding toevoegen
        </StyledButton>
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
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  subcategories: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      info: PropTypes.string,
    })
  ).isRequired,
  register: PropTypes.func.isRequired,
};

export default IncidentSplitFormIncident;
