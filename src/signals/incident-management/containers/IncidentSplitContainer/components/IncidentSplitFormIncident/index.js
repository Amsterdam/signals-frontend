// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React, { useCallback, useState, Fragment, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeColor, themeSpacing } from '@amsterdam/asc-ui';

import { priorityList, typesList } from 'signals/incident-management/definitions';

import Button from 'components/Button';
import Label from 'components/Label';
import TextArea from 'components/TextArea';

import { StyledGrid, StyledHeading, StyledFieldset } from '../../styled';

import IncidentSplitRadioInput from '../IncidentSplitRadioInput';
import IncidentSplitSelectInput from '../IncidentSplitSelectInput';

export const INCIDENT_SPLIT_LIMIT = 10;

const IncidentSplitFormIncident = ({ parentIncident, subcategories, register, errors }) => {
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

            <TextArea
              label={<strong>Omschrijving</strong>}
              errorMessage={errors.incidents && errors.incidents[splitNumber]?.description.message}
              data-testid={`incidentSplitFormIncidentDescriptionText-${splitNumber}`}
              id={`description-${splitNumber}`}
              name={`incidents[${splitNumber}].description`}
              ref={register({ validate: {
                required: value => !!value.trim() || 'Dit is een verplicht veld',
              } })}
              rows={10}
              defaultValue={parentIncident.description}
            />

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
  errors: PropTypes.object.isRequired,
};

export default IncidentSplitFormIncident;
