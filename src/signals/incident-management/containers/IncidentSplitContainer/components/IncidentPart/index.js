import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import CopyFileInput from '../../../../components/CopyFileInput';
import RadioInput from '../../../../components/RadioInput';
import SelectInput from '../../../../components/SelectInput';
import TextAreaInput from '../../../../components/TextAreaInput';

const IncidentPart = ({ index, incident, subcategories, priorityList, splitForm }) => (
  <section className="incident-part">
    {incident ? (
      <div>
        <h2>Deelmelding {index}</h2>
        <FieldControlWrapper
          render={SelectInput}
          name={`part${index}.subcategory`}
          display="Subcategorie"
          control={splitForm.get(`part${index}.subcategory`)}
          values={subcategories}
        />
        <FieldControlWrapper
          render={TextAreaInput}
          name={`part${index}.text`}
          display="Omschrijving"
          control={splitForm.get(`part${index}.text`)}
          rows={5}
        />
        {incident.image &&
          <FieldControlWrapper
            render={CopyFileInput}
            name={`part${index}.file`}
            control={splitForm.get(`part${index}.file`)}
            values={[{ key: '', alt: `Foto bij melding ${incident.id}`, value: incident.image }]}
          />
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
      </div>
    )
    : ''}
  </section>
);

IncidentPart.defaultProps = {
  incident: {
    category: {},
    priority: {
      priority: ''
    }
  },
  subcategories: []
};

IncidentPart.propTypes = {
  index: PropTypes.number.isRequired,
  incident: PropTypes.object,
  subcategories: PropTypes.array,
  priorityList: PropTypes.array,
  splitForm: PropTypes.object.isRequired
};

export default IncidentPart;
