SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;

CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_id` int(11) NOT NULL DEFAULT 1,
  `parent_account_id` int(11) DEFAULT NULL,
  `label` varchar(250) NOT NULL,
  `description` text DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `creator_id` int(11) NOT NULL,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modificator_id` int(11) DEFAULT NULL,
  `modification_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `account-parent_account` (`parent_account_id`),
  KEY `account-creator` (`creator_id`),
  KEY `account-modificator` (`modificator_id`),
  KEY `type_id` (`type_id`),
  CONSTRAINT `account-creator` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `account-modificator` FOREIGN KEY (`modificator_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `account-parent_account` FOREIGN KEY (`parent_account_id`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `account_type_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(250) NOT NULL,
  `description` text DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `creator_id` int(11) NOT NULL,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modificator_id` int(11) DEFAULT NULL,
  `modification_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `account-creator` (`creator_id`),
  KEY `account-modificator` (`modificator_id`),
  CONSTRAINT `account_type_list-creator` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `account_type_list-modificator` FOREIGN KEY (`modificator_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `migration` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `execution` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name_first` varchar(20) NOT NULL,
  `name_last` varchar(20) NOT NULL,
  `description` text NOT NULL,
  `mail` varchar(100) NOT NULL,
  `active` int(2) NOT NULL DEFAULT 1,
  `creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `modification` datetime DEFAULT CURRENT_TIMESTAMP,
  `language` varchar(50) NOT NULL DEFAULT 'fr',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `operation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) NOT NULL,
  `account_id_dest` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` datetime NOT NULL,
  `status_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `third_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `creator_id` int(11) NOT NULL,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modificator_id` int(11) DEFAULT NULL,
  `modification_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `operation-creator` (`creator_id`),
  KEY `operation-modificator` (`modificator_id`),
  KEY `operation-account_id` (`account_id`),
  KEY `operation-status_id` (`status_id`),
  KEY `operation-type_id` (`type_id`),
  KEY `operation-third_id` (`third_id`),
  KEY `operation-category_id` (`category_id`),
  KEY `operation-account_id_dest` (`account_id_dest`),
  CONSTRAINT `operation-account_id` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `operation-account_id_dest` FOREIGN KEY (`account_id_dest`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `operation-category_id` FOREIGN KEY (`category_id`) REFERENCES `operation_category_list` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `operation-creator` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `operation-modificator` FOREIGN KEY (`modificator_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `operation-status_id` FOREIGN KEY (`status_id`) REFERENCES `operation_status_list` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `operation-third_id` FOREIGN KEY (`third_id`) REFERENCES `operation_third_list` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `operation-type_id` FOREIGN KEY (`type_id`) REFERENCES `operation_type_list` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `operation_category_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(250) NOT NULL,
  `description` text DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `creator_id` int(11) DEFAULT NULL,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modificator_id` int(11) DEFAULT NULL,
  `modification_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `operation_status_list-creator` (`creator_id`),
  KEY `operation_status_list-modificator` (`modificator_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `operation_link` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `operation_id` int(11) NOT NULL,
  `operation_ref_id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `creator_id` int(11) NOT NULL,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modificator_id` int(11) DEFAULT NULL,
  `modification_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `operation_link-operationA` (`operation_id`),
  KEY `operation_link-operationB` (`operation_ref_id`),
  KEY `operation_link-creator` (`creator_id`),
  KEY `operation_link-modificator` (`modificator_id`),
  CONSTRAINT `operation_link-creator` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `operation_link-modificator` FOREIGN KEY (`modificator_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `operation_link-operation_id` FOREIGN KEY (`operation_id`) REFERENCES `operation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `operation_link-operation_ref_id` FOREIGN KEY (`operation_ref_id`) REFERENCES `operation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `operation_status_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(250) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `creator_id` int(11) DEFAULT NULL,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modificator_id` int(11) DEFAULT NULL,
  `modification_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `operation_status_list-creator` (`creator_id`),
  KEY `operation_status_list-modificator` (`modificator_id`),
  CONSTRAINT `operation_status_list-creator` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `operation_status_list-modificator` FOREIGN KEY (`modificator_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `operation_third_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(250) NOT NULL,
  `description` text DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `creator_id` int(11) DEFAULT NULL,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modificator_id` int(11) DEFAULT NULL,
  `modification_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `operation_status_list-creator` (`creator_id`),
  KEY `operation_status_list-modificator` (`modificator_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


CREATE TABLE `operation_type_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(250) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `creator_id` int(11) NOT NULL,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modificator_id` int(11) DEFAULT NULL,
  `modification_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `operation_status_list-creator` (`creator_id`),
  KEY `operation_status_list-modificator` (`modificator_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;