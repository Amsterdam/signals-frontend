import * as React from 'react';
import { AbstractControl } from 'react-reactive-form';

// React SFC to render Input element
const TextInput = ({
  handler,
  meta: { label, placeholder }
}: AbstractControl) => (
  <div>
    <label>{label}:</label>
    <input placeholder={placeholder} style={styles.input} {...handler()} />
  </div>
);

export default TextInput;
