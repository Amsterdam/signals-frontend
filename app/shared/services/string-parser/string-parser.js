import moment from 'moment';

export const string2date = (value) => moment(value).format('DD-MM-YYYY');

export const string2time = (value) => moment(value).format('HH:mm');
