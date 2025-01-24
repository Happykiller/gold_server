ALTER TABLE `passkeys`
ADD `registration_parsed` longtext COLLATE 'utf8mb4_bin' NOT NULL AFTER `registration`;