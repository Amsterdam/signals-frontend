/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add an unconnected component',
  prompts: [{
    type: 'list',
    name: 'type',
    message: 'Select the type of component',
    default: 'Stateless Function',
    choices: () => ['Stateless Function', 'React.PureComponent', 'React.Component'],
  }, {
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Button',
    validate: value => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A component or container with this name already exists' : true;
      }

      return 'The name is required';
    },
  }, {
    type: 'confirm',
    name: 'wantLoadable',
    default: false,
    message: 'Do you want to load the component asynchronously?',
  }],
  actions: data => {
    // Generate index.js and index.test.js
    let componentTemplate;

    switch (data.type) {
      case 'Stateless Function':
      default: {
        componentTemplate = './ams-component/stateless.js.hbs';
        break;
      }
    }

    const actions = [{
      type: 'add',
      path: '../../src/components/{{properCase name}}/index.js',
      templateFile: componentTemplate,
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../src/components/{{properCase name}}/index.test.js',
      templateFile: './ams-component/test.js.hbs',
      abortOnFail: true,
    }];

    actions.push({
      type: 'add',
      path: '../../src/components/{{properCase name}}/style.scss',
      templateFile: './ams-component/style.scss.hbs',
      abortOnFail: true,
    });

    return actions;
  },
};
