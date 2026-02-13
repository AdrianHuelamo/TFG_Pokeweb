<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', function($routes) {
    
    $routes->post('register', 'Auth::register'); // Registro de usuario
    $routes->post('login', 'Auth::login');       // Inicio de sesión

    $routes->get('noticias', 'Noticias::index');
    $routes->get('noticias/(:num)', 'Noticias::show/$1'); // Noticia individual

});