-- Sortir le `credential_id` du JSON, et l'indexer.
--
-- La connexion par passkey retrouve sa clé par le seul identifiant que
-- l'authentificateur lui donne. Cette recherche s'écrivait :
--
--     AND a.registration LIKE '%<credential_id>%'
--
-- soit un balayage de toute la table, avec une comparaison de sous-chaîne sur
-- un document JSON de plusieurs kilo-octets — et la valeur cherchée venait du
-- client, interpolée dans le texte SQL (refermé le 12/08/2026 par une liaison).
--
-- La colonne ci-dessous porte la même valeur, extraite une fois pour toutes, et
-- se lit par un index unique. Elle est remplie pour les lignes existantes
-- depuis le JSON lui-même : aucune passkey n'est à ré-enregistrer.
--
-- Rejouable : chaque étape se garde de ce qui existe déjà.

-- 1. La colonne. `varchar(255)` : un credential id est du base64url, 43
--    caractères pour les clés courantes, davantage pour les authentificateurs
--    qui enveloppent leur état dans l'identifiant.
SET @exists := (
  SELECT COUNT(*) FROM information_schema.columns
   WHERE table_schema = DATABASE()
     AND table_name = 'passkeys'
     AND column_name = 'credential_id'
);
SET @sql := IF(@exists = 0,
  'ALTER TABLE `passkeys` ADD COLUMN `credential_id` VARCHAR(255) NULL AFTER `user_code`',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2. Le remplissage depuis le JSON déjà stocké.
UPDATE `passkeys`
   SET `credential_id` = JSON_UNQUOTE(JSON_EXTRACT(`registration`, '$.id'))
 WHERE `credential_id` IS NULL
   AND JSON_EXTRACT(`registration`, '$.id') IS NOT NULL;

-- 3. L'index. UNIQUE parce que deux passkeys ne peuvent pas porter le même
--    identifiant de credential : si cela arrivait, la connexion deviendrait
--    ambiguë — on ne saurait plus quel compte ouvrir. Mieux vaut que l'INSERT
--    échoue.
SET @exists := (
  SELECT COUNT(*) FROM information_schema.statistics
   WHERE table_schema = DATABASE()
     AND table_name = 'passkeys'
     AND index_name = 'passkeys-credential_id'
);
SET @sql := IF(@exists = 0,
  'ALTER TABLE `passkeys` ADD UNIQUE INDEX `passkeys-credential_id` (`credential_id`)',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Un index posé sans statistiques reste inerte — leçon du 10/08/2026.
ANALYZE TABLE `passkeys`;

INSERT INTO `migration` (`name`, `execution`)
SELECT '009-passkey-credential-id', NOW()
 WHERE NOT EXISTS (SELECT 1 FROM `migration` WHERE `name` = '009-passkey-credential-id');
