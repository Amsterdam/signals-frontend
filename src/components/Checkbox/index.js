import React from 'react';

const Checkbox = React.forwardRef((props, ref) => (
  <input type="checkbox" {...props} ref={ref} />
));

export default Checkbox;
