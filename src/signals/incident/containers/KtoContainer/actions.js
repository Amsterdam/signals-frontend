import {
  UPDATE_KTA,
} from './constants';

export function updateKto(payload) {
  return {
    type: UPDATE_KTA,
    payload
  };
}
