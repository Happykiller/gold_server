import { merge } from 'lodash';

import { defaults } from './defaults';
import { Configuration } from './configuration';

let config: Configuration;

// eslint-disable-next-line @typescript-eslint/no-var-requires
if (process.env.NODE_ENV) {
  const custo = require(`./${process.env.NODE_ENV}`);
  
  config = merge({}, defaults, custo.conf);
  
} else {
  config = defaults;
}

export { config };