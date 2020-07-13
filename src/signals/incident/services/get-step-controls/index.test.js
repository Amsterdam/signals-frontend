import getStepControls from '.';

describe('The get step controls service', () => {
  const controls = {
    description: {
      type: 'text',
    },
    location: {
      type: 'latlng',
    },
  };

  it('should return undefined by default', () => {
    expect(getStepControls()).toEqual({});
  });

  it('should return controls of wizard step from wizard definition', () => {
    expect(getStepControls({
      form: {
        controls,
      },
    })).toEqual(controls);
  });

  it('should return controls of wizard step from wizard formFactory', () => {
    expect(getStepControls({
      formFactory: () => ({ controls }),
    })).toEqual(controls);
  });
});
