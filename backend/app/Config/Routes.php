<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// GRUPO API
$routes->group('api', function($routes) {
    
    // --- 1. RUTAS PÚBLICAS (No necesitan token) ---
    
    // Auth
    $routes->post('register', 'Auth::register');
    $routes->post('login', 'Auth::login');

    // Noticias (AQUÍ ESTABA EL ERROR)
    $routes->get('noticias', 'Noticias::index');           // Listar todas
    $routes->get('noticias/(:num)', 'Noticias::show/$1');  // <--- ESTA LÍNEA FALTABA

    // --- 2. RUTAS PRIVADAS (Necesitan Token) ---
    $routes->group('', ['filter' => 'auth'], function($routes) {
        
        // Pokémon y Capturas
        $routes->post('pokemon/toggle', 'Pokemon::toggleCatch');
        $routes->get('pokemon/capturas/(:num)', 'Pokemon::getCapturas/$1');
        
    });

});