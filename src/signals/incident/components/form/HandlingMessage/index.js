import React from 'react';
import { Heading } from '@amsterdam/asc-ui';
import PropTypes from 'prop-types';
import isString from 'lodash.isstring';
import get from 'lodash.get';

import './style.scss';

const renderText = (key, name, parent) => {
  const replacedValue = get(parent, `meta.incidentContainer.${key}`);
  if (replacedValue) {
    return replacedValue.split('\n\n').map((item, k) => (
      <div key={`${name}-${k + 1}`} className="plain-text__box-p">
        {item}
      </div>
    ));
  }

  return <div>We gaan zo snel mogelijk aan de slag.</div>;
};

const HandlingMessage = ({ meta, parent }) =>
  meta?.isVisible && (
    <div className={`${meta.className || 'col-12'} mode_input`}>
      <div className="handling-message__box">
        <Heading as="h2" styleAs="h3">
          {meta.title}
        </Heading>
        {meta.key && isString(meta.key) && renderText(meta.key, meta.name, parent)}
      </div>
    </div>
  );

HandlingMessage.propTypes = {
  meta: PropTypes.object,
  parent: PropTypes.object,
};

export default HandlingMessage;
