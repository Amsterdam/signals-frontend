/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const DEFAULT_LOCALE = 'nl';

export const AUTHENTICATE_USER = 'sia/App/AUTHENTICATE_USER';
export const AUTHORIZE_USER = 'sia/App/AUTHORIZE_USER';

export const SHOW_GLOBAL_ERROR = 'sia/App/SHOW_GLOBAL_ERROR';
export const RESET_GLOBAL_ERROR = 'sia/App/RESET_GLOBAL_ERROR';

export const LOGIN = 'sia/App/LOGIN';
export const LOGOUT = 'sia/App/LOGOUT';

export const UPLOAD_REQUEST = 'sia/App/UPLOAD_REQUEST';
export const UPLOAD_PROGRESS = 'sia/App/UPLOAD_PROGRESS';
export const UPLOAD_SUCCESS = 'sia/App/UPLOAD_SUCCESS';
export const UPLOAD_FAILURE = 'sia/App/UPLOAD_FAILURE';
