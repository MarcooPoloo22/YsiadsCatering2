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
CREATE DATABASE IF NOT EXISTS `asr` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `asr`;

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
  `status` enum('pending','completed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `staff_id` int(11) NOT NULL DEFAULT 0,
  `branch_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL COMMENT 'Stores URL/path to image files',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `fk_staff` (`staff_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.bookings: ~6 rows (approximately)
INSERT INTO `bookings` (`id`, `user_id`, `first_name`, `last_name`, `email`, `contact_no`, `service_type`, `appointment_date`, `appointment_time`, `status`, `created_at`, `staff_id`, `branch_id`, `rating`, `file_url`) VALUES
	(5, 35, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'Service', '2025-03-23', '09:00:00', 'completed', '2025-03-24 02:02:29', 4, 6, 3, NULL),
	(6, 35, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'Service', '2025-03-23', '09:00:00', 'completed', '2025-03-24 02:44:01', 1, 6, NULL, NULL),
	(7, NULL, 'Se', 'Sel', 'sel@gmail.com', '0912314567', 'Service', '2025-03-23', '02:00:00', 'completed', '2025-03-24 02:47:12', 1, 6, NULL, NULL),
	(8, 35, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'Service', '2025-03-24', '09:00:00', 'pending', '2025-03-24 12:35:44', 1, 6, NULL, NULL),
	(9, 35, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'Service', '2025-03-24', '09:00:00', 'pending', '2025-03-24 12:36:02', 4, 6, NULL, NULL),
	(10, 35, 'Randolph', 'Alvarado', 'alvaradorandolph@gmail.com', '09052752202', 'Promo', '2025-03-24', '10:00:00', 'pending', '2025-03-24 12:38:38', 1, 6, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
