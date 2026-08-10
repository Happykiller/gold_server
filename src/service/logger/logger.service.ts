/**
 * L'interface déclarait `info(): void` et `error(): void` — sans paramètres.
 * Un logger qu'on ne peut rien faire journaliser n'a jamais été appelé : le
 * winston câblé dans le conteneur d'injection n'avait aucun usage dans tout
 * `src/`. La signature ci-dessous est celle que winston accepte déjà.
 */
export interface LoggerService {
  info(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}
