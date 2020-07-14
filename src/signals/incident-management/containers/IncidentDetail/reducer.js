export const initialState = {
  attachmentHref: undefined,
  attachments: undefined,
  children: undefined,
  error: undefined,
  history: undefined,
  incident: undefined,
  patching: undefined,
};

const reducer = (state, action) => {
  // disabling linter; default case does not apply, because all actions are known
  // eslint-disable-next-line default-case
  switch (action.type) {
    case 'closeAll':
      return { ...state, preview: undefined, edit: undefined, error: undefined, attachmentHref: '' };

    case 'error':
      return { ...state, error: action.payload };

    case 'attachments':
      return { ...state, attachments: action.payload };

    case 'history':
      return { ...state, history: action.payload };

    case 'children':
      return { ...state, children: action.payload };

    case 'defaultTexts':
      return { ...state, defaultTexts: action.payload };

    case 'incident':
      return { ...state, children: undefined, incident: { ...state.incident, ...action.payload } };

    case 'patchStart':
      return { ...state, patching: action.payload };

    case 'patchSuccess':
      return { ...state, patching: undefined };

    case 'preview':
      return { ...state, edit: undefined, ...action.payload };

    case 'edit':
      return { ...state, preview: undefined, ...action.payload };

    case 'reset':
      return initialState;
  }

  return state;
};

export default reducer;
