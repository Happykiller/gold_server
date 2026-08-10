-- Index composites sur `operation`, pour la lecture d'une liste et le calcul
-- des soldes.
--
-- Les huit index de la table sont tous mono-colonne, et AUCUN ne porte sur
-- `date` — qui est pourtant la clé de tri de toute liste d'opérations. Le plan
-- de la requête de liste montrait `type=ALL` sur ses deux branches : deux
-- balayages complets de la table, malgré `operation-account_id` et
-- `operation-account_id_dest`, parce qu'un index mono-colonne ne couvre ni le
-- tri ni le prédicat `active`.
--
-- À 13 718 lignes, MariaDB absorbe ces balayages : le gain immédiat se compte
-- en millisecondes (13 ms contre 12 ms sur la requête de liste, mesuré le
-- 10/08/2026). Ce n'est donc pas la mesure du jour qui justifie ces index,
-- c'est la pente : un balayage complet coûte proportionnellement au volume,
-- un parcours d'index non. On achète aujourd'hui la volumétrie de demain.
--
-- L'ordre des colonnes suit l'usage : égalité d'abord (`account_id`,
-- `active`), tri ensuite (`date`, `id`) — un index ne sert le ORDER BY que si
-- les colonnes d'égalité le précèdent.
--
-- RIEN N'EST SUPPRIMÉ. Les index mono-colonne `operation-account_id` et
-- `operation-account_id_dest` deviennent des préfixes redondants, mais ils
-- portent des clés étrangères : un DROP échouerait, ou pire, réussirait. Leur
-- surcoût est en écriture seulement, négligeable ici.
--
-- Rejouable : la table `migration` étant vide en production, rien ne dit ce
-- qui a déjà été appliqué. Chaque ALTER est donc gardé par un test sur
-- `information_schema`, sur le modèle du `IF NOT EXISTS` de 007 —
-- `ADD INDEX IF NOT EXISTS` n'existe pas sous MariaDB.

-- 1. Branche « opérations émises » de la liste, et préfixe (account_id, active)
--    dont se sert le calcul des soldes.
SET @exists := (
  SELECT COUNT(*) FROM information_schema.STATISTICS
   WHERE table_schema = DATABASE()
     AND table_name = 'operation'
     AND index_name = 'operation-account_active_date'
);
SET @sql := IF(@exists = 0,
  'ALTER TABLE `operation` ADD INDEX `operation-account_active_date` (`account_id`, `active`, `date`, `id`)',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2. Branche « virements reçus » de la liste, et versant reçu des soldes.
SET @exists := (
  SELECT COUNT(*) FROM information_schema.STATISTICS
   WHERE table_schema = DATABASE()
     AND table_name = 'operation'
     AND index_name = 'operation-dest_active_date'
);
SET @sql := IF(@exists = 0,
  'ALTER TABLE `operation` ADD INDEX `operation-dest_active_date` (`account_id_dest`, `active`, `date`, `id`)',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 3. Le cloisonnement, présent dans TOUTES les requêtes du domaine.
SET @exists := (
  SELECT COUNT(*) FROM information_schema.STATISTICS
   WHERE table_schema = DATABASE()
     AND table_name = 'operation'
     AND index_name = 'operation-creator_active_date'
);
SET @sql := IF(@exists = 0,
  'ALTER TABLE `operation` ADD INDEX `operation-creator_active_date` (`creator_id`, `active`, `date`)',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Rafraîchir les statistiques, sans quoi les index posés ci-dessus restent
-- INERTES. Constaté le 10/08/2026 : juste après l'ALTER, le plan montrait
-- encore `type=ALL, key=NULL` sur les deux branches de la liste ; un
-- `ANALYZE TABLE` plus tard, `type=range` sur chacun des deux nouveaux index.
-- L'optimiseur choisit sur des statistiques, pas sur la liste des index — un
-- index posé et jamais analysé ressemble en tout point à un index qui ne sert
-- à rien.
ANALYZE TABLE `operation`;

-- La seule trace de ce qui est appliqué est celle qu'on écrit : la table
-- existe depuis l'origine et n'a jamais servi.
INSERT INTO `migration` (`name`, `execution`)
SELECT '008-perf-index', NOW()
 WHERE NOT EXISTS (SELECT 1 FROM `migration` WHERE `name` = '008-perf-index');
