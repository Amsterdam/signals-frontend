import forEach from 'lodash.foreach';
import set from 'lodash.set';

import getStepControls from '../get-step-controls';
import convertValue from '../convert-value';

const mapPaths = (params, incident, wizard) => {
  forEach(wizard, (step) => {
    const category_url = incident && incident.subcategory_link ? new URL(incident.subcategory_link).pathname : '';
    const controls = getStepControls(step, incident);
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
