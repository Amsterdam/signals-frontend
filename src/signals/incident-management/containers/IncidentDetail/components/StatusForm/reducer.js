import statusList, { changeStatusOptionList } from 'signals/incident-management/definitions/statusList';
import * as constants from './constants';

const emailSentWhenStatusChangedTo = status =>
  Boolean(changeStatusOptionList.find(({ email_sent_when_set, key }) => email_sent_when_set && status === key));

const determineWarning = selectedStatusKey => {
  if (selectedStatusKey === 'reopened') {
    return constants.HEROPENED_EXPLANATION;
  }

  if (selectedStatusKey === 'o') {
    return constants.AFGEHANDELD_EXPLANATION;
  }

  if (selectedStatusKey === 'a') {
    return constants.GEANNULEERD_EXPLANATION;
  }

  return '';
};

export const init = incident => {
  const incidentStatus = statusList.find(({ key }) => key === incident.status.state);

  return {
    status: incidentStatus,
    check: {
      checked: emailSentWhenStatusChangedTo(incidentStatus.key),
      disabled: emailSentWhenStatusChangedTo(incidentStatus.key),
    },
    errors: {},
    text: {
      defaultValue: '',
      value: '',
      required: emailSentWhenStatusChangedTo(incidentStatus.key),
    },
    warning: determineWarning(incidentStatus.key),
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_STATUS': {
      const checkboxIsChecked = emailSentWhenStatusChangedTo(action.payload.key);

      return {
        ...state,
        check: {
          checked: checkboxIsChecked,
          disabled: checkboxIsChecked,
        },
        errors: { ...state.errors, text: undefined },
        status: action.payload,
        text: { ...state.text, defaultValue: '', required: checkboxIsChecked },
        warning: determineWarning(action.payload.key),
      };
    }

    case 'TOGGLE_CHECK':
      return {
        ...state,
        check: { ...state.check, checked: !state.check.checked },
        text: { ...state.text, required: !state.check.checked },
      };

    case 'SET_WARNING':
      return { ...state, warning: action.payload };

    case 'SET_DEFAULT_TEXT':
      return {
        ...state,
        errors: { ...state.errors, text: undefined },
        text: { ...state.text, value: '', defaultValue: action.payload },
      };

    case 'SET_TEXT':
      return {
        ...state,
        errors: { ...state.errors, text: undefined },
        text: { ...state.text, value: action.payload, defaultValue: '' },
      };

    case 'SET_ERRORS':
      return { ...state, errors: { ...state.errors, ...action.payload } };

    default:
      return state;
  }
};

export default reducer;
