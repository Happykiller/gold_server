// src\config\test.ts
import { DeepPartial } from '@happykiller/sunny-apis';
import { Configuration } from '@src/config/configuration';

export const conf: DeepPartial<Configuration> = {
  env: {
    mode: 'test',
  },
};
