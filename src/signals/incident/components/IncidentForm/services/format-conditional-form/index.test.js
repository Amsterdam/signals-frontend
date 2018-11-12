import formatConditionalForm from './index';

describe('The format conditional form service', () => {
  it('should be undefined by default', () => {
    expect(formatConditionalForm()).toBeUndefined();
  });

  it('should add name and isVisible true when meta is available', () => {
    const controls = {
      description: {
        meta: {
          foo: 'bar'
        }
      },
      title: {
        meta: {
          bar: 'baz'
        }
      },
      var_no_path: {}
    };
    expect(
      formatConditionalForm({
        controls
      })
    ).toEqual({
      controls: {
        description: {
          meta: {
            ...controls.description.meta,
            // foo: 'bar',
            isVisible: true,
            name: 'description'
          }
        },
        title: {
          meta: {
            ...controls.title.meta,
            isVisible: true,
            name: 'title'
          }
        },
        var_no_path: {}
      }
    });
  });

  it('should show controls based on authorization', () => {
    expect(
      formatConditionalForm({
        controls: {
          var_1: {
            meta: {},
            authenticated: true
          }
        }
      }, {}, true)
    ).toEqual({
      controls: {
        var_1: {
          meta: {
            isVisible: true,
            name: 'var_1'
          },
          authenticated: true
        }
      }
    });
  });

  it('should hide controls when not authorized', () => {
    expect(
      formatConditionalForm({
        controls: {
          var_1: {
            meta: {},
            authenticated: true
          }
        }
      }, {}, false)
    ).toEqual({
      controls: {
        var_1: {
          meta: {
            isVisible: false,
            name: 'var_1'
          },
          authenticated: true
        }
      }
    });
  });

  it('should show control according to the ifAllOf', () => {
    const controls = {
      var_1: {
        meta: {
          ifAllOf: {
            category: 'bar'
          }
        }
      },
      var_2: {
        meta: {
          ifAllOf: {
            category: 'bar',
            subcategory: 'foo'
          }
        }
      },
      var_3: {
        meta: {
          ifAllOf: {
            category: 'wrong'
          }
        }
      },
      var_4: {
        meta: {
          ifAllOf: {
            category: 'bar',
            subcategory: 'wrong'
          }
        }
      },
      array_1: {
        meta: {
          ifAllOf: {
            category: ['bar']
          }
        }
      },
      array_2: {
        meta: {
          ifAllOf: {
            category: ['bar', 'wrong']
          }
        }
      }
    };

    expect(
      formatConditionalForm(
        {
          controls
        },
        {
          category: 'bar',
          subcategory: 'foo'
        }
      )
    ).toEqual({
      controls: {
        var_1: {
          meta: {
            ...controls.var_1.meta,
            isVisible: true,
            name: 'var_1'
          }
        },
        var_2: {
          meta: {
            ...controls.var_2.meta,
            isVisible: true,
            name: 'var_2'
          }
        },
        var_3: {
          meta: {
            ...controls.var_3.meta,
            isVisible: false,
            name: 'var_3'
          }
        },
        var_4: {
          meta: {
            ...controls.var_4.meta,
            isVisible: false,
            name: 'var_4'
          }
        },
        array_1: {
          meta: {
            ...controls.array_1.meta,
            isVisible: true,
            name: 'array_1'
          }
        },
        array_2: {
          meta: {
            ...controls.array_2.meta,
            isVisible: false,
            name: 'array_2'
          }
        }
      }
    });
  });

  it('should show control according to the isOneOf', () => {
    const controls = {
      var_1: {
        meta: {
          ifOneOf: {
            category: 'bar'
          }
        }
      },
      var_2: {
        meta: {
          ifOneOf: {
            category: 'bar',
            subcategory: 'foo'
          }
        }
      },
      var_3: {
        meta: {
          ifOneOf: {
            category: 'wrong'
          }
        }
      },
      var_4: {
        meta: {
          ifOneOf: {
            category: 'bar',
            subcategory: 'wrong'
          }
        }
      },
      array_1: {
        meta: {
          ifOneOf: {
            category: ['bar']
          },
          isVisible: true,
          name: 'array_1'
        }
      },
      array_2: {
        meta: {
          ifOneOf: {
            category: ['incorrect', 'wrong']
          },
          isVisible: false,
          name: 'array_2'
        }
      }
    };

    expect(
      formatConditionalForm(
        {
          controls
        },
        {
          category: 'bar',
          subcategory: 'foo'
        }
      )
    ).toEqual({
      controls: {
        var_1: {
          meta: {
            ...controls.var_1.meta,
            isVisible: true,
            name: 'var_1'
          }
        },
        var_2: {
          meta: {
            ...controls.var_2.meta,
            isVisible: true,
            name: 'var_2'
          }
        },
        var_3: {
          meta: {
            ...controls.var_3.meta,
            isVisible: false,
            name: 'var_3'
          }
        },
        var_4: {
          meta: {
            ...controls.var_4.meta,
            isVisible: true,
            name: 'var_4'
          }
        },
        array_1: {
          meta: {
            ...controls.array_1.meta,
            isVisible: true,
            name: 'array_1'
          }
        },
        array_2: {
          meta: {
            ...controls.array_2.meta,
            isVisible: false,
            name: 'array_2'
          }
        }
      }
    });
  });

  it('should show control according to the ifNoneOf', () => {
    const controls = {
      var_1: {
        meta: {
          ifNoneOf: {
            category: 'bar'
          }
        }
      },
      var_2: {
        meta: {
          ifNoneOf: {
            category: 'bar',
            subcategory: 'foo'
          }
        }
      },
      var_3: {
        meta: {
          ifNoneOf: {
            category: 'wrong'
          }
        }
      },
      var_4: {
        meta: {
          ifNoneOf: {
            category: 'bar',
            subcategory: 'wrong'
          }
        }
      },
      array_1: {
        meta: {
          ifNoneOf: {
            category: ['bar']
          },
          isVisible: true,
          name: 'array_1'
        }
      },
      array_2: {
        meta: {
          ifNoneOf: {
            category: ['incorrect', 'wrong']
          },
          isVisible: false,
          name: 'array_2'
        }
      }
    };

    expect(
      formatConditionalForm(
        {
          controls
        },
        {
          category: 'bar',
          subcategory: 'foo'
        }
      )
    ).toEqual({
      controls: {
        var_1: {
          meta: {
            ...controls.var_1.meta,
            isVisible: false,
            name: 'var_1'
          }
        },
        var_2: {
          meta: {
            ...controls.var_2.meta,
            isVisible: false,
            name: 'var_2'
          }
        },
        var_3: {
          meta: {
            ...controls.var_3.meta,
            isVisible: true,
            name: 'var_3'
          }
        },
        var_4: {
          meta: {
            ...controls.var_4.meta,
            isVisible: false,
            name: 'var_4'
          }
        },
        array_1: {
          meta: {
            ...controls.array_1.meta,
            isVisible: false,
            name: 'array_1'
          }
        },
        array_2: {
          meta: {
            ...controls.array_2.meta,
            isVisible: true,
            name: 'array_2'
          }
        }
      }
    });
  });

  it('should show control according to the ifAllOf and isOneOf', () => {
    const controls = {
      var_1: {
        meta: {
          ifOneOf: {
            category: 'bar'
          },
          ifAllOf: {
            subcategory: 'foo'
          }
        }
      },
      var_2: {
        meta: {
          ifOneOf: {
            category: 'wrong'
          },
          ifAllOf: {
            subcategory: 'foo'
          }
        }
      },
      var_3: {
        meta: {
          ifOneOf: {
            category: 'bar'
          },
          ifAllOf: {
            subcategory: 'wrong'
          }
        }
      }
    };

    expect(
      formatConditionalForm(
        {
          controls
        },
        {
          category: 'bar',
          subcategory: 'foo'
        }
      )
    ).toEqual({
      controls: {
        var_1: {
          meta: {
            ...controls.var_1.meta,
            isVisible: true,
            name: 'var_1'
          }
        },
        var_2: {
          meta: {
            ...controls.var_2.meta,
            isVisible: false,
            name: 'var_2'
          }
        },
        var_3: {
          meta: {
            ...controls.var_3.meta,
            isVisible: false,
            name: 'var_3'
          }
        }
      }
    });
  });
});
