import moment from 'moment';

export const string2date = value => (value && moment(value).format('DD-MM-YYYY')) || `[${value}]`;

export const string2time = value => (value && moment(value).format('HH:mm')) || `[${value}]`;
