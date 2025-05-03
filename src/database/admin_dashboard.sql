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
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.audit_logs: ~55 rows (approximately)
REPLACE INTO `audit_logs` (`audit_id`, `user_id`, `user_name`, `user_role`, `action_type`, `table_name`, `new_value`, `timestamp`, `description`, `old_value`) VALUES
	(20, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":5,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 13:33:06","branch_ids":"[]","staff_ids":"[]"}', '2025-03-23 06:26:14', NULL, '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":5,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 13:33:06","branch_ids":"[]","staff_ids":"[]"}'),
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
	(74, 57, 'Rovin', 'employee', 'UPDATE', 'promos', '{"id":8,"name":"Promo 3","description":"Promo 3 desc","price":"199.00","file_url":null,"start_date":"2025-03-25 21:38:00","end_date":"2025-03-29 22:38:00","duration":12,"created_at":"2025-03-23 17:33:57","updated_at":"2025-03-23 20:16:36","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"3\\",\\"1\\",\\"4\\"]"}', '2025-03-23 12:16:36', NULL, '{"id":8,"name":"Promo 3","description":"Promo 3 desc","price":"199.00","file_url":null,"start_date":"2025-03-25 21:38:00","end_date":"2025-03-29 22:38:00","duration":12,"created_at":"2025-03-23 17:33:57","updated_at":"2025-03-23 19:23:28","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\",\\"4\\",\\"8\\"]"}');

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
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.bookings: ~3 rows (approximately)
REPLACE INTO `bookings` (`id`, `user_id`, `first_name`, `last_name`, `email`, `contact_no`, `service_type`, `appointment_date`, `appointment_time`, `status`, `created_at`) VALUES
	(1, NULL, 'Randolph', 'Alvarado', 'xere.sa.12@gmail.com', '09232228423', 'Haircut', '2025-03-06', '10:00:00', 'pending', '2025-03-07 04:28:49'),
	(2, NULL, 'Gabriello', 'Gerald Herrera', 'rsori013@ucr.edu', '09052752202', 'Service', '2025-03-22', '11:00:00', 'pending', '2025-03-22 10:24:17'),
	(3, NULL, 'Gabriello', 'Gerald Herrera', 'rsori013@ucr.edu', '09052752202', 'Service', '2025-03-22', '01:00:00', 'pending', '2025-03-22 10:24:29');

-- Dumping structure for table asr.branches
CREATE TABLE IF NOT EXISTS `branches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.branches: ~2 rows (approximately)
REPLACE INTO `branches` (`id`, `name`) VALUES
	(6, 'Katipunan'),
	(7, 'Zabarte');

-- Dumping structure for table asr.contact_info
CREATE TABLE IF NOT EXISTS `contact_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL,
  `facebook` varchar(255) NOT NULL,
  `instagram` varchar(255) NOT NULL,
  `twitter` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.contact_info: ~1 rows (approximately)
REPLACE INTO `contact_info` (`id`, `phone`, `facebook`, `instagram`, `twitter`) VALUES
	(1, '+63 9123456789', 'https://www.facebook.com/ASRSpaPH', 'https://www.facebook.com/ASRSpaPH', 'https://www.facebook.com/ASRSpaPH');

-- Dumping structure for table asr.faqs
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1017 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.faqs: ~6 rows (approximately)
REPLACE INTO `faqs` (`id`, `question`, `answer`) VALUES
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.password_resets: ~0 rows (approximately)

