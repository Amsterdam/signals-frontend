import formatConditionalForm from './index';

describe('The format conditional form service', () => {
  it('should be undefined by default', () => {
    expect(formatConditionalForm()).toBeUndefined();
  });

  it('should add name and isVisible true when meta is available', () => {
    expect(
      formatConditionalForm({
        controls: {
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
        }
      })
    ).toEqual({
      controls: {
        description: {
          meta: {
            foo: 'bar',
            isVisible: true,
            name: 'description'
          }
        },
        title: {
          meta: {
            bar: 'baz',
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
          authenticated: true,
          options: null
        }
      }
    });
  });

  it('should show control according to the ifAllOf', () => {
    expect(
      formatConditionalForm(
        {
          controls: {
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
          }
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
            ifAllOf: {
              category: 'bar'
            },
            isVisible: true,
            name: 'var_1'
          }
        },
        var_2: {
          meta: {
            ifAllOf: {
              category: 'bar',
              subcategory: 'foo'
            },
            isVisible: true,
            name: 'var_2'
          }
        },
        var_3: {
          meta: {
            ifAllOf: {
              category: 'wrong'
            },
            isVisible: false,
            name: 'var_3'
          },
          options: null
        },
        var_4: {
          meta: {
            ifAllOf: {
              category: 'bar',
              subcategory: 'wrong'
            },
            isVisible: false,
            name: 'var_4'
          },
          options: null
        },
        array_1: {
          meta: {
            ifAllOf: {
              category: ['bar']
            },
            isVisible: true,
            name: 'array_1'
          }
        },
        array_2: {
          meta: {
            ifAllOf: {
              category: ['bar', 'wrong']
            },
            isVisible: false,
            name: 'array_2'
          },
          options: null
        }
      }
    });
  });

  it('should show control according to the isOneOf', () => {
    expect(
      formatConditionalForm(
        {
          controls: {
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
              },
              options: null
            }
          }
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
            ifOneOf: {
              category: 'bar'
            },
            isVisible: true,
            name: 'var_1'
          }
        },
        var_2: {
          meta: {
            ifOneOf: {
              category: 'bar',
              subcategory: 'foo'
            },
            isVisible: true,
            name: 'var_2'
          }
        },
        var_3: {
          meta: {
            ifOneOf: {
              category: 'wrong'
            },
            isVisible: false,
            name: 'var_3'
          },
          options: null
        },
        var_4: {
          meta: {
            ifOneOf: {
              category: 'bar',
              subcategory: 'wrong'
            },
            isVisible: true,
            name: 'var_4'
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
          },
          options: null
        }
      }
    });
  });
});
