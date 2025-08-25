-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 22, 2025 at 04:06 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `disaster_reports`
--

CREATE TABLE `disaster_reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `disaster_type` varchar(255) NOT NULL,
  `reported_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `location` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `disaster_reports`
--

INSERT INTO `disaster_reports` (`id`, `user_id`, `disaster_type`, `reported_at`, `location`) VALUES
(1, 2, 'Fire', '2025-04-22 17:09:51', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines'),
(2, 2, 'Landslide', '2025-04-22 17:13:56', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines'),
(3, 13, 'Earthquake', '2025-04-22 17:33:00', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines'),
(4, 13, 'Fire', '2025-04-22 17:35:22', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines'),
(5, 13, 'Landslide', '2025-04-22 17:44:12', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines'),
(6, 3, 'Flood', '2025-04-22 17:48:12', 'Commission Civil Street, Jereos, San Pedro, Jaro, Calubihan, Iloilo City, Western Visayas, 5000, Philippines'),
(7, 3, 'Flood', '2025-04-22 17:53:10', 'Commission Civil Street, Jereos, San Pedro, Jaro, Calubihan, Iloilo City, Western Visayas, 5000, Philippines'),
(8, 8, 'Fire', '2025-04-23 07:16:23', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines'),
(9, 8, 'Earthquake', '2025-04-23 07:22:26', 'Commission Civil Street, Jereos, San Pedro, Jaro, Calubihan, Iloilo City, Western Visayas, 5000, Philippines'),
(10, 2, 'Fire', '2025-04-28 01:52:48', 'Tayud, Cebu, Central Visayas, 6002, Philippines'),
(11, 2, 'Flood', '2025-04-28 01:59:50', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines'),
(12, 9, 'Fire', '2025-04-28 02:04:06', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines'),
(13, 2, 'Fire', '2025-05-12 18:11:12', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines'),
(14, 2, 'Flood', '2025-05-12 18:28:18', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines'),
(15, 2, 'Fire', '2025-08-14 09:02:34', 'Iloilo City Hall, I. de la Rama Street, City Proper, Iloilo City, Western Visayas, 5000, Philippines'),
(16, 2, 'Fire', '2025-08-15 08:00:19', 'University of Iloilo, Rizal Street, City Proper, Iloilo City, Western Visayas, 5000, Philippines'),
(17, 13, 'Fire', '2025-08-18 13:50:48', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines'),
(18, 13, 'Fire', '2025-08-19 21:21:18', 'Alviola Street, Tejero, Cebu City, Central Visayas, 6666, Philippines'),
(19, 13, 'Flood', '2025-08-19 21:27:16', 'Alviola Street, Tejero, Cebu City, Central Visayas, 6666, Philippines'),
(20, 20, 'Landslide', '2025-08-21 15:05:11', 'Alviola Street, Tejero, Cebu City, Central Visayas, 6666, Philippines');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `needs` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `help_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id`, `user_id`, `name`, `location`, `needs`, `created_at`, `help_count`) VALUES
(1, 2, 'Yasmine Talaman', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines', 'need clothing fire', '2025-04-13 06:46:48', 2),
(2, 2, 'Yasmine Talaman', 'Western Visayas Medical Center, Q. Abeto Street, Iloilo Business Park, Mandurriao, Pale Benidicto Rizal, Iloilo City, Western Visayas, 5000, Philippines', 'water', '2025-04-13 07:35:56', 1),
(3, 13, 'test test1', 'Tayud, Cebu, Central Visayas, 6002, Philippines', 'foods', '2025-04-13 07:39:01', 0),
(4, 2, 'Yasmine Talaman', 'Western Visayas Medical Center, Q. Abeto Street, Iloilo Business Park, Mandurriao, Pale Benidicto Rizal, Iloilo City, Western Visayas, 5000, Philippines', 'Clothes\r\n', '2025-04-13 07:57:42', 0),
(5, 3, 'John Doe', 'Tayud, Cebu, Central Visayas, 6002, Philippines', 'need food please', '2025-04-13 11:32:26', 0),
(6, 4, 'Jane Smith', 'Western Visayas Medical Center, Q. Abeto Street, Iloilo Business Park, Mandurriao, Pale Benidicto Rizal, Iloilo City, Western Visayas, 5000, Philippines', 'Whiskey', '2025-04-13 14:13:27', 0),
(7, 9, 'James Garcia', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines', 'shelter, clothing\r\n', '2025-04-14 09:33:15', 0),
(8, 9, 'James Garcia', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines', 'Foods', '2025-04-14 09:40:54', 1),
(9, 13, 'test test1', 'San Juan, Molo, Iloilo City, Western Visayas, 5000, Philippines', 'food\r\n', '2025-04-14 13:49:55', 0),
(10, 8, 'Olivia Brown', 'Commission Civil Street, Jereos, San Pedro, Jaro, Calubihan, Iloilo City, Western Visayas, 5000, Philippines', 'i need clothes \r\n', '2025-04-23 07:17:37', 1),
(11, 2, 'Yasmine Talaman', 'Iloilo City Hall, I. de la Rama Street, City Proper, Iloilo City, Western Visayas, 5000, Philippines', 'relief, clothes', '2025-08-14 09:08:06', 0);

-- --------------------------------------------------------

--
-- Table structure for table `risk_assessments`
--

CREATE TABLE `risk_assessments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `near_river` tinyint(1) NOT NULL,
  `near_fault` tinyint(1) NOT NULL,
  `has_emergency_kit` tinyint(1) NOT NULL,
  `has_evacuation_plan` tinyint(1) NOT NULL,
  `risk_score` int(11) NOT NULL,
  `risk_level` varchar(20) NOT NULL,
  `assessed_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `risk_assessments`
--

INSERT INTO `risk_assessments` (`id`, `user_id`, `near_river`, `near_fault`, `has_emergency_kit`, `has_evacuation_plan`, `risk_score`, `risk_level`, `assessed_at`) VALUES
(2, 13, 1, 0, 0, 1, 5, 'Moderate', '2025-04-13 18:19:08'),
(3, 13, 1, 1, 1, 1, 6, 'Moderate', '2025-04-13 19:14:29'),
(4, 3, 1, 0, 1, 1, 3, 'Low', '2025-04-13 19:31:38'),
(5, 2, 0, 0, 0, 1, 2, 'Low', '2025-04-13 20:22:50'),
(6, 4, 1, 1, 0, 0, 10, 'High', '2025-04-13 22:12:58'),
(7, 2, 1, 1, 1, 1, 6, 'Moderate', '2025-04-14 03:24:47'),
(8, 9, 1, 1, 0, 1, 8, 'High', '2025-04-14 17:44:52'),
(9, 8, 1, 1, 0, 0, 10, 'High', '2025-04-23 15:20:48'),
(10, 9, 0, 0, 1, 1, 0, 'Low', '2025-04-23 15:32:52'),
(11, 16, 1, 1, 1, 1, 6, 'Moderate', '2025-04-28 19:28:27'),
(12, 2, 1, 0, 0, 0, 7, 'Moderate', '2025-08-14 17:07:38');

-- --------------------------------------------------------

--
-- Table structure for table `stations`
--

CREATE TABLE `stations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('PNP','BFP') NOT NULL,
  `address` varchar(255) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stations`
--

INSERT INTO `stations` (`id`, `name`, `type`, `address`, `latitude`, `longitude`) VALUES
(1, 'Molo District Police Station', 'PNP', 'Molo, Iloilo City', 10.702577704829702, 122.54524721212897),
(2, 'Arevalo Police Station', 'PNP', 'Villa Arevalo, Iloilo City', 10.68935915151069, 122.51657110973035),
(3, 'PNP Station 5', 'PNP', 'Mandurriao, Iloilo City', 10.718606349123561, 122.53707085605258),
(4, 'Iloilo City Police Station 10', 'PNP', 'Mandurriao, Iloilo City', 10.705703842025798, 122.5541731091961),
(5, 'Iloilo City Police Office', 'PNP', 'Mandurriao, Iloilo City', 10.702239047821504, 122.56352819973596),
(6, 'POLICE STATION 3', 'PNP', 'Luna St. Jaro, Iloilo City', 10.71637147858059, 122.56250731158228),
(7, 'Iloilo City Police Station 3', 'PNP', 'Jaro, Iloilo City', 10.727275249070377, 122.55753827685025),
(8, 'Iloilo City Police Station 8', 'PNP', 'Sampaguita St, Lapuz, Iloilo City, Iloilo', 10.697309491012305, 122.58514996232637),
(9, 'Philippine National Police Western Visayas Regional Headquarters', 'PNP', 'Iloilo City Proper, Iloilo City, 5000 Iloilo', 10.69145157414182, 122.58088533707652),
(10, 'Philipine National Police - RD PRO 6', 'PNP', 'Camp Martin Delgado, Fort San Pedro Drive, Iloilo City, 5000, Iloilo', 10.691463432743692, 122.58048708982415),
(11, 'Arevalo Fire Sub-Station', 'BFP', 'Villa Arevalo District, Iloilo City, 5000 Iloilo', 10.68803077326833, 122.51673847140576),
(12, '(OLD)Molo Fire Station', 'BFP', 'Locsin St, Molo, Iloilo City, 5000 Iloilo', 10.697476892069218, 122.54420429175273),
(13, 'Molo Fire Sub Station, BFP Iloilo City', 'BFP', 'Brgy Taal, Molo, Iloilo City, Iloilo', 10.696923185712782, 122.54797465357223),
(14, 'Bureau of Fire Protection', 'BFP', 'Macario Peralta Street, Iloilo City Proper, Iloilo City, Iloilo', 10.694069105333908, 122.57255837802192),
(15, 'NEW BFP BLDG.', 'BFP', 'Fort San Pedro Dr, Iloilo City Proper, Iloilo City, Iloilo', 10.689374358960329, 122.58151053465244),
(16, 'Iloilo City Fire Station', 'BFP', 'Fort San Pedro Dr, Iloilo City Proper, Iloilo City, Iloilo', 10.690353933763825, 122.58221564132928),
(17, 'BO.OBRERO FIRE SUB-STATION', 'BFP', 'Dahlia St, Lapuz, Iloilo City, Iloilo', 10.699540066181463, 122.58756406938278),
(18, 'La Paz Fire Sub-Station', 'BFP', 'La Paz, Iloilo City, Iloilo', 10.710991846100452, 122.56986447036857),
(19, 'BUREAU OF FIRE PROTECTION JARO FIRE SUB STATION', 'BFP', 'Plaza Rizal St, Jaro, Iloilo City, Iloilo, Iloilo', 10.725320702555917, 122.55750782376005),
(20, 'Bureau of Fire Protection RHQ 6', 'BFP', '4th Main Ave, Jaro, Iloilo City, Iloilo', 10.73970031909681, 122.56651567896992),
(21, 'Iloilo City Ungka Fire Sub-Station', 'BFP', 'Jaro, Iloilo City, Iloilo', 10.746821847269024, 122.53897978786522);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(150) DEFAULT NULL,
  `lastname` varchar(150) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contact_number` varchar(25) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `address_type` varchar(50) DEFAULT NULL,
  `additional_instructions` text DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('user','admin') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `street_address`, `barangay`, `city`, `province`, `postal_code`, `country`, `email`, `contact_number`, `landmark`, `address_type`, `additional_instructions`, `password`, `created_at`, `role`) VALUES
(1, 'Jayrold', 'Tabalina', '124 R. Mapa Street', 'Tabucan', 'Iloilo city', 'Iloilo', '5000', 'Philippines', 'jayroldtabalina@gmail.com', '09499619011', 'near Patahan sa Tabucan1', 'Home', 'none', '123', '2025-04-11 12:54:46', 'admin'),
(2, 'Yasmine', 'Talaman', 'Blk 15, Lot 6 ', 'Housing', 'Iloilo city', 'Iloilo', '5000', 'Philippines', 'yasminetalaman@gmail.com', '09876543210', 'near Garzon appartment', 'home', 'mandurriao housing1', '123', '2025-04-11 14:47:41', 'user'),
(3, 'John', 'Doe', '123 Main St', 'Barangay 1', 'Cityville', 'Province A', '12345', 'Country X', 'john.doe@example.com', '09123456789', 'Near park', 'Home', 'Leave at the door', 'password123', '2025-04-11 16:30:52', 'user'),
(4, 'Jane', 'Smith', '456 Oak Ave', 'Barangay 2', 'Townsville', 'Province B', '67890', 'Country Y', 'jane.smith@example.com', '09234567890', 'Near school', 'Home', 'Ring the bell', 'password123', '2025-04-11 16:30:52', 'user'),
(5, 'Michael', 'Johnson', '789 Pine Rd', 'Barangay 3', 'Villagetown', 'Province C', '11223', 'Country Z', 'michael.johnson@example.com', '09345678901', 'Next to hospital', 'Home', 'Call first', 'password123', '2025-04-11 16:30:52', 'user'),
(6, 'Emily', 'Davis', '101 Maple Blvd', 'Barangay 4', 'Metropolis', 'Province D', '44556', 'Country W', 'emily.davis@example.com', '09456789012', 'Behind mall', 'Home', 'Do not disturb', 'password123', '2025-04-11 16:30:52', 'user'),
(7, 'William', 'Martinez', '202 Cedar Ln', 'Barangay 5', 'Bigcity', 'Province E', '77889', 'Country V', 'william.martinez@example.com', '09567890123', 'Near restaurant', 'Office', 'Leave on doorstep', 'password123', '2025-04-11 16:30:52', 'user'),
(8, 'Olivia', 'Brown', '303 Birch Dr', 'Barangay 6', 'Smalltown', 'Province F', '33445', 'Country U', 'olivia.brown@example.com', '09678901234', 'Beside bank', 'Home', 'Ring bell', 'password123', '2025-04-11 16:30:52', 'user'),
(9, 'James', 'Garcia', '404 Elm St', 'Barangay 7', 'Largetown', 'Province G', '55667', 'Country T', 'james.garcia@example.com', '09789012345', 'In front of library', 'Office', 'Knock on door', 'password123', '2025-04-11 16:30:52', 'user'),
(13, 'test', 'test', '', '', '', '', '5000', 'Philippines', '', '091234567890', '', '', '', '123', '2025-04-13 04:42:49', 'user'),
(15, 'admin', 'admin', '', '', '', '', '', '', 'admin@gmail.com', '', '', '', '', '123', '2025-04-13 12:33:33', 'admin'),
(16, 'user', 'user', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '09111111111', NULL, NULL, NULL, '123', '2025-04-28 11:10:48', 'user'),
(17, 'Mark', 'Jabao', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '09630426657', NULL, NULL, NULL, 'Mark12345', '2025-08-15 01:36:23', 'user'),
(20, 'sample', 'user', '', '', '', '', '', '', 'sampleuser@gmail.com', '0954321789', '', '', '', '123', '2025-08-21 14:02:12', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `disaster_reports`
--
ALTER TABLE `disaster_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `risk_assessments`
--
ALTER TABLE `risk_assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `stations`
--
ALTER TABLE `stations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `contact_number` (`contact_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `disaster_reports`
--
ALTER TABLE `disaster_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `risk_assessments`
--
ALTER TABLE `risk_assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `stations`
--
ALTER TABLE `stations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `disaster_reports`
--
ALTER TABLE `disaster_reports`
  ADD CONSTRAINT `disaster_reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `risk_assessments`
--
ALTER TABLE `risk_assessments`
  ADD CONSTRAINT `risk_assessments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
