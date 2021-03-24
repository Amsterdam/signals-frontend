import onNext from '.';

describe('The wizard on next service', () => {
  const wizardDefinition = {
    step1: {
    },
    step2: {
      getNextStep: () => 'incident/step4',
    },
    step3: {},
    step4: {},
  };
  let props;
  let incident;

  beforeEach(() => {
    props = {
      step: {},
      steps: [
        {
          id: 'incident/step1',
        },
        {
          id: 'incident/step2',
        },
        {
          id: 'incident/step3',
        },
        {
          id: 'incident/step4',
        },
      ],
      push: jest.fn(),
    };

    incident = {
      category: 'foo',
      subcategory: 'bar',
    };
  });

  it('should go to next step dispatching a push', () => {
    props.step.id = 'incident/step1';
    onNext(wizardDefinition, props, incident);

    expect(props.push).toHaveBeenCalled();
  });

  it('should skip next step dispatching a push', () => {
    props.step.id = 'incident/step2';
    onNext(wizardDefinition, props, incident);

    expect(props.push).toHaveBeenCalledWith('incident/step4');
  });

  it('should not dispatch a push when wizard is empty', () => {
    props.step.id = 'incident/step1';
    props.steps = [];
    onNext(wizardDefinition, props, incident);

    expect(props.push).not.toHaveBeenCalled();
  });
});
