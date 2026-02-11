<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;

class Api extends BaseController
{
    use ResponseTrait;

    // Función LOGIN
    public function login()
    {
        // 1. Añadimos cabeceras CORS manualmente a ESTA respuesta
        $this->response->setHeader('Access-Control-Allow-Origin', '*')
                       ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
                       ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

        $json = $this->request->getJSON();
        
        if (!isset($json->email) || !isset($json->password)) {
            return $this->fail('Faltan datos', 400);
        }

        $model = new UserModel();
        $user = $model->where('email', $json->email)->first();

        if ($user && password_verify($json->password, $user['password'])) {
            unset($user['password']);
            
            return $this->respond([
                'status' => 200,
                'mensaje' => 'Login correcto',
                'data' => $user
            ]);
        } else {
            return $this->fail('Credenciales incorrectas', 401);
        }
    }

    // Función REGISTER
    public function register()
    {
        // 1. Añadimos cabeceras CORS manualmente también aquí
        $this->response->setHeader('Access-Control-Allow-Origin', '*')
                       ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
                       ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

        $json = $this->request->getJSON();
        $model = new UserModel();
        
        $data = [
            'username' => $json->username,
            'email'    => $json->email,
            'password' => password_hash($json->password, PASSWORD_DEFAULT),
            'rol'      => 'entrenador'
        ];

        $model->insert($data);
        
        return $this->respondCreated(['status' => 200, 'mensaje' => 'Usuario registrado']);
    }

    // Función OPTIONS (El portero)
    public function options()
    {
        return $this->response
            ->setHeader('Access-Control-Allow-Origin', '*')
            ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
            ->setStatusCode(200);
    }
}