-- Dumping structure for table asr.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1022 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.products: ~4 rows (approximately)
REPLACE INTO `products` (`id`, `name`, `description`, `price`, `file_url`) VALUES
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.promos: ~4 rows (approximately)
REPLACE INTO `promos` (`id`, `name`, `description`, `price`, `file_url`, `start_date`, `end_date`, `duration`, `created_at`, `updated_at`, `branch_ids`, `staff_ids`) VALUES
	(10, 'ASR Gluta IV Push or Vit C Drip', 'For Immune System Booster W/ Whitening (5+1 Promo), +1 or 5 Treatment Points', 399.00, 'http://localhost/admin_dashboard_backend/uploads/67e01dd211554-bart.jpg', '2025-03-23 22:42:00', '2025-03-31 22:42:00', 1, '2025-03-23 14:42:26', '2025-03-23 14:42:26', NULL, NULL),
	(11, 'ASR Immunomax Drip', 'High Dose IV Vitamin C for whitening and to counteract. FREE Radicals, Tumors and Cancer Cells (5+1 Promo), +1 or 10 Treatment Points', 7495.00, 'http://localhost/admin_dashboard_backend/uploads/67e01e47491f1-67e01dd211554-bart.jpg', '2025-03-23 22:44:00', '2025-03-31 22:44:00', 3, '2025-03-23 14:44:23', '2025-03-23 14:44:23', NULL, NULL),
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
REPLACE INTO `promo_branches` (`promo_id`, `branch_id`) VALUES
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
REPLACE INTO `promo_staff` (`promo_id`, `staff_id`) VALUES
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.services: ~9 rows (approximately)
REPLACE INTO `services` (`id`, `name`, `description`, `price`, `file_url`, `duration`) VALUES
	(10, 'Deep Cleansing Facial', 'Deep Cleansing Facial', 399.00, 'uploads/dora.jpg', 1),
	(11, 'Acne Control Facial', 'Acne Control Facial', 499.00, 'uploads/hellokitty.png', 2),
	(12, 'Intensive Whitening Facial', 'Intensive Whitening Facial', 499.00, 'uploads/tomjerry.jpg', 2),
	(13, 'Diamond Peel (Microdermabrasion)', 'Diamond Peel (Microdermabrasion)', 599.00, 'uploads/hellokitty.png', 1),
	(14, 'Vampire Facial', 'Vampire Facial', 2999.00, 'uploads/spongebob.webp', 1),
	(15, 'Skin Peeling (Chemical Peel)', 'Skin Peeling (Chemical Peel)', 1499.00, 'uploads/spongebob.webp', 1),
	(16, 'HIFU V-Shaped Face Contouring with Free Treatment', 'Slimming Service', 999.00, 'uploads/bart.jpg', 1),
	(17, 'High Dose IV Vitamin C Drip', 'Whitening Service - 799 Per Session', 799.00, 'uploads/spongebob.webp', 1),
	(18, 'Glutathione Drip (Single Dose)', 'Whitening Service - Per Session', 1899.00, 'uploads/hellokitty.png', 1);

