import {
  REQUEST_CATEGORY_UPDATE,
  REQUEST_CATEGORY_UPDATE_SUCCESS,
  REQUEST_CATEGORY_UPDATE_ERROR
}
  from './constants';

export function requestCategoryUpdate(category) {
  return {
    type: REQUEST_CATEGORY_UPDATE,
    payload: category
  };
}

export function requestCategoryUpdateSuccess(category) {
  return {
    type: REQUEST_CATEGORY_UPDATE_SUCCESS,
    payload: category
  };
}

export function requestCategoryUpdateError(message) {
  return {
    type: REQUEST_CATEGORY_UPDATE_ERROR,
    payload: message
  };
}
