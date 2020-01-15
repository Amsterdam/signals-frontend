import {
  FETCH_DEPARTMENTS_ERROR,
  FETCH_DEPARTMENTS_SUCCESS,
  FETCH_DEPARTMENTS,
} from './constants';

export const fetchDepartments = () => ({
  type: FETCH_DEPARTMENTS,
});

export const fetchDepartmentsSuccess = payload => ({
  type: FETCH_DEPARTMENTS_SUCCESS,
  payload,
});

export const fetchDepartmentsError = payload => ({
  type: FETCH_DEPARTMENTS_ERROR,
  payload,
});
