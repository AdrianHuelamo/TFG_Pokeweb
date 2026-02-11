<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');


$routes->post('api/login', 'Api::login');
$routes->post('api/register', 'Api::register');

$routes->get('api/noticias', 'Noticias::index');
