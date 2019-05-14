import forEach from 'lodash.foreach';
import set from 'lodash.set';

import getControls from '../get-controls';

const convertValue = (value) => {
  if (value === 0) {
    return 0;
  }
  if (value === true) {
    return 'ja';
  }
  if (value === false) {
    return 'nee';
  }

  return value;
};

const mapPaths = (params, incident, wizard) => {
  forEach(wizard, (step) => {
    const category_url = incident && incident.subcategory_link ? new URL(incident.subcategory_link).pathname : '';
    const controls = getControls(step, incident);
    let mapMerge = {};

    forEach(controls, (control, name) => {
      const value = incident[name];
      const meta = control.meta;

      if (meta && meta.isVisible && meta.pathMerge) {
        const answer = convertValue(value);
        if (answer || answer === 0) {
          mapMerge = {
            ...mapMerge,
            [meta.pathMerge]: [
              ...(mapMerge[meta.pathMerge] || []),
              {
                id: name,
                label: meta.label,
                category_url,
                answer
              }
            ]
          };
        }
      }
    });

    forEach(mapMerge, (value, key) => {
      set(params, key, value);
    });
  });
};

export default mapPaths;
