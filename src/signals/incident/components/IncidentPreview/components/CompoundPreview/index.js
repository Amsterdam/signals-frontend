import React from 'react';

export const createCompoundPreview = (children) => {
  return (props) => (
    <div>
      {
        children.map((Child, idx) => <Child key={idx} {...props} />) // eslint-disable-line react/no-array-index-key
      }
    </div>
  );
};
