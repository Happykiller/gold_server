-- Table des liens entre opérations : un virement et les opérations qu'il prend
-- en charge (`operation_id` = le virement portant, `operation_ref_id` = une
-- opération couverte).
--
-- Elle existe en production depuis 2019 et porte plus de 3 100 lignes, mais son
-- DDL n'avait jamais rejoint le dépôt : seul `001-install/001-schema/undo.sql`
-- la mentionnait, pour la supprimer. Monter une base neuve depuis le dépôt
-- donnait donc une application qui démarre et échoue sur chaque requête de lien.
--
-- `IF NOT EXISTS` la rend sûre à rejouer : sur une base existante elle ne fait
-- rien, sur une base neuve elle comble le trou. Numérotée 007 et non insérée
-- dans 001 : les clés étrangères exigent que `operation` existe déjà.
--
-- Pas de contrainte d'unicité sur (operation_id, operation_ref_id) : un doublon
-- actif existe en production, l'ALTER échouerait — et la suppression étant
-- logique (`active`), un index unique interdirait de relier à nouveau deux
-- opérations qu'on a déliées. La garde vit dans le `NOT EXISTS` de
-- `createOperationLinks`, là où le doublon naît réellement (double envoi).
--
-- Les contraintes vers `user` (creator_id, modificator_id) présentes dans
-- l'historique du dépôt ne sont volontairement pas reprises : elles sont
-- absentes du schéma de production, et reproduire la production prime.
CREATE TABLE IF NOT EXISTS `operation_link` (
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
  CONSTRAINT `operation_link-operation_id` FOREIGN KEY (`operation_id`)
    REFERENCES `operation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `operation_link-operation_ref_id` FOREIGN KEY (`operation_ref_id`)
    REFERENCES `operation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
