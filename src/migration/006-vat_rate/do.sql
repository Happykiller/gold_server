ALTER TABLE `operation`
ADD `vat_rate` decimal(5,2) NOT NULL DEFAULT 20.00 AFTER `category_id`;

UPDATE `operation`
SET `vat_rate` = 20.00
WHERE `vat_rate` IS NULL;
