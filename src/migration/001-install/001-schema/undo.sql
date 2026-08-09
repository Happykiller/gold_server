DROP TABLE `account`;
DROP TABLE `account_type_list`;
DROP TABLE `migration`;
DROP TABLE `user`;
DROP TABLE `operation`;
DROP TABLE `operation_category_list`;
-- `operation_link` n'est plus supprimée ici : ce répertoire ne la crée pas.
-- Sa création et sa suppression vivent dans 007-operation_link/.
DROP TABLE `operation_status_list`;
DROP TABLE `operation_third_list`;
DROP TABLE `operation_type_list`;