SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

INSERT INTO `account_type_list` (`id`, `label`, `active`, `creator_id`, `creation_date`, `modificator_id`, `modification_date`) VALUES
(1,	'account.type-regular',	1,	NULL,	'0000-00-00 00:00:00',	NULL,	'0000-00-00 00:00:00'),
(2,	'account.type-template',	1,	NULL,	'0000-00-00 00:00:00',	NULL,	'0000-00-00 00:00:00');

INSERT INTO `operation_status_list` (`id`, `label`, `active`, `creator_id`, `creation_date`, `modificator_id`, `modification_date`) VALUES
(1,	'operation.status-follow',	1,	NULL,	'0000-00-00 00:00:00',	NULL,	'0000-00-00 00:00:00'),
(2,	'operation.status-reconciled',	1,	NULL,	'0000-00-00 00:00:00',	NULL,	'0000-00-00 00:00:00');

INSERT INTO `operation_third_list` (`id`, `label`, `description`, `active`, `creator_id`, `creation_date`, `modificator_id`, `modification_date`) VALUES
(1,	'operation.third-otherCredit',	'',	1,	NULL,	'0000-00-00 00:00:00',	NULL,	'0000-00-00 00:00:00'),
(2,	'operation.third-otherDebit',	'',	1,	NULL,	'0000-00-00 00:00:00',	NULL,	'0000-00-00 00:00:00');

INSERT INTO `operation_type_list` (`id`, `label`, `active`, `creator_id`, `creation_date`, `modificator_id`, `modification_date`) VALUES
(1,	'operation.type-credit',	1,	0,	'0000-00-00 00:00:00',	NULL,	'0000-00-00 00:00:00'),
(2,	'operation.type-debit',	1,	0,	'0000-00-00 00:00:00',	NULL,	'0000-00-00 00:00:00'),
(3,	'operation.type-vire',	1,	0,	'0000-00-00 00:00:00',	NULL,	'0000-00-00 00:00:00');