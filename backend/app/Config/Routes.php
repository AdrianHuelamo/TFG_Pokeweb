<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', function($routes) {
    
    // --- RUTAS PÚBLICAS (Tus originales) ---
    $routes->post('register', 'Auth::register');
    $routes->post('login', 'Auth::login');
    $routes->get('noticias', 'Noticias::index');           // Tu controlador
    $routes->get('noticias/(:num)', 'Noticias::show/$1');  // Tu controlador

    // --- NUEVO: GRUPO ADMIN (Solo lo que no tenías) ---
    $routes->group('admin', ['filter' => 'auth'], function($routes) {
        // Dashboard Stats
        $routes->get('stats', 'Admin::dashboardStats');

        // Gestión de Usuarios (Nuevo)
        $routes->get('users', 'Admin::getUsers');
        $routes->post('users/update', 'Admin::updateUser'); 
        $routes->delete('users/(:num)', 'Admin::deleteUser/$1');

        // Vista Admin de Equipos (Para ver emails)
        $routes->get('teams', 'Admin::getTeamsList');
        $routes->delete('teams/(:num)', 'Admin::deleteTeam/$1');
    });

    // --- TUS RUTAS DE USUARIO (Auth, Teams, Pokemon) ---
    // (Esto se queda EXACTAMENTE como lo tenías)
    $routes->group('', ['filter' => 'auth'], function($routes) {
        
        $routes->get('user/me', 'Auth::me');
        $routes->post('user/avatar', 'Auth::uploadAvatar');
        $routes->post('user/password', 'Auth::changePassword');
        $routes->get('auth/refresh', 'Auth::refresh');

        $routes->post('pokemon/toggle', 'Pokemon::toggleCatch');
        $routes->get('pokemon/capturas/(:num)', 'Pokemon::getCapturas/$1');

        $routes->get('teams', 'Teams::index');
        $routes->post('teams', 'Teams::create');
        $routes->delete('teams/(:num)', 'Teams::delete/$1');
        $routes->post('teams/add', 'Teams::addMember');
        $routes->put('teams/(:num)', 'Teams::update/$1');
        $routes->delete('teams/member/(:num)', 'Teams::removeMember/$1');
        $routes->post('teams/(:num)/favorite', 'Teams::setFavorite/$1');

        // GESTIÓN DE NOTICIAS (Usamos TU controlador)
        // Como ya tienes estas rutas protegidas por 'auth' y tu controlador
        // ya verifica si es admin, el Dashboard usará estas mismas rutas.
        $routes->post('noticias', 'Noticias::create');
        $routes->put('noticias/(:num)', 'Noticias::update/$1');
        $routes->delete('noticias/(:num)', 'Noticias::delete/$1');
    });
});