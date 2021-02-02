import type { FunctionComponent } from 'react';
import React, { Fragment } from 'react';
// import isObject from 'lodash.isobject';
// import isBoolean from 'lodash.isboolean';

const getValue = (answer: (Standard | Container | string)[] | string) => {
  if (Array.isArray(answer)) {
    return answer.map((item: Standard | Container | string, index: number) => {
      if (typeof item !== 'string') {
        if ((item as Standard).label) {
          const standard = item as Standard;
          return <div key={standard.id}>{standard.label}</div>;
        }

        if ((item as Container).description) {
          const container = item as Container;
          return <div key={container.id}>{`${container.description}${container.id && ` - ${container.id}`}`}</div>;
        }
      }

      // eslint-disable-next-line react/no-array-index-key
      return <div key={index}>{item}</div>;
    });
  }

  // if (isObject(answer)) {
  //   if (isBoolean((answer as any).value)) {
  //     return (answer as any).value ? (answer as any).label : 'Nee';
  //   }

  //   return (answer as any).label;
  // }

  return answer;
};

type LegacyItem = Record<string, string>;
interface MappedLegacyItem {
  label: string;
  answer: string;
  id: number;
}

interface Standard {
  id: string;
  label: string;
  info: string;
}
interface Container {
  description: string;
  type: string;
  id: string;
}
type Light = string; // string of id's

type Answer = Standard[] | Container[] | Light[];

interface Item {
  id: string;
  label: string;
  answer: Answer;
  category_url: string;
}

interface Props {
  items: LegacyItem | Item[];
}

const ExtraProperties: FunctionComponent<Props> = ({ items }) => {
  // Some incidents have been stored with values for their extra properties that is incompatible with the current API
  // We therefore need to check if we're getting an array or an object
  const itemList = Array.isArray(items)
    ? items
    : Object.entries(items).map(([label, answer], index) => ({ label, answer, id: index }));

  const extraProperties: JSX.Element[] = [];

  itemList.forEach((item: Item | MappedLegacyItem) => {
    extraProperties.push(
      <Fragment key={item.id}>
        <dt data-testid="extra-properties-definition">{item.label}</dt>
        <dd data-testid="extra-properties-value">{getValue(item.answer)}</dd>
      </Fragment>
    );
  });

  // TypeScript does not understand returning arrays in function components - therefore return a fragment.
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment>{extraProperties}</Fragment>;
};

export default ExtraProperties;
