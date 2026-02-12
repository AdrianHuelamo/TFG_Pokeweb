<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// GRUPO API (Prefijo /api)
$routes->group('api', function($routes) {
    
    // --- AUTENTICACIÓN ---
    $routes->post('register', 'Auth::register'); // Registro de usuario
    $routes->post('login', 'Auth::login');       // Inicio de sesión

    // --- NOTICIAS ---
    $routes->get('noticias', 'Noticias::index');
    $routes->get('noticias/(:num)', 'Noticias::show/$1'); // Noticia individual

});