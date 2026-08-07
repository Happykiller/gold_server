// src\config\configuration.ts
import { ConfigurationBase } from '@happykiller/sunny-apis';

/* istanbul ignore file */
export class Configuration extends ConfigurationBase {
  public bdd?: {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
  };
}
