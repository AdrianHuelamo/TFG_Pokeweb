<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Noticias extends ResourceController
{
    protected $modelName = 'App\Models\NoticiaModel';
    protected $format    = 'json';

    public function index()
    {
        $noticias = $this->model
                         ->orderBy('destacada', 'DESC')
                         ->orderBy('created_at', 'DESC')
                         ->findAll();
        
        return $this->respond([
            'status' => 200,
            'mensaje' => 'Noticias obtenidas correctamente',
            'data' => $noticias
        ]);
    }
}