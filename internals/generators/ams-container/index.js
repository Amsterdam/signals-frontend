/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add a container component',
  prompts: [{
    type: 'list',
    name: 'type',
    message: 'Select the base component type:',
    default: 'React.Component',
    choices: () => ['Stateless Function', 'React.PureComponent', 'React.Component'],
  }, {
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Form',
    validate: value => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A component or container with this name already exists' : true;
      }

      return 'The name is required';
    },
  }, {
    type: 'confirm',
    name: 'wantHeaders',
    default: false,
    message: 'Do you want headers?',
  }, {
    type: 'confirm',
    name: 'wantActionsAndReducer',
    default: true,
    message: 'Do you want an actions/constants/selectors/reducer tuple for this container?',
  }, {
    type: 'confirm',
    name: 'wantSaga',
    default: true,
    message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
  }],
  actions: data => {
    // Generate index.js and index.test.js
    var componentTemplate; // eslint-disable-line no-var

    switch (data.type) {
      case 'Stateless Function':
      default: {
        componentTemplate = './ams-container/stateless.js.hbs';
        break;
      }
    }

    const actions = [{
      type: 'add',
      path: '../../src/containers/{{properCase name}}/index.js',
      templateFile: componentTemplate,
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../src/containers/{{properCase name}}/index.test.js',
      templateFile: './ams-container/test.js.hbs',
      abortOnFail: true,
    }];

    // If they want actions and a reducer, generate actions.js, constants.js,
    // reducer.js and the corresponding tests for actions and the reducer
    if (data.wantActionsAndReducer) {
      // Actions
      actions.push({
        type: 'add',
        path: '../../src/containers/{{properCase name}}/actions.js',
        templateFile: './ams-container/actions.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../src/containers/{{properCase name}}/actions.test.js',
        templateFile: './ams-container/actions.test.js.hbs',
        abortOnFail: true,
      });

      // Constants
      actions.push({
        type: 'add',
        path: '../../src/containers/{{properCase name}}/constants.js',
        templateFile: './ams-container/constants.js.hbs',
        abortOnFail: true,
      });

      // Selectors
      actions.push({
        type: 'add',
        path: '../../src/containers/{{properCase name}}/selectors.js',
        templateFile: './ams-container/selectors.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../src/containers/{{properCase name}}/selectors.test.js',
        templateFile: './ams-container/selectors.test.js.hbs',
        abortOnFail: true,
      });

      // Reducer
      actions.push({
        type: 'add',
        path: '../../src/containers/{{properCase name}}/reducer.js',
        templateFile: './ams-container/reducer.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../src/containers/{{properCase name}}/reducer.test.js',
        templateFile: './ams-container/reducer.test.js.hbs',
        abortOnFail: true,
      });
    }

    // Sagas
    if (data.wantSaga) {
      actions.push({
        type: 'add',
        path: '../../src/containers/{{properCase name}}/saga.js',
        templateFile: './ams-container/saga.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../src/containers/{{properCase name}}/saga.test.js',
        templateFile: './ams-container/saga.test.js.hbs',
        abortOnFail: true,
      });
    }

    // Style
    actions.push({
      type: 'add',
      path: '../../src/containers/{{properCase name}}/style.scss',
      templateFile: './ams-container/style.scss.hbs',
      abortOnFail: true,
    });

    return actions;
  },
};
