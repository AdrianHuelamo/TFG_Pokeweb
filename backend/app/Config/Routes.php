<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// Rutas de tu API (Login y Registro)
$routes->post('api/login', 'Api::login');
$routes->post('api/register', 'Api::register');

// [NUEVO] Esta línea es la CLAVE.
// Atrapa todas las peticiones de comprobación (OPTIONS) y las manda al controlador.
$routes->options('(:any)', 'Api::options');