<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index(): string
    {
        return view('welcome_message');
    }

    public function testApi()
{
    header('Access-Control-Allow-Origin: *'); 
    header('Access-Control-Allow-Headers: Content-Type');
    
    $data = [
        'mensaje' => '¡Conexión exitosa desde CodeIgniter!',
        'status' => 200,
        'pokemon_favorito' => 'Pikachu'
    ];
    
    return $this->response->setJSON($data);
}
}
