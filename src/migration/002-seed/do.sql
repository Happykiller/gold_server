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

INSERT INTO `operation_category_list` (`id`, `label`, `description`, `active`, `creator_id`, `creation_date`, `modificator_id`, `modification_date`) VALUES
(1,	'operation.category-other',	'',	1,	NULL,	'0000-00-00 00:00:00',	NULL,	'0000-00-00 00:00:00'),
(2,	'Alimentation',	'',	1,	1,	'2018-07-11 10:45:19',	NULL,	'0000-00-00 00:00:00'),
(3,	'Santé',	'',	1,	1,	'2018-07-11 10:57:01',	NULL,	'0000-00-00 00:00:00'),
(4,	'Cadeau',	'',	1,	1,	'2018-07-11 11:02:43',	NULL,	'0000-00-00 00:00:00'),
(5,	'Prêt',	'',	1,	1,	'2018-07-11 11:11:34',	NULL,	'0000-00-00 00:00:00'),
(6,	'Mobilité',	'',	1,	1,	'2018-07-16 09:38:16',	1,	'2020-02-11 08:02:27'),
(7,	'Vacances',	'',	1,	1,	'2018-07-19 10:24:39',	NULL,	'0000-00-00 00:00:00'),
(8,	'Frais',	'banquaire, etc',	1,	1,	'2018-08-02 10:54:20',	NULL,	'0000-00-00 00:00:00'),
(9,	'Sortie',	'',	1,	1,	'2018-08-02 10:55:52',	NULL,	'0000-00-00 00:00:00'),
(10,	'Revenue',	'',	1,	1,	'2018-08-02 11:00:09',	NULL,	'0000-00-00 00:00:00'),
(11,	'Régulation',	'',	1,	1,	'2018-08-02 11:16:38',	NULL,	'0000-00-00 00:00:00'),
(12,	'Jeux',	'',	1,	1,	'2018-08-08 10:34:32',	NULL,	'0000-00-00 00:00:00'),
(13,	'Impôts',	'',	1,	1,	'2018-08-19 19:34:03',	NULL,	'0000-00-00 00:00:00'),
(14,	'FAI',	'',	1,	1,	'2018-08-21 10:33:16',	NULL,	'0000-00-00 00:00:00'),
(15,	'Immobilier ',	'',	1,	1,	'2018-08-28 15:22:14',	1,	'2020-02-11 08:02:13'),
(16,	'Salaire',	'',	1,	1,	'2018-09-04 15:45:46',	NULL,	'0000-00-00 00:00:00'),
(17,	'Assurance',	'',	1,	1,	'2018-09-04 16:33:20',	NULL,	'0000-00-00 00:00:00'),
(18,	'Charges',	'',	1,	1,	'2018-10-03 11:30:41',	NULL,	'0000-00-00 00:00:00'),
(19,	'Régulation',	'équilibrage de compte',	0,	1,	'2020-03-22 16:40:44',	1,	'2020-03-22 16:41:16');