import { BddServicePasskeyMysql } from './db.service.passkey.mysql';

/**
 * Les passkeys ont cessé de fonctionner en production le 07/08/2026, sans
 * qu'une ligne de ce dépôt ait changé : le lock est passé de mysql2 3.14 à
 * 3.23, version où le driver désérialise lui-même les colonnes que MariaDB
 * annonce comme JSON. `JSON.parse` recevait dès lors un objet, d'où le
 * `"[object Object]" is not valid JSON` remonté jusqu'à l'écran Profil — et,
 * en silence cette fois, l'échec de la connexion par passkey et de
 * l'enregistrement d'une nouvelle clé.
 *
 * Ces tests verrouillent la seule propriété qui compte ici : la couche rend des
 * **objets** quoi que le driver lui donne. Ils portent aussi sur le texte des
 * requêtes et leurs liaisons, sur le modèle de `bdd.service.operationLink.sql.spec.ts` :
 * `getPasskey` cherchait par `credential_id` interpolé dans le SQL, sur un
 * chemin empruntable sans être authentifié.
 *
 * Fixtures réduites à la forme (loi 7) : aucune vraie clé, aucun vrai
 * identifiant d'appareil.
 */
const REGISTRATION = { id: 'credential-abc', type: 'public-key' };
const REGISTRATION_PARSED = {
  credential: { id: 'credential-abc', publicKey: 'cle-publique' },
};

const makeService = (rows: unknown[] = []) => {
  // mysql2 rend `[rows, fields]` pour un SELECT.
  const execute = jest.fn().mockResolvedValue([rows]);
  const service = new BddServicePasskeyMysql();
  // La classe n'a pas de constructeur : en production, `pool` lui est posé par
  // les autres classes du mixin `applyInstanceMixins` (bdd.service.sql.ts).
  service.pool = { execute };
  return { service, execute };
};

const ligne = (registration: unknown, registrationParsed: unknown) => ({
  id: 6,
  user_id: 1,
  user_code: 'faro',
  label: 'un appareil',
  hostname: 'exemple.test',
  challenge: 'un-challenge',
  registration,
  registration_parsed: registrationParsed,
});

const lastQuery = (execute: jest.Mock): string => execute.mock.calls[0][0];
const lastParams = (execute: jest.Mock): unknown[] => execute.mock.calls[0][1];

describe('BddServicePasskeyMysql — lecture des colonnes JSON', () => {
  describe('getPasskeyByUserId', () => {
    it('accepte une `registration` déjà désérialisée par le driver', async () => {
      // Le cas de production depuis mysql2 3.23 : la colonne porte un
      // CHECK json_valid, MariaDB la déclare JSON, le driver la rend en objet.
      const { service } = makeService([
        ligne(REGISTRATION, JSON.stringify(REGISTRATION_PARSED)),
      ]);

      const passkeys = await service.getPasskeyByUserId({ user_id: 1 } as any);

      expect(passkeys[0].registration).toEqual(REGISTRATION);
      expect(passkeys[0].registrationParsed).toEqual(REGISTRATION_PARSED);
    });

    it('accepte une `registration` rendue en chaîne', async () => {
      // Le comportement d'avant 3.23, et celui d'une base dont la colonne n'a
      // pas la contrainte : les deux doivent rester lisibles.
      const { service } = makeService([
        ligne(
          JSON.stringify(REGISTRATION),
          JSON.stringify(REGISTRATION_PARSED),
        ),
      ]);

      const passkeys = await service.getPasskeyByUserId({ user_id: 1 } as any);

      expect(passkeys[0].registration).toEqual(REGISTRATION);
      expect(passkeys[0].registrationParsed).toEqual(REGISTRATION_PARSED);
    });

    it('rend `null` sur une `registration_parsed` vide, sans lever', async () => {
      const { service } = makeService([ligne(REGISTRATION, '')]);

      const passkeys = await service.getPasskeyByUserId({ user_id: 1 } as any);

      expect(passkeys[0].registrationParsed).toBeNull();
    });

    it('lie le user_id au lieu de l’interpoler', async () => {
      const { service, execute } = makeService([]);

      await service.getPasskeyByUserId({ user_id: 42 } as any);

      expect(lastQuery(execute)).toContain('a.user_id = ?');
      expect(lastQuery(execute)).not.toContain('42');
      expect(lastParams(execute)).toEqual([42]);
    });
  });

  describe('getPasskey', () => {
    it('accepte une `registration` déjà désérialisée par le driver', async () => {
      // Le chemin de la connexion : AuthPasskeyUsecase lit ensuite
      // `registrationParsed.credential`, qui doit donc être un objet.
      const { service } = makeService([
        ligne(REGISTRATION, JSON.stringify(REGISTRATION_PARSED)),
      ]);

      const passkey = await service.getPasskey({
        credential_id: 'credential-abc',
      } as any);

      expect(passkey.registration).toEqual(REGISTRATION);
      expect(passkey.registrationParsed).toEqual(REGISTRATION_PARSED);
    });

    it('rend `null` sur une `registration_parsed` vide, sans lever', async () => {
      // Cette branche-ci n'avait aucun garde-fou : une chaîne vide y levait une
      // SyntaxError, masquée en AUTH_PASSKEY_USECASE_FAIL côté appelant.
      const { service } = makeService([ligne(REGISTRATION, '')]);

      const passkey = await service.getPasskey({ passkey_id: 6 } as any);

      expect(passkey.registrationParsed).toBeNull();
    });

    it('renseigne credential_id à l’insertion', async () => {
      // Sans quoi la colonne resterait vide pour toute clé créée après la
      // migration, et la connexion ne retrouverait plus rien.
      const { service, execute } = makeService([]);

      await service.createPasskey({
        user_id: 1,
        user_code: 'faro',
        label: 'un appareil',
        hostname: 'exemple.test',
        challenge: 'c',
        registration: REGISTRATION,
        registrationParsed: REGISTRATION_PARSED,
      } as any);

      expect(lastQuery(execute)).toContain('credential_id');
      expect(lastParams(execute)).toContain(REGISTRATION.id);
    });

    it('cherche par la colonne indexée, et lie sa valeur', async () => {
      // C'était `registration LIKE '%…%'` : un balayage de toute la table avec
      // comparaison de sous-chaîne sur un document JSON, sur le chemin de la
      // connexion. La colonne `credential_id` (migration 009) porte la même
      // valeur, sous index unique.
      const { service, execute } = makeService([]);

      await service.getPasskey({ credential_id: "x' OR 1=1 --" } as any);

      expect(lastQuery(execute)).toContain('a.credential_id = ?');
      expect(lastQuery(execute)).not.toContain('LIKE');
      expect(lastQuery(execute)).not.toContain('OR 1=1');
      expect(lastParams(execute)).toEqual(["x' OR 1=1 --"]);
    });

    it('lie le passkey_id au lieu de l’interpoler', async () => {
      const { service, execute } = makeService([]);

      await service.getPasskey({ passkey_id: 6 } as any);

      expect(lastQuery(execute)).toContain('a.id = ?');
      expect(lastParams(execute)).toEqual([6]);
    });

    it('ne rend rien, et ne cherche rien, sans critère', async () => {
      const { service, execute } = makeService([]);

      const passkey = await service.getPasskey({} as any);

      expect(passkey).toBeNull();
      expect(lastQuery(execute)).toContain('AND false');
      expect(lastParams(execute)).toEqual([]);
    });
  });
});
