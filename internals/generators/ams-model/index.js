/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add a data model',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'userModel',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A model with this name already exists' : true;
      }

      return 'The name is required';
    },
  }, {
    type: 'confirm',
    name: 'wantActionsAndReducer',
    default: true,
    message: 'Do you want an actions/constants/selectors/reducer tuple for this model?',
  }, {
    type: 'confirm',
    name: 'wantSaga',
    default: true,
    message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
  }],
  actions: (data) => {
    // Generate index.js and index.test.js
    const actions = [{
      type: 'add',
      path: '../../src/models/{{properCase name}}/index.js',
      templateFile: './ams-model/model.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../src/models/{{properCase name}}/index.test.js',
      templateFile: './ams-model/test.js.hbs',
      abortOnFail: true,
    }];

    // If they want actions and a reducer, generate actions.js, constants.js,
    // reducer.js and the corresponding tests for actions and the reducer
    if (data.wantActionsAndReducer) {
      // Actions
      actions.push({
        type: 'add',
        path: '../../src/models/{{properCase name}}/actions.js',
        templateFile: './ams-model/actions.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../src/models/{{properCase name}}/actions.test.js',
        templateFile: './ams-model/actions.test.js.hbs',
        abortOnFail: true,
      });

      // Constants
      actions.push({
        type: 'add',
        path: '../../src/models/{{properCase name}}/constants.js',
        templateFile: './ams-model/constants.js.hbs',
        abortOnFail: true,
      });

      // Selectors
      actions.push({
        type: 'add',
        path: '../../src/models/{{properCase name}}/selectors.js',
        templateFile: './ams-model/selectors.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../src/models/{{properCase name}}/selectors.test.js',
        templateFile: './ams-model/selectors.test.js.hbs',
        abortOnFail: true,
      });

      // Reducer
      actions.push({
        type: 'add',
        path: '../../src/models/{{properCase name}}/reducer.js',
        templateFile: './ams-model/reducer.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../src/models/{{properCase name}}/reducer.test.js',
        templateFile: './ams-model/reducer.test.js.hbs',
        abortOnFail: true,
      });
    }

    // Sagas
    if (data.wantSaga) {
      actions.push({
        type: 'add',
        path: '../../src/models/{{properCase name}}/saga.js',
        templateFile: './ams-model/saga.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../src/models/{{properCase name}}/saga.test.js',
        templateFile: './ams-model/saga.test.js.hbs',
        abortOnFail: true,
      });
    }

    return actions;
  },
};
