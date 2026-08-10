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
    connectionLimit?: number;
  };

  /** Instrumentation — voir src/common/metrics/request.context.ts. */
  public log?: {
    /** Journalise une requête SQL au-delà de ce nombre de millisecondes. */
    slowQueryMs?: number;
    /** Journalise une opération GraphQL au-delà de ce seuil. 0 = toutes. */
    slowOperationMs?: number;
    /** Coupe complètement la journalisation des mesures (tests, mock). */
    metrics?: boolean;
  };
}
