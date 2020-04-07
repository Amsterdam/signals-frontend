import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Heading, themeColor, themeSpacing } from '@datapunt/asc-ui';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { makeSelectSubCategories } from 'models/categories/selectors';
import { attachmentsType } from 'shared/types';
import { priorityList, typesList } from 'signals/incident-management/definitions';

import FieldControlWrapper from 'signals/incident-management/components/FieldControlWrapper';
import CopyFileInput from 'signals/incident-management/components/CopyFileInput';
import RadioInput from 'signals/incident-management/components/RadioInput';
import SelectInput from 'signals/incident-management/components/SelectInput';
import TextAreaInput from 'signals/incident-management/components/TextAreaInput';

const StyledWrapper = styled.div`
  border-bottom: 2px solid ${themeColor('tint', 'level3')};
  padding-bottom: ${themeSpacing(4)};
  margin-bottom: ${themeSpacing(10)};
`;

const StyledH2 = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${themeSpacing(3)};
`;

const IncidentPart = ({ index, attachments, splitForm }) => {
  const subcategories = useSelector(makeSelectSubCategories);

  return (
    <StyledWrapper>
      <StyledH2 forwardedAs="h2" data-testid="incidentPartTitle">
        Deelmelding {index}
      </StyledH2>

      {splitForm && (
        <Fragment>
          <FieldControlWrapper
            data-testid="incidentPartFieldSubcategory"
            render={SelectInput}
            name={`part${index}.subcategory`}
            display="Subcategorie"
            control={splitForm.get(`part${index}.subcategory`)}
            values={subcategories || []}
            sort
          />

          <FieldControlWrapper
            data-testid="incidentPartFieldText"
            render={TextAreaInput}
            name={`part${index}.text`}
            display="Omschrijving"
            control={splitForm.get(`part${index}.text`)}
            rows={5}
          />

          {attachments?.length > 0 && (
            <FieldControlWrapper
              render={CopyFileInput}
              name={`part${index}.image`}
              control={splitForm.get(`part${index}.image`)}
              values={attachments}
            />
          )}

          <FieldControlWrapper
            render={TextAreaInput}
            name={`part${index}.note`}
            display="Notitie"
            control={splitForm.get(`part${index}.note`)}
            rows={5}
          />

          <FieldControlWrapper
            render={RadioInput}
            name={`part${index}.priority`}
            display="Urgentie"
            control={splitForm.get(`part${index}.priority`)}
            values={priorityList}
          />

          <FieldControlWrapper
            render={RadioInput}
            name={`part${index}.type`}
            display="Type"
            control={splitForm.get(`part${index}.type`)}
            values={typesList}
          />
        </Fragment>
      )}
    </StyledWrapper>
  );
};

IncidentPart.defaultProps = {
  attachments: [],
  splitForm: null,
};

IncidentPart.propTypes = {
  incident: PropTypes.shape({
    category: PropTypes.shape({}),
    priority: PropTypes.shape({
      priority: PropTypes.string,
    }),
    type: PropTypes.shape({
      code: PropTypes.string.isRequired,
    }),
  }),
  index: PropTypes.string.isRequired,
  attachments: attachmentsType,
  splitForm: PropTypes.shape({
    get: PropTypes.func,
  }),
};

export default IncidentPart;
