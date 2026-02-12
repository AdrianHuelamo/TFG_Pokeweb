-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-02-2026 a las 23:23:15
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
(1, '¡Bienvenido a la Comunidad PokéWeb!', 'Inauguramos nuestro nuevo espacio para entrenadores.', 'Estamos muy emocionados de anunciar el lanzamiento de la sección de comunidad. Aquí podréis encontrar las últimas novedades del mundo Pokémon, torneos y actualizaciones de la web.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', 1, '2026-02-11 18:53:50', 1),
(2, 'Descubierto nuevo método evolutivo', 'Los científicos de Sinnoh están perplejos.', 'Recientes estudios confirman que ciertos Pokémon solo evolucionan al girar sobre uno mismo mientras se sostiene un dulce. Seguiremos informando.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', 1, '2026-02-11 18:53:50', 0),
(3, 'Torneo de Campeones: Próximamente', 'Prepara tu equipo para el desafío definitivo.', 'Muy pronto abriremos las inscripciones para el torneo mensual. Solo los entrenadores con rango Campeón podrán crear eventos, pero todos podrán participar.', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png', 1, '2026-02-11 18:53:50', 0);

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'ash', 'ash@pueblopaleta.com', '$2y$10$Au.01ARfTF8wzf3RfmYTGe2QnQbL5jM5myRmGiQ2WJJegkcDtRdGy', 'entrenador', '2026-02-06 14:05:58'),
(2, 'adri', 'adri41104@gmail.com', '$2y$10$uQKQD3UmFSCs3mSIzJofOuMl72xkPGxxktv9HzlZtxYbiHvpm9Khq', 'entrenador', '2026-02-12 18:57:56'),
(3, 'adahi', 'adahi@psoe.com', '$2y$10$Ra3GKiDbfJSd/L51YVSmUOeMg0EgY5EUz/Xf3ULozVNHGEdkk3YUm', 'entrenador', '2026-02-12 18:59:04'),
(4, 'jorge', 'jorge@gmail.com', '$2y$10$ccdQtRUedlHvtiQebOEkPuW8HXAJJ9M7Z4rmpM/SUlRiwKE3pJfaC', 'entrenador', '2026-02-12 20:45:49');

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
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `user_capturas`
--
ALTER TABLE `user_capturas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `user_capturas`
--
ALTER TABLE `user_capturas`
  ADD CONSTRAINT `user_capturas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
