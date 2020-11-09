import React, { useCallback, useState, Fragment, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import { priorityList, typesList } from 'signals/incident-management/definitions';

import Button from 'components/Button';
import Label from 'components/Label';
import TextArea from 'components/TextArea';

import { StyledGrid, StyledHeading, StyledFieldset } from '../../styled';

import IncidentSplitRadioInput from '../IncidentSplitRadioInput';
import IncidentSplitSelectInput from '../IncidentSplitSelectInput';

export const INCIDENT_SPLIT_LIMIT = 10;

const IncidentSplitFormIncident = ({ parentIncident, subcategories, register }) => {
  const [splitCount, setSplitCount] = useState(1);
  const incidentRef = useRef(null);

  const addIncident = useCallback(event => {
    event.preventDefault();
    setSplitCount(previousSplitCount => previousSplitCount + 1);
  }, []);

  const indexWithIncidentRef = useMemo(() => (splitCount === 1 ? null : splitCount - 1), [splitCount]);

  useEffect(() => {
    incidentRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [splitCount, incidentRef]);

  return (
    <Fragment>
      {[...Array(splitCount + 1).keys()].slice(1).map((splitNumber, index) => (
        <StyledFieldset
          key={`incident-splitform-incident-${splitNumber}`}
          ref={index === indexWithIncidentRef ? incidentRef : null}
        >
          <StyledGrid>
            <StyledHeading forwardedAs="h2" data-testid="incidentSplitFormIncidentTitle">
              Deelmelding {splitNumber + parentIncident.childrenCount}
            </StyledHeading>

            <IncidentSplitSelectInput
              id={`subcategory-${splitNumber}`}
              data-testid={`incidentSplitFormIncidentSubcategorySelect-${splitNumber}`}
              name={`incidents[${splitNumber}].subcategory`}
              display="Subcategorie"
              options={subcategories[1]}
              groups={subcategories[0]}
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

            <div>
              <IncidentSplitRadioInput
                id={`priority-${splitNumber}`}
                data-testid={`incidentSplitFormIncidentPriorityRadio-${splitNumber}`}
                name={`incidents[${splitNumber}].priority`}
                display="Urgentie"
                options={priorityList}
                initialValue={parentIncident.priority}
                register={register}
              />
            </div>

            <div>
              <IncidentSplitRadioInput
                id={`type-${splitNumber}`}
                data-testid={`incidentSplitFormIncidentTypeRadio-${splitNumber}`}
                name={`incidents[${splitNumber}].type`}
                display="Type"
                options={typesList}
                initialValue={parentIncident.type}
                register={register}
              />
            </div>
          </StyledGrid>
        </StyledFieldset>
      ))}

      {splitCount < INCIDENT_SPLIT_LIMIT - parentIncident.childrenCount && (
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
    childrenCount: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    statusDisplayName: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    subcategory: PropTypes.string.isRequired,
    subcategoryDisplayName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  subcategories: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
};

export default IncidentSplitFormIncident;
