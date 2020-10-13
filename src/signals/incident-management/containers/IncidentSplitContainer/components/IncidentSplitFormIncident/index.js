import React, { useCallback, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Heading } from '@datapunt/asc-ui';

import { typesList, priorityList } from 'signals/incident-management/definitions';

import { subcategoriesType } from 'shared/types';

import Label from 'components/Label';
import TextArea from 'components/TextArea';

import IncidentSplitRadioInput from '../IncidentSplitRadioInput';
import IncidentSplitSelectInput from '../IncidentSplitSelectInput';

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

          <IncidentSplitSelectInput
            id={`subcategory-${splitNumber}`}
            data-testid={`incidentSplitFormIncidentSubcategorySelect-${splitNumber}`}
            name={`incidents[${splitNumber}].subcategory`}
            display="Subcategorie"
            options={subcategories}
            initialValue={parentIncident.subcategory}
            register={register}
          />

          <div>
            <Label as="span">Omschrijving</Label>

            <TextArea
              data-testid={`incidentSplitFormIncidentDescriptionText-${splitNumber}`}
              name={`incidents[${splitNumber}].description`}
              ref={register}
              rows={10}
              defaultValue={parentIncident.description}
            />
          </div>

          <IncidentSplitRadioInput
            id={`priority-${splitNumber}`}
            data-testid={`incidentSplitFormIncidentPriorityRadio-${splitNumber}`}
            name={`incidents[${splitNumber}].priority`}
            display="Urgentie"
            options={priorityList}
            initialValue={parentIncident.priority}
            register={register}
          />

          <IncidentSplitRadioInput
            id={`type-${splitNumber}`}
            data-testid={`incidentSplitFormIncidentTypeRadio-${splitNumber}`}
            name={`incidents[${splitNumber}].type`}
            display="Type"
            options={typesList}
            initialValue={parentIncident.type}
            register={register}
          />
        </fieldset>
      ))}

      {splitCount < INCIDENT_SPLIT_LIMIT && (
        <fieldset>
          <Button
            data-testid="incidentSplitFormIncidentSplitButton"
            type="button"
            variant="primaryInverted"
            onClick={addIncident}
          >
            Extra deelmelding toevoegen
          </Button>
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
