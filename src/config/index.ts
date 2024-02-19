/* istanbul ignore file */
import { merge } from 'lodash';

import { defaults } from '@src/config/defaults';
import { Configuration } from '@src/config/configuration';

let config: Configuration;

// eslint-disable-next-line @typescript-eslint/no-var-requires
if (process.env.NODE_ENV) {
  const custo = require(`./${process.env.NODE_ENV}`);
  
  config = merge({}, defaults, custo.conf);
  
} else {
  config = defaults;
}

export { config };