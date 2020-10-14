import React, { useCallback, useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { priorityList, typesList } from 'signals/incident-management/definitions';

import { subcategoriesType } from 'shared/types';

import Button from 'components/Button';
import Label from 'components/Label';
import TextArea from 'components/TextArea';

import { StyledGrid, StyledGridRow, StyledHeading } from '../../styled';

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
          <StyledGrid>
            <StyledHeading forwardedAs="h2" data-testid="incidentSplitFormIncidentTitle">
              Deelmelding {splitNumber}
            </StyledHeading>

            <StyledGridRow>
              <IncidentSplitSelectInput
                id={`subcategory-${splitNumber}`}
                data-testid={`incidentSplitFormIncidentSubcategorySelect-${splitNumber}`}
                name={`incidents[${splitNumber}].subcategory`}
                display="Subcategorie"
                options={subcategories}
                initialValue={parentIncident.subcategory}
                register={register}
              />
            </StyledGridRow>

            <StyledGridRow>
              <Label as="span">Omschrijving</Label>

              <TextArea
                data-testid={`incidentSplitFormIncidentDescriptionText-${splitNumber}`}
                name={`incidents[${splitNumber}].description`}
                ref={register}
                rows={10}
                defaultValue={parentIncident.description}
              />
            </StyledGridRow>

            <StyledGridRow>
              <IncidentSplitRadioInput
                id={`priority-${splitNumber}`}
                data-testid={`incidentSplitFormIncidentPriorityRadio-${splitNumber}`}
                name={`incidents[${splitNumber}].priority`}
                display="Urgentie"
                options={priorityList}
                initialValue={parentIncident.priority}
                register={register}
              />
            </StyledGridRow>

            <StyledGridRow>
              <IncidentSplitRadioInput
                id={`type-${splitNumber}`}
                data-testid={`incidentSplitFormIncidentTypeRadio-${splitNumber}`}
                name={`incidents[${splitNumber}].type`}
                display="Type"
                options={typesList}
                initialValue={parentIncident.type}
                register={register}
              />
            </StyledGridRow>
          </StyledGrid>
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
