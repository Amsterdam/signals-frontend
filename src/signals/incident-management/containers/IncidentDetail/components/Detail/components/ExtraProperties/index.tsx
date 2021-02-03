import React, { Fragment } from 'react';
import type { FunctionComponent } from 'react';
import type { Answer, MappedLegacyItem, Item, CheckboxInput, ExtraPropertiesTypes, LegacyAnswer } from './types';

const getValue = (answer: Answer | LegacyAnswer): string | JSX.Element[] => {
  if (Array.isArray(answer)) {
    return answer.map((item, index) => {
      if (typeof item !== 'string') {
        if (item.description) {
          return <div key={item.id}>{`${item.description}${item.id && ` - ${item.id}`}`}</div>;
        }
      }

      // eslint-disable-next-line react/no-array-index-key
      return <div key={index}>{item}</div>;
    });
  }

  if (typeof answer !== 'string') {
    if (typeof (answer as CheckboxInput).value === 'boolean') {
      return (answer as CheckboxInput).value ? answer.label : 'Nee';
    }

    return answer.label;
  }

  return answer;
};

interface ExtraPropertiesProps {
  items?: ExtraPropertiesTypes;
}

const ExtraProperties: FunctionComponent<ExtraPropertiesProps> = ({ items = [] }) => {
  // Some incidents have been stored with values for their extra properties that is incompatible with the current API
  // We therefore need to check if we're getting an array or an object
  const itemList = Array.isArray(items)
    ? items
    : Object.entries(items).map(([question, answer], index) => ({ label: question, answer, id: index.toString() }));

  const extraProperties: JSX.Element[] = [];

  itemList.forEach((item: Item | MappedLegacyItem) => {
    extraProperties.push(
      <Fragment key={item.id}>
        <dt data-testid="extra-properties-definition">{item.label}</dt>
        <dd data-testid="extra-properties-value">{getValue(item.answer)}</dd>
      </Fragment>
    );
  });

  // TypeScript does not support arrays as a return type in function components - return a fragment as a workaround.
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment>{extraProperties}</Fragment>;
};

export default ExtraProperties;
