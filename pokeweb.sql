-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-02-2026 a las 21:04:31
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pokeweb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias`
--

CREATE TABLE `noticias` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `resumen` text DEFAULT NULL,
  `contenido` longtext NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `autor_id` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `destacada` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `noticias`
--

INSERT INTO `noticias` (`id`, `titulo`, `resumen`, `contenido`, `imagen`, `autor_id`, `created_at`, `destacada`) VALUES
(1, '¡Bienvenido a la Comunidad PokéWeb!', 'Inauguramos nuestro nuevo espacio para entrenadores.', 'Estamos muy emocionados de anunciar el lanzamiento de la sección de comunidad. Aquí podréis encontrar las últimas novedades del mundo Pokémon, torneos y actualizaciones de la web.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', 9, '2026-02-11 18:53:50', 1),
(2, 'Descubierto nuevo método evolutivo', 'Los científicos de Sinnoh están perplejos.', 'Recientes estudios confirman que ciertos Pokémon solo evolucionan al girar sobre uno mismo mientras se sostiene un dulce. Seguiremos informando.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', 9, '2026-02-11 18:53:50', 0),
(3, 'Torneo de Campeones: Próximamente', 'Prepara tu equipo para el desafío definitivo.', 'Muy pronto abriremos las inscripciones para el torneo mensual. Solo los entrenadores con rango Campeón podrán crear eventos, pero todos podrán participar.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png', 9, '2026-02-11 18:53:50', 0),
(15, 'Pokeweb', 'Web de pokemon', 'Web dedicada a pokemon', 'uploads/noticias/1771182343_9d56ca870c4db58c09fe.webp', 11, '2026-02-15 19:05:59', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL DEFAULT 'Nuevo Equipo',
  `created_at` datetime DEFAULT current_timestamp(),
  `is_favorite` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `teams`
--

INSERT INTO `teams` (`id`, `user_id`, `name`, `created_at`, `is_favorite`) VALUES
(1, 2, 'Equipo 1', '2026-02-14 13:12:02', 1),
(5, 2, 'equipo AB', '2026-02-14 14:14:39', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `team_members`
--

CREATE TABLE `team_members` (
  `id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `pokemon_id` int(11) NOT NULL,
  `slot_order` int(11) DEFAULT 0,
  `nickname` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `team_members`
--

