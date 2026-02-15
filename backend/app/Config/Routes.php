<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', function($routes) {
   
    $routes->post('register', 'Auth::register');
    $routes->post('login', 'Auth::login');

    $routes->get('noticias', 'Noticias::index');          
    $routes->get('noticias/(:num)', 'Noticias::show/$1');  

    $routes->group('', ['filter' => 'auth'], function($routes) {
        
        $routes->get('user/me', 'Auth::me');
        $routes->post('user/avatar', 'Auth::uploadAvatar');
        $routes->post('user/password', 'Auth::changePassword');

        $routes->post('pokemon/toggle', 'Pokemon::toggleCatch');
        $routes->get('pokemon/capturas/(:num)', 'Pokemon::getCapturas/$1');

        $routes->get('teams', 'Teams::index');                
        $routes->post('teams', 'Teams::create');               
        $routes->delete('teams/(:num)', 'Teams::delete/$1');  
        
        $routes->post('teams/add', 'Teams::addMember');        
        $routes->put('teams/(:num)', 'Teams::update/$1');
        $routes->delete('teams/member/(:num)', 'Teams::removeMember/$1'); 
        $routes->post('teams/(:num)/favorite', 'Teams::setFavorite/$1');

        $routes->get('auth/refresh', 'Auth::refresh');

        $routes->post('noticias', 'Noticias::create');            
        $routes->put('noticias/(:num)', 'Noticias::update/$1');   
        $routes->delete('noticias/(:num)', 'Noticias::delete/$1');
        $routes->post('upload/noticia', 'Uploads::noticia');

        $routes->get('admin/stats', 'Admin::dashboardStats');
    });

});