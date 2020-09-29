import React, { useCallback, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Heading } from '@datapunt/asc-ui';

import { typesList, priorityList } from 'signals/incident-management/definitions';

import { subcategoriesType } from 'shared/types';

import TextArea from 'components/TextArea';

import { StyledButton } from './styled';

import IncidentSplitRadioInput from './IncidentSplitRadioInput';
import IncidentSplitSelectInput from './IncidentSplitSelectInput';

export const INCIDENT_SPLIT_LIMIT = 10;

const IncidentSplitFormIncident = ({ parentIncident, subcategories, register }) => {
  const [splitCount, setSplitCount] = useState(1);

  const addIncident = useCallback(
    event => {
      event.preventDefault();
      setSplitCount(previousSplitCount => previousSplitCount + 1);
    },
    []
  );

  return (
    <Fragment>
      {[...Array(splitCount + 1).keys()].slice(1).map(splitNumber => (
        <fieldset key={`incident-splitform-incident-${splitNumber}`}>
          <Heading forwardedAs="h3" data-testid="incidentSplitFormIncidentTitle">Deelmelding {splitNumber}</Heading>

          <TextArea
            name={`incidents[${splitNumber}].description`}
            ref={register}
            rows={10}
            defaultValue={parentIncident.description}
          />

          <IncidentSplitSelectInput
            name={`incidents[${splitNumber}].subcategory`}
            id="subcategory"
            display="Subcategorie"
            register={register}
            initialValue={parentIncident.subcategory}
            options={subcategories}
          />

          <IncidentSplitRadioInput
            display="Urgentie"
            register={register}
            initialValue={parentIncident.priority}
            name={`incidents[${splitNumber}].priority`}
            id={`incidents-${splitNumber}-priority`}
            options={priorityList}
          />

          <IncidentSplitRadioInput
            display="Type"
            register={register}
            initialValue={parentIncident.type}
            name={`incidents[${splitNumber}].type`}
            id="type"
            options={typesList}
          />
        </fieldset>
      ))}

      {splitCount < INCIDENT_SPLIT_LIMIT && (
        <fieldset>
          <StyledButton
            type="button"
            variant="primaryInverted"
            onClick={addIncident}
            data-testid="incidentSplitFormIncidentSplitButton"
          >
            Extra deelmelding toevoegen
          </StyledButton>
        </fieldset>
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
  subcategories: subcategoriesType.isRequired,
  register: PropTypes.func.isRequired,
};

export default IncidentSplitFormIncident;