-- Dumping structure for table asr.service_branches
CREATE TABLE IF NOT EXISTS `service_branches` (
  `service_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  KEY `service_id` (`service_id`),
  KEY `service_branches_ibfk_2` (`branch_id`),
  CONSTRAINT `service_branches_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  CONSTRAINT `service_branches_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.service_branches: ~10 rows (approximately)
REPLACE INTO `service_branches` (`service_id`, `branch_id`) VALUES
	(10, 6),
	(10, 7),
	(11, 6),
	(12, 7),
	(13, 7),
	(14, 6),
	(15, 7),
	(16, 6),
	(17, 7),
	(18, 7);

-- Dumping structure for table asr.service_staff
CREATE TABLE IF NOT EXISTS `service_staff` (
  `service_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  KEY `service_id` (`service_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `service_staff_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  CONSTRAINT `service_staff_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.service_staff: ~20 rows (approximately)
REPLACE INTO `service_staff` (`service_id`, `staff_id`) VALUES
	(10, 1),
	(10, 4),
	(10, 3),
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
	(18, 3),
	(18, 8);

-- Dumping structure for table asr.staff
CREATE TABLE IF NOT EXISTS `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `branch_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `staff_ibfk_1` (`branch_id`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.staff: ~5 rows (approximately)
REPLACE INTO `staff` (`id`, `name`, `branch_id`) VALUES
	(1, 'Ma. Agustherese Soreda', 6),
	(3, 'Fritzie Y. Santos', 7),
	(4, 'Ashley De Guzman', 6),
	(8, 'Loraine Salamat', 7),
	(9, 'Jucel Jordan', 7);

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.surgeries: ~4 rows (approximately)
REPLACE INTO `surgeries` (`id`, `title`, `description`, `start_date`, `end_date`, `price`, `image_url`, `duration`, `created_at`, `updated_at`, `branch_ids`, `staff_ids`) VALUES
	(2, 'Surgery 1', 'This is the description for Surgery 1', '2025-03-23 00:00:00', '2025-03-31 00:00:00', 9998.00, 'http://localhost/admin_dashboard_backend/uploads/surgeries/67e020c02c2e7-spongebob.webp', 12, '2025-03-19 20:57:12', '2025-03-23 14:54:56', '["6","7"]', '["1","3","4","8","9"]'),
	(4, 'Surgery 2', 'This is the description for Surgery 1', '2025-03-23 00:00:00', '2025-03-31 00:00:00', 10998.00, 'http://localhost/admin_dashboard_backend/uploads/surgeries/67e020d2f31b1-tomjerry.jpg', 6, '2025-03-23 08:36:02', '2025-03-23 14:55:53', NULL, NULL),
	(5, 'Surgery 3', 'This is the description for Surgery 3', '2025-03-23 00:00:00', '2025-03-31 00:00:00', 12999.00, 'http://localhost/admin_dashboard_backend/uploads/surgeries/67e02149c58e4-tomjerry.jpg', 11, '2025-03-23 08:56:09', '2025-03-23 14:57:13', 'Array', 'Array'),
	(6, 'Surgery 4', 'This is the description for Surgery 4', '2025-03-18 00:00:00', '2025-04-02 00:00:00', 15999.00, 'http://localhost/admin_dashboard_backend/uploads/surgeries/67e0216758af3-dora.jpg', 11, '2025-03-23 08:56:54', '2025-03-23 14:57:43', '["7","6"]', '["3","1","4"]');

-- Dumping structure for table asr.surgery_branches
CREATE TABLE IF NOT EXISTS `surgery_branches` (
  `surgery_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  PRIMARY KEY (`surgery_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `surgery_branches_ibfk_1` FOREIGN KEY (`surgery_id`) REFERENCES `surgeries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `surgery_branches_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.surgery_branches: ~8 rows (approximately)
REPLACE INTO `surgery_branches` (`surgery_id`, `branch_id`) VALUES
	(2, 6),
	(2, 7),
	(4, 6),
	(4, 7),
	(5, 6),
	(5, 7),
	(6, 6),
	(6, 7);

-- Dumping structure for table asr.surgery_staff
CREATE TABLE IF NOT EXISTS `surgery_staff` (
  `surgery_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  PRIMARY KEY (`surgery_id`,`staff_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `surgery_staff_ibfk_1` FOREIGN KEY (`surgery_id`) REFERENCES `surgeries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `surgery_staff_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.surgery_staff: ~13 rows (approximately)
REPLACE INTO `surgery_staff` (`surgery_id`, `staff_id`) VALUES
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
	(6, 4);

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
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.users: ~6 rows (approximately)
REPLACE INTO `users` (`id`, `first_name`, `middle_initial`, `last_name`, `email`, `password`, `contact_no`, `verified`, `verification_token`, `role`) VALUES
	(35, 'Randolph', 'M', 'Alvarado', 'alvaradorandolph@gmail.com', '$2y$10$k6Agkx6/Tzh9jzQhLQMkgOUFMmhYERgG6TxEKsjzVJTAmoYlGdHTm', '09052752202', 1, NULL, 'customer'),
	(40, 'Randolph', 'M', 'Alvarado', 'xere.sa.12@gmail.com', '$2y$10$LAm7aelI1Gwv2rduso08S.Pctik1AjK6/BNKMBqjOXeTWMpPakta2', '09232228423', 1, NULL, 'admin'),
	(44, 'Gabriello', 'A', 'Gerald Herrera', 'gabgerald@yahoo.com', '$2y$10$GCPNaNqPAOrPqXLxRokbJ.cFnQwhGsLfZeCBYHEtMMSBX2JJapSo6', '09428098248', 1, NULL, 'admin'),
	(45, 'Armand', 'G', 'Ledor', 'armand@yahoo.com', '$2y$10$u2snYTiSkIjj1eO/bnixk.WUrWkkN0y0dZxW6Ks8wgY1/z4RweHDG', '09428098248', 1, NULL, 'employee'),
	(57, 'Rovin', '', 'Soriano', 'rsori013@ucr.edu', '$2y$10$.nAAckSjqWEwiYc0ly2uEeemPk4wZP7/dS5PbG5YAl/gAhrCqsDBy', '7472382804', 1, NULL, 'employee'),
	(58, 'Gwen', 'T.', 'Navarro', 'gwen@yahoo.com', '$2y$10$TujZx8YMulFG7byC11GW0u3MhZfw3IsSgE3jnUUbxeCrY..9w5BZG', '09760314957', 1, NULL, 'admin');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
