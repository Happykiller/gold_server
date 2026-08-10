-- Retour arrière de 008-perf-index.
--
-- Sans effet fonctionnel : un index ne change que des plans d'exécution. À
-- n'utiliser que si l'un d'eux dégradait une écriture, ce qui reste théorique
-- à cette volumétrie.

SET @exists := (
  SELECT COUNT(*) FROM information_schema.STATISTICS
   WHERE table_schema = DATABASE()
     AND table_name = 'operation'
     AND index_name = 'operation-account_active_date'
);
SET @sql := IF(@exists > 0,
  'ALTER TABLE `operation` DROP INDEX `operation-account_active_date`', 'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (
  SELECT COUNT(*) FROM information_schema.STATISTICS
   WHERE table_schema = DATABASE()
     AND table_name = 'operation'
     AND index_name = 'operation-dest_active_date'
);
SET @sql := IF(@exists > 0,
  'ALTER TABLE `operation` DROP INDEX `operation-dest_active_date`', 'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (
  SELECT COUNT(*) FROM information_schema.STATISTICS
   WHERE table_schema = DATABASE()
     AND table_name = 'operation'
     AND index_name = 'operation-creator_active_date'
);
SET @sql := IF(@exists > 0,
  'ALTER TABLE `operation` DROP INDEX `operation-creator_active_date`', 'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

DELETE FROM `migration` WHERE `name` = '008-perf-index';
