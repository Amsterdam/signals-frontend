import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import CopyFileInput from '../../../../components/CopyFileInput';
import RadioInput from '../../../../components/RadioInput';
import SelectInput from '../../../../components/SelectInput';
import TextAreaInput from '../../../../components/TextAreaInput';

const IncidentPart = ({
  index, attachments, subcategories, priorityList, splitForm,
}) => (
  <section className="incident-part">
    <h2>
Deelmelding
      {index}
    </h2>
    <FieldControlWrapper
      render={SelectInput}
      name={`part${index}.subcategory`}
      display="Subcategorie"
      control={splitForm.get(`part${index}.subcategory`)}
      values={subcategories}
      sort
    />
    <FieldControlWrapper
      render={TextAreaInput}
      name={`part${index}.text`}
      display="Omschrijving"
      control={splitForm.get(`part${index}.text`)}
      rows={5}
    />

    {attachments && attachments.length
      && (
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
  </section>
);

IncidentPart.defaultProps = {
  incident: {
    category: {},
    priority: {
      priority: '',
    },
  },
  subcategories: [],
};

IncidentPart.propTypes = {
  incident: PropTypes.shape({
    category: PropTypes.shape({}),
    priority: PropTypes.shape({
      priority: PropTypes.string,
    }),
  }),
  index: PropTypes.string.isRequired,
  attachments: PropTypes.array,
  subcategories: PropTypes.array,
  priorityList: PropTypes.array,
  splitForm: PropTypes.object.isRequired,
};

export default IncidentPart;
