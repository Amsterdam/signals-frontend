import React from 'react';
import { styles } from '@datapunt/asc-ui';

const { InputStyle } = styles;

const TextArea = props => <InputStyle as="textarea" {...props} />;

export default TextArea;
