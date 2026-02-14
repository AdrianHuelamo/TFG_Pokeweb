-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-02-2026 a las 20:39:00
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
(4, 'gregergerg', 'gergreg', 'grtgergrtg', 'uploads/noticias/1771097470_191351bb40c804b3cda9.webp', 9, '2026-02-14 19:31:13', 0);

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
(5, 2, 'equipo A', '2026-02-14 14:14:39', 0);

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
(7, 1, 10, 6, NULL);

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
(2, 'adri', 'adri41104@gmail.com', '$2y$10$Senb0xNSjANXWTJTk.kShOhr6bsOAQL8I9DEgcIhTwkDtLgGDcWAm', 'entrenador', '2026-02-12 18:57:56', '1771087067_c3f3a673cc7a7cfc4f41.webp'),
(3, 'adahi', 'adahi@psoe.com', '$2y$10$Ra3GKiDbfJSd/L51YVSmUOeMg0EgY5EUz/Xf3ULozVNHGEdkk3YUm', 'entrenador', '2026-02-12 18:59:04', 'default.webp'),
(4, 'jorge', 'jorge@gmail.com', '$2y$10$ccdQtRUedlHvtiQebOEkPuW8HXAJJ9M7Z4rmpM/SUlRiwKE3pJfaC', 'entrenador', '2026-02-12 20:45:49', 'default.webp'),
(5, 'pablo', 'pablo@hotmail.com', '$2y$12$zrPWENFFwr2oRZ5i5.lXUujHPUkLzzg3U7vNxOA80wlwMYXltAcni', 'entrenador', '2026-02-13 08:43:11', 'default.webp'),
(6, 'jorgue', 'jorge@hotmail.com', '$2y$12$LQVF119f182NcgVsjyzhyed3ZU5PRzjcwAjj3KYgKITUae8oBomAi', 'entrenador', '2026-02-13 09:15:04', 'default.webp'),
(8, 'adahi', 'adahi@vox.com', '$2y$12$PYJuBQt/1zsR/ZPhXi5eCuer4osKUaj/aDvZiCY.nmI0xX1oU/CgO', 'entrenador', '2026-02-13 10:53:02', 'default.webp'),
(9, 'joselu', 'joselu@israel.com', '$2y$10$5Fv5VZe6W9tQ4TM0kerIcuuhYk22D2Mg0q5M5tUMRckr0mA12XtNW', 'campeon', '2026-02-14 16:51:56', 'default.webp');

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
(9, 2, 3, '2026-02-13 22:08:24'),
(11, 2, 10, '2026-02-13 22:08:35'),
(13, 2, 2, '2026-02-13 22:09:21'),
(14, 2, 1, '2026-02-13 22:38:20'),
(15, 2, 4, '2026-02-13 22:38:20'),
(16, 2, 5, '2026-02-13 22:38:20'),
(17, 2, 7, '2026-02-13 22:38:20'),
(18, 2, 9, '2026-02-13 22:38:20'),
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
(105, 2, 6, '2026-02-14 14:02:18');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `user_capturas`
--
ALTER TABLE `user_capturas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

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
