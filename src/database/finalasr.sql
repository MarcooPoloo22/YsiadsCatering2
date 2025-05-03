-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for asr
CREATE DATABASE IF NOT EXISTS `asr` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `asr`;

-- Dumping structure for table asr.audit_logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `audit_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_role` enum('admin','employee') NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `table_name` varchar(255) NOT NULL,
  `new_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_value`)),
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` text DEFAULT NULL,
  `old_value` text DEFAULT NULL,
  PRIMARY KEY (`audit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=192 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.audit_logs: ~171 rows (approximately)
INSERT INTO `audit_logs` (`audit_id`, `user_id`, `user_name`, `user_role`, `action_type`, `table_name`, `new_value`, `timestamp`, `description`, `old_value`) VALUES
	(21, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:35:08","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}', '2025-03-23 06:35:08', NULL, '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":5,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 13:33:06","branch_ids":"[]","staff_ids":"[]"}'),
	(22, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:40:33","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}', '2025-03-23 06:40:33', NULL, '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:35:08","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}'),
	(23, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:40:52","branch_ids":"[]","staff_ids":"[]"}', '2025-03-23 06:40:52', NULL, '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:40:33","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}'),
	(24, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:41:09","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}', '2025-03-23 06:41:09', NULL, '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:40:52","branch_ids":"[]","staff_ids":"[]"}'),
	(25, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":3,"name":"Armand 2","description":"Seeerrcvvicee","price":"11.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67dd0247dc581-hair_treatment.jpg","start_date":"2025-03-09 03:14:00","end_date":"2025-03-25 07:19:00","duration":7,"created_at":"2025-03-20 01:22:52","updated_at":"2025-03-23 14:42:32","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}', '2025-03-23 06:42:32', NULL, '{"id":3,"name":"Armand 2","description":"Seeerrcvvicee","price":"11.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67dd0247dc581-hair_treatment.jpg","start_date":"2025-03-09 03:14:00","end_date":"2025-03-25 07:19:00","duration":7,"created_at":"2025-03-20 01:22:52","updated_at":"2025-03-21 14:08:07","branch_ids":null,"staff_ids":null}'),
	(26, 44, 'Gabriello', 'admin', 'DELETE', 'promos', 'null', '2025-03-23 06:43:08', NULL, '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:41:09","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}'),
	(27, 44, 'Gabriello', 'admin', 'UPDATE', 'products', '{"id":2,"name":"Massage Therapy","description":"Relax your body and mind with therapeutic massages.","price":"1500.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/massage.jpg"}', '2025-03-23 07:15:56', NULL, '{"id":2,"name":"Massage Therapy","description":"Relax your body and mind with therapeutic massages.","price":"1499.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/massage.jpg"}'),
	(28, 57, 'Rovin', 'employee', 'DELETE', 'products', 'null', '2025-03-23 07:26:20', NULL, '{"id":1014,"name":"123123","description":"123123","price":"122312.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/bart.jpg"}'),
	(29, 57, 'Rovin', 'employee', 'UPDATE', 'products', '{"name":"","description":"","price":"","file_url":null}', '2025-03-23 07:44:49', NULL, 'null'),
	(30, 57, 'Rovin', 'employee', 'CREATE', 'products', '{"name":"111","description":"1111","price":"1111","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/bart.jpg"}', '2025-03-23 07:45:00', NULL, NULL),
	(31, 57, 'Rovin', 'employee', 'UPDATE', 'products', '{"name":"","description":"","price":"","file_url":null}', '2025-03-23 07:45:18', NULL, 'null'),
	(32, 57, 'Rovin', 'employee', 'UPDATE', 'products', '{"name":"11111","description":"1111","price":"1111.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/bart.jpg"}', '2025-03-23 07:47:27', NULL, '{"id":1017,"name":"111","description":"1111","price":"1111.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/bart.jpg"}'),
	(33, 57, 'Rovin', 'employee', 'UPDATE', 'products', '{"name":"11111","description":"1111","price":"1111.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/bart.jpg"}', '2025-03-23 07:47:32', NULL, '{"id":1017,"name":"11111","description":"1111","price":"1111.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/bart.jpg"}'),
	(34, 57, 'Rovin', 'employee', 'UPDATE', 'products', '{"name":"1111111","description":"1111","price":"1111.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/bart.jpg"}', '2025-03-23 07:48:52', NULL, '{"id":1017,"name":"11111","description":"1111","price":"1111.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/bart.jpg"}'),
	(35, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":2,"title":"Surgery 1","description":"This is the description for Surgery 1","start_date":"2025-03-18 00:00:00","end_date":"2025-03-27 00:00:00","price":"3456.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67db35b4196b6-facial.jpg","duration":12,"created_at":"2025-03-20 04:57:12","updated_at":"2025-03-23 16:53:35","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\",\\"8\\",\\"9\\"]"}', '2025-03-23 08:53:35', NULL, '{"id":2,"title":"Surgery 1","description":"This is the description for Surgery 1","start_date":"2025-03-23 00:00:00","end_date":"2025-03-26 00:00:00","price":"3456.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67db35b4196b6-facial.jpg","duration":12,"created_at":"2025-03-20 04:57:12","updated_at":"2025-03-23 16:35:11","branch_ids":null,"staff_ids":null}'),
	(36, 58, 'Gwen', 'admin', 'CREATE', 'surgeries', '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-26 16:58:00","end_date":"2025-03-28 20:59:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 16:56:09","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}', '2025-03-23 08:56:09', NULL, 'null'),
	(37, 58, 'Gwen', 'admin', 'CREATE', 'surgeries', '{"id":6,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-26 16:58:00","end_date":"2025-03-28 20:59:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:54","updated_at":"2025-03-23 16:56:54","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}', '2025-03-23 08:56:54', NULL, 'null'),
	(38, 58, 'Gwen', 'admin', 'CREATE', 'surgeries', '{"id":7,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-26 16:58:00","end_date":"2025-03-28 20:59:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:57:03","updated_at":"2025-03-23 16:57:03","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}', '2025-03-23 08:57:03', NULL, 'null'),
	(39, 58, 'Gwen', 'admin', 'CREATE', 'surgeries', '{"id":8,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-26 16:58:00","end_date":"2025-03-28 20:59:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:57:09","updated_at":"2025-03-23 16:57:09","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}', '2025-03-23 08:57:09', NULL, 'null'),
	(40, 58, 'Gwen', 'admin', 'CREATE', 'surgeries', '{"id":9,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-26 16:58:00","end_date":"2025-03-28 20:59:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:57:56","updated_at":"2025-03-23 16:57:56","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}', '2025-03-23 08:57:56', NULL, 'null'),
	(41, 58, 'Gwen', 'admin', 'CREATE', 'surgeries', '{"id":10,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-26 16:58:00","end_date":"2025-03-28 20:59:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:58:02","updated_at":"2025-03-23 16:58:02","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}', '2025-03-23 08:58:02', NULL, 'null'),
	(42, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-23 00:00:00","end_date":"2025-03-26 00:00:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:09:20","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}', '2025-03-23 09:09:20', NULL, '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-26 16:58:00","end_date":"2025-03-28 20:59:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 16:56:09","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}'),
	(43, 58, 'Gwen', 'admin', 'DELETE', 'surgeries', 'null', '2025-03-23 09:09:42', NULL, '{"id":10,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-26 16:58:00","end_date":"2025-03-28 20:59:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:58:02","updated_at":"2025-03-23 16:58:02","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}'),
	(44, 58, 'Gwen', 'admin', 'DELETE', 'surgeries', 'null', '2025-03-23 09:09:45', NULL, '{"id":9,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-26 16:58:00","end_date":"2025-03-28 20:59:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:57:56","updated_at":"2025-03-23 16:57:56","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}'),
	(45, 58, 'Gwen', 'admin', 'DELETE', 'surgeries', 'null', '2025-03-23 09:09:48', NULL, '{"id":8,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-26 16:58:00","end_date":"2025-03-28 20:59:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:57:09","updated_at":"2025-03-23 16:57:09","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}'),
	(46, 58, 'Gwen', 'admin', 'DELETE', 'surgeries', 'null', '2025-03-23 09:09:50', NULL, '{"id":7,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-26 16:58:00","end_date":"2025-03-28 20:59:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:57:03","updated_at":"2025-03-23 16:57:03","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}'),
	(47, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-25 00:00:00","end_date":"2025-03-26 00:00:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:11:22","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}', '2025-03-23 09:11:22', NULL, '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-23 00:00:00","end_date":"2025-03-26 00:00:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:09:20","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}'),
	(48, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-25 00:00:00","end_date":"2025-03-27 00:00:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:13:59","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}', '2025-03-23 09:13:59', NULL, '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-25 00:00:00","end_date":"2025-03-26 00:00:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:11:22","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}'),
	(49, 58, 'Gwen', 'admin', 'CREATE', 'surgeries', '{"id":11,"title":"Surgeryy","description":"Surg Appt","start_date":"2025-03-31 20:20:00","end_date":"2025-04-01 21:21:00","price":"455.00","image_url":null,"duration":7,"created_at":"2025-03-23 17:18:04","updated_at":"2025-03-23 17:18:04","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\"]"}', '2025-03-23 09:18:04', NULL, 'null'),
	(50, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-17 00:00:00","end_date":"2025-03-24 00:00:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:23:59","branch_ids":"[\\"6\\"]","staff_ids":"[\\"1\\",\\"4\\"]"}', '2025-03-23 09:23:59', NULL, '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-25 00:00:00","end_date":"2025-03-27 00:00:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:13:59","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}'),
	(51, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-24 00:00:00","end_date":"2025-03-25 00:00:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:24:40","branch_ids":"[\\"6\\"]","staff_ids":"[\\"1\\",\\"4\\"]"}', '2025-03-23 09:24:40', NULL, '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-17 00:00:00","end_date":"2025-03-24 00:00:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:23:59","branch_ids":"[\\"6\\"]","staff_ids":"[\\"1\\",\\"4\\"]"}'),
	(52, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-23 00:00:00","end_date":"2025-03-26 00:00:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:26:36","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}', '2025-03-23 09:26:36', NULL, '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-24 00:00:00","end_date":"2025-03-25 00:00:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:24:40","branch_ids":"[\\"6\\"]","staff_ids":"[\\"1\\",\\"4\\"]"}'),
	(53, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":6,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-25 00:00:00","end_date":"2025-03-28 00:00:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:54","updated_at":"2025-03-23 17:26:51","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}', '2025-03-23 09:26:51', NULL, '{"id":6,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-26 16:58:00","end_date":"2025-03-28 20:59:00","price":"3456.00","image_url":null,"duration":11,"created_at":"2025-03-23 16:56:54","updated_at":"2025-03-23 16:56:54","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}'),
	(54, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-26 00:00:00","end_date":"2025-03-28 00:00:00","price":"3456.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67dfd3cc09a02-bart.jpg","duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:32:32","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}', '2025-03-23 09:32:32', NULL, '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-23 00:00:00","end_date":"2025-03-26 00:00:00","price":"3456.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67dfd3cc09a02-bart.jpg","duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:26:36","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}'),
	(55, 58, 'Gwen', 'admin', 'CREATE', 'promos', '{"id":8,"name":"Promo 3","description":"Promo 3 desc","price":"199.00","file_url":null,"start_date":"2025-03-25 21:38:00","end_date":"2025-03-29 22:38:00","duration":12,"created_at":"2025-03-23 17:33:57","updated_at":"2025-03-23 17:33:57","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}', '2025-03-23 09:33:57', NULL, 'null'),
	(56, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-25 00:00:00","end_date":"2025-03-27 00:00:00","price":"3456.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67dfd3cc09a02-bart.jpg","duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:53:23","branch_ids":"Array","staff_ids":"Array"}', '2025-03-23 09:53:23', NULL, '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-26 00:00:00","end_date":"2025-03-28 00:00:00","price":"3456.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67dfd3cc09a02-bart.jpg","duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:32:32","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}'),
	(57, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-25 00:00:00","end_date":"2025-03-27 00:00:00","price":"3456.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67dfd3cc09a02-bart.jpg","duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:53:23","branch_ids":"Array","staff_ids":"Array"}', '2025-03-23 09:53:32', NULL, '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-25 00:00:00","end_date":"2025-03-27 00:00:00","price":"3456.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67dfd3cc09a02-bart.jpg","duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:53:23","branch_ids":"Array","staff_ids":"Array"}'),
	(58, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-25 00:00:00","end_date":"2025-03-27 00:00:00","price":"3456.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67dfd3cc09a02-bart.jpg","duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:53:23","branch_ids":"Array","staff_ids":"Array"}', '2025-03-23 09:53:38', NULL, '{"id":5,"title":"Surgery 3","description":"Surgery Desc 3","start_date":"2025-03-25 00:00:00","end_date":"2025-03-27 00:00:00","price":"3456.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67dfd3cc09a02-bart.jpg","duration":11,"created_at":"2025-03-23 16:56:09","updated_at":"2025-03-23 17:53:23","branch_ids":"Array","staff_ids":"Array"}'),
	(59, 58, 'Gwen', 'admin', 'DELETE', 'products', 'null', '2025-03-23 09:55:39', NULL, '{"id":1017,"name":"1111111","description":"1111","price":"1111.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/bart.jpg"}'),
	(60, 58, 'Gwen', 'admin', 'DELETE', 'products', 'null', '2025-03-23 09:55:42', NULL, '{"id":1016,"name":"123","description":"123","price":"123.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/bart.jpg"}'),
	(61, 58, 'Gwen', 'admin', 'UPDATE', 'products', '{"name":"Product 178","description":"178 desc","price":"178.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/bart.jpg"}', '2025-03-23 09:55:47', NULL, '{"id":1015,"name":"Product 178","description":"178 desc","price":"178.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/body_scrub.jpg"}'),
	(62, 58, 'Gwen', 'admin', 'UPDATE', 'promos', '{"id":8,"name":"Promo 3","description":"Promo 3 desc","price":"199.00","file_url":null,"start_date":"2025-03-25 21:38:00","end_date":"2025-03-29 22:38:00","duration":12,"created_at":"2025-03-23 17:33:57","updated_at":"2025-03-23 17:57:36","branch_ids":"Array","staff_ids":"Array"}', '2025-03-23 09:57:36', NULL, '{"id":8,"name":"Promo 3","description":"Promo 3 desc","price":"199.00","file_url":null,"start_date":"2025-03-25 21:38:00","end_date":"2025-03-29 22:38:00","duration":12,"created_at":"2025-03-23 17:33:57","updated_at":"2025-03-23 17:33:57","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}'),
	(63, 58, 'Gwen', 'admin', 'UPDATE', 'promos', '{"id":8,"name":"Promo 3","description":"Promo 3 desc","price":"199.00","file_url":null,"start_date":"2025-03-25 21:38:00","end_date":"2025-03-29 22:38:00","duration":12,"created_at":"2025-03-23 17:33:57","updated_at":"2025-03-23 17:58:26","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}', '2025-03-23 09:58:26', NULL, '{"id":8,"name":"Promo 3","description":"Promo 3 desc","price":"199.00","file_url":null,"start_date":"2025-03-25 21:38:00","end_date":"2025-03-29 22:38:00","duration":12,"created_at":"2025-03-23 17:33:57","updated_at":"2025-03-23 17:57:36","branch_ids":"Array","staff_ids":"Array"}'),
	(64, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":11,"title":"Surgeryy","description":"Surg Appt","start_date":"2025-03-24 00:00:00","end_date":"2025-03-26 00:00:00","price":"455.00","image_url":null,"duration":7,"created_at":"2025-03-23 17:18:04","updated_at":"2025-03-23 19:17:05","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}', '2025-03-23 11:17:05', NULL, '{"id":11,"title":"Surgeryy","description":"Surg Appt","start_date":"2025-03-31 20:20:00","end_date":"2025-04-01 21:21:00","price":"455.00","image_url":null,"duration":7,"created_at":"2025-03-23 17:18:04","updated_at":"2025-03-23 17:18:04","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"3\\",\\"1\\"]"}'),
	(65, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":11,"title":"Surgeryy","description":"Surg Appt","start_date":"2025-03-24 00:00:00","end_date":"2025-03-26 00:00:00","price":"455.00","image_url":null,"duration":7,"created_at":"2025-03-23 17:18:04","updated_at":"2025-03-23 19:17:05","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}', '2025-03-23 11:17:21', NULL, '{"id":11,"title":"Surgeryy","description":"Surg Appt","start_date":"2025-03-24 00:00:00","end_date":"2025-03-26 00:00:00","price":"455.00","image_url":null,"duration":7,"created_at":"2025-03-23 17:18:04","updated_at":"2025-03-23 19:17:05","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}'),
	(66, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":11,"title":"Surgeryy","description":"Surg Appt","start_date":"2025-03-24 00:00:00","end_date":"2025-03-26 00:00:00","price":"455.00","image_url":null,"duration":7,"created_at":"2025-03-23 17:18:04","updated_at":"2025-03-23 19:17:05","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}', '2025-03-23 11:17:49', NULL, '{"id":11,"title":"Surgeryy","description":"Surg Appt","start_date":"2025-03-24 00:00:00","end_date":"2025-03-26 00:00:00","price":"455.00","image_url":null,"duration":7,"created_at":"2025-03-23 17:18:04","updated_at":"2025-03-23 19:17:05","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}'),
	(67, 58, 'Gwen', 'admin', 'UPDATE', 'surgeries', '{"id":11,"title":"Surgeryy","description":"Surg Appt","start_date":"2025-03-24 00:00:00","end_date":"2025-03-26 00:00:00","price":"455.00","image_url":null,"duration":7,"created_at":"2025-03-23 17:18:04","updated_at":"2025-03-23 19:17:05","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}', '2025-03-23 11:18:01', NULL, '{"id":11,"title":"Surgeryy","description":"Surg Appt","start_date":"2025-03-24 00:00:00","end_date":"2025-03-26 00:00:00","price":"455.00","image_url":null,"duration":7,"created_at":"2025-03-23 17:18:04","updated_at":"2025-03-23 19:17:05","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}'),
	(68, 58, 'Gwen', 'admin', 'UPDATE', 'promos', '{"id":8,"name":"Promo 3","description":"Promo 3 desc","price":"199.00","file_url":null,"start_date":"2025-03-25 21:38:00","end_date":"2025-03-29 22:38:00","duration":12,"created_at":"2025-03-23 17:33:57","updated_at":"2025-03-23 17:58:26","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}', '2025-03-23 11:18:38', NULL, '{"id":8,"name":"Promo 3","description":"Promo 3 desc","price":"199.00","file_url":null,"start_date":"2025-03-25 21:38:00","end_date":"2025-03-29 22:38:00","duration":12,"created_at":"2025-03-23 17:33:57","updated_at":"2025-03-23 17:58:26","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}'),
	(69, 58, 'Gwen', 'admin', 'UPDATE', 'products', '{"name":"Massage Therapyy","description":"RELAXINGGG HMM","price":"1699.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/body_scrub.jpg"}', '2025-03-23 11:21:36', NULL, '{"id":2,"name":"Massage Therapyy","description":"RELAXINGGG HMM","price":"1699.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/bart.jpg"}'),
	(70, 58, 'Gwen', 'admin', 'UPDATE', 'promos', '{"id":8,"name":"Promo 3","description":"Promo 3 desc","price":"199.00","file_url":null,"start_date":"2025-03-25 21:38:00","end_date":"2025-03-29 22:38:00","duration":12,"created_at":"2025-03-23 17:33:57","updated_at":"2025-03-23 19:23:28","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\",\\"8\\"]"}', '2025-03-23 11:23:28', NULL, '{"id":8,"name":"Promo 3","description":"Promo 3 desc","price":"199.00","file_url":null,"start_date":"2025-03-25 21:38:00","end_date":"2025-03-29 22:38:00","duration":12,"created_at":"2025-03-23 17:33:57","updated_at":"2025-03-23 17:58:26","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\"]"}'),
	(71, 58, 'Gwen', 'admin', 'UPDATE', 'faqs', '{"id":1010,"question":"Is it safe","answer":"Yes itis"}', '2025-03-23 11:27:39', NULL, '{"id":1010,"question":"Is it safe","answer":"Yes it s"}'),
	(72, 58, 'Gwen', 'admin', 'UPDATE', 'promos', '{"id":3,"name":"Armand 2","description":"Seeerrcvvicee","price":"11.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67dd0247dc581-hair_treatment.jpg","start_date":"2025-03-09 03:14:00","end_date":"2025-03-25 07:19:00","duration":7,"created_at":"2025-03-20 01:22:52","updated_at":"2025-03-23 19:58:18","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}', '2025-03-23 11:58:18', NULL, '{"id":3,"name":"Armand 2","description":"Seeerrcvvicee","price":"11.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67dd0247dc581-hair_treatment.jpg","start_date":"2025-03-09 03:14:00","end_date":"2025-03-25 07:19:00","duration":7,"created_at":"2025-03-20 01:22:52","updated_at":"2025-03-23 14:42:32","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}'),
	(73, 57, 'Rovin', 'employee', 'CREATE', 'promos', '{"id":9,"name":"Promo 67","description":"67 desc","price":"67.00","file_url":null,"start_date":"2025-03-25 20:15:00","end_date":"2025-03-26 20:16:00","duration":8,"created_at":"2025-03-23 20:16:12","updated_at":"2025-03-23 20:16:12","branch_ids":"[\\"6\\"]","staff_ids":"[\\"1\\",\\"4\\"]"}', '2025-03-23 12:16:12', NULL, 'null'),
	(74, 57, 'Rovin', 'employee', 'UPDATE', 'promos', '{"id":8,"name":"Promo 3","description":"Promo 3 desc","price":"199.00","file_url":null,"start_date":"2025-03-25 21:38:00","end_date":"2025-03-29 22:38:00","duration":12,"created_at":"2025-03-23 17:33:57","updated_at":"2025-03-23 20:16:36","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}', '2025-03-23 12:16:36', NULL, '{"id":8,"name":"Promo 3","description":"Promo 3 desc","price":"199.00","file_url":null,"start_date":"2025-03-25 21:38:00","end_date":"2025-03-29 22:38:00","duration":12,"created_at":"2025-03-23 17:33:57","updated_at":"2025-03-23 19:23:28","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\",\\"8\\"]"}'),
	(75, 44, 'Gabriello', 'admin', 'CREATE', 'branches', '{"id":12,"name":"Hello"}', '2025-04-09 11:54:01', 'Created branch: Hello', NULL),
	(76, 44, 'Gabriello', 'admin', 'UPDATE', 'branches', '{"id":12,"name":"Trial"}', '2025-04-09 11:54:32', 'Updated branch: Trial', '{"id":12,"name":"Hello"}'),
	(77, 44, 'Gabriello', 'admin', 'CREATE', 'staff', '{"id":19,"name":"ayo","branch_id":12}', '2025-04-09 12:08:34', 'Created staff: ayo', NULL),
	(78, 44, 'Gabriello', 'admin', 'UPDATE', 'staff', '{"id":19,"name":"yayaya","branch_id":12}', '2025-04-09 12:10:07', 'Updated staff: yayaya', '{"id":19,"name":"ayo","branch_id":12}'),
	(79, 44, 'Gabriello', 'admin', 'DELETE', 'staff', NULL, '2025-04-09 12:10:12', 'Deleted staff: yayaya', '{"id":19,"name":"yayaya","branch_id":12}'),
	(80, 44, 'Gabriello', 'admin', 'UPDATE', 'branches', '{"id":12,"name":"Trialaaaaa"}', '2025-04-09 12:18:15', 'Updated branch: Trialaaaaa', '{"id":12,"name":"Trialaa"}'),
	(81, 44, 'Gabriello', 'admin', 'CREATE', 'staff', '{"id":20,"name":"Gwem","branch_id":12}', '2025-04-09 12:18:29', 'Created staff: Gwem', NULL),
	(82, 44, 'Gabriello', 'admin', 'UPDATE', 'staff', '{"id":20,"name":"GWENENE","branch_id":12}', '2025-04-09 12:18:41', 'Updated staff: GWENENE', '{"id":20,"name":"Gwem","branch_id":12}'),
	(83, 44, 'Gabriello', 'admin', 'DELETE', 'staff', NULL, '2025-04-09 12:18:51', 'Deleted staff: GWENENE', '{"id":20,"name":"GWENENE","branch_id":12}'),
	(84, 44, 'Gabriello', 'admin', 'CREATE', 'branches', '{"id":13,"name":"UST BBB"}', '2025-04-09 12:26:47', 'Created branch: UST BBB', NULL),
	(85, 44, 'Gabriello', 'admin', 'UPDATE', 'branches', '{"id":13,"name":"UST BBBA"}', '2025-04-09 12:27:06', 'Updated branch: UST BBBA', '{"id":13,"name":"UST BBB"}'),
	(86, 44, 'Gabriello', 'admin', 'CREATE', 'staff', '{"id":21,"name":"GAWFF","branch_id":13}', '2025-04-09 12:27:21', 'Created staff: GAWFF', NULL),
	(87, 44, 'Gabriello', 'admin', 'UPDATE', 'staff', '{"id":21,"name":"GAWFFFF","branch_id":13}', '2025-04-09 12:27:33', 'Updated staff: GAWFFFF', '{"id":21,"name":"GAWFF","branch_id":13}'),
	(88, 44, 'Gabriello', 'admin', 'DELETE', 'staff', NULL, '2025-04-09 12:27:44', 'Deleted staff: GAWFFFF', '{"id":21,"name":"GAWFFFF","branch_id":13}'),
	(89, 44, 'Gabriello', 'admin', 'CREATE', 'branches', '{"id":14,"name":"asdas"}', '2025-04-09 12:29:38', 'Created branch: asdas', NULL),
	(90, 44, 'Gabriello', 'admin', 'UPDATE', 'branches', '{"id":14,"name":"asdaszasd"}', '2025-04-09 12:38:33', 'Updated branch: asdaszasd', '{"id":14,"name":"asdas"}'),
	(91, 44, 'Gabriello', 'admin', 'DELETE', 'branches', NULL, '2025-04-09 12:40:42', 'Deleted branch: asdaszasd', '{"id":14,"name":"asdaszasd"}'),
	(92, 44, 'Gabriello', 'admin', 'DELETE', 'services', NULL, '2025-04-09 13:04:12', 'Deleted service: Glutathione Drip (Single Dose)', '{"id":18,"name":"Glutathione Drip (Single Dose)","description":"Whitening Service - Per Session","price":"1899.00","file_url":"uploads\\/hellokitty.png","duration":1}'),
	(93, 44, 'Gabriello', 'admin', 'CREATE', 'services', '{"id":19,"name":"asda","description":"asd","price":"1235.00","file_url":"uploads\\/67dffdbc9dbb4-body_scrub.jpg","duration":7}', '2025-04-09 13:05:02', 'Created service: asda', NULL),
	(94, 44, 'Gabriello', 'admin', 'UPDATE', 'services', '{"id":19,"name":"asdaa","description":"asd","price":"1235.00","file_url":"uploads\\/67dffdbc9dbb4-body_scrub.jpg","duration":7}', '2025-04-09 13:05:40', 'Updated service: asdaa', '{"id":19,"name":"asda","description":"asd","price":"1235.00","file_url":"uploads\\/67dffdbc9dbb4-body_scrub.jpg","duration":7}'),
	(95, 44, 'Gabriello', 'admin', 'DELETE', 'services', NULL, '2025-04-09 13:06:35', 'Deleted service: asdaa', '{"id":19,"name":"asdaa","description":"asd","price":"1235.00","file_url":"uploads\\/67dffdbc9dbb4-body_scrub.jpg","duration":7}'),
	(96, 44, 'Gabriello', 'admin', 'CREATE', 'promos', '{"id":15,"name":"asda","description":"asddas","price":"12312.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67f67331a777b-67de8d5635819-cheesy burger.jpg","start_date":"2025-04-09 20:50:00","end_date":"2025-04-09 21:21:00","duration":1,"created_at":"2025-04-09 21:16:33","updated_at":"2025-04-09 21:16:33","branch_ids":null,"staff_ids":null}', '2025-04-09 13:16:33', 'Created promo: asda', NULL),
	(97, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":15,"name":"asda","description":"asddas","price":"12312.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67f67331a777b-67de8d5635819-cheesy burger.jpg","start_date":"2025-04-09 20:50:00","end_date":"2025-04-09 21:21:00","duration":11,"created_at":"2025-04-09 21:16:33","updated_at":"2025-04-09 21:16:51","branch_ids":null,"staff_ids":null}', '2025-04-09 13:16:51', 'Updated promo: asda', '{"id":15,"name":"asda","description":"asddas","price":"12312.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67f67331a777b-67de8d5635819-cheesy burger.jpg","start_date":"2025-04-09 20:50:00","end_date":"2025-04-09 21:21:00","duration":1,"created_at":"2025-04-09 21:16:33","updated_at":"2025-04-09 21:16:33","branch_ids":null,"staff_ids":null}'),
	(98, 44, 'Gabriello', 'admin', 'DELETE', 'promos', NULL, '2025-04-09 13:19:21', 'Deleted promo: asda', '{"id":15,"name":"asda","description":"asddas","price":"12312.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67f67331a777b-67de8d5635819-cheesy burger.jpg","start_date":"2025-04-09 20:50:00","end_date":"2025-04-09 21:21:00","duration":11,"created_at":"2025-04-09 21:16:33","updated_at":"2025-04-09 21:16:51","branch_ids":null,"staff_ids":null}'),
	(99, 44, 'Gabriello', 'admin', 'CREATE', 'products', '{"id":1024,"name":"sdadsa","description":"asda","price":"0.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67f678641f458-67de8d5635819-cheesy burger.jpg"}', '2025-04-09 13:38:44', 'Created product: sdadsa', NULL),
	(100, 44, 'Gabriello', 'admin', 'UPDATE', 'products', '{"id":1024,"name":"sdadsa","description":"asda","price":"1231.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67f678641f458-67de8d5635819-cheesy burger.jpg"}', '2025-04-09 13:39:15', 'Updated product: sdadsa', '{"id":1024,"name":"sdadsa","description":"asda","price":"0.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67f678641f458-67de8d5635819-cheesy burger.jpg"}'),
	(101, 44, 'Gabriello', 'admin', 'DELETE', 'products', NULL, '2025-04-09 13:39:25', 'Deleted product: sdadsa', '{"id":1024,"name":"sdadsa","description":"asda","price":"1231.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67f678641f458-67de8d5635819-cheesy burger.jpg"}'),
	(102, 44, 'Gabriello', 'admin', 'CREATE', 'surgeries', '{"id":12,"title":"asda","description":"asdads","start_date":"2025-04-16 22:19:00","end_date":"2025-04-30 13:18:00","price":"213.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67f680c8913e4-67e01dd211554-bart.jpg","duration":10,"created_at":"2025-04-09 22:14:32","updated_at":"2025-04-09 22:14:32","branch_ids":null,"staff_ids":null}', '2025-04-09 14:14:32', 'Created surgery: asda', NULL),
	(103, 44, 'Gabriello', 'admin', 'CREATE', 'surgeries', '{"id":13,"title":"asda","description":"asdads","start_date":"2025-04-16 22:19:00","end_date":"2025-04-30 13:18:00","price":"213.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67f680d5acebd-67e01dd211554-bart.jpg","duration":10,"created_at":"2025-04-09 22:14:45","updated_at":"2025-04-09 22:14:45","branch_ids":null,"staff_ids":null}', '2025-04-09 14:14:45', 'Created surgery: asda', NULL),
	(104, 44, 'Gabriello', 'admin', 'DELETE', 'surgeries', NULL, '2025-04-09 14:17:26', 'Deleted surgery: asda', '{"id":14,"title":"asda","description":"asdads","start_date":"2025-04-16 22:19:00","end_date":"2025-04-30 13:18:00","price":"213.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67f6814d28e69-67e01dd211554-bart.jpg","duration":10,"created_at":"2025-04-09 22:16:45","updated_at":"2025-04-09 22:16:45","branch_ids":null,"staff_ids":null}'),
	(105, 44, 'Gabriello', 'admin', 'UPDATE', 'surgeries', '{"id":13,"title":"asda","description":"asdads","start_date":"2025-04-08 00:00:00","end_date":"2025-04-11 00:00:00","price":"213.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67f680d5acebd-67e01dd211554-bart.jpg","duration":10,"created_at":"2025-04-09 22:14:45","updated_at":"2025-04-09 22:18:36","branch_ids":null,"staff_ids":null}', '2025-04-09 14:18:36', 'Updated surgery: asda', '{"id":13,"title":"asda","description":"asdads","start_date":"2025-04-16 22:19:00","end_date":"2025-04-30 13:18:00","price":"213.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67f680d5acebd-67e01dd211554-bart.jpg","duration":10,"created_at":"2025-04-09 22:14:45","updated_at":"2025-04-09 22:14:45","branch_ids":null,"staff_ids":null}'),
	(106, 44, 'Gabriello', 'admin', 'DELETE', 'surgeries', NULL, '2025-04-09 14:19:19', 'Deleted surgery: asda', '{"id":13,"title":"asda","description":"asdads","start_date":"2025-04-08 00:00:00","end_date":"2025-04-11 00:00:00","price":"213.00","image_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/surgeries\\/67f680d5acebd-67e01dd211554-bart.jpg","duration":10,"created_at":"2025-04-09 22:14:45","updated_at":"2025-04-09 22:18:36","branch_ids":null,"staff_ids":null}'),
	(107, 44, 'Gabriello', 'admin', 'CREATE', 'faqs', '{"id":1017,"question":"LALAL","answer":"ALLALA"}', '2025-04-09 15:22:15', 'Created FAQ: LALAL', NULL),
	(108, 44, 'Gabriello', 'admin', 'CREATE', 'faqs', '{"id":1018,"question":"ASDDAS","answer":"AM,SDA"}', '2025-04-09 15:24:36', 'Created FAQ: ASDDAS', NULL),
	(109, 44, 'Gabriello', 'admin', 'DELETE', 'faqs', NULL, '2025-04-09 15:25:06', 'Deleted FAQ: ASDDAS', '{"id":1018,"question":"ASDDAS","answer":"AM,SDA"}'),
	(110, 44, 'Gabriello', 'admin', 'CREATE', 'faqs', '{"id":1019,"question":"sad","answer":"asdasd"}', '2025-04-09 15:25:28', 'Created FAQ: sad', NULL),
	(111, 44, 'Gabriello', 'admin', 'CREATE', 'faqs', '{"id":1020,"question":"asdad","answer":"asddasdas"}', '2025-04-10 01:29:34', 'Created FAQ: asdad', NULL),
	(112, 44, 'Gabriello', 'admin', 'DELETE', 'faqs', NULL, '2025-04-10 01:29:44', 'Deleted FAQ: asdad', '{"id":1020,"question":"asdad","answer":"asddasdas"}'),
	(113, 44, 'Gabriello', 'admin', 'UPDATE', 'faqs', '{"id":1019,"question":"sad","answer":"asdasddadas"}', '2025-04-10 01:40:03', 'Updated FAQ: sad', '{"id":1019,"question":"sad","answer":"asdasd"}'),
	(114, 44, 'Gabriello', 'admin', 'UPDATE', 'faqs', '{"id":1019,"question":"sadasddas","answer":"asdasddadas"}', '2025-04-10 01:40:22', 'Updated FAQ: sadasddas', '{"id":1019,"question":"sad","answer":"asdasddadas"}'),
	(115, 44, 'Gabriello', 'admin', 'DELETE', 'faqs', NULL, '2025-04-10 01:40:30', 'Deleted FAQ: sadasddas', '{"id":1019,"question":"sadasddas","answer":"asdasddadas"}'),
	(116, 44, 'Gabriello', 'admin', 'UPDATE', 'contact_info', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPH","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPH","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPH"}', '2025-04-10 01:44:28', 'Updated contact information', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPH","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPH","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPH"}'),
	(117, 44, 'Gabriello', 'admin', 'UPDATE', 'contact_info', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPH","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPH","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPH"}', '2025-04-10 01:44:39', 'Updated contact information', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPH","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPH","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPH"}'),
	(118, 44, 'Gabriello', 'admin', 'UPDATE', 'contact_info', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdasda","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPHsdasd","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdads"}', '2025-04-10 01:44:54', 'Updated contact information', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPH","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPH","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPH"}'),
	(119, 44, 'Gabriello', 'admin', 'UPDATE', 'contact_info', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdasda","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPHsdasd","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdads"}', '2025-04-10 01:46:38', 'Updated contact information', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdasda","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPHsdasd","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdads"}'),
	(120, 44, 'Gabriello', 'admin', 'UPDATE', 'contact_info', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdasda","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPHsdasd","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdads"}', '2025-04-10 01:46:48', 'Updated contact information', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdasda","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPHsdasd","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdads"}'),
	(121, 44, 'Gabriello', 'admin', 'UPDATE', 'contact_info', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdasda","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPHsdasd","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdads"}', '2025-04-10 01:47:21', 'Updated contact information', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdasda","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPHsdasd","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdads"}'),
	(122, 44, 'Gabriello', 'admin', 'UPDATE', 'contact_info', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdasda","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPHsdasd","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdads"}', '2025-04-10 01:49:17', 'Updated contact information', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdasda","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPHsdasd","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdads"}'),
	(123, 44, 'Gabriello', 'admin', 'UPDATE', 'contact_info', '{"id":1,"phone":"+63 9123456789 \\/ +632123123","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdasda","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPHsdasd","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdads"}', '2025-04-10 01:49:30', 'Updated contact information', '{"id":1,"phone":"+63 9123456789 \\/ +63","facebook":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdasda","instagram":"https:\\/\\/www.facebook.com\\/ASRSpaPHsdasd","twitter":"https:\\/\\/www.facebook.com\\/ASRSpaPHasdads"}'),
	(124, 44, 'Gabriello', 'admin', 'UPDATE', 'payment_details', '{"id":1,"gcash_number":"091234567891231","gcash_name":"Juan Dela Cruzzzz","gcash_amount":"500.00","paymaya_number":"09123456789123","paymaya_name":"Juan Dela Cruzzz","paymaya_amount":"500.00","bank_name":"BDOas","bank_account_number":"123456789123","bank_account_name":"0","bank_amount":"500.00","last_updated":"2025-04-10 09:53:04"}', '2025-04-10 01:53:04', 'Updated payment details', '{"id":1,"gcash_number":"09123456789","gcash_name":"Juan Dela Cruz","gcash_amount":"500.00","paymaya_number":"09123456789","paymaya_name":"Juan Dela Cruz","paymaya_amount":"500.00","bank_name":"BDO","bank_account_number":"123456789","bank_account_name":"Juan Dela Cruz","bank_amount":"500.00","last_updated":"2025-03-24 19:06:20"}'),
	(125, 44, 'Gabriello', 'admin', 'UPDATE', 'payment_details', '{"id":1,"gcash_number":"091234567891231","gcash_name":"Juan Dela Cruzzzz","gcash_amount":"500.00","paymaya_number":"09123456789123","paymaya_name":"Juan Dela Cruzzz","paymaya_amount":"500.00","bank_name":"BDOas","bank_account_number":"123456789123","bank_account_name":"0","bank_amount":"500.00","last_updated":"2025-04-10 09:53:04"}', '2025-04-10 01:53:35', 'Updated payment details', '{"id":1,"gcash_number":"091234567891231","gcash_name":"Juan Dela Cruzzzz","gcash_amount":"500.00","paymaya_number":"09123456789123","paymaya_name":"Juan Dela Cruzzz","paymaya_amount":"500.00","bank_name":"BDOas","bank_account_number":"123456789123","bank_account_name":"0","bank_amount":"500.00","last_updated":"2025-04-10 09:53:04"}'),
	(126, 44, 'Gabriello', 'admin', 'UPDATE', 'payment_details', '{"id":1,"gcash_number":"99","gcash_name":"99","gcash_amount":"99.00","paymaya_number":"99","paymaya_name":"99","paymaya_amount":"97.00","bank_name":"99","bank_account_number":"99","bank_account_name":"99","bank_amount":"99.00","last_updated":"2025-04-10 09:54:04"}', '2025-04-10 01:54:04', 'Updated payment details', '{"id":1,"gcash_number":"091234567891231","gcash_name":"Juan Dela Cruzzzz","gcash_amount":"500.00","paymaya_number":"09123456789123","paymaya_name":"Juan Dela Cruzzz","paymaya_amount":"500.00","bank_name":"BDOas","bank_account_number":"123456789123","bank_account_name":"0","bank_amount":"500.00","last_updated":"2025-04-10 09:53:04"}'),
	(127, 44, 'Gabriello', 'admin', 'UPDATE', 'payment_details', '{"id":1,"gcash_number":"99","gcash_name":"99","gcash_amount":"99.00","paymaya_number":"99","paymaya_name":"99","paymaya_amount":"97.00","bank_name":"99","bank_account_number":"99","bank_account_name":"0","bank_amount":"99.00","last_updated":"2025-04-10 09:54:29"}', '2025-04-10 01:54:29', 'Updated payment details', '{"id":1,"gcash_number":"99","gcash_name":"99","gcash_amount":"99.00","paymaya_number":"99","paymaya_name":"99","paymaya_amount":"97.00","bank_name":"99","bank_account_number":"99","bank_account_name":"99","bank_amount":"99.00","last_updated":"2025-04-10 09:54:04"}'),
	(128, 44, 'Gabriello', 'admin', 'UPDATE', 'payment_details', '{"id":1,"gcash_number":"99","gcash_name":"99","gcash_amount":"99.00","paymaya_number":"99","paymaya_name":"99","paymaya_amount":"97.00","bank_name":"99","bank_account_number":"99","bank_account_name":"0","bank_amount":"99.00","last_updated":"2025-04-10 09:54:29"}', '2025-04-10 01:56:46', 'Updated payment details', '{"id":1,"gcash_number":"99","gcash_name":"99","gcash_amount":"99.00","paymaya_number":"99","paymaya_name":"99","paymaya_amount":"97.00","bank_name":"99","bank_account_number":"99","bank_account_name":"0","bank_amount":"99.00","last_updated":"2025-04-10 09:54:29"}'),
	(129, 44, 'Gabriello', 'admin', 'UPDATE', 'payment_details', '{"id":1,"gcash_number":"99","gcash_name":"99","gcash_amount":"99.00","paymaya_number":"99","paymaya_name":"99","paymaya_amount":"97.00","bank_name":"99","bank_account_number":"99","bank_account_name":"0","bank_amount":"99.00","last_updated":"2025-04-10 09:54:29"}', '2025-04-10 01:57:17', 'Updated payment details', '{"id":1,"gcash_number":"99","gcash_name":"99","gcash_amount":"99.00","paymaya_number":"99","paymaya_name":"99","paymaya_amount":"97.00","bank_name":"99","bank_account_number":"99","bank_account_name":"0","bank_amount":"99.00","last_updated":"2025-04-10 09:54:29"}'),
	(130, 44, 'Gabriello', 'admin', 'UPDATE', 'payment_details', '{"id":1,"gcash_number":"99","gcash_name":"99","gcash_amount":"99.00","paymaya_number":"99","paymaya_name":"99","paymaya_amount":"97.00","bank_name":"99","bank_account_number":"99","bank_account_name":"0","bank_amount":"99.00","last_updated":"2025-04-10 09:54:29"}', '2025-04-10 02:06:50', 'Updated payment details', '{"id":1,"gcash_number":"99","gcash_name":"99","gcash_amount":"99.00","paymaya_number":"99","paymaya_name":"99","paymaya_amount":"97.00","bank_name":"99","bank_account_number":"99","bank_account_name":"0","bank_amount":"99.00","last_updated":"2025-04-10 09:54:29"}'),
	(131, 44, 'Gabriello', 'admin', 'UPDATE', 'payment_details', '{"id":1,"gcash_number":"99","gcash_name":"99","gcash_amount":"99.00","paymaya_number":"99","paymaya_name":"99","paymaya_amount":"97.00","bank_name":"99","bank_account_number":"99","bank_account_name":"asdaasjhda","bank_amount":"99.00","last_updated":"2025-04-10 10:08:47"}', '2025-04-10 02:08:47', 'Updated payment details', '{"id":1,"gcash_number":"99","gcash_name":"99","gcash_amount":"99.00","paymaya_number":"99","paymaya_name":"99","paymaya_amount":"97.00","bank_name":"99","bank_account_number":"99","bank_account_name":"0","bank_amount":"99.00","last_updated":"2025-04-10 09:54:29"}'),
	(132, 44, 'Gabriello', 'admin', 'UPDATE', 'payment_details', '{"id":1,"gcash_number":"09123456789","gcash_name":"Juan Dela Cruz","gcash_amount":"99.00","paymaya_number":"09123456789","paymaya_name":"Juan Dela Cruz","paymaya_amount":"97.00","bank_name":"BDO","bank_account_number":"09123456789","bank_account_name":"Juan Dela Cruz","bank_amount":"99.00","last_updated":"2025-04-12 05:57:00"}', '2025-04-11 21:57:00', 'Updated payment details', '{"id":1,"gcash_number":"99","gcash_name":"99","gcash_amount":"99.00","paymaya_number":"99","paymaya_name":"99","paymaya_amount":"97.00","bank_name":"99","bank_account_number":"99","bank_account_name":"asdaasjhda","bank_amount":"99.00","last_updated":"2025-04-10 10:08:47"}'),
	(133, 44, 'Gabriello', 'admin', 'DELETE', 'users', NULL, '2025-04-13 03:41:33', 'Deleted user: gab@yahoo.com', '{"id":60,"first_name":"Gabriello","middle_initial":"A","last_name":"Gerald Herrera","email":"gab@yahoo.com","password":"***REDACTED***","contact_no":"+639760314957","verified":0,"verification_token":"6b50b193c01c4833cacc4baec89588d25b79f7d022a0be4f0002f2813e5af7bd","role":"customer"}'),
	(134, 44, 'Gabriello', 'admin', 'UPDATE', 'users', '{"id":58,"first_name":"Gwen","middle_initial":"T.","last_name":"Navarro","email":"gwen@yahoo.com","password":"***REDACTED***","contact_no":"09760314957","verified":1,"verification_token":null,"role":"admin"}', '2025-04-13 03:43:07', 'Updated user: gwen@yahoo.com', '{"id":58,"first_name":"Gwen","middle_initial":"T.","last_name":"Navarro","email":"gwen@yahoo.com","password":"***REDACTED***","contact_no":"09760314957","verified":1,"verification_token":null,"role":"admin"}'),
	(135, 44, 'Gabriello', 'admin', 'UPDATE', 'users', '{"id":58,"first_name":"Gwen","middle_initial":"T.","last_name":"Navarro","email":"gwen@yahoo.com","password":"***REDACTED***","contact_no":"09760314957","verified":1,"verification_token":null,"role":"admin"}', '2025-04-13 03:43:29', 'Updated user: gwen@yahoo.com', '{"id":58,"first_name":"Gwen","middle_initial":"T.","last_name":"Navarro","email":"gwen@yahoo.com","password":"***REDACTED***","contact_no":"09760314957","verified":1,"verification_token":null,"role":"admin"}'),
	(136, 44, 'Gabriello', 'admin', 'UPDATE', 'users', '{"id":58,"first_name":"Gwennie","middle_initial":"T.","last_name":"Navarroo","email":"gwennie@yahoo.com","password":"***REDACTED***","contact_no":"09760314951","verified":1,"verification_token":null,"role":"admin"}', '2025-04-13 03:44:39', 'Updated user: gwennie@yahoo.com', '{"id":58,"first_name":"Gwen","middle_initial":"T.","last_name":"Navarro","email":"gwen@yahoo.com","password":"***REDACTED***","contact_no":"09760314957","verified":1,"verification_token":null,"role":"admin"}'),
	(137, 44, 'Gabriello', 'admin', 'UPDATE', 'users', '{"id":58,"first_name":"Gwennie","middle_initial":"T.","last_name":"Navarroo","email":"gwennie@yahoo.com","password":"***REDACTED***","contact_no":"09760314951","verified":1,"verification_token":null,"role":"admin"}', '2025-04-13 03:49:10', 'Updated user: gwennie@yahoo.com', '{"id":58,"first_name":"Gwennie","middle_initial":"T.","last_name":"Navarroo","email":"gwennie@yahoo.com","password":"***REDACTED***","contact_no":"09760314951","verified":1,"verification_token":null,"role":"admin"}'),
	(138, 44, 'Gabriello', 'admin', 'UPDATE', 'users', '{"id":58,"first_name":"Gwennie","middle_initial":"T.","last_name":"Navarroo","email":"gwennie@yahoo.com","contact_no":"09760314951","verified":1,"verification_token":null,"role":"admin"}', '2025-04-13 03:51:03', 'Updated user (including password): gwennie@yahoo.com', '{"id":58,"first_name":"Gwennie","middle_initial":"T.","last_name":"Navarroo","email":"gwennie@yahoo.com","contact_no":"09760314951","verified":1,"verification_token":null,"role":"admin"}'),
	(139, 44, 'Gabriello', 'admin', 'UPDATE', 'users', '{"id":58,"first_name":"Gwennie","middle_initial":"T.","last_name":"Navarro","email":"gwennie@yahoo.com","contact_no":"09760314957","verified":1,"verification_token":null,"role":"admin"}', '2025-04-13 03:52:47', 'Updated user: gwennie@yahoo.com', '{"id":58,"first_name":"Gwennie","middle_initial":"T.","last_name":"Navarroo","email":"gwennie@yahoo.com","contact_no":"09760314951","verified":1,"verification_token":null,"role":"admin"}'),
	(140, 44, 'Gabriello', 'admin', 'UPDATE', 'users', '{"id":57,"first_name":"Rovin","middle_initial":"","last_name":"Soriano","email":"rsori013@ucr.edu","contact_no":"7472382804","verified":1,"verification_token":null,"role":"admin"}', '2025-04-13 03:53:08', 'Updated user (including password): rsori013@ucr.edu', '{"id":57,"first_name":"Rovin","middle_initial":"","last_name":"Soriano","email":"rsori013@ucr.edu","contact_no":"7472382804","verified":1,"verification_token":null,"role":"employee"}'),
	(141, 44, 'Gabriello', 'admin', 'DELETE', 'users', NULL, '2025-04-13 03:55:39', 'Deleted user: rsori013@ucr.edu', '{"id":57,"first_name":"Rovin","middle_initial":"","last_name":"Soriano","email":"rsori013@ucr.edu","contact_no":"7472382804","verified":1,"verification_token":null,"role":"admin"}'),
	(142, 44, 'Gabriello', 'admin', 'UPDATE', 'payment_details', '{"id":1,"gcash_number":"09123456789","gcash_name":"Juan Dela Cruz","paymaya_number":"09123456789","paymaya_name":"Juan Dela Cruz","bank_name":"BDO","bank_account_number":"09123456789","bank_account_name":"Juan Dela Cruzz","last_updated":"2025-04-13 12:09:33"}', '2025-04-13 04:09:33', 'Updated payment details', '{"id":1,"gcash_number":"09123456789","gcash_name":"Juan Dela Cruz","paymaya_number":"09123456789","paymaya_name":"Juan Dela Cruz","bank_name":"BDO","bank_account_number":"09123456789","bank_account_name":"Juan Dela Cruz","last_updated":"2025-04-12 05:57:00"}'),
	(143, 44, 'Gabriello', 'admin', 'UPDATE', 'products', '{"id":1023,"name":"trial","description":"trial Description for Product 1 Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1 Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1 Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1 Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1","price":"192.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67dafb18ef171-body_scrub.jpg"}', '2025-04-13 05:32:52', 'Updated product: trial', '{"id":1023,"name":"trial","description":"trial Description for Product 1 Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1 Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1 Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1 Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1","price":"0.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67dafb18ef171-body_scrub.jpg"}'),
	(144, 44, 'Gabriello', 'admin', 'UPDATE', 'faqs', '{"id":1011,"question":"Question 1","answer":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."}', '2025-04-13 06:05:41', 'Updated FAQ: Question 1', '{"id":1011,"question":"Question 1","answer":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."}'),
	(145, 44, 'Gabriello', 'admin', 'UPDATE', 'faqs', '{"id":1011,"question":"Question 1","answer":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."}', '2025-04-13 06:06:12', 'Updated FAQ: Question 1', '{"id":1011,"question":"Question 1","answer":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."}'),
	(146, 44, 'Gabriello', 'admin', 'UPDATE', 'services', '{"id":10,"name":"Deep Cleansing Facial","description":"Deep Cleansing Facial Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...","price":"399.00","file_url":"uploads\\/dora.jpg","duration":1}', '2025-04-13 06:08:27', 'Updated service: Deep Cleansing Facial', '{"id":10,"name":"Deep Cleansing Facial","description":"Deep Cleansing Facial","price":"399.00","file_url":"uploads\\/dora.jpg","duration":1}'),
	(147, 44, 'Gabriello', 'admin', 'UPDATE', 'services', '{"id":10,"name":"Deep Cleansing Facial","description":"Deep Cleansing Facial","price":"399.00","file_url":"uploads\\/dora.jpg","duration":1}', '2025-04-13 06:08:37', 'Updated service: Deep Cleansing Facial', '{"id":10,"name":"Deep Cleansing Facial","description":"Deep Cleansing Facial Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...","price":"399.00","file_url":"uploads\\/dora.jpg","duration":1}'),
	(148, 44, 'Gabriello', 'admin', 'DELETE', 'products', NULL, '2025-04-13 06:08:56', 'Deleted product: trial', '{"id":1023,"name":"trial","description":"trial Description for Product 1 Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1 Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1 Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1 Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1Description for Product 1","price":"192.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67dafb18ef171-body_scrub.jpg"}'),
	(149, 44, 'Gabriello', 'admin', 'DELETE', 'staff', NULL, '2025-04-13 06:11:48', 'Deleted staff: Si Stephen', '{"id":13,"name":"Si Stephen","branch_id":6}'),
	(150, 44, 'Gabriello', 'admin', 'DELETE', 'staff', NULL, '2025-04-13 06:11:54', 'Deleted staff: Si Stephen', '{"id":14,"name":"Si Stephen","branch_id":6}'),
	(151, 44, 'Gabriello', 'admin', 'CREATE', 'site_policies', '{"id":1,"privacy_policy":"1. Introduction\\nAt [Your Spa Name], we are committed to safeguarding your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you interact with our website and booking platform.\\u200b\\n\\n2. Information We Collect\\nWe may collect the following information:\\n\\nPersonal Details: Name, email address, phone number, birthday, and gender.\\u200b\\n\\nHealth Information: Details about skin type, allergies, or pregnancy status to tailor treatments.\\u200b\\n\\nBooking Data: Appointment history and service preferences.\\u200b\\ngotonails.org\\n\\nPayment Information: Processed securely via third-party gateways; we do not store credit card details.\\u200b\\nSkin8spa\\n\\nWebsite Usage: IP address, browser type, and pages visited, collected via cookies for analytics.\\u200b\\nSkin8spa\\n\\n3. How We Use Your Information\\nYour data helps us:\\n\\nSchedule and confirm appointments.\\u200b\\nRoequite SKIN\\n\\nCustomize treatments based on your preferences.\\u200b\\nRoequite SKIN\\n+1\\nSkin8spa\\n+1\\n\\nSend updates, promotional offers, or policy changes (with your consent).\\u200b\\nRoequite SKIN\\n+1\\ngotonails.org\\n+1\\n\\nComply with legal obligations or resolve disputes.\\u200b\\nRoequite SKIN\\n+1\\nBeautyeBooking\\n+1\\n\\n4. Data Sharing\\nWe do not sell or rent your personal information. Data may be shared with:\\u200b\\nRoequite SKIN\\n+3\\nSkin8spa\\n+3\\nBeautyeBooking\\n+3\\n\\nService Providers: For payment processing and booking management.\\u200b\\nSimply Skin\\n+2\\nRoequite SKIN\\n+2\\nSkin8spa\\n+2\\n\\nLegal Authorities: When required by law.\\u200b\\nSkin8spa\\n\\n5. Data Security\\nWe implement strict measures to protect your personal and payment information, including encryption and secure storage. However, no online platform can guarantee 100% security.\\u200b\\nRoequite SKIN\\n+1\\ngotonails.org\\n+1\\n\\n6. Your Rights\\nYou have the right to:\\n\\nAccess, correct, or delete your personal information.\\u200b\\nBreathe: Bodywork and Beautification\\n+6\\nBeautyeBooking\\n+6\\nSimply Skin\\n+6\\n\\nWithdraw consent for marketing communications.\\u200b\\n\\nRequest a copy of the data we hold about you.\\u200b\\nRoequite SKIN\\n+5\\nSkin8spa\\n+5\\nPP MANILA\\n+5\\n\\n7. Data Retention\\nWe retain your information only as long as necessary for service provision and legal compliance.\\u200b\\n\\n8. Children\\u2019s Privacy\\nOur services are not intended for individuals under 18. We do not knowingly collect data from minors.\\u200b\\n\\n9. Contact Us\\nFor inquiries or to exercise your data rights:\\n\\nEmail: info@yoursparname.com\\n\\nPhone: +63 [Your Contact Number]","terms_condition":"1. Appointments\\nAppointments can be booked via our website, phone, or in-person.\\u200b\\n\\nA confirmation message will be sent upon successful booking.\\u200b\\n\\n2. Cancellations & Rescheduling\\nCancellations must be made at least 24 hours in advance.\\u200b\\n\\nLate cancellations may incur a 50% service fee.\\u200b\\nRoequite SKIN\\n\\nNo-shows will be charged the full service amount.\\u200b\\nRoequite SKIN\\n\\n3. Late Arrivals\\nArriving more than 10 minutes late may result in a shortened service or rescheduling, with applicable fees.\\u200b\\nRoequite SKIN\\n\\n4. Health & Safety\\nPlease disclose any health conditions or allergies prior to treatment.\\u200b\\nRoequite SKIN\\n\\nWe reserve the right to refuse service if a condition poses a risk.\\u200b\\n\\n5. Refund Policy\\nServices are non-refundable. If dissatisfied, please contact us within 24 hours to address concerns.\\u200b\\nRoequite SKIN\\n\\n6. Promotions & Discounts\\nPromotional offers cannot be combined and are subject to availability.\\u200b\\n\\n7. Intellectual Property\\nAll content on our website, including logos and images, is the property of [Your Spa Name] and may not be used without permission.\\u200b\\n\\n8. Governing Law\\nThese terms are governed by the laws of the Republic of the Philippines.","last_updated":"2025-04-13 17:22:36"}', '2025-04-13 09:22:36', 'Created site policies', NULL),
	(152, 44, 'Gabriello', 'admin', 'UPDATE', 'site_policies', '{"id":1,"privacy_policy":"1. Introduction\\nAt [Your Spa Name], we are committed to safeguarding your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you interact with our website and booking platform.\\u200b\\n\\n2. Information We Collect\\nWe may collect the following information:\\n\\nPersonal Details: Name, email address, phone number, birthday, and gender.\\u200b\\n\\nHealth Information: Details about skin type, allergies, or pregnancy status to tailor treatments.\\u200b\\n\\nBooking Data: Appointment history and service preferences.\\u200b\\ngotonails.org\\n\\nPayment Information: Processed securely via third-party gateways; we do not store credit card details.\\u200b\\nSkin8spa\\n\\nWebsite Usage: IP address, browser type, and pages visited, collected via cookies for analytics.\\u200b\\nSkin8spa\\n\\n3. How We Use Your Information\\nYour data helps us:\\n\\nSchedule and confirm appointments.\\u200b\\nRoequite SKIN\\n\\nCustomize treatments based on your preferences.\\u200b\\nRoequite SKIN\\n+1\\nSkin8spa\\n+1\\n\\nSend updates, promotional offers, or policy changes (with your consent).\\u200b\\nRoequite SKIN\\n+1\\ngotonails.org\\n+1\\n\\nComply with legal obligations or resolve disputes.\\u200b\\nRoequite SKIN\\n+1\\nBeautyeBooking\\n+1\\n\\n4. Data Sharing\\nWe do not sell or rent your personal information. Data may be shared with:\\u200b\\nRoequite SKIN\\n+3\\nSkin8spa\\n+3\\nBeautyeBooking\\n+3\\n\\nService Providers: For payment processing and booking management.\\u200b\\nSimply Skin\\n+2\\nRoequite SKIN\\n+2\\nSkin8spa\\n+2\\n\\nLegal Authorities: When required by law.\\u200b\\nSkin8spa\\n\\n5. Data Security\\nWe implement strict measures to protect your personal and payment information, including encryption and secure storage. However, no online platform can guarantee 100% security.\\u200b\\nRoequite SKIN\\n+1\\ngotonails.org\\n+1\\n\\n6. Your Rights\\nYou have the right to:\\n\\nAccess, correct, or delete your personal information.\\u200b\\nBreathe: Bodywork and Beautification\\n+6\\nBeautyeBooking\\n+6\\nSimply Skin\\n+6\\n\\nWithdraw consent for marketing communications.\\u200b\\n\\nRequest a copy of the data we hold about you.\\u200b\\nRoequite SKIN\\n+5\\nSkin8spa\\n+5\\nPP MANILA\\n+5\\n\\n7. Data Retention\\nWe retain your information only as long as necessary for service provision and legal compliance.\\u200b\\n\\n8. Children\\u2019s Privacy\\nOur services are not intended for individuals under 18. We do not knowingly collect data from minors.\\u200b\\n\\n9. Contact Us\\nFor inquiries or to exercise your data rights: asdakhdaksd\\n\\nEmail: info@yoursparname.com\\n\\nPhone: +63 [Your Contact Number]","terms_condition":"1. Appointments\\nAppointments can be booked via our website, phone, or in-person.\\u200b\\n\\nA confirmation message will be sent upon successful booking.\\u200b\\n\\n2. Cancellations & Rescheduling\\nCancellations must be made at least 24 hours in advance.\\u200b\\n\\nLate cancellations may incur a 50% service fee.\\u200b\\nRoequite SKIN\\n\\nNo-shows will be charged the full service amount.\\u200b\\nRoequite SKIN\\n\\n3. Late Arrivals\\nArriving more than 10 minutes late may result in a shortened service or rescheduling, with applicable fees.\\u200b\\nRoequite SKIN\\n\\n4. Health & Safety\\nPlease disclose any health conditions or allergies prior to treatment.\\u200b\\nRoequite SKIN\\n\\nWe reserve the right to refuse service if a condition poses a risk.\\u200b\\n\\n5. Refund Policy\\nServices are non-refundable. If dissatisfied, please contact us within 24 hours to address concerns.\\u200b\\nRoequite SKIN\\n\\n6. Promotions & Discounts\\nPromotional offers cannot be combined and are subject to availability.\\u200b\\n\\n7. Intellectual Property\\nAll content on our website, including logos and images, is the property of [Your Spa Name] and may not be used without permission.\\u200b\\n\\n8. Governing Law\\nThese terms are governed by the laws of the Republic of the Philippines.","last_updated":"2025-04-13 17:23:43"}', '2025-04-13 09:23:43', 'Updated site policies', '{"count":1,"privacy_policy":"1. Introduction\\nAt [Your Spa Name], we are committed to safeguarding your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you interact with our website and booking platform.\\u200b\\n\\n2. Information We Collect\\nWe may collect the following information:\\n\\nPersonal Details: Name, email address, phone number, birthday, and gender.\\u200b\\n\\nHealth Information: Details about skin type, allergies, or pregnancy status to tailor treatments.\\u200b\\n\\nBooking Data: Appointment history and service preferences.\\u200b\\ngotonails.org\\n\\nPayment Information: Processed securely via third-party gateways; we do not store credit card details.\\u200b\\nSkin8spa\\n\\nWebsite Usage: IP address, browser type, and pages visited, collected via cookies for analytics.\\u200b\\nSkin8spa\\n\\n3. How We Use Your Information\\nYour data helps us:\\n\\nSchedule and confirm appointments.\\u200b\\nRoequite SKIN\\n\\nCustomize treatments based on your preferences.\\u200b\\nRoequite SKIN\\n+1\\nSkin8spa\\n+1\\n\\nSend updates, promotional offers, or policy changes (with your consent).\\u200b\\nRoequite SKIN\\n+1\\ngotonails.org\\n+1\\n\\nComply with legal obligations or resolve disputes.\\u200b\\nRoequite SKIN\\n+1\\nBeautyeBooking\\n+1\\n\\n4. Data Sharing\\nWe do not sell or rent your personal information. Data may be shared with:\\u200b\\nRoequite SKIN\\n+3\\nSkin8spa\\n+3\\nBeautyeBooking\\n+3\\n\\nService Providers: For payment processing and booking management.\\u200b\\nSimply Skin\\n+2\\nRoequite SKIN\\n+2\\nSkin8spa\\n+2\\n\\nLegal Authorities: When required by law.\\u200b\\nSkin8spa\\n\\n5. Data Security\\nWe implement strict measures to protect your personal and payment information, including encryption and secure storage. However, no online platform can guarantee 100% security.\\u200b\\nRoequite SKIN\\n+1\\ngotonails.org\\n+1\\n\\n6. Your Rights\\nYou have the right to:\\n\\nAccess, correct, or delete your personal information.\\u200b\\nBreathe: Bodywork and Beautification\\n+6\\nBeautyeBooking\\n+6\\nSimply Skin\\n+6\\n\\nWithdraw consent for marketing communications.\\u200b\\n\\nRequest a copy of the data we hold about you.\\u200b\\nRoequite SKIN\\n+5\\nSkin8spa\\n+5\\nPP MANILA\\n+5\\n\\n7. Data Retention\\nWe retain your information only as long as necessary for service provision and legal compliance.\\u200b\\n\\n8. Children\\u2019s Privacy\\nOur services are not intended for individuals under 18. We do not knowingly collect data from minors.\\u200b\\n\\n9. Contact Us\\nFor inquiries or to exercise your data rights:\\n\\nEmail: info@yoursparname.com\\n\\nPhone: +63 [Your Contact Number]","terms_condition":"1. Appointments\\nAppointments can be booked via our website, phone, or in-person.\\u200b\\n\\nA confirmation message will be sent upon successful booking.\\u200b\\n\\n2. Cancellations & Rescheduling\\nCancellations must be made at least 24 hours in advance.\\u200b\\n\\nLate cancellations may incur a 50% service fee.\\u200b\\nRoequite SKIN\\n\\nNo-shows will be charged the full service amount.\\u200b\\nRoequite SKIN\\n\\n3. Late Arrivals\\nArriving more than 10 minutes late may result in a shortened service or rescheduling, with applicable fees.\\u200b\\nRoequite SKIN\\n\\n4. Health & Safety\\nPlease disclose any health conditions or allergies prior to treatment.\\u200b\\nRoequite SKIN\\n\\nWe reserve the right to refuse service if a condition poses a risk.\\u200b\\n\\n5. Refund Policy\\nServices are non-refundable. If dissatisfied, please contact us within 24 hours to address concerns.\\u200b\\nRoequite SKIN\\n\\n6. Promotions & Discounts\\nPromotional offers cannot be combined and are subject to availability.\\u200b\\n\\n7. Intellectual Property\\nAll content on our website, including logos and images, is the property of [Your Spa Name] and may not be used without permission.\\u200b\\n\\n8. Governing Law\\nThese terms are governed by the laws of the Republic of the Philippines."}'),
	(153, 44, 'Gabriello', 'admin', 'UPDATE', 'site_policies', '{"id":1,"privacy_policy":"1. Introduction\\nAt [Your Spa Name], we are committed to safeguarding your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you interact with our website and booking platform.\\u200b\\n\\n2. Information We Collect\\nWe may collect the following information:\\n\\nPersonal Details: Name, email address, phone number, birthday, and gender.\\u200b\\n\\nHealth Information: Details about skin type, allergies, or pregnancy status to tailor treatments.\\u200b\\n\\nBooking Data: Appointment history and service preferences.\\u200b\\ngotonails.org\\n\\nPayment Information: Processed securely via third-party gateways; we do not store credit card details.\\u200b\\nSkin8spa\\n\\nWebsite Usage: IP address, browser type, and pages visited, collected via cookies for analytics.\\u200b\\nSkin8spa\\n\\n3. How We Use Your Information\\nYour data helps us:\\n\\nSchedule and confirm appointments.\\u200b\\nRoequite SKIN\\n\\nCustomize treatments based on your preferences.\\u200b\\nRoequite SKIN\\n+1\\nSkin8spa\\n+1\\n\\nSend updates, promotional offers, or policy changes (with your consent).\\u200b\\nRoequite SKIN\\n+1\\ngotonails.org\\n+1\\n\\nComply with legal obligations or resolve disputes.\\u200b\\nRoequite SKIN\\n+1\\nBeautyeBooking\\n+1\\n\\n4. Data Sharing\\nWe do not sell or rent your personal information. Data may be shared with:\\u200b\\nRoequite SKIN\\n+3\\nSkin8spa\\n+3\\nBeautyeBooking\\n+3\\n\\nService Providers: For payment processing and booking management.\\u200b\\nSimply Skin\\n+2\\nRoequite SKIN\\n+2\\nSkin8spa\\n+2\\n\\nLegal Authorities: When required by law.\\u200b\\nSkin8spa\\n\\n5. Data Security\\nWe implement strict measures to protect your personal and payment information, including encryption and secure storage. However, no online platform can guarantee 100% security.\\u200b\\nRoequite SKIN\\n+1\\ngotonails.org\\n+1\\n\\n6. Your Rights\\nYou have the right to:\\n\\nAccess, correct, or delete your personal information.\\u200b\\nBreathe: Bodywork and Beautification\\n+6\\nBeautyeBooking\\n+6\\nSimply Skin\\n+6\\n\\nWithdraw consent for marketing communications.\\u200b\\n\\nRequest a copy of the data we hold about you.\\u200b\\nRoequite SKIN\\n+5\\nSkin8spa\\n+5\\nPP MANILA\\n+5\\n\\n7. Data Retention\\nWe retain your information only as long as necessary for service provision and legal compliance.\\u200b\\n\\n8. Children\\u2019s Privacy\\nOur services are not intended for individuals under 18. We do not knowingly collect data from minors.\\u200b\\n\\n9. Contact Us\\nFor inquiries or to exercise your data rights: asdakhdaksd\\n\\nEmail: info@yoursparname.com\\n\\nPhone: +63 [Your Contact Number]","terms_condition":"1. Appointments\\nAppointments can be booked via our website, phone, or in-person.\\u200b\\n\\nA confirmation message will be sent upon successful booking\\/s.\\u200b\\n\\n2. Cancellations & Rescheduling\\nCancellations must be made at least 24 hours in advance.\\u200b\\n\\nLate cancellations may incur a 50% service fee.\\u200b\\nRoequite SKIN\\n\\nNo-shows will be charged the full service amount.\\u200b\\nRoequite SKIN\\n\\n3. Late Arrivals\\nArriving more than 10 minutes late may result in a shortened service or rescheduling, with applicable fees.\\u200b\\nRoequite SKIN\\n\\n4. Health & Safety\\nPlease disclose any health conditions or allergies prior to treatment.\\u200b\\nRoequite SKIN\\n\\nWe reserve the right to refuse service if a condition poses a risk.\\u200b\\n\\n5. Refund Policy\\nServices are non-refundable. If dissatisfied, please contact us within 24 hours to address concerns.\\u200b\\nRoequite SKIN\\n\\n6. Promotions & Discounts\\nPromotional offers cannot be combined and are subject to availability.\\u200b\\n\\n7. Intellectual Property\\nAll content on our website, including logos and images, is the property of [Your Spa Name] and may not be used without permission.\\u200b\\n\\n8. Governing Law\\nThese terms are governed by the laws of the Republic of the Philippines.","last_updated":"2025-04-13 17:24:37"}', '2025-04-13 09:24:37', 'Updated site policies', '{"count":1,"privacy_policy":"1. Introduction\\nAt [Your Spa Name], we are committed to safeguarding your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you interact with our website and booking platform.\\u200b\\n\\n2. Information We Collect\\nWe may collect the following information:\\n\\nPersonal Details: Name, email address, phone number, birthday, and gender.\\u200b\\n\\nHealth Information: Details about skin type, allergies, or pregnancy status to tailor treatments.\\u200b\\n\\nBooking Data: Appointment history and service preferences.\\u200b\\ngotonails.org\\n\\nPayment Information: Processed securely via third-party gateways; we do not store credit card details.\\u200b\\nSkin8spa\\n\\nWebsite Usage: IP address, browser type, and pages visited, collected via cookies for analytics.\\u200b\\nSkin8spa\\n\\n3. How We Use Your Information\\nYour data helps us:\\n\\nSchedule and confirm appointments.\\u200b\\nRoequite SKIN\\n\\nCustomize treatments based on your preferences.\\u200b\\nRoequite SKIN\\n+1\\nSkin8spa\\n+1\\n\\nSend updates, promotional offers, or policy changes (with your consent).\\u200b\\nRoequite SKIN\\n+1\\ngotonails.org\\n+1\\n\\nComply with legal obligations or resolve disputes.\\u200b\\nRoequite SKIN\\n+1\\nBeautyeBooking\\n+1\\n\\n4. Data Sharing\\nWe do not sell or rent your personal information. Data may be shared with:\\u200b\\nRoequite SKIN\\n+3\\nSkin8spa\\n+3\\nBeautyeBooking\\n+3\\n\\nService Providers: For payment processing and booking management.\\u200b\\nSimply Skin\\n+2\\nRoequite SKIN\\n+2\\nSkin8spa\\n+2\\n\\nLegal Authorities: When required by law.\\u200b\\nSkin8spa\\n\\n5. Data Security\\nWe implement strict measures to protect your personal and payment information, including encryption and secure storage. However, no online platform can guarantee 100% security.\\u200b\\nRoequite SKIN\\n+1\\ngotonails.org\\n+1\\n\\n6. Your Rights\\nYou have the right to:\\n\\nAccess, correct, or delete your personal information.\\u200b\\nBreathe: Bodywork and Beautification\\n+6\\nBeautyeBooking\\n+6\\nSimply Skin\\n+6\\n\\nWithdraw consent for marketing communications.\\u200b\\n\\nRequest a copy of the data we hold about you.\\u200b\\nRoequite SKIN\\n+5\\nSkin8spa\\n+5\\nPP MANILA\\n+5\\n\\n7. Data Retention\\nWe retain your information only as long as necessary for service provision and legal compliance.\\u200b\\n\\n8. Children\\u2019s Privacy\\nOur services are not intended for individuals under 18. We do not knowingly collect data from minors.\\u200b\\n\\n9. Contact Us\\nFor inquiries or to exercise your data rights: asdakhdaksd\\n\\nEmail: info@yoursparname.com\\n\\nPhone: +63 [Your Contact Number]","terms_condition":"1. Appointments\\nAppointments can be booked via our website, phone, or in-person.\\u200b\\n\\nA confirmation message will be sent upon successful booking.\\u200b\\n\\n2. Cancellations & Rescheduling\\nCancellations must be made at least 24 hours in advance.\\u200b\\n\\nLate cancellations may incur a 50% service fee.\\u200b\\nRoequite SKIN\\n\\nNo-shows will be charged the full service amount.\\u200b\\nRoequite SKIN\\n\\n3. Late Arrivals\\nArriving more than 10 minutes late may result in a shortened service or rescheduling, with applicable fees.\\u200b\\nRoequite SKIN\\n\\n4. Health & Safety\\nPlease disclose any health conditions or allergies prior to treatment.\\u200b\\nRoequite SKIN\\n\\nWe reserve the right to refuse service if a condition poses a risk.\\u200b\\n\\n5. Refund Policy\\nServices are non-refundable. If dissatisfied, please contact us within 24 hours to address concerns.\\u200b\\nRoequite SKIN\\n\\n6. Promotions & Discounts\\nPromotional offers cannot be combined and are subject to availability.\\u200b\\n\\n7. Intellectual Property\\nAll content on our website, including logos and images, is the property of [Your Spa Name] and may not be used without permission.\\u200b\\n\\n8. Governing Law\\nThese terms are governed by the laws of the Republic of the Philippines."}'),
	(154, 44, 'Gabriello', 'admin', 'DELETE', 'bookings', NULL, '2025-04-13 10:14:51', 'Deleted appointment for: armand@yahoo.com', '{"id":19,"user_id":null,"first_name":"MANDYY","last_name":"VALLL","email":"armand@yahoo.com","contact_no":"09760314957","service_type":"Service","appointment_date":"2025-03-26","appointment_time":"03:00:00","status":"pending","created_at":"2025-03-25 07:29:44","staff_id":4,"branch_id":6,"rating":null,"file_url":null}'),
	(155, 44, 'Gabriello', 'admin', 'UPDATE', 'bookings', '{"id":23,"user_id":null,"first_name":"Gabriello","last_name":"Gerald Herrera","email":"rsori013@ucr.edu","contact_no":"09760314957","service_type":"ASR Gluta IV Push or Vit C Drip","appointment_date":"2025-03-26","appointment_time":"01:00:00","status":"confirmed","created_at":"2025-03-25 11:48:56","staff_id":8,"branch_id":7,"rating":null,"file_url":null}', '2025-04-13 10:42:29', 'Updated appointment ID: 23 for rsori013@ucr.edu', '{"id":23,"user_id":null,"first_name":"Gabriello","last_name":"Gerald Herrera","email":"rsori013@ucr.edu","contact_no":"09760314957","service_type":"Promo","appointment_date":"2025-03-26","appointment_time":"01:00:00","status":"pending","created_at":"2025-03-25 11:48:56","staff_id":1,"branch_id":6,"rating":null,"file_url":null}'),
	(156, 44, 'Gabriello', 'admin', 'UPDATE', 'bookings', '{"id":24,"user_id":null,"first_name":"Gabriello","last_name":"Gerald Herrera","email":"rsori013@ucr.edu","contact_no":"09760314957","service_type":"ASR Immunomax Drip","appointment_date":"2025-03-27","appointment_time":"18:00:00","status":"pending","created_at":"2025-03-25 11:52:31","staff_id":9,"branch_id":7,"rating":null,"file_url":null}', '2025-04-13 10:43:48', 'Updated appointment for rsori013@ucr.edu', '{"id":24,"user_id":null,"first_name":"Gabriello","last_name":"Gerald Herrera","email":"rsori013@ucr.edu","contact_no":"09760314957","service_type":"Surgery","appointment_date":"2025-03-27","appointment_time":"03:00:00","status":"pending","created_at":"2025-03-25 11:52:31","staff_id":3,"branch_id":7,"rating":null,"file_url":null}'),
	(157, 44, 'Gabriello', 'admin', 'UPDATE', 'faqs', '{"id":1011,"question":"Question 1","answer":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...."}', '2025-04-13 11:43:14', 'Updated FAQ: Question 1', '{"id":1011,"question":"Question 1","answer":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...."}'),
	(158, 44, 'Gabriello', 'admin', 'DELETE', 'bookings', NULL, '2025-04-13 11:44:56', 'Deleted appointment for: alvaradorandolph@gmail.com', '{"id":10,"user_id":null,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Acne Control Facial","appointment_date":"2025-03-24","appointment_time":"10:00:00","status":"confirmed","created_at":"2025-03-24 20:38:38","staff_id":1,"branch_id":6,"rating":null,"file_url":null}'),
	(159, 44, 'Gabriello', 'admin', 'UPDATE', 'site_policies', '{"id":1,"privacy_policy":"Add your privacy policy here","terms_condition":"Add your Terms and Conditions heree\\n","last_updated":"2025-04-13 19:45:10"}', '2025-04-13 11:45:10', 'Updated site policies', '{"count":1,"privacy_policy":"Add your privacy policy here","terms_condition":"Add your Terms and Conditions here"}'),
	(160, 44, 'Gabriello', 'admin', 'UPDATE', 'site_policies', '{"id":1,"privacy_policy":"Add your privacy policy here","terms_condition":"Add your Terms and Conditions here","last_updated":"2025-04-13 19:45:19"}', '2025-04-13 11:45:19', 'Updated site policies', '{"count":1,"privacy_policy":"Add your privacy policy here","terms_condition":"Add your Terms and Conditions heree\\n"}'),
	(161, 44, 'Gabriello', 'admin', 'UPDATE', 'bookings', '{"id":23,"user_id":null,"first_name":"Gabriello","last_name":"Gerald Herrera","email":"rsori013@ucr.edu","contact_no":"09760314957","service_type":"ASR Gluta IV Push or Vit C Drip","appointment_date":"2025-03-26","appointment_time":"01:00:00","status":"confirmed","created_at":"2025-03-25 11:48:56","staff_id":9,"branch_id":7,"rating":null,"file_url":null}', '2025-04-13 14:17:47', 'Updated appointment ID: 23 for rsori013@ucr.edu', '{"id":23,"user_id":null,"first_name":"Gabriello","last_name":"Gerald Herrera","email":"rsori013@ucr.edu","contact_no":"09760314957","service_type":"ASR Gluta IV Push or Vit C Drip","appointment_date":"2025-03-26","appointment_time":"01:00:00","status":"confirmed","created_at":"2025-03-25 11:48:56","staff_id":8,"branch_id":7,"rating":null,"file_url":null}'),
	(162, 44, 'Gabriello', 'admin', 'UPDATE', 'bookings', '{"id":21,"user_id":null,"first_name":"MANDYY","last_name":"VALLL","email":"armand@yahoo.com","contact_no":"09760314957","service_type":"Diamond Peel (Microdermabrasion)","appointment_date":"2025-03-27","appointment_time":"03:00:00","status":"confirmed","created_at":"2025-03-25 07:30:38","staff_id":8,"branch_id":7,"rating":null,"file_url":null}', '2025-04-13 14:18:42', 'Updated appointment for armand@yahoo.com', '{"id":21,"user_id":null,"first_name":"MANDYY","last_name":"VALLL","email":"armand@yahoo.com","contact_no":"09760314957","service_type":"Surgery","appointment_date":"2025-03-27","appointment_time":"03:00:00","status":"pending","created_at":"2025-03-25 07:30:38","staff_id":9,"branch_id":7,"rating":null,"file_url":null}'),
	(163, 44, 'Gabriello', 'admin', 'UPDATE', 'bookings', '{"id":41,"user_id":null,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Surgery 1","appointment_date":"2025-04-14","appointment_time":"13:00:00","status":"confirmed","created_at":"2025-04-13 23:31:06","staff_id":1,"branch_id":6,"rating":null,"file_url":null}', '2025-04-13 15:33:08', 'Updated appointment for alvaradorandolph@gmail.com', '{"id":41,"user_id":35,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Surgery 1","appointment_date":"2025-04-14","appointment_time":"13:00:00","status":"pending","created_at":"2025-04-13 23:31:06","staff_id":1,"branch_id":6,"rating":null,"file_url":null}'),
	(164, 44, 'Gabriello', 'admin', 'UPDATE', 'bookings', '{"id":41,"user_id":null,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Surgery 1","appointment_date":"2025-04-14","appointment_time":"13:00:00","status":"pending","created_at":"2025-04-13 23:31:06","staff_id":1,"branch_id":6,"rating":null,"file_url":null}', '2025-04-13 15:36:08', 'Updated appointment for alvaradorandolph@gmail.com', '{"id":41,"user_id":null,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Surgery 1","appointment_date":"2025-04-14","appointment_time":"13:00:00","status":"confirmed","created_at":"2025-04-13 23:31:06","staff_id":1,"branch_id":6,"rating":null,"file_url":null}'),
	(165, 44, 'Gabriello', 'admin', 'UPDATE', 'bookings', '{"id":41,"user_id":null,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Surgery 1","appointment_date":"2025-04-14","appointment_time":"13:00:00","status":"completed","created_at":"2025-04-13 23:31:06","staff_id":1,"branch_id":6,"rating":null,"file_url":null}', '2025-04-13 15:38:10', 'Updated appointment for alvaradorandolph@gmail.com', '{"id":41,"user_id":null,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Surgery 1","appointment_date":"2025-04-14","appointment_time":"13:00:00","status":"pending","created_at":"2025-04-13 23:31:06","staff_id":1,"branch_id":6,"rating":null,"file_url":null}'),
	(166, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":10,"name":"ASR Gluta IV Push or Vit C Drip","description":"For Immune System Booster W\\/ Whitening (5+1 Promo), +1 or 5 Treatment Points","price":"399.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67e01dd211554-bart.jpg","start_date":"2025-04-02 22:42:00","end_date":"2025-05-08 22:42:00","duration":1,"created_at":"2025-03-23 22:42:26","updated_at":"2025-04-14 00:02:03","branch_ids":null,"staff_ids":null}', '2025-04-13 16:02:03', 'Updated promo: ASR Gluta IV Push or Vit C Drip', '{"id":10,"name":"ASR Gluta IV Push or Vit C Drip","description":"For Immune System Booster W\\/ Whitening (5+1 Promo), +1 or 5 Treatment Points","price":"399.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67e01dd211554-bart.jpg","start_date":"2025-03-22 22:42:00","end_date":"2025-03-23 22:42:00","duration":1,"created_at":"2025-03-23 22:42:26","updated_at":"2025-03-25 12:04:40","branch_ids":null,"staff_ids":null}'),
	(167, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":11,"name":"ASR Immunomax Drip","description":"High Dose IV Vitamin C for whitening and to counteract. FREE Radicals, Tumors and Cancer Cells (5+1 Promo), +1 or 10 Treatment Points","price":"7495.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67e01e47491f1-67e01dd211554-bart.jpg","start_date":"2025-04-22 22:44:00","end_date":"2025-05-02 22:44:00","duration":3,"created_at":"2025-03-23 22:44:23","updated_at":"2025-04-14 00:02:18","branch_ids":null,"staff_ids":null}', '2025-04-13 16:02:18', 'Updated promo: ASR Immunomax Drip', '{"id":11,"name":"ASR Immunomax Drip","description":"High Dose IV Vitamin C for whitening and to counteract. FREE Radicals, Tumors and Cancer Cells (5+1 Promo), +1 or 10 Treatment Points","price":"7495.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67e01e47491f1-67e01dd211554-bart.jpg","start_date":"2025-03-23 22:44:00","end_date":"2025-03-31 22:44:00","duration":3,"created_at":"2025-03-23 22:44:23","updated_at":"2025-03-23 22:44:23","branch_ids":null,"staff_ids":null}'),
	(168, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":11,"name":"ASR Immunomax Drip","description":"High Dose IV Vitamin C for whitening and to counteract. FREE Radicals, Tumors and Cancer Cells (5+1 Promo), +1 or 10 Treatment Points","price":"7495.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67e01e47491f1-67e01dd211554-bart.jpg","start_date":"2025-04-13 22:44:00","end_date":"2025-05-02 22:44:00","duration":3,"created_at":"2025-03-23 22:44:23","updated_at":"2025-04-14 00:03:00","branch_ids":null,"staff_ids":null}', '2025-04-13 16:03:00', 'Updated promo: ASR Immunomax Drip', '{"id":11,"name":"ASR Immunomax Drip","description":"High Dose IV Vitamin C for whitening and to counteract. FREE Radicals, Tumors and Cancer Cells (5+1 Promo), +1 or 10 Treatment Points","price":"7495.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67e01e47491f1-67e01dd211554-bart.jpg","start_date":"2025-04-22 22:44:00","end_date":"2025-05-02 22:44:00","duration":3,"created_at":"2025-03-23 22:44:23","updated_at":"2025-04-14 00:02:18","branch_ids":null,"staff_ids":null}'),
	(169, 44, 'Gabriello', 'admin', 'UPDATE', 'bookings', '{"id":50,"user_id":null,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Surgery 2","appointment_date":"2025-04-15","appointment_time":"11:00:00","status":"cancelled","created_at":"2025-04-14 18:07:48","staff_id":1,"branch_id":6,"rating":null,"file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67fcde74e4125_67e01dd211554-bart.jpg"}', '2025-04-14 10:36:00', 'Updated appointment for alvaradorandolph@gmail.com', '{"id":50,"user_id":35,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Surgery 2","appointment_date":"2025-04-15","appointment_time":"11:00:00","status":"pending","created_at":"2025-04-14 18:07:48","staff_id":1,"branch_id":6,"rating":null,"file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67fcde74e4125_67e01dd211554-bart.jpg"}'),
	(170, 44, 'Gabriello', 'admin', 'UPDATE', 'bookings', '{"id":51,"user_id":null,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Deep Cleansing Facial","appointment_date":"2025-04-15","appointment_time":"13:00:00","status":"completed","created_at":"2025-04-14 18:32:45","staff_id":4,"branch_id":6,"rating":null,"file_url":null}', '2025-04-14 10:36:54', 'Updated appointment for alvaradorandolph@gmail.com', '{"id":51,"user_id":35,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Deep Cleansing Facial","appointment_date":"2025-04-15","appointment_time":"13:00:00","status":"pending","created_at":"2025-04-14 18:32:45","staff_id":4,"branch_id":6,"rating":null,"file_url":null}'),
	(171, 44, 'Gabriello', 'admin', 'UPDATE', 'bookings', '{"id":42,"user_id":null,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Acne Control Facial","appointment_date":"2025-04-14","appointment_time":"14:00:00","status":"cancelled","created_at":"2025-04-13 23:41:52","staff_id":1,"branch_id":6,"rating":null,"file_url":null}', '2025-04-14 10:37:36', 'Updated appointment for alvaradorandolph@gmail.com', '{"id":42,"user_id":35,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Acne Control Facial","appointment_date":"2025-04-14","appointment_time":"14:00:00","status":"pending","created_at":"2025-04-13 23:41:52","staff_id":1,"branch_id":6,"rating":null,"file_url":null}'),
	(172, 58, 'Gwennie', 'admin', 'UPDATE', 'staff', '{"id":1,"name":"Ma. Agustherese Soreda","branch_id":6,"role":"STAFF","is_surgery_staff":1}', '2025-04-17 02:13:26', 'Updated staff: Ma. Agustherese Soreda (Surgery Staff: 1)', '{"id":1,"name":"Ma. Agustherese Soreda","branch_id":6,"role":"STAFF","is_surgery_staff":0}'),
	(173, 58, 'Gwennie', 'admin', 'CREATE', 'doctor_availability', '{"doctor_id":1,"date_time":"2025-04-17 10:20:00"}', '2025-04-17 02:20:09', 'Added availability slot for doctor 1 at 2025-04-17 10:20:00', NULL),
	(174, 58, 'Gwennie', 'admin', 'CREATE', 'doctor_availability', '{"doctor_id":1,"date_time":"2025-04-17 11:20:00"}', '2025-04-17 02:21:04', 'Added availability slot for doctor 1 at 2025-04-17 11:20:00', NULL),
	(175, 40, 'Randolph', 'admin', 'CREATE', 'doctor_availability', '{"doctor_id":1,"date_time":"2025-04-29 09:00:00"}', '2025-04-29 13:04:24', 'Added availability slot for doctor 1 at 2025-04-29 09:00:00', NULL),
	(176, 40, 'Randolph', 'admin', 'CREATE', 'doctor_availability', '{"doctor_id":1,"date_time":"2025-04-29 10:00:00"}', '2025-04-29 13:04:46', 'Added availability slot for doctor 1 at 2025-04-29 10:00:00', NULL),
	(177, 40, 'Randolph', 'admin', 'DELETE', 'doctor_availability', NULL, '2025-04-29 15:50:07', 'Removed availability slot for doctor 1 at 2025-04-29 10:00:00', '{"doctor_id":1,"date_time":"2025-04-29 10:00:00"}'),
	(178, 40, 'Randolph', 'admin', 'DELETE', 'bookings', NULL, '2025-04-29 15:52:19', 'Deleted appointment for: alvaradorandolph@gmail.com', '{"id":56,"user_id":35,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"ASR Gluta IV Push or Vit C Drip","appointment_date":"2025-04-29","appointment_time":"09:00:00","status":"pending","created_at":"2025-04-29 19:55:13","staff_id":3,"branch_id":7,"rating":null,"file_url":null}'),
	(179, 40, 'Randolph', 'admin', 'DELETE', 'bookings', NULL, '2025-04-29 16:30:44', 'Deleted appointment for: alvaradorandolph@gmail.com', '{"id":57,"user_id":35,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Deep Cleansing Facial","appointment_date":"2025-04-29","appointment_time":"09:00:00","status":"pending","created_at":"2025-04-29 23:47:53","staff_id":1,"branch_id":6,"rating":null,"file_url":null}'),
	(180, 40, 'Randolph', 'admin', 'DELETE', 'bookings', NULL, '2025-04-29 16:34:57', 'Deleted appointment for: alvaradorandolph@gmail.com', '{"id":59,"user_id":35,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"ASR Immunomax Drip","appointment_date":"2025-04-30","appointment_time":"09:00:00","status":"pending","created_at":"2025-04-30 00:34:14","staff_id":1,"branch_id":6,"rating":null,"file_url":null}'),
	(181, 40, 'Randolph', 'admin', 'UPDATE', 'bookings', '{"id":60,"user_id":35,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"ASR Gluta IV Push or Vit C Drip","appointment_date":"2025-04-30","appointment_time":"09:00:00","status":"cancelled","created_at":"2025-04-30 00:36:22","staff_id":3,"branch_id":7,"rating":null,"file_url":null}', '2025-04-29 16:36:45', 'Updated appointment for alvaradorandolph@gmail.com', '{"id":60,"user_id":35,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"ASR Gluta IV Push or Vit C Drip","appointment_date":"2025-04-30","appointment_time":"09:00:00","status":"pending","created_at":"2025-04-30 00:36:22","staff_id":3,"branch_id":7,"rating":null,"file_url":null}'),
	(182, 40, 'Randolph', 'admin', 'CREATE', 'doctor_availability', '{"doctor_id":1,"date_time":"2025-04-30 13:00:00"}', '2025-04-29 17:47:07', 'Added availability slot for doctor 1 at 2025-04-30 13:00:00', NULL),
	(183, 40, 'Randolph', 'admin', 'CREATE', 'users', '{"id":70,"first_name":"Aleah","middle_initial":"","last_name":"Bautista","email":"aleahbautista@gmail.com","password":"***REDACTED***","contact_no":"09123456789","verified":1,"verification_token":null,"role":"admin"}', '2025-04-30 04:04:57', 'Created user: aleahbautista@gmail.com', NULL),
	(184, 40, 'Randolph', 'admin', 'CREATE', 'users', '{"id":71,"first_name":"Ashley","middle_initial":"","last_name":"De Guzman","email":"ashleydeguzman@gmail.com","password":"***REDACTED***","contact_no":"09123456789","verified":1,"verification_token":null,"role":"employee"}', '2025-04-30 04:09:31', 'Created user: ashleydeguzman@gmail.com', NULL),
	(185, 70, 'Aleah', 'admin', 'UPDATE', 'staff', '{"id":12,"name":"Armand","branch_id":9,"role":"STAFF","is_surgery_staff":1}', '2025-04-30 04:23:21', 'Updated staff: Armand', '{"id":12,"name":"Armand","branch_id":9,"role":"STAFF","is_surgery_staff":0}'),
	(186, 70, 'Aleah', 'admin', 'CREATE', 'doctor_availability', '{"doctor_id":12,"date_time":"2025-04-30 12:23:00"}', '2025-04-30 04:23:25', 'Added availability slot for doctor 12 at 2025-04-30 12:23:00', NULL),
	(187, 70, 'Aleah', 'admin', 'UPDATE', 'services', '{"id":10,"name":"Deep Cleansing Facial","description":"Deep Cleansing Facial","price":"399.00","file_url":"uploads\\/dora.jpg","duration":2}', '2025-04-30 04:24:08', 'Updated service: Deep Cleansing Facial', '{"id":10,"name":"Deep Cleansing Facial","description":"Deep Cleansing Facial","price":"399.00","file_url":"uploads\\/dora.jpg","duration":1}'),
	(188, 70, 'Aleah', 'admin', 'UPDATE', 'bookings', '{"id":33,"user_id":35,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Deep Cleansing Facial","appointment_date":"2025-04-23","appointment_time":"11:00:00","status":"cancelled","created_at":"2025-04-12 05:24:55","staff_id":4,"branch_id":6,"rating":null,"file_url":"http:\\/\\/localhost\\/uploads\\/67f988a7acc7b_67dffdbc9dbb4-body_scrub.jpg"}', '2025-04-30 04:26:09', 'Updated appointment for alvaradorandolph@gmail.com', '{"id":33,"user_id":35,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Surgery","appointment_date":"2025-04-23","appointment_time":"11:00:00","status":"pending","created_at":"2025-04-12 05:24:55","staff_id":4,"branch_id":6,"rating":null,"file_url":"http:\\/\\/localhost\\/uploads\\/67f988a7acc7b_67dffdbc9dbb4-body_scrub.jpg"}'),
	(189, 70, 'Aleah', 'admin', 'DELETE', 'users', NULL, '2025-04-30 04:27:10', 'Deleted user: randolphdiosell.alvarado.cics@ust.edu.ph', '{"id":69,"first_name":"Randolph","middle_initial":"D","last_name":"Alvarado","email":"randolphdiosell.alvarado.cics@ust.edu.ph","password":"***REDACTED***","contact_no":"09052752202","verified":1,"verification_token":null,"role":"customer"}'),
	(190, 70, 'Aleah', 'admin', 'DELETE', 'bookings', NULL, '2025-04-30 04:31:17', 'Deleted appointment for: alvaradorandolph@gmail.com', '{"id":60,"user_id":35,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"ASR Gluta IV Push or Vit C Drip","appointment_date":"2025-04-30","appointment_time":"09:00:00","status":"cancelled","created_at":"2025-04-30 00:36:22","staff_id":3,"branch_id":7,"rating":null,"file_url":null}'),
	(191, 70, 'Aleah', 'admin', 'UPDATE', 'bookings', '{"id":63,"user_id":35,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Deep Cleansing Facial","appointment_date":"2025-04-30","appointment_time":"15:00:00","status":"confirmed","created_at":"2025-04-30 12:13:11","staff_id":3,"branch_id":7,"rating":null,"file_url":null}', '2025-04-30 04:31:35', 'Updated appointment for alvaradorandolph@gmail.com', '{"id":63,"user_id":35,"first_name":"Randolph","last_name":"Alvarado","email":"alvaradorandolph@gmail.com","contact_no":"09052752202","service_type":"Deep Cleansing Facial","appointment_date":"2025-04-30","appointment_time":"15:00:00","status":"pending","created_at":"2025-04-30 12:13:11","staff_id":3,"branch_id":7,"rating":null,"file_url":null}');

-- Dumping structure for table asr.bookings
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact_no` varchar(20) NOT NULL,
  `service_type` varchar(255) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `staff_id` int(11) NOT NULL DEFAULT 0,
  `branch_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL COMMENT 'Stores URL/path to image files',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `fk_staff` (`staff_id`),
  KEY `idx_user_status` (`user_id`,`status`),
  KEY `idx_status_date` (`status`,`appointment_date`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.bookings: ~12 rows (approximately)
INSERT INTO `bookings` (`id`, `user_id`, `first_name`, `last_name`, `email`, `contact_no`, `service_type`, `appointment_date`, `appointment_time`, `status`, `created_at`, `staff_id`, `branch_id`, `rating`, `file_url`) VALUES
	(33, 35, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'Deep Cleansing Facial', '2025-04-23', '11:00:00', 'cancelled', '2025-04-11 21:24:55', 4, 6, NULL, 'http://localhost/uploads/67f988a7acc7b_67dffdbc9dbb4-body_scrub.jpg'),
	(42, NULL, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'Acne Control Facial', '2025-04-14', '14:00:00', 'cancelled', '2025-04-13 15:41:52', 1, 6, NULL, NULL),
	(44, 35, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'Intensive Whitening Facial', '2025-04-15', '14:00:00', 'pending', '2025-04-13 16:43:52', 8, 7, NULL, NULL),
	(46, NULL, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'Promo', '2025-04-14', '11:00:00', 'pending', '2025-04-14 05:12:55', 8, 7, NULL, ''),
	(47, NULL, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'Promo', '2025-04-14', '16:00:00', 'pending', '2025-04-14 05:13:37', 1, 6, NULL, ''),
	(49, 35, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'Intensive Whitening Facial', '2025-04-16', '11:00:00', 'pending', '2025-04-14 10:06:17', 3, 7, NULL, NULL),
	(52, NULL, 'Gabriello', 'Gerald Herrera', 'gabgerald@yahoo.com', '09760314957', 'ASR Immunomax Drip', '2025-04-14', '13:00:00', 'pending', '2025-04-14 10:47:04', 1, 6, NULL, NULL),
	(53, NULL, 'Gabriello', 'Gerald Herrera', 'gabgerald@yahoo.com', '09760314957', 'Vampire Facial', '2025-04-14', '14:00:00', 'pending', '2025-04-14 10:49:27', 1, 6, NULL, NULL),
	(54, 35, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'ASR Gluta IV Push or Vit C Drip', '2025-04-21', '09:00:00', 'pending', '2025-04-21 09:31:40', 3, 7, NULL, NULL),
	(61, 35, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'Deep Cleansing Facial', '2025-04-30', '09:00:00', 'pending', '2025-04-29 17:38:59', 1, 6, NULL, NULL),
	(62, 35, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'ASR Gluta IV Push or Vit C Drip', '2025-04-30', '09:00:00', 'pending', '2025-04-29 17:39:27', 3, 7, NULL, NULL),
	(63, 35, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'Deep Cleansing Facial', '2025-04-30', '15:00:00', 'confirmed', '2025-04-30 04:13:11', 3, 7, NULL, NULL);

-- Dumping structure for table asr.bookings_archive
CREATE TABLE IF NOT EXISTS `bookings_archive` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact_no` varchar(20) NOT NULL,
  `service_type` varchar(50) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `branch_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `archived_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `branch_id` (`branch_id`),
  KEY `staff_id` (`staff_id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.bookings_archive: ~1 rows (approximately)
INSERT INTO `bookings_archive` (`id`, `user_id`, `first_name`, `last_name`, `email`, `contact_no`, `service_type`, `appointment_date`, `appointment_time`, `status`, `created_at`, `branch_id`, `staff_id`, `rating`, `updated_at`, `archived_at`) VALUES
	(51, NULL, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'Deep Cleansing Facial', '2025-04-15', '13:00:00', 'completed', '2021-04-14 18:32:45', 4, 6, NULL, '2025-04-26 10:30:26', '2025-04-26 10:30:26');

-- Dumping structure for table asr.branches
CREATE TABLE IF NOT EXISTS `branches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.branches: ~3 rows (approximately)
INSERT INTO `branches` (`id`, `name`) VALUES
	(6, 'Katipunan'),
	(7, 'Zabarte'),
	(9, 'UST');

-- Dumping structure for table asr.contact_info
CREATE TABLE IF NOT EXISTS `contact_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(255) NOT NULL,
  `facebook` varchar(255) NOT NULL,
  `instagram` varchar(255) NOT NULL,
  `twitter` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.contact_info: ~1 rows (approximately)
INSERT INTO `contact_info` (`id`, `phone`, `facebook`, `instagram`, `twitter`) VALUES
	(1, '+63 9123456789 / +632123123', 'https://www.facebook.com/ASRSpaPHasdasda', 'https://www.facebook.com/ASRSpaPHsdasd', 'https://www.facebook.com/ASRSpaPHasdads');

-- Dumping structure for table asr.doctor_availability
CREATE TABLE IF NOT EXISTS `doctor_availability` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doctor_id` int(11) NOT NULL,
  `date_time` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `doctor_availability_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.doctor_availability: ~6 rows (approximately)
INSERT INTO `doctor_availability` (`id`, `doctor_id`, `date_time`, `created_at`) VALUES
	(1, 1, '2025-04-17 10:20:00', '2025-04-17 02:20:09'),
	(2, 1, '2025-04-17 11:20:00', '2025-04-17 02:21:04'),
	(3, 1, '2025-04-29 09:00:00', '2025-04-29 13:04:24'),
	(5, 1, '2025-04-30 13:00:00', '2025-04-29 17:47:07'),
	(6, 12, '0000-00-00 00:00:00', '2025-04-30 04:23:21'),
	(7, 12, '2025-04-30 12:23:00', '2025-04-30 04:23:25');

-- Dumping structure for table asr.faqs
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1021 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.faqs: ~6 rows (approximately)
INSERT INTO `faqs` (`id`, `question`, `answer`) VALUES
	(1011, 'Question 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...'),
	(1012, 'Question 2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...'),
	(1013, 'Question 3', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...'),
	(1014, 'Question 4', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...'),
	(1015, 'Question 5', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...'),
	(1016, 'Question 6', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...');

-- Dumping structure for table asr.password_resets
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.password_resets: ~0 rows (approximately)

-- Dumping structure for table asr.payment_details
CREATE TABLE IF NOT EXISTS `payment_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gcash_number` varchar(20) NOT NULL,
  `gcash_name` varchar(100) NOT NULL,
  `paymaya_number` varchar(20) NOT NULL,
  `paymaya_name` varchar(100) NOT NULL,
  `bank_name` varchar(100) NOT NULL,
  `bank_account_number` varchar(50) NOT NULL,
  `bank_account_name` varchar(100) NOT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.payment_details: ~1 rows (approximately)
INSERT INTO `payment_details` (`id`, `gcash_number`, `gcash_name`, `paymaya_number`, `paymaya_name`, `bank_name`, `bank_account_number`, `bank_account_name`, `last_updated`) VALUES
	(1, '09123456789', 'Juan Dela Cruz', '09123456789', 'Juan Dela Cruz', 'BDO', '09123456789', 'Juan Dela Cruzz', '2025-04-13 04:09:33');

-- Dumping structure for table asr.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1025 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.products: ~4 rows (approximately)
INSERT INTO `products` (`id`, `name`, `description`, `price`, `file_url`) VALUES
	(1018, 'Product 1', 'Description for Product 1', 499.00, 'http://localhost/admin_dashboard_backend/uploads/spongebob.webp'),
	(1019, 'Product 2', 'Description for Product 2', 599.00, 'http://localhost/admin_dashboard_backend/uploads/tomjerry.jpg'),
	(1020, 'Product 3', 'Description for Product 3', 999.00, 'http://localhost/admin_dashboard_backend/uploads/spongebob.webp'),
	(1021, 'Product 4', 'Description for Product 4', 299.00, 'http://localhost/admin_dashboard_backend/uploads/dora.jpg');

-- Dumping structure for table asr.promos
CREATE TABLE IF NOT EXISTS `promos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `duration` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `branch_ids` text DEFAULT NULL,
  `staff_ids` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.promos: ~4 rows (approximately)
INSERT INTO `promos` (`id`, `name`, `description`, `price`, `file_url`, `start_date`, `end_date`, `duration`, `created_at`, `updated_at`, `branch_ids`, `staff_ids`) VALUES
	(10, 'ASR Gluta IV Push or Vit C Drip', 'For Immune System Booster W/ Whitening (5+1 Promo), +1 or 5 Treatment Points', 399.00, 'http://localhost/admin_dashboard_backend/uploads/67e01dd211554-bart.jpg', '2025-04-02 22:42:00', '2025-05-08 22:42:00', 1, '2025-03-23 14:42:26', '2025-04-13 16:02:03', NULL, NULL),
	(11, 'ASR Immunomax Drip', 'High Dose IV Vitamin C for whitening and to counteract. FREE Radicals, Tumors and Cancer Cells (5+1 Promo), +1 or 10 Treatment Points', 7495.00, 'http://localhost/admin_dashboard_backend/uploads/67e01e47491f1-67e01dd211554-bart.jpg', '2025-04-13 22:44:00', '2025-05-02 22:44:00', 3, '2025-03-23 14:44:23', '2025-04-13 16:03:00', NULL, NULL),
	(12, 'ASR Pure Glow Drip', 'Single Dose Glutathione Drip with thioctic acid for Whitening, Multivitamins and Kojic Acid (5+1 Promo), +1 or 10 Treatment Points', 6495.00, 'http://localhost/admin_dashboard_backend/uploads/67e01eb758334-spongebob.webp', '2025-03-23 22:46:00', '2025-03-31 22:46:00', 1, '2025-03-23 14:46:15', '2025-03-23 14:46:15', NULL, NULL),
	(13, 'ASR Cinderella Drip', 'Cocktail mixed of gluta drip, multivitamins, collagen, Vitamin C and Placenta that fights aging with cell rejuvenation plus whitening  (5+1 Promo), +1 or 10 Treatment Points', 9495.00, 'http://localhost/admin_dashboard_backend/uploads/67e01f26a9e58-hellokitty.png', '2025-03-23 22:46:00', '2025-03-31 22:49:00', 3, '2025-03-23 14:48:06', '2025-03-23 14:48:06', NULL, NULL);

-- Dumping structure for table asr.promo_branches
CREATE TABLE IF NOT EXISTS `promo_branches` (
  `promo_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  PRIMARY KEY (`promo_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `promo_branches_ibfk_1` FOREIGN KEY (`promo_id`) REFERENCES `promos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promo_branches_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.promo_branches: ~4 rows (approximately)
INSERT INTO `promo_branches` (`promo_id`, `branch_id`) VALUES
	(10, 7),
	(11, 6),
	(12, 7),
	(13, 7);

-- Dumping structure for table asr.promo_staff
CREATE TABLE IF NOT EXISTS `promo_staff` (
  `promo_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  PRIMARY KEY (`promo_id`,`staff_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `promo_staff_ibfk_1` FOREIGN KEY (`promo_id`) REFERENCES `promos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promo_staff_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.promo_staff: ~9 rows (approximately)
INSERT INTO `promo_staff` (`promo_id`, `staff_id`) VALUES
	(10, 3),
	(10, 8),
	(11, 1),
	(11, 4),
	(12, 3),
	(12, 8),
	(12, 9),
	(13, 3),
	(13, 8);

-- Dumping structure for table asr.services
CREATE TABLE IF NOT EXISTS `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `duration` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.services: ~8 rows (approximately)
INSERT INTO `services` (`id`, `name`, `description`, `price`, `file_url`, `duration`) VALUES
	(10, 'Deep Cleansing Facial', 'Deep Cleansing Facial', 399.00, 'uploads/dora.jpg', 2),
	(11, 'Acne Control Facial', 'Acne Control Facial', 499.00, 'uploads/hellokitty.png', 2),
	(12, 'Intensive Whitening Facial', 'Intensive Whitening Facial', 499.00, 'uploads/tomjerry.jpg', 2),
	(13, 'Diamond Peel (Microdermabrasion)', 'Diamond Peel (Microdermabrasion)', 599.00, 'uploads/hellokitty.png', 1),
	(14, 'Vampire Facial', 'Vampire Facial', 2999.00, 'uploads/spongebob.webp', 1),
	(15, 'Skin Peeling (Chemical Peel)', 'Skin Peeling (Chemical Peel)', 1499.00, 'uploads/spongebob.webp', 1),
	(16, 'HIFU V-Shaped Face Contouring with Free Treatment', 'Slimming Service', 999.00, 'uploads/bart.jpg', 1),
	(17, 'High Dose IV Vitamin C Drip', 'Whitening Service - 799 Per Session', 799.00, 'uploads/spongebob.webp', 1);

-- Dumping structure for table asr.service_branches
CREATE TABLE IF NOT EXISTS `service_branches` (
  `service_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  KEY `service_id` (`service_id`),
  KEY `service_branches_ibfk_2` (`branch_id`),
  CONSTRAINT `service_branches_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  CONSTRAINT `service_branches_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.service_branches: ~9 rows (approximately)
INSERT INTO `service_branches` (`service_id`, `branch_id`) VALUES
	(11, 6),
	(12, 7),
	(13, 7),
	(14, 6),
	(15, 7),
	(16, 6),
	(17, 7),
	(10, 6),
	(10, 7);

-- Dumping structure for table asr.service_staff
CREATE TABLE IF NOT EXISTS `service_staff` (
  `service_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  KEY `service_id` (`service_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `service_staff_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  CONSTRAINT `service_staff_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.service_staff: ~18 rows (approximately)
INSERT INTO `service_staff` (`service_id`, `staff_id`) VALUES
	(11, 1),
	(11, 4),
	(12, 3),
	(12, 8),
	(12, 9),
	(13, 3),
	(13, 9),
	(14, 4),
	(15, 3),
	(15, 8),
	(16, 1),
	(16, 4),
	(17, 9),
	(17, 8),
	(17, 3),
	(10, 1),
	(10, 4),
	(10, 3);

-- Dumping structure for table asr.site_policies
CREATE TABLE IF NOT EXISTS `site_policies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `privacy_policy` text NOT NULL,
  `terms_condition` text NOT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.site_policies: ~1 rows (approximately)
INSERT INTO `site_policies` (`id`, `privacy_policy`, `terms_condition`, `last_updated`) VALUES
	(1, 'Add your privacy policy here', 'Add your Terms and Conditions here', '2025-04-13 11:45:19');

-- Dumping structure for table asr.staff
CREATE TABLE IF NOT EXISTS `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `role` varchar(20) DEFAULT 'STAFF',
  `is_surgery_staff` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `staff_ibfk_1` (`branch_id`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.staff: ~7 rows (approximately)
INSERT INTO `staff` (`id`, `name`, `branch_id`, `role`, `is_surgery_staff`) VALUES
	(1, 'Ma. Agustherese Soreda', 6, 'STAFF', 1),
	(3, 'Fritzie Y. Santos', 7, 'STAFF', 0),
	(4, 'Ashley De Guzman', 6, 'STAFF', 0),
	(8, 'Loraine Salamat', 7, 'STAFF', 0),
	(9, 'Jucel Jordan', 7, 'STAFF', 0),
	(12, 'Armand', 9, 'STAFF', 1),
	(18, 'gwen', 9, 'STAFF', 0);

-- Dumping structure for table asr.surgeries
CREATE TABLE IF NOT EXISTS `surgeries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `branch_ids` text DEFAULT NULL,
  `staff_ids` text DEFAULT NULL,
  `time_slots` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`time_slots`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.surgeries: ~5 rows (approximately)
INSERT INTO `surgeries` (`id`, `title`, `description`, `start_date`, `end_date`, `price`, `image_url`, `duration`, `created_at`, `updated_at`, `branch_ids`, `staff_ids`, `time_slots`) VALUES
	(2, 'Surgery 1', 'This is the description for Surgery 1', '2025-03-23 00:00:00', '2025-03-31 00:00:00', 9998.00, 'http://localhost/admin_dashboard_backend/uploads/surgeries/67e020c02c2e7-spongebob.webp', 12, '2025-03-19 20:57:12', '2025-03-23 14:54:56', '["6","7"]', '["1","3","4","8","9"]', NULL),
	(4, 'Surgery 2', 'This is the description for Surgery 1', '2025-03-23 00:00:00', '2025-03-31 00:00:00', 10998.00, 'http://localhost/admin_dashboard_backend/uploads/surgeries/67e020d2f31b1-tomjerry.jpg', 6, '2025-03-23 08:36:02', '2025-03-23 14:55:53', NULL, NULL, NULL),
	(5, 'Surgery 3', 'This is the description for Surgery 3', '2025-03-23 00:00:00', '2025-03-31 00:00:00', 12999.00, 'http://localhost/admin_dashboard_backend/uploads/surgeries/67e02149c58e4-tomjerry.jpg', 11, '2025-03-23 08:56:09', '2025-03-23 14:57:13', 'Array', 'Array', NULL),
	(6, 'Surgery 4', 'This is the description for Surgery 4', '2025-03-18 00:00:00', '2025-04-02 00:00:00', 15999.00, 'http://localhost/admin_dashboard_backend/uploads/surgeries/67e0216758af3-dora.jpg', 11, '2025-03-23 08:56:54', '2025-03-23 14:57:43', '["7","6"]', '["3","1","4"]', NULL),
	(12, 'asda', 'asdads', '2025-04-16 22:19:00', '2025-04-30 13:18:00', 213.00, 'http://localhost/admin_dashboard_backend/uploads/surgeries/67f680c8913e4-67e01dd211554-bart.jpg', 10, '2025-04-09 14:14:32', '2025-04-09 14:14:32', NULL, NULL, NULL);

-- Dumping structure for table asr.surgery_branches
CREATE TABLE IF NOT EXISTS `surgery_branches` (
  `surgery_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  PRIMARY KEY (`surgery_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `surgery_branches_ibfk_1` FOREIGN KEY (`surgery_id`) REFERENCES `surgeries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `surgery_branches_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.surgery_branches: ~10 rows (approximately)
INSERT INTO `surgery_branches` (`surgery_id`, `branch_id`) VALUES
	(2, 6),
	(2, 7),
	(4, 6),
	(4, 7),
	(5, 6),
	(5, 7),
	(6, 6),
	(6, 7),
	(12, 7),
	(12, 9);

-- Dumping structure for table asr.surgery_staff
CREATE TABLE IF NOT EXISTS `surgery_staff` (
  `surgery_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  PRIMARY KEY (`surgery_id`,`staff_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `surgery_staff_ibfk_1` FOREIGN KEY (`surgery_id`) REFERENCES `surgeries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `surgery_staff_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.surgery_staff: ~15 rows (approximately)
INSERT INTO `surgery_staff` (`surgery_id`, `staff_id`) VALUES
	(2, 1),
	(2, 3),
	(2, 4),
	(2, 8),
	(2, 9),
	(4, 1),
	(4, 3),
	(4, 4),
	(5, 1),
	(5, 3),
	(6, 1),
	(6, 3),
	(6, 4),
	(12, 3),
	(12, 8);

-- Dumping structure for table asr.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `middle_initial` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `contact_no` varchar(15) NOT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  `role` enum('admin','employee','customer') NOT NULL DEFAULT 'customer',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.users: ~8 rows (approximately)
INSERT INTO `users` (`id`, `first_name`, `middle_initial`, `last_name`, `email`, `password`, `contact_no`, `verified`, `verification_token`, `role`) VALUES
	(35, 'Randolph', 'M', 'Alvarado', 'alvaradorandolph@gmail.com', '$2y$10$PzSSKfhQG/27GPqf5f3VWe1glHNj/WL8JeUr24XSoAg/xrWM.8C42', '09052752202', 1, NULL, 'customer'),
	(40, 'Randolph', 'M', 'Alvarado', 'xere.sa.12@gmail.com', '$2y$10$LAm7aelI1Gwv2rduso08S.Pctik1AjK6/BNKMBqjOXeTWMpPakta2', '09232228423', 1, NULL, 'admin'),
	(44, 'Gabriello', 'A', 'Gerald Herrera', 'gabgerald@yahoo.com', '$2y$10$ciIrE9ap3ClhyOO/Va46Yei.d45M4cFDpz3ZmaaZ1XXl/3ZwYHZEe', '09428098248', 1, NULL, 'admin'),
	(45, 'Armand', 'G', 'Ledor', 'armand@yahoo.com', '$2y$10$VOYVmUG0OylZnarZlxAJFebWNQzzfO.WLatYb31nEI/RRELW/AEla', '09428098248', 1, NULL, 'employee'),
	(58, 'Gwennie', 'T.', 'Navarro', 'gwennie@yahoo.com', '$2y$10$MzFgvYLwOENu0aOpeCnzJOZVTZf7THHmqZmw5biXBG/HxaXtonr.W', '09760314957', 1, NULL, 'admin'),
	(68, 'Best Employee', NULL, 'Employee', 'empl@gmail.com', '$2y$10$XxHQO54EMTDIM1rTgMcgDuJqN1rcC51nXkYaEI9z8T5lC0VZ0uuLi', '09760314957', 1, NULL, 'employee'),
	(70, 'Aleah', '', 'Bautista', 'aleahbautista@gmail.com', '$2y$10$HKUdleUkr6x1KN25LBoece83g3/O2gqnnU7XAcp7pYb3WtZCgGmxq', '09123456789', 1, NULL, 'admin'),
	(71, 'Ashley', '', 'De Guzman', 'ashleydeguzman@gmail.com', '$2y$10$kalT1CDbNnenn58ch6F3QOqrK7Pd3cTC0GlrTFp.7GlzfAF4hJn9S', '09123456789', 1, NULL, 'employee');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
