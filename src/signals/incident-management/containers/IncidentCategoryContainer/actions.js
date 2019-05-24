import {
  REQUEST_CATEGORY_UPDATE,
  REQUEST_CATEGORY_UPDATE_SUCCESS,
  REQUEST_CATEGORY_UPDATE_ERROR
}
  from './constants';

export function requestCategoryUpdate(patch) {
  return {
    type: REQUEST_CATEGORY_UPDATE,
    payload: patch
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