INSERT INTO `team_members` (`id`, `team_id`, `pokemon_id`, `slot_order`, `nickname`) VALUES
(1, 1, 501, 1, NULL),
(2, 1, 13, 2, NULL),
(3, 1, 5, 3, NULL),
(5, 1, 18, 5, NULL),
(6, 1, 20, 6, NULL),
(7, 1, 10, 6, NULL),
(11, 5, 7, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','campeon','entrenador') DEFAULT 'entrenador',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `avatar`) VALUES
(1, 'admin', 'admin@pokeweb.com', '$2y$10$KvG0.aKrNspidRUp8qZ79.iiAG.v2/3Ninycr/ZHcuyAgKej4Ksem', 'admin', '2026-02-14 19:32:24', 'default.webp'),
(2, 'adri', 'adri41104@gmail.com', '$2y$10$US75REt.xo259ZYUNC6zJOFg.xloQi8Qi4a3kcXHraHO1T1eMjIt.', 'entrenador', '2026-02-12 18:57:56', '1771087067_c3f3a673cc7a7cfc4f41.webp'),
(3, 'adahi', 'adahi@psoe.com', '$2y$10$Ra3GKiDbfJSd/L51YVSmUOeMg0EgY5EUz/Xf3ULozVNHGEdkk3YUm', 'entrenador', '2026-02-12 18:59:04', 'default.webp'),
(4, 'jorge', 'jorge@gmail.com', '$2y$10$ccdQtRUedlHvtiQebOEkPuW8HXAJJ9M7Z4rmpM/SUlRiwKE3pJfaC', 'entrenador', '2026-02-12 20:45:49', 'default.webp'),
(8, 'adahi', 'adahi@vox.com', '$2y$12$PYJuBQt/1zsR/ZPhXi5eCuer4osKUaj/aDvZiCY.nmI0xX1oU/CgO', 'entrenador', '2026-02-13 10:53:02', 'default.webp'),
(9, 'joselu', 'joselu@solvam.com', '$2y$10$5Fv5VZe6W9tQ4TM0kerIcuuhYk22D2Mg0q5M5tUMRckr0mA12XtNW', 'campeon', '2026-02-14 16:51:56', 'default.webp'),
(11, 'jorge', 'jorge@solvam.com', '$2y$10$8DhBWRFtjcYfxd1TFpPrRempwWtslIDEyl.I2LiYkn1yIbYrgRd8W', 'campeon', '2026-02-15 09:50:48', 'default.webp');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_capturas`
--

CREATE TABLE `user_capturas` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `pokemon_id` int(11) NOT NULL,
  `fecha_captura` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user_capturas`
--

INSERT INTO `user_capturas` (`id`, `user_id`, `pokemon_id`, `fecha_captura`) VALUES
(7, 2, 8, '2026-02-13 21:32:46'),
(11, 2, 10, '2026-02-13 22:08:35'),
(13, 2, 2, '2026-02-13 22:09:21'),
(16, 2, 5, '2026-02-13 22:38:20'),
(17, 2, 7, '2026-02-13 22:38:20'),
(19, 2, 11, '2026-02-13 22:38:20'),
(20, 2, 12, '2026-02-13 22:38:20'),
(21, 2, 13, '2026-02-13 22:38:20'),
(22, 2, 14, '2026-02-13 22:38:20'),
(23, 2, 15, '2026-02-13 22:38:20'),
(24, 2, 16, '2026-02-13 22:38:20'),
(25, 2, 17, '2026-02-13 22:38:20'),
(26, 2, 18, '2026-02-13 22:38:20'),
(27, 2, 19, '2026-02-13 22:38:20'),
(28, 2, 20, '2026-02-13 22:38:20'),
(29, 2, 21, '2026-02-13 22:38:20'),
(30, 2, 22, '2026-02-13 22:38:20'),
(31, 2, 23, '2026-02-13 22:38:20'),
(32, 2, 24, '2026-02-13 22:38:20'),
(33, 2, 25, '2026-02-13 22:38:20'),
(34, 2, 26, '2026-02-13 22:38:20'),
(35, 2, 27, '2026-02-13 22:38:20'),
(36, 2, 28, '2026-02-13 22:38:20'),
(37, 2, 29, '2026-02-13 22:38:20'),
(38, 2, 30, '2026-02-13 22:38:20'),
(39, 2, 31, '2026-02-13 22:38:20'),
(40, 2, 32, '2026-02-13 22:38:20'),
(41, 2, 33, '2026-02-13 22:38:20'),
(42, 2, 34, '2026-02-13 22:38:20'),
(43, 2, 35, '2026-02-13 22:38:20'),
(44, 2, 36, '2026-02-13 22:38:20'),
(45, 2, 37, '2026-02-13 22:38:20'),
(46, 2, 38, '2026-02-13 22:38:20'),
(47, 2, 39, '2026-02-13 22:38:20'),
(48, 2, 40, '2026-02-13 22:38:20'),
(49, 2, 41, '2026-02-13 22:38:20'),
(50, 2, 42, '2026-02-13 22:38:20'),
(51, 2, 43, '2026-02-13 22:38:20'),
(52, 2, 44, '2026-02-13 22:38:20'),
(53, 2, 45, '2026-02-13 22:38:20'),
(54, 2, 46, '2026-02-13 22:38:20'),
(55, 2, 47, '2026-02-13 22:38:20'),
(56, 2, 48, '2026-02-13 22:38:20'),
(57, 2, 49, '2026-02-13 22:38:20'),
(58, 2, 50, '2026-02-13 22:38:20'),
(59, 2, 51, '2026-02-13 22:38:20'),
(60, 2, 52, '2026-02-13 22:38:20'),
(61, 2, 53, '2026-02-13 22:38:20'),
(62, 2, 54, '2026-02-13 22:38:20'),
(63, 2, 55, '2026-02-13 22:38:20'),
(64, 2, 56, '2026-02-13 22:38:20'),
(65, 2, 57, '2026-02-13 22:38:20'),
(66, 2, 58, '2026-02-13 22:38:20'),
(67, 2, 59, '2026-02-13 22:38:20'),
(68, 2, 60, '2026-02-13 22:38:20'),
(69, 2, 130, '2026-02-13 22:38:20'),
(70, 2, 143, '2026-02-13 22:38:20'),
(71, 2, 149, '2026-02-13 22:38:20'),
(72, 2, 150, '2026-02-13 22:38:20'),
(73, 2, 151, '2026-02-13 22:38:20'),
(74, 2, 152, '2026-02-13 22:38:20'),
(75, 2, 155, '2026-02-13 22:38:20'),
(76, 2, 158, '2026-02-13 22:38:20'),
(77, 2, 243, '2026-02-13 22:38:20'),
(78, 2, 244, '2026-02-13 22:38:20'),
(79, 2, 245, '2026-02-13 22:38:20'),
(80, 2, 249, '2026-02-13 22:38:20'),
(81, 2, 250, '2026-02-13 22:38:20'),
(82, 2, 252, '2026-02-13 22:38:20'),
(83, 2, 255, '2026-02-13 22:38:20'),
(84, 2, 258, '2026-02-13 22:38:20'),
(85, 2, 382, '2026-02-13 22:38:20'),
(86, 2, 383, '2026-02-13 22:38:20'),
(87, 2, 384, '2026-02-13 22:38:20'),
(88, 2, 387, '2026-02-13 22:38:20'),
(89, 2, 483, '2026-02-13 22:38:20'),
(90, 2, 484, '2026-02-13 22:38:20'),
(91, 2, 487, '2026-02-13 22:38:20'),
(92, 2, 493, '2026-02-13 22:38:20'),
(93, 2, 494, '2026-02-13 22:38:20'),
(94, 2, 501, '2026-02-13 22:38:20'),
(95, 2, 643, '2026-02-13 22:38:20'),
(96, 2, 644, '2026-02-13 22:38:20'),
(97, 2, 650, '2026-02-13 22:38:20'),
(98, 2, 658, '2026-02-13 22:38:20'),
(99, 2, 722, '2026-02-13 22:38:20'),
(100, 2, 778, '2026-02-13 22:38:20'),
(101, 2, 906, '2026-02-13 22:38:20'),
(102, 2, 909, '2026-02-13 22:38:20'),
(103, 2, 912, '2026-02-13 22:38:20'),
(104, 2, 1000, '2026-02-13 22:38:20'),
(105, 2, 6, '2026-02-14 14:02:18'),
(106, 2, 3, '2026-02-15 10:51:40'),
(107, 2, 4, '2026-02-15 10:51:42'),
(109, 2, 61, '2026-02-15 15:38:56'),
(110, 2, 62, '2026-02-15 15:38:57'),
(111, 2, 63, '2026-02-15 15:38:58'),
(112, 2, 64, '2026-02-15 15:38:59'),
(113, 2, 68, '2026-02-15 15:39:00'),
(114, 2, 67, '2026-02-15 15:39:01'),
(115, 2, 66, '2026-02-15 15:39:02'),
(116, 2, 65, '2026-02-15 15:39:02'),
(117, 2, 69, '2026-02-15 15:39:03'),
(118, 2, 70, '2026-02-15 15:39:04'),
(119, 2, 71, '2026-02-15 15:39:05'),
(120, 2, 72, '2026-02-15 15:39:06'),
(121, 2, 76, '2026-02-15 15:39:08'),
(122, 2, 75, '2026-02-15 15:39:16'),
(123, 2, 74, '2026-02-15 15:39:17'),
(124, 2, 73, '2026-02-15 15:39:18'),
(125, 2, 77, '2026-02-15 15:39:19'),
(126, 2, 78, '2026-02-15 15:39:20'),
(127, 2, 79, '2026-02-15 15:39:20'),
(128, 2, 80, '2026-02-15 15:39:21'),
(129, 2, 84, '2026-02-15 15:39:22'),
(130, 2, 83, '2026-02-15 15:39:23'),
(131, 2, 82, '2026-02-15 15:39:24'),
(132, 2, 81, '2026-02-15 15:39:25'),
(133, 2, 85, '2026-02-15 15:39:26'),
(134, 2, 86, '2026-02-15 15:39:27'),
(135, 2, 87, '2026-02-15 15:39:28'),
(136, 2, 88, '2026-02-15 15:39:29'),
(137, 2, 92, '2026-02-15 15:39:30'),
(138, 2, 91, '2026-02-15 15:39:31'),
(139, 2, 90, '2026-02-15 15:39:32'),
(140, 2, 89, '2026-02-15 15:39:33'),
(141, 2, 93, '2026-02-15 15:39:35'),
(142, 2, 94, '2026-02-15 15:39:36'),
(143, 2, 95, '2026-02-15 15:39:38'),
(144, 2, 96, '2026-02-15 15:39:39'),
(145, 2, 100, '2026-02-15 15:39:40'),
(146, 2, 99, '2026-02-15 15:39:41'),
(147, 2, 98, '2026-02-15 15:39:42'),
(148, 2, 97, '2026-02-15 15:39:43'),
(149, 2, 101, '2026-02-15 15:39:45'),
(150, 2, 102, '2026-02-15 15:39:46'),
(151, 2, 103, '2026-02-15 15:39:47'),
(152, 2, 104, '2026-02-15 15:39:48'),
(153, 2, 108, '2026-02-15 15:39:50'),
(154, 2, 107, '2026-02-15 15:39:50'),
(155, 2, 106, '2026-02-15 15:39:51'),
(156, 2, 105, '2026-02-15 15:39:52'),
(157, 2, 109, '2026-02-15 15:39:54'),
(158, 2, 113, '2026-02-15 15:39:55'),
(159, 2, 114, '2026-02-15 15:39:55'),
(160, 2, 110, '2026-02-15 15:39:56'),
(161, 2, 111, '2026-02-15 15:39:57'),
(162, 2, 115, '2026-02-15 15:39:58'),
(163, 2, 112, '2026-02-15 15:39:59'),
(164, 2, 116, '2026-02-15 15:40:00'),
(165, 2, 120, '2026-02-15 15:40:02'),
(166, 2, 124, '2026-02-15 15:40:03'),
(167, 2, 123, '2026-02-15 15:40:03'),
(168, 2, 119, '2026-02-15 15:40:04'),
(169, 2, 118, '2026-02-15 15:40:05'),
(170, 2, 122, '2026-02-15 15:40:06'),
(171, 2, 121, '2026-02-15 15:40:07'),
(172, 2, 117, '2026-02-15 15:40:08'),
(173, 2, 125, '2026-02-15 15:40:10'),
(174, 2, 129, '2026-02-15 15:40:11'),
(175, 2, 133, '2026-02-15 15:40:13'),
(176, 2, 137, '2026-02-15 15:40:14'),
(177, 2, 138, '2026-02-15 15:40:15'),
(178, 2, 134, '2026-02-15 15:40:16'),
(179, 2, 126, '2026-02-15 15:40:17'),
(180, 2, 127, '2026-02-15 15:40:18'),
(181, 2, 128, '2026-02-15 15:40:19'),
(182, 2, 148, '2026-02-15 15:40:26'),
(183, 2, 147, '2026-02-15 15:40:27'),
(184, 2, 146, '2026-02-15 15:40:36'),
(185, 2, 145, '2026-02-15 15:40:37'),
(186, 2, 141, '2026-02-15 15:40:40'),
(187, 2, 142, '2026-02-15 15:40:41'),
(188, 2, 144, '2026-02-15 15:40:42'),
(189, 2, 140, '2026-02-15 15:40:46'),
(190, 2, 139, '2026-02-15 15:40:48'),
(191, 2, 135, '2026-02-15 15:40:49'),
(192, 2, 136, '2026-02-15 15:40:50'),
(193, 2, 132, '2026-02-15 15:40:51'),
(194, 2, 131, '2026-02-15 15:40:53'),
(195, 2, 9, '2026-02-15 17:55:58'),
(197, 2, 1, '2026-02-15 20:31:28');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `team_id` (`team_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `user_capturas`
--
ALTER TABLE `user_capturas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_pokemon` (`user_id`,`pokemon_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `noticias`
--
ALTER TABLE `noticias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `user_capturas`
--
ALTER TABLE `user_capturas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=198;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `team_members`
--
ALTER TABLE `team_members`
  ADD CONSTRAINT `team_members_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_capturas`
--
ALTER TABLE `user_capturas`
  ADD CONSTRAINT `user_capturas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
