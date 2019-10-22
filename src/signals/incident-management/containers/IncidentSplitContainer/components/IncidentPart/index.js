import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Heading, themeColor } from '@datapunt/asc-ui';
import styled from 'styled-components';
import { attachmentsType, dataListType } from 'shared/types';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import CopyFileInput from '../../../../components/CopyFileInput';
import RadioInput from '../../../../components/RadioInput';
import SelectInput from '../../../../components/SelectInput';
import TextAreaInput from '../../../../components/TextAreaInput';

const StyledWrapper = styled.div`
  border-bottom: 2px solid ${themeColor('tint', 'level3')};
  padding-bottom: 15px;
  margin-bottom: 37px;
`;

const StyledH2 = styled(Heading)`
  font-weight: normal;
  margin-bottom: 12px;
`;

const IncidentPart = ({ index, attachments, subcategories, priorityList, splitForm }) => (
  <StyledWrapper>
    <StyledH2
      $as="h2"
      data-testid="incidentPartTitle"
    >Deelmelding {index}</StyledH2>
    {splitForm ?
      <Fragment>
        <FieldControlWrapper
          data-testid="incidentPartFieldSubcategory"
          render={SelectInput}
          name={`part${index}.subcategory`}
          display="Subcategorie"
          control={splitForm.get(`part${index}.subcategory`)}
          values={subcategories}
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

        {attachments && attachments.length ?
          <FieldControlWrapper
            render={CopyFileInput}
            name={`part${index}.image`}
            control={splitForm.get(`part${index}.image`)}
            values={attachments}
          /> : null
        }
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

      </Fragment>
      : null}
  </StyledWrapper>
);

IncidentPart.defaultProps = {
  attachments: [],
  subcategories: [],
  priorityList: [],
  splitForm: null,
};

IncidentPart.propTypes = {
  incident: PropTypes.shape({
    category: PropTypes.shape({}),
    priority: PropTypes.shape({
      priority: PropTypes.string,
    }),
  }),
  index: PropTypes.string.isRequired,
  attachments: attachmentsType,
  subcategories: dataListType,
  priorityList: dataListType,
  splitForm: PropTypes.shape({
    get: PropTypes.func,
  }),
};

export default IncidentPart;
