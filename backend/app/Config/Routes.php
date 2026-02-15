<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', function($routes) {
    
    // =================================================
    // 1. RUTAS PÚBLICAS (Cualquiera puede entrar)
    // =================================================
    
    // Autenticación
    $routes->post('register', 'Auth::register');
    $routes->post('login', 'Auth::login');

    // Noticias
    $routes->get('noticias', 'Noticias::index');           // Ver lista
    $routes->get('noticias/(:num)', 'Noticias::show/$1');  // Ver detalle

    $routes->group('', ['filter' => 'auth'], function($routes) {
        
        // Perfil y Usuario
        $routes->get('user/me', 'Auth::me');
        $routes->post('user/avatar', 'Auth::uploadAvatar');
        $routes->post('user/password', 'Auth::changePassword');

        // Pokémon
        $routes->post('pokemon/toggle', 'Pokemon::toggleCatch');
        $routes->get('pokemon/capturas/(:num)', 'Pokemon::getCapturas/$1');

        // === ESTO ES LO QUE TE FALTA (EQUIPOS) ===
        $routes->get('teams', 'Teams::index');                 // Ver equipos
        $routes->post('teams', 'Teams::create');               // Crear equipo
        $routes->delete('teams/(:num)', 'Teams::delete/$1');   // Borrar equipo
        
        $routes->post('teams/add', 'Teams::addMember');        // Añadir poke
        $routes->put('teams/(:num)', 'Teams::update/$1');
        $routes->delete('teams/member/(:num)', 'Teams::removeMember/$1'); // Quitar poke
        $routes->post('teams/(:num)/favorite', 'Teams::setFavorite/$1');

        $routes->get('auth/refresh', 'Auth::refresh');

        $routes->post('noticias', 'Noticias::create');             // <--- ESTA FALTABA
        $routes->put('noticias/(:num)', 'Noticias::update/$1');    // <--- ESTA FALTABA
        $routes->delete('noticias/(:num)', 'Noticias::delete/$1');
        $routes->post('upload/noticia', 'Uploads::noticia');

        $routes->get('admin/stats', 'Admin::dashboardStats');
    });

});