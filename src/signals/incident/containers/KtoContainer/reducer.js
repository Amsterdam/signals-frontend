import { fromJS } from 'immutable';
import {
  UPDATE_KTA
} from './constants';

const initialState = fromJS({
  kto: {},
  answers: {
    'Mijn melding is snel opgepakt': 'Mijn melding is snel opgepakt',
    'Het probleem is verholpen': 'Het probleem is verholpen'
  }
});

function ktoContainerReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_KTA:
      return state
        .set('kto', fromJS({
          ...state.get('kto').toJS(),
          ...action.payload
        }));

    default:
      return state;
  }
}

export default ktoContainerReducer;